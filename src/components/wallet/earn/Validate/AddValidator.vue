<template>
    <div>
        <div class="cols">
            <form @submit.prevent="">
                <transition-group name="fade" mode="out-in">
                    <div v-show="!isConfirm" key="form" class="ins_col">
                        <div style="margin-bottom: 30px">
                            <h4>{{ $t('earn.validate.nodeId') }}</h4>
                            <input
                                type="text"
                                v-model="nodeID"
                                style="width: 100%; border-radius: var(--border-radius-sm)"
                                placeholder="NodeID-"
                            />
                        </div>
                        <div style="margin: 30px 0">
                            <h4>{{ $t('earn.validate.duration.label') }}</h4>
                            <p class="desc">
                                {{ $t('earn.validate.duration.desc') }}
                            </p>
                            <DateForm
                                @change_end="setEnd"
                                :minDurationMs="minStakeDuration"
                                :maxDurationMs="maxStakeDuration"
                                :defaultDurationMs="defaultStakeDuration"
                            ></DateForm>
                        </div>
                        <div style="margin: 30px 0">
                            <h4>{{ $t('earn.validate.amount.label') }}</h4>
                            <p class="desc">
                                {{
                                    $t('earn.validate.amount.desc', [
                                        displayMinStakeAmt.toLocaleString(),
                                    ])
                                }}
                            </p>
                            <AvaxInput
                                v-model="stakeAmt"
                                :max="maxAmt"
                                ref="avaxinput"
                                :readonly="true"
                                class="amt_in"
                                :initial="maxAmt"
                            ></AvaxInput>
                        </div>
                    </div>
                    <ConfirmPage
                        key="confirm"
                        v-show="isConfirm"
                        :node-i-d="nodeID"
                        :end="formEnd"
                        :amount="formAmt"
                        :reward-address="rewardIn"
                        :reward-destination="rewardDestination"
                    ></ConfirmPage>
                </transition-group>
                <div>
                    <div class="summary" v-if="!isSuccess">
                        <div>
                            <label>{{ $t('earn.validate.summary.duration') }} *</label>
                            <p>{{ durationText }}</p>
                        </div>
                        <div class="submit_box">
                            <p v-if="warnShortDuration" class="err">
                                {{ $t('earn.validate.errs.duration_warn') }}
                            </p>
                            <p class="err">{{ err }}</p>
                            <v-btn
                                v-if="!isConfirm"
                                @click="confirm"
                                class="button_secondary"
                                depressed
                                :loading="isLoading"
                                :disabled="!canSubmit"
                                block
                            >
                                {{ $t('earn.validate.confirm') }}
                            </v-btn>
                            <template v-else>
                                <v-btn
                                    @click="submit"
                                    class="button_secondary"
                                    depressed
                                    :loading="isLoading"
                                    block
                                >
                                    {{ $t('earn.validate.submit') }}
                                </v-btn>
                                <v-btn
                                    text
                                    @click="cancelConfirm"
                                    block
                                    style="color: var(--primary-color); margin-top: 20px"
                                >
                                    {{ $t('earn.validate.cancel') }}
                                </v-btn>
                            </template>
                        </div>
                    </div>
                    <div class="success_cont" v-else>
                        <h2>{{ $t('earn.validate.success.title') }}</h2>
                        <p>{{ $t('earn.validate.success.desc') }}</p>
                        <p class="tx_id">Tx ID: {{ txId }}</p>
                        <div class="tx_status">
                            <div>
                                <label>{{ $t('earn.validate.success.status') }}</label>
                                <p v-if="!txStatus">Waiting..</p>
                                <p v-else>{{ txStatus }}</p>
                            </div>
                            <div class="status_icon">
                                <Spinner
                                    v-if="!txStatus"
                                    style="color: var(--primary-color)"
                                ></Spinner>
                                <p style="color: var(--success)" v-if="txStatus === 'Committed'">
                                    <fa icon="check-circle"></fa>
                                </p>
                                <p style="color: var(--error)" v-if="txStatus === 'Dropped'">
                                    <fa icon="times-circle"></fa>
                                </p>
                            </div>
                        </div>
                        <div class="reason_cont" v-if="txReason">
                            <label>{{ $t('earn.validate.success.reason') }}</label>
                            <p>{{ txReason }}</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue } from 'vue-property-decorator'
//@ts-ignore
import AvaxInput from '@/components/misc/AvaxInput.vue'
import { BN } from '@c4tplatform/caminojs/dist'
import Big from 'big.js'
import { ava, bintools } from '@/AVA'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import ConfirmPage from '@/components/wallet/earn/Validate/ConfirmPage.vue'
import moment from 'moment'
import Tooltip from '@/components/misc/Tooltip.vue'
import CurrencySelect from '@/components/misc/CurrencySelect/CurrencySelect.vue'
import Spinner from '@/components/misc/Spinner.vue'
import DateForm from '@/components/wallet/earn/DateForm.vue'
import Expandable from '@/components/misc/Expandable.vue'
import { WalletType } from '@/js/wallets/types'
import { WalletHelper } from '@/helpers/wallet_helper'
import { bnToBig } from '@/helpers/helper'
import { SignatureError } from '@c4tplatform/caminojs/dist/common'

const MIN_MS = 60000
const HOUR_MS = MIN_MS * 60
const DAY_MS = HOUR_MS * 24

@Component({
    name: 'add_validator',
    components: {
        Tooltip,
        AvaxInput,
        ConfirmPage,
        CurrencySelect,
        Spinner,
        DateForm,
        Expandable,
    },
})
export default class AddValidator extends Vue {
    @Prop() nodeID!: string

    startDate: string = new Date(Date.now() + MIN_MS * 15).toISOString()
    endDate: string = new Date().toISOString()
    rewardIn: string = ''
    rewardDestination = 'local' // local || custom
    isLoading = false
    isConfirm = false
    err: string = ''
    stakeAmt: BN = this.maxAmt

    minFee = 2

    formNodeID = ''
    formAmt: BN = new BN(0)
    formEnd: Date = new Date()
    formFee: number = 0
    formRewardAddr = ''

    txId = ''
    txStatus: string | null = null
    txReason: null | string = null

    isSuccess = false

    currency_type = 'NATIVE'

    mounted() {
        this.rewardSelect('local')
    }

    setEnd(val: string) {
        this.endDate = val
    }

    get rewardAddressLocal() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet.getPlatformRewardAddress()
    }

    rewardSelect(val: 'local' | 'custom') {
        if (val === 'local') {
            this.rewardIn = this.rewardAddressLocal
        } else {
            this.rewardIn = ''
        }
        this.rewardDestination = val
    }

    get minStakeDuration() {
        return ava.getNetwork().P.minStakeDuration * 1000
    }

    get maxStakeDuration() {
        return ava.getNetwork().P.maxStakeDuration * 1000
    }

    get defaultStakeDuration() {
        return 21 * DAY_MS
    }

    // Returns true to show a warning about short validation periods that can not take any delegators
    get warnShortDuration(): boolean {
        let dur = this.stakeDuration

        // If duration is less than 16 days give a warning
        if (dur <= DAY_MS * 16) {
            return true
        }
        return false
    }

    get stakeDuration(): number {
        let start = new Date(this.startDate)
        let end = new Date(this.endDate)

        if (this.isConfirm) {
            end = this.formEnd
        }

        let diff = end.getTime() - start.getTime()
        return diff
    }

    get durationText() {
        let d = moment.duration(this.stakeDuration, 'milliseconds')
        let days = Math.floor(d.asDays())
        return `${days} days ${d.hours()} hours ${d.minutes()} minutes`
    }

    get denomination() {
        return 9
    }

    get platformUnlocked(): BN {
        return this.$store.getters['Assets/walletPlatformBalance']
    }

    get platformLockedStakeable(): BN {
        return this.$store.getters['Assets/walletPlatformBalanceLockedStakeable']
    }

    get feeAmt(): BN {
        return ava.PChain().getTxFee()
    }

    get maxAmt(): BN {
        return ava.getNetwork().P.minStake
    }

    updateFormData() {
        this.formNodeID = this.nodeID.trim()
        this.formAmt = this.stakeAmt
        this.formEnd = new Date(this.endDate)
        this.formRewardAddr = this.rewardIn
    }

    confirm() {
        if (!this.formCheck()) return
        this.updateFormData()
        this.isConfirm = true
    }

    cancelConfirm() {
        this.isConfirm = false
    }

    cancel() {
        this.$emit('cancel')
    }

    get canSubmit() {
        if (!this.nodeID) {
            return false
        }

        if (this.stakeAmt.isZero()) {
            return false
        }

        if (!this.rewardIn) {
            return false
        }

        return true
    }

    formCheck(): boolean {
        this.err = ''

        // Reward Address
        if (this.rewardDestination !== 'local') {
            let rewardAddr = this.rewardIn

            // If it doesnt start with P
            if (rewardAddr[0] !== 'P') {
                this.err = this.$t('earn.validate.errs.address') as string
                return false
            }

            // not a valid address
            try {
                bintools.stringToAddress(rewardAddr)
            } catch (e) {
                this.err = this.$t('earn.validate.errs.address') as string
                return false
            }
        }

        // Not a valid Node ID
        if (!this.nodeID.includes('NodeID-')) {
            this.err = this.$t('earn.validate.errs.id') as string
            return false
        }

        // Stake amount
        if (this.stakeAmt.lt(this.minStakeAmt)) {
            let big = Big(this.minStakeAmt.toString()).div(Math.pow(10, 9))
            this.err = this.$t('earn.validate.errs.amount', [big.toLocaleString()]) as string
            return false
        }

        return true
    }

    async submit() {
        if (!this.formCheck()) return
        let wallet: WalletType = this.$store.state.activeWallet

        // Start delegation in 5 minutes
        let startDate = new Date(Date.now() + 5 * MIN_MS)
        let endDate = this.formEnd
        let startMs = startDate.getTime()
        let endMs = endDate.getTime()

        if (endMs - startMs < this.minStakeDuration) {
            endDate = new Date(startMs + this.minStakeDuration)
        }
        // If End date - start date is greater than max stake duration, adjust start date
        if (endMs - startMs > this.maxStakeDuration) {
            startDate = new Date(endMs - this.maxStakeDuration)
        }
        try {
            this.isLoading = true
            this.err = ''
            let txId = await WalletHelper.validate(
                wallet,
                this.formNodeID,
                new BN(this.formAmt.toString()),
                startDate,
                this.formEnd,
                10
            )
            this.isLoading = false
            this.onTxSubmit(txId)
        } catch (err) {
            this.isLoading = false
            if (err instanceof SignatureError) {
                return this.onTxRecorded(err)
            }
            this.onerror(err)
        }
    }

    onTxSubmit(txId: string) {
        this.txId = txId
        this.isSuccess = true
        this.updateTxStatus(txId)
    }

    onSuccess() {
        // Update History
        this.$store.dispatch('updateTransaction', {
            onlyMultisig: true,
            msgType: 'success',
            msgTitle: 'Validator Added',
            msgText: 'Your tokens are now locked to stake.',
        })
    }

    onTxRecorded(err: any) {
        this.$store.dispatch('updateTransaction', {
            onlyMultisig: true,
            msgType: 'info',
            msgTitle: 'Multisignature',
            msgText: err.message,
        })
    }

    async updateTxStatus(txId: string) {
        let res = await ava.PChain().getTxStatus(txId)
        let status
        let reason = null
        if (typeof res === 'string') {
            status = res
        } else {
            status = res.status
            reason = res.reason
        }

        if (!status || status === 'Processing' || status === 'Unknown') {
            setTimeout(() => {
                this.updateTxStatus(txId)
            }, 5000)
        } else {
            this.txStatus = status
            this.txReason = reason

            if (status === 'Committed') {
                this.onSuccess()
            }
        }
    }

    get minStakeAmt(): BN {
        return this.$store.state.Platform.minStake
    }

    get displayMinStakeAmt(): Big {
        let bn = this.$store.state.Platform.minStake
        return bnToBig(bn, 9)
    }

    onerror(err: any) {
        let msg: string = err.message
        console.error(err)

        if (msg.includes('startTime')) {
            this.err = this.$t('earn.validate.errs.date') as string
        } else if (msg.includes('must be at least')) {
            let minAmt = this.minStakeAmt
            let big = Big(minAmt.toString()).div(Math.pow(10, 9))
            this.err = this.$t('earn.validate.errs.amount', [big.toLocaleString()]) as string
        } else if (msg.includes('nodeID')) {
            this.err = this.$t('earn.validate.errs.id') as string
        } else if (msg.includes('address format')) {
            this.err = this.$t('earn.validate.errs.address') as string
        } else {
            this.err = err.message
        }

        this.$store.dispatch('Notifications/add', {
            type: 'error',
            title: 'Validation Failed',
            message: 'Failed to add validator.',
        })
    }

    get nativeAssetSymbol(): string {
        return this.$store.getters['Assets/AssetAVA']?.symbol ?? ''
    }
}
</script>
<style scoped lang="scss">
@use '../../../../styles/abstracts/mixins';

form {
    display: grid;
    grid-template-columns: 1fr 340px;
    column-gap: 90px;
}

.ins_col {
    max-width: 490px;
    // padding-bottom: 8vh;
}

.amt {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #999;
    padding: 4px 14px;
}

.bigIn {
    flex-grow: 1;
}

input {
    color: var(--primary-color);
    background-color: var(--bg-light);
    padding: 6px 14px;
}

.desc {
    font-size: 13px;
    margin-bottom: 8px !important;
    color: var(--primary-color-light);
}

h4 {
    font-weight: bold;
}

label {
    margin-top: 6px;
    color: var(--primary-color-light);
    font-size: 14px;
    margin-bottom: 3px;
}

.dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 15px;

    label > span {
        float: right;
        opacity: 0.4;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }
}

.submit_box {
    .v-btn {
        margin-top: 14px;
    }
}

.summary {
    border-left: 2px solid var(--bg-light);
    padding-left: 30px;
    height: 100%;

    > div {
        margin-bottom: 14px;

        p {
            font-size: 24px;
        }
    }

    .err {
        margin: 14px 0 !important;
        font-size: 14px;
    }
}

.success_cont {
    .check {
        font-size: 4em;
        color: var(--success);
    }

    .tx_id {
        font-size: 13px;
        color: var(--primary-color-light);
        word-break: break-all;
        margin: 14px 0 !important;
        font-weight: bold;
    }
}

.reward_in {
    transition-duration: 0.2s;

    &[type='local'] {
        .reward_addr_in {
            opacity: 0.3;
            user-select: none;
            pointer-events: none;
        }
    }
}

.reward_tabs {
    margin-bottom: 8px;
    font-size: 13px;

    button {
        color: var(--primary-color-light);

        &:hover {
            color: var(--primary-color);
        }

        &[selected] {
            color: var(--secondary-color);
        }
    }

    span {
        margin: 0px 12px;
    }
}

.tx_status {
    display: flex;
    justify-content: space-between;

    .status_icon {
        align-items: center;
        display: flex;
        font-size: 24px;
    }
}

.tx_status,
.reason_cont {
    background-color: var(--bg-light);
    padding: 4px 12px;
    margin-bottom: 6px;
}

@include mixins.mobile-device {
    form {
        grid-template-columns: 1fr;
    }

    .dates {
        grid-template-columns: 1fr;
    }

    .amt_in {
        width: 100%;
    }

    .summary {
        border-left: none;
        border-top: 2px solid var(--bg-light);
        padding-left: 0;
        padding-top: 30px;
    }
}
</style>
