<template>
    <div class="create_wallet">
        <div class="container">
            <div class="row">
                <div class="col">
                    <transition name="fade" mode="out-in">
                        <!-- PHASE 2 -->
                        <div class="stage_2" v-if="!kycStep">
                            <div class="cols">
                                <!-- LEFT -->
                                <div class="mneumonic_disp_col">
                                    <div class="mnemonic_disp">
                                        <p
                                            class="phrase_raw"
                                            v-bind:class="{
                                                verified: isVerified,
                                            }"
                                        >
                                            {{ keyPhrase.getValue() }}
                                        </p>
                                        <div class="mneumonic_button_container" v-if="!isVerified">
                                            <button
                                                @click="createKey"
                                                class="ava_button but_randomize button_primary"
                                            >
                                                <fa icon="sync"></fa>
                                                <span>{{ $t('create.regenerate') }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- RIGHT -->
                                <div class="phrase_disp_col">
                                    <template v-if="!isVerified">
                                        <img
                                            v-if="$root.theme === 'day'"
                                            src="@/assets/keyphrase.png"
                                            alt
                                        />
                                        <img v-else src="@/assets/keyphrase_night.svg" alt />
                                    </template>
                                    <template v-else>
                                        <img src="@/assets/success.svg" alt />
                                    </template>
                                    <header v-if="!isVerified">
                                        <h1>
                                            {{ $t('create.mnemonic_title') }}
                                        </h1>
                                        <p>{{ $t('create.mnemonic_desc') }}</p>
                                    </header>
                                    <header v-else>
                                        <h1>
                                            {{ $t('create.success_title') }}
                                        </h1>
                                        <p>{{ $t('create.success_desc') }}</p>
                                    </header>
                                    <p class="warn" v-if="!isVerified">
                                        <span class="label">{{ $t('create.attention') }}</span>
                                        <span class="description">{{ $t('create.warning') }}</span>
                                    </p>
                                    <!-- STEP 2a - VERIFY -->
                                    <div class="verify_cont" v-if="!isVerified">
                                        <MnemonicCopied
                                            v-model="isSecured"
                                            :explain="$t('create.confirm')"
                                        ></MnemonicCopied>
                                        <VerifyMnemonic
                                            :mnemonic="keyPhrase"
                                            ref="verify"
                                            @complete="complete"
                                        ></VerifyMnemonic>
                                        <button
                                            class="but_primary ava_button button_secondary"
                                            @click="verifyMnemonic"
                                            :disabled="!canVerify"
                                        >
                                            vetify Mnemonic
                                        </button>
                                    </div>
                                    <!-- STEP 2b - ACCESS -->
                                    <div class="access_cont" v-if="isVerified && !kycStep">
                                        <paper-wallet
                                            ref="print_modal"
                                            v-if="walletType === 'mnemonic'"
                                            :wallet="activeWallet"
                                        ></paper-wallet>
                                        <div class="submit">
                                            <transition name="fade" mode="out-in">
                                                <Spinner v-if="isLoad" class="spinner"></Spinner>
                                                <div v-else>
                                                    <!-- <v-btn
                                                        :tooltip="$t('top.hover2')"
                                                        @click="viewPrintModal"
                                                        class="print_but"
                                                        :disabled="
                                                            selectedNetwork !== 'Camino' ||
                                                            walletType !== 'mnemonic'
                                                        "
                                                    >
                                                        <span>3. Print paper Wallet</span>
                                                    </v-btn> -->
                                                    <button
                                                        :disabled="walletType !== 'mnemonic'"
                                                        @click="viewPrintModal"
                                                        class="but_primary ava_button button_secondary"
                                                    >
                                                        Print keyphrase
                                                    </button>
                                                    <button
                                                        class="button_primary ava_button access generate"
                                                        @click="nextStep"
                                                        :disabled="!canSubmit"
                                                    >
                                                        next step
                                                    </button>
                                                    <!-- <router-link to="/" class="link">
                                                        {{ $t('create.cancel') }}
                                                    </router-link> -->
                                                    <ToS style="margin: 30px 0 !important"></ToS>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>
                                    <!-- <div class="kyc" v-if="isVerified && kycStep">toto d zeb</div> -->
                                    <!-- STEP 3c - kyc -->
                                </div>
                            </div>
                        </div>
                        <div class="stage_2" v-else>
                            <div v-if="!userDataSubmitted" class="KYCform">
                                <div class="request-text">
                                    {{ $t('kyc_process.info_explanation_p1') }}
                                    <br />
                                    {{ $t('kyc_process.info_explanation_p2') }}
                                </div>
                                <form @submit.prevent="submitUserData">
                                    <div>
                                        <label>{{ $t('kyc_process.your_email_address') }}</label>
                                        <input
                                            type="text"
                                            :placeholder="$t('kyc_process.email_address')"
                                            v-model="userData.email"
                                        />
                                    </div>
                                    <div>
                                        <label>{{ $t('kyc_process.your_phone_number') }}</label>
                                        <input
                                            type="tel"
                                            :placeholder="$t('kyc_process.phone_number')"
                                            v-model="userData.phone"
                                        />
                                    </div>
                                    <v-btn
                                        type="submit"
                                        :disabled="submitUserDataDisabled"
                                        :loading="isLoading"
                                        class="button_submit_form"
                                    >
                                        {{ $t('kyc_process.submit') }}
                                    </v-btn>
                                </form>
                            </div>
                            <div id="sumsub-websdk-container"></div>
                            <div v-if="verficationCompleted" class="kyc_action">
                                <v-btn type="cancel" @click="nextStepKyc" class="outlined_button">
                                    Next step
                                </v-btn>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div></div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Spinner from '@/components/misc/Spinner.vue'
import * as bip39 from 'bip39'

import VerifyMnemonic from '@/components/modals/VerifyMnemonic.vue'
import MnemonicCopied from '@/components/CreateWalletWorkflow/MnemonicCopied.vue'
import ToS from '@/components/misc/ToS.vue'
import MnemonicPhrase from '@/js/wallets/MnemonicPhrase'
import PaperWallet from '../modals/PaperWallet/PaperWallet.vue'
import Modal from '../modals/Modal.vue'
import { BN, WalletNameType, WalletType } from '@c4tplatform/camino-wallet-sdk'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { generateToken } from '@/kyc_api'
import snsWebSdk from '@sumsub/websdk'
import { bnToBig } from '@/helpers/helper'
import Big from 'big.js'
import AvaAsset from '@/js/AvaAsset'

interface UserData {
    email: string
    phone: string
}
@Component({
    components: {
        ToS,
        Spinner,
        VerifyMnemonic,
        MnemonicCopied,
        PaperWallet,
    },
})
export default class CreateWallet extends Vue {
    // TODO: We do not need to create keyPair, only mnemonic is sufficient
    isLoad: boolean = false
    userDataSubmitted: boolean = false
    isLoading: boolean = false
    userData: UserData = {
        email: '',
        phone: '',
    }
    keyPhrase: MnemonicPhrase | null = null
    isSecured: boolean = false
    isVerified: boolean = false
    kycStep: boolean = false
    background: string = 'body {background-color: red !important;}'
    verficationCompleted: boolean = true
    created() {
        this.createKey()
    }
    get canVerify(): boolean {
        return this.isSecured ? true : false
    }

    get verificatiionColor() {
        return this.isVerified ? '#a9efbf' : '#F5F6FA'
    }

    createKey(): void {
        this.isSecured = false
        let mnemonic = bip39.generateMnemonic(256)
        this.keyPhrase = new MnemonicPhrase(mnemonic)
    }

    $refs!: {
        modal: Modal
        print_modal: PaperWallet
    }
    viewPrintModal() {
        this.$refs.print_modal.open()
    }

    // Will be true if the values in remember wallet checkbox are valid
    // isRememberValid(val: boolean){
    //     this.rememberValid = val;
    // }

    get canSubmit(): boolean {
        // if(!this.rememberValid) return false;
        return true
    }
    verifyMnemonic() {
        // @ts-ignore
        this.$refs.verify.open()
    }

    /********************* kyc *********************/
    // get walletType(): WalletNameType {
    //     return this.wallet.type
    // }
    get privateKeyC(): string | null {
        if (this.walletType === 'ledger') return null
        let wallet = this.wallet as SingletonWallet | MnemonicWallet
        return wallet.ethKey
    }
    get submitUserDataDisabled() {
        return !this.userData.email || !this.userData.phone || this.isLoading
    }

    async getNewAccessToken() {
        if (this.privateKeyC) {
            const result = await generateToken(this.privateKeyC)
            return result.access_token
        }
        return ''
    }
    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
    }

    async submitUserData() {
        if (!this.userData.email || !this.userData.phone) return
        try {
            this.isLoading = true
            const accessToken = await this.getNewAccessToken()
            this.launchWebSdk(accessToken, this.userData.email, this.userData.phone)
            this.userDataSubmitted = true
        } finally {
            this.isLoading = false
        }
    }
    launchWebSdk(accessToken: string, applicantEmail: any, applicantPhone: any) {
        let snsWebSdkInstance = snsWebSdk
            .init(accessToken, () => this.getNewAccessToken())
            .withConf({
                email: applicantEmail,
                phone: applicantPhone,
                uiConf: {
                    customCssStr: this.background,
                },
            })
            .withOptions({ addViewportTag: false, adaptIframeHeight: true })
            .on('idCheck.applicantStatus', async (applicantStatus) => {
                await this.$store.dispatch('Accounts/updateKycStatus')
                if (applicantStatus.reviewStatus === 'completed') {
                    this.verficationCompleted = true
                }
            })
            .build()
        snsWebSdkInstance.launch('#sumsub-websdk-container')
    }
    /*********************  kyc *********************/
    /*********************  getbalance *********************/
    // updateBalance(): void {
    //     this.$store.dispatch('Assets/updateUTXOs')
    //     this.$store.dispatch('History/updateTransactionHistory')
    // }
    get isUpdateBalance(): boolean {
        if (!this.wallet) return true
        return this.wallet.isFetchUtxos
    }
    get ava_asset(): AvaAsset | null {
        let ava = this.$store.getters['Assets/AssetAVA']
        return ava
    }
    get evmUnlocked(): BN {
        if (!this.wallet) return new BN(0)
        // convert from ^18 to ^9
        let bal = this.wallet.ethBalance
        return bal.div(new BN(Math.pow(10, 9).toString()))
    }

    get totalBalance(): BN {
        if (!this.ava_asset) return new BN(0)

        let tot = this.ava_asset.getTotalAmount()
        // add EVM balance
        tot = tot.add(this.evmUnlocked)
        // console.log('sdfkjsdfkl')
        // console.log(tot)
        return tot
    }

    get totalBalanceBig(): Big {
        if (this.ava_asset) {
            let denom = this.ava_asset.denomination
            let bigTot = bnToBig(this.totalBalance, denom)
            return bigTot
        }
        return Big(0)
    }
    get balanceText(): string {
        if (this.ava_asset !== null) {
            let denom = this.ava_asset.denomination
            return this.totalBalanceBig.toLocaleString(denom)
        } else {
            return '?'
        }
    }

    get balanceTextLeft(): string {
        if (this.isUpdateBalance) return '--'
        let text = this.balanceText
        if (text.includes('.')) {
            let left = text.split('.')[0]
            return left
        }
        console.log(text)
        return text
    }
    /*********************  getbalance *********************/
    async complete() {
        let result = await this.access()
        console.log(result)
        console.log('gooood')
        this.isLoad = false
        this.isVerified = true
    }
    get activeWallet(): WalletType | null {
        return this.$store.state.activeWallet
    }
    get walletType(): WalletNameType {
        let wallet = this.activeWallet
        if (!wallet) return 'mnemonic'
        return wallet.type
    }
    nextStep() {
        this.kycStep = true
        console.log('next step a bigoola')
    }
    nextStepKyc() {
        console.log(this.balanceTextLeft)
        console.log('kyc finished')
    }
    async access(): Promise<void> {
        if (!this.keyPhrase) return
        this.isLoad = true
        let parent = this
        return await parent.$store.dispatch('accessWallet', this.keyPhrase!.getValue())
    }
}
</script>
<style scoped lang="scss">
@use '../../styles/main';

.create_wallet {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ==========================================
   stage_1
   ========================================== */

.stage_1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: var(--bg-light);
    padding: main.$container-padding;
    border-radius: 1rem;
    text-align: center;
    /*min-width: 1000px;*/

    img {
        margin-top: main.$vertical-padding;
        width: 89px;
        height: 89px;
        max-height: none;
    }

    h1 {
        margin-top: main.$vertical-padding;
        text-align: left;
        font-size: main.$m-size;
        font-weight: 400;
    }
}

.options {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 15px;
    padding-top: 15px;
    border-top: 1px solid var(--primary-color-light);

    > * {
        margin: 4px;
        font-size: 0.8rem;
    }

    p {
        color: #999;
        margin: 6px !important;
    }
}

.torus_but {
    background-color: #db3236;
    color: #fff;
}

.but_generate {
    display: block;
    height: max-content;
    background-color: main.$secondary-color;
}

.key_disp {
    margin: 30px auto;
    font-size: 12px;
}

a {
    color: main.$primary-color-light !important;
    text-decoration: underline !important;
    margin-top: 10px;
}

/* ==========================================
   mneumonic
   ========================================== */

.stage_2 {
    margin: 0 auto;
    text-align: left;
    align-items: flex-start;
    max-width: 100%;
}

.cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 60px;
}

.mneumonic_disp_col {
    .mnemonic_disp {
        max-width: 560px;
        justify-self: center;
        display: flex;
        flex-direction: column;
    }

    .phrase_raw {
        color: var(--primary-color);
        background-color: var(--bg-light);
        padding: 14px 24px;
        text-align: justify;
        border-radius: var(--border-radius-sm);
        margin: 30px 0px !important;
    }

    .mnemonic_display {
        background-color: var(--bg-light);
        padding: 14px;
    }

    .verified {
        background-color: main.$green-light;
        color: #222;
    }

    .mneumonic_button_container {
        .but_randomize {
            span {
                margin-left: 12px;
            }
        }
    }
}

.phrase_disp_col {
    padding: 0 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    > * {
        width: 100%;
    }

    img {
        width: main.$img-size;
        height: main.$img-size;
        max-height: none;
    }

    header {
        h1 {
            margin-top: 10px;
            font-size: main.$xl-size;
            line-height: 1.25em;
            font-weight: 400;
        }

        p {
            color: main.$primary-color-light;
        }
    }

    .warn {
        margin-top: main.$vertical-padding !important;

        span {
            display: block;
            font-size: main.$s-size;
            font-weight: 700;
            text-transform: uppercase;

            &.label {
                color: main.$secondary-color;
                text-transform: uppercase;
            }

            &.description {
                color: main.$primary-color-light !important;
            }
        }
    }

    .access_cont {
        text-align: left;
        flex-direction: column;

        .submit {
            display: flex;
            flex-direction: row;
            margin-top: 14px;
            text-align: left;

            .link {
                margin-left: 40px;
            }
        }
    }
}

.spinner {
    width: 26px !important;
    margin: 0px auto;
}

.remember_wallet {
    margin: 20px 0;
}

h1 {
    font-weight: normal;
}

.outlined_button {
    border-width: 1px;
    border-style: solid;
    border-radius: var(--border-radius-sm);
    padding: 10px 24px;
    border-color: var(--primary-btn-border-color);
    color: var(--primary-btn-border-color);
    background-color: var(--bg) !important;
    height: auto;
}

.kyc_action {
    display: flex;
    background-color: var(--bg);
    border-bottom: var(--bg);
    color: var(--primary-color);
    border-top: 2px solid var(--bg-light);
    position: relative;
    padding: 16px 22px;
}
.KYCform {
    padding: 20px;
    border-radius: var(--border-radius-sm);
    overflow: auto;
    .request-text {
        padding: 1rem;
        /* border: var(--primary-border); */
        text-align: center;
        color: var(--primary-contrast-text);
        border-radius: var(--border-radius-sm);
        margin-bottom: 25px;
        box-shadow: var(--box-shadow);
        background-color: var(--bg-light);
    }
    form {
        display: grid;
        gap: 10px;
        label {
            font-size: 14px;
            margin-bottom: 10px !important;
            color: var(--primary-contrast-text);
        }
        > div {
            display: flex;
            flex-direction: column;
            margin-bottom: 5px;
        }
    }
}

@include main.medium-device {
    .stage_1 {
        min-width: unset;
    }
}

@include main.mobile-device {
    .stage_1 {
        min-width: unset;
    }

    .stage_2 {
        min-width: unset;
    }

    .access {
        margin: 30px auto;
        width: 100%;
    }

    .cols {
        display: block;
    }

    .options {
        margin: 30px 0px;
        flex-direction: column;

        > button {
            width: 100%;
        }
    }

    .mneumonic_disp_col {
        .mnemonic_disp {
            margin: 0 auto;
        }

        .mneumonic_button_container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            .copy_phrase {
                margin-right: 0;
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .but_randomize {
                margin-top: 10px;

                span {
                    margin-left: 12px;
                }
            }
        }
    }

    .phrase_disp_col {
        padding: 30px 0;
        align-items: center;

        img {
            width: main.$img-size-mobile;
            height: main.$img-size-mobile;
        }

        header {
            h1 {
                font-size: main.$xl-size-mobile;
            }
        }

        .warn {
            margin-top: main.$vertical-padding-mobile !important;
        }

        .access_cont {
            .submit {
                flex-direction: column;
                justify-content: center;

                > div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .link {
                    margin: auto;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.create_wallet {
    .remember_wallet {
        .v-expansion-panel-header,
        .v-expansion-panel-content__wrap {
            padding: 6px 0;
        }
    }
}
</style>
