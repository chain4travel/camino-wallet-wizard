<template>
    <v-stepper class="steper" :value="step">
        <v-stepper-header class="steper__header elevation-0">
            <v-stepper-step step="1" :complete="step > 1">Create Wallet</v-stepper-step>
            <v-stepper-step step="2" :complete="step > 2">Personal Data</v-stepper-step>
            <v-stepper-step step="3" :complete="step > 3">KYC Verification</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="steper__body">
            <v-stepper-content step="1" key="1">
                <create-wallet-step @changestep="changeStep" />
            </v-stepper-content>

            <v-stepper-content step="2" key="2">
                <saft
                    @changestep="changeStep"
                    @getVerificationStatus="getVerificationStatus"
                    :name="name"
                    :surname="surname"
                    :email="email"
                    :phone="phone"
                    @update:name="name = $event"
                    @update:surname="surname = $event"
                    @update:phone="phone = $event"
                    @update:email="email = $event"
                ></saft>
            </v-stepper-content>

            <v-stepper-content step="3" key="3">
                <kyc-verification
                    :verificationCompleted="verificationCompleted"
                    :name="name"
                    :surname="surname"
                    :email="email"
                    :phone="phone"
                />
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Spinner from '@/components/misc/Spinner.vue'
import * as bip39 from 'bip39'

import MnemonicPhrase from '@/js/wallets/MnemonicPhrase'
import Modal from '@/components/modals/Modal.vue'
import { BN, WalletNameType, WalletType } from '@c4tplatform/camino-wallet-sdk'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { bnToBig } from '@/helpers/helper'
import Big from 'big.js'
import AvaAsset from '@/js/AvaAsset'
import CreateWalletStep from './CreateWalletStep.vue'
import Saft from './Saft.vue'
import KycVerification from './KycVerification.vue'

@Component({
    components: {
        Spinner,
        CreateWalletStep,
        KycVerification,
        Saft,
    },
})
export default class CreateWallet extends Vue {
    // TODO: We do not need to create keyPair, only mnemonic is sufficient
    isLoad: boolean = false
    isLoading: boolean = false
    step = 1
    keyPhrase: MnemonicPhrase | null = null
    isSecured: boolean = false
    isVerified: boolean = false
    verificationCompleted = false

    name: string = ''
    surname: string = ''
    email: string = ''
    phone: string = ''

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
    }
    getVerificationStatus() {
        this.verificationCompleted = true
    }
    get canSubmit(): boolean {
        // if(!this.rememberValid) return false;
        return true
    }
    verifyMnemonic() {
        // @ts-ignore
        this.$refs.verify.open()
    }

    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
    }

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
        return text
    }
    /*********************  getbalance *********************/
    async complete() {
        let result = await this.access()
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
    nextStep() {}
    nextStepKyc() {}
    async access(): Promise<void> {
        if (!this.keyPhrase) return
        this.isLoad = true
        let parent = this
        return await parent.$store.dispatch('accessWallet', this.keyPhrase!.getValue())
    }
    changeStep(s: number) {
        this.step = s
    }
}
</script>
<style lang="scss">
@use '../styles/abstracts/mixins';
@use '../styles/abstracts/variables';
.v-stepper {
    flex: 1;
}
.v-application .primary {
    background-color: red !important;
    border-color: red !important ;
}
.hide {
    opacity: 0;
}
.v-stepper__wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
}
.v-stepper__header {
    background-color: var(--bg-wallet-light);
}

.steper {
    width: 100%;
    height: auto;
    max-width: 1100px;
    padding: 15px !important;
    padding-top: 50px !important;
    padding-bottom: 50px !important;
    border: none !important;
    display: flex;
    flex-direction: column;
    background-color: transparent !important;
    box-shadow: none !important;
    justify-content: center;
    margin-top: 0px !important;
    &__header {
        border-radius: var(--border-radius-sm);
        .v-stepper__label {
            color: var(--primary-color) !important;
        }
        box-shadow: var(--box-shadow) !important;
        .v-divider {
            border-color: var(--tooltip-bg) !important;
        }
        border: var(--secondary-border);
    }
    &__body {
        margin-top: 50px;
        overflow: auto !important;
    }

    /* ==========================================
   mneumonic
   ========================================== */

    .stage_2 {
        margin: 0 auto;
        text-align: left;
        align-items: flex-start;
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
            background-color: variables.$green-light;
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
            width: variables.$img-size;
            height: variables.$img-size;
            max-height: none;
        }

        header {
            h1 {
                margin-top: 10px;
                font-size: variables.$xl-size;
                line-height: 1.25em;
                font-weight: 400;
            }

            p {
                color: variables.$primary-color-light;
            }
        }

        .warn {
            margin-top: variables.$vertical-padding !important;

            span {
                display: block;
                font-size: variables.$s-size;
                font-weight: 700;
                text-transform: uppercase;

                &.label {
                    color: variables.$secondary-color;
                    text-transform: uppercase;
                }

                &.description {
                    color: variables.$primary-color-light !important;
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
                > div {
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                }

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
}

@include mixins.mobile-device {
    .steper .cols {
        display: block;
    }
    .steper .phrase_disp_col {
        padding: 30px 0;
        align-items: center;
        text-align: center;

        img {
            width: variables.$img-size-mobile;
            height: variables.$img-size-mobile;
        }

        header {
            h1 {
                font-size: variables.$xl-size-mobile;
            }
        }

        .warn {
            margin-top: variables.$vertical-padding-mobile !important;
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

@include mixins.mobile-device {
    .v-stepper__content {
        padding: 24px 5px 16px 5px !important;
    }
}
</style>
