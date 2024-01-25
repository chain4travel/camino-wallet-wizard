<template>
    <div>
        <template v-if="!submitted">
            <div class="success_body">
                <div class="success_content">
                    <span>{{ $t('wizard.success.dear') }} {{ name }} {{ surname }}</span>
                    <p>
                        {{ $t('wizard.success.thank_you_note') }}
                        <br />
                        <br />
                        {{ $t('wizard.success.thank_you_note2') }}
                        <br />
                        <br />
                        {{ $t('wizard.success.contact_us1') }}
                        <a href="mailto:hello@camino.network">hello@camino.network</a>
                        {{ $t('wizard.success.contact_us2') }}
                    </p>
                    <button
                        @click="completeSaftStep"
                        class="ava_button button_secondary submit_but"
                    >
                        {{ $t('wizard.success.start') }}
                    </button>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-if="isLoading" class="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div class="stage_2" v-if="!isLoading && !walletCreated">
                <div class="modal_main">
                    <div class="modal_body">
                        <div id="sumsub-websdk-container"></div>
                        <!-- <div class="kyc_action">
                    <v-btn type="cancel" @click="walletCreated = true" class="submit_but">
                        Done & Next
                    </v-btn>
                </div> -->
                    </div>
                    <div class="verification--text">
                        <p>Verification might take a while.</p>
                        <p>You will receive your result via Email.</p>
                        <p>
                            If you don't receive your result within 24 hours, please contact
                            <a href="mailto:hello@camino.network" class="presale">
                                hello@camino.network
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <WalletCreated v-else />
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'
import { WalletType } from '@c4tplatform/camino-wallet-sdk'
import WalletCreated from './WalletCreated.vue'
import { generateToken } from '@/kyc_api'
import { KYC_VARIANT } from '@/constants'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletNameType } from '@/js/wallets/types'
import snsWebSdk from '@sumsub/websdk'

@Component({
    components: {
        Modal,
        WalletCreated,
    },
})
export default class KycVerification extends Vue {
    @Prop() walle!: WalletType
    @Prop() verificationCompleted!: boolean
    @Prop() name!: string
    @Prop() surname!: string
    @Prop() email!: string
    @Prop() phone!: string
    submitted: boolean = false
    walletCreated: boolean = this.verificationCompleted ? true : false
    isLoading = false
    background: string = ''
    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
    }
    get walletType(): WalletNameType {
        return this.wallet.type
    }
    async getNewAccessToken() {
        if (this.privateKeyC) {
            const result = await generateToken(this.privateKeyC, KYC_VARIANT.KYC_BASIC)
            return result.access_token
        }
        return ''
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
                    // this.verficationCompleted = true
                }
            })
            .build()
        setTimeout(() => {
            snsWebSdkInstance.launch('#sumsub-websdk-container')
        }, 500)
    }

    @Watch('$root.theme', { immediate: true })
    onthemechange(val: string) {
        if (val === 'night') {
            this.background =
                ".step.active .line, .step.active .bullet:before, .radio-item .checkmark:after, .step.active.pending .bullet:before {\
    background-color: #149ded;\
}\
.accent {\
    color: #149ded;\
}\
.step .title, .title  {\
    color: #f5f5f5;\
}\
.step.active .title {\
    color: #149ded;\
    font-size: 14px;\
    font-weight: 400;\
}\
section {\
    border-radius: 12px;\
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;\
    background-color: #1e293b;\
}\
p , h3, h2, label, .markdown-instructions li , .markdown-instructions p,.line-form .line-form-item > .phone-input,\
.line-form .line-form-item > input{\
    color : #f5f5f5 !important;\
    font-size : 14px;\
}\
.document-examples, .upload {\
    gap : 10px;\
}\
.upload-payment-item {\
    margin : 0px;\
}\
.upload-payment-item .upload-item , .mobile-button{\
    border: 1px solid rgba(203, 213, 225, 0.12);\
    border-radius: 7px;\
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;\
}\
 .mobile-button h3{\
    color : #149ded !important;\
 }\
 button.submit,\
button[type='submit'] {\
    border-radius: 12px;\
    background-color: transparent;\
    background-image: none;\
    color: #149ded;\
    border: 1px solid #149ded;\
}\
button:active:not(:disabled):not(.disabled),\
button:hover:not(:disabled):not(.disabled):not(:active) {\
    box-shadow: none;\
}\
button.submit:active:not(:disabled),\
button.submit:hover:not(:disabled):not(.disabled):not(:active),\
button[type='submit']:active:not(:disabled),\
button[type='submit']:hover:not(:disabled):not(.disabled):not(:active) {\
     background-image: none;\
}\
button {\
    border-radius: 12px;\
    background-color: transparent;\
    font-weight: 600;\
    text-align: center;\
    color: #149ded;\
    border: 1px solid #149ded;\
}\
.line-form .line-form-item > span {\
    border-bottom: none;\
}\
button.submit .arrow, button[type=submit] .arrow {\
    margin-right: 0;\
    margin-left: 5px;\
}\
button .arrow {\
    margin-right: 5px;\
}\
.upload-item h4.requiredDoc:after {\
    color: #149ded;\
}\
.popup {\
    background: #1e293b !important;\
}\
.popup .message-content p {\
    color: #f5f5f5 !important;\
}\
.step.pending .bullet {\
    background-color: #f5f5f5;\
    background-image: none;\
    border-color: #f5f5f5;\
}\
.step.pending .line , .step.active .line, .step.success .line{\
    background-color: #149ded;\
}\
.step.success .bullet {\
    background-color: #149ded;\
    border-color: #f5f5f5;\
}\
.error-message.warn {\
    background-color: #0f172a;\
}\
.radio-item input:disabled~.checkmark:after {\
  background-color: #149ded;\
}\
.document-status {\
    background-color: transparent !important;\
}\
"
            // 'body {background-color: var(--secondary-color) !important; min-height: 450px !important;} .line {background-color: black !important;}'
        } else {
            this.background =
                ".step.active .line, .step.active .bullet:before, .radio-item .checkmark:after, .step.active.pending .bullet:before {\
    background-color: #149ded;\
}\
.accent {\
    color: #149ded;\
}\
.step .title, .title  {\
    color: #0f172a;\
}\
.step.active .title {\
    color: #149ded;\
    font-size: 14px;\
    font-weight: 400;\
}\
section {\
    border-radius: 12px;\
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;\
    background-color: transparent;\
}\
p , h3, h2, label, .markdown-instructions li , .markdown-instructions p,.line-form .line-form-item > .phone-input,\
.line-form .line-form-item > input{\
    color : #0f172a !important;\
    font-size : 14px;\
}\
.document-examples, .upload {\
    gap : 10px;\
}\
.upload-payment-item {\
    margin : 0px;\
}\
.upload-payment-item .upload-item , .mobile-button{\
    border: 1px solid rgba(203, 213, 225, 0.12);\
    border-radius: 7px;\
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;\
}\
 .mobile-button h3{\
    color : #149ded !important;\
 }\
 button.submit,\
button[type='submit'] {\
    border-radius: 12px;\
    background-color: transparent;\
    background-image: none;\
    color: #149ded;\
    border: 1px solid #149ded;\
}\
button:active:not(:disabled):not(.disabled),\
button:hover:not(:disabled):not(.disabled):not(:active) {\
    box-shadow: none;\
}\
button.submit:active:not(:disabled),\
button.submit:hover:not(:disabled):not(.disabled):not(:active),\
button[type='submit']:active:not(:disabled),\
button[type='submit']:hover:not(:disabled):not(.disabled):not(:active) {\
     background-image: none;\
}\
button {\
    border-radius: 12px;\
    background-color: transparent;\
    font-weight: 600;\
    text-align: center;\
    color: #149ded;\
    border: 1px solid #149ded;\
}\
.line-form .line-form-item > span {\
    border-bottom: none;\
}\
button.submit .arrow, button[type=submit] .arrow {\
    margin-right: 0;\
    margin-left: 5px;\
}\
button .arrow {\
    margin-right: 5px;\
}\
.upload-item h4.requiredDoc:after {\
    color: #149ded;\
}\
.popup {\
    background: #e2e8f0 !important;\
}\
.popup .message-content p {\
    color: #0f172a !important;\
}\
.step.pending .bullet {\
    background-color: #0f172a;\
    background-image: none;\
    border-color: #0f172a;\
}\
.step.pending .line , .step.active .line, .step.success .line{\
    background-color: #149ded;\
}\
.step.success .bullet {\
    background-color: #149ded;\
    border-color: #0f172a;\
}\
.error-message.warn {\
    background-color: transparent;\
}\
.radio-item input:disabled~.checkmark:after {\
  background-color: #149ded;\
}\
.document-status {\
    background-color: transparent !important;\
}\
"
        }
    }
    get privateKeyC(): string | null {
        if (this.walletType === 'ledger') return null
        let wallet = this.wallet as SingletonWallet | MnemonicWallet
        return wallet.ethKey
    }

    async submitUserData() {
        // if (!this.userData.email || !this.userData.phone) return
        try {
            this.isLoading = true
            const accessToken = await this.getNewAccessToken()
            this.launchWebSdk(accessToken, this.email, this.phone)
            // this.userDataSubmitted = true
            this.submitted = true
        } finally {
            this.isLoading = false
        }
    }
    async completeSaftStep() {
        await this.submitUserData()
    }
    doneWalletCreation() {
        this.walletCreated = true
    }
}
</script>
<style scoped lang="scss">
@use '../styles/abstracts/mixins';

/* .v-stepper__wrapper {
    display: flex;
    justify-content: center;
} */
.kyc_action {
    display: flex;
    justify-content: flex-end;
}
.presale {
    color: var(--secondary-color);
    text-decoration: none;
}
.stage_2 {
    width: 100%;
}
.verification--text {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 1rem;
    p {
        text-align: center;
    }
}

.modal_main::v-deep {
    display: flex;
    align-items: center;
    flex-direction: column;
    /* background-color: red; */

    .modal_body {
        width: 70%;
        min-width: 100%;
        border: var(--primary-border);
        max-width: 750px;
        height: min-content !important;
        /* min-height: 450px !important; */
        border-radius: var(--border-radius-sm) !important;
        overflow: auto;
        min-height: 200px;
    }

    .modal_bg {
        width: 100vw !important;
        position: fixed;
    }
}

h1 {
    font-weight: normal;
}

.kyc_button {
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

.submit_but {
    // width: 100%;
    height: 48px !important;
    border-radius: 12px !important;
    text-transform: capitalize !important;
    color: #fff !important;
    font-size: 1rem !important;
    border: none !important;
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

.popup {
    background: #1e293b;
}
.popup .message-content p {
    color: #f5f5f5;
}

.step.active.pending .bullet:before {
    background-color: var(--orange-color);
}
.line-form .line-form-item > .phone-input,
.line-form .line-form-item > input {
    color: red;
}
.line-form .line-form-item > span {
    border-bottom: none;
}

.success_body {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-direction: column;
    max-width: 700px;
}

.success_content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    text-align: center;
    .v-btn {
        max-width: 350px;
    }
}

button {
    border-radius: 12px;
    background-color: transparent;
    font-weight: 600;
    text-align: center;
    color: #7c8ab5;
    border: 1px solid #149ded;
}
input {
    color: var(--primary-color);
    background-color: var(--bg-light);
    border-radius: var(--border-radius-sm);
    padding: 10px 10px;
    font-size: 13px;
    outline: none;
}
@include mixins.mobile-device {
    .success_content,
    .verification--text {
        font-size: 14px;
    }
}
</style>
