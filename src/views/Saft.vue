<template>
    <div class="saft-view">
        <template v-if="!submitted">
            <h1 class="header-text">{{ $t('wizard.title') }}</h1>
            <form @submit.prevent="submitSaftForm">
                <InputField
                    labels="Name"
                    :error_value="error.name"
                    :error_message="$t('wizard.errors.name')"
                    placeholder="John"
                    @change="handleChange"
                    required
                />
                <InputField
                    label="Surname"
                    :error_value="error.surname"
                    :error_message="$t('wizard.errors.surname')"
                    placeholder="Doe"
                    @change="handleChange"
                    required
                />
                <InputField
                    label="Street"
                    :error_message="$t('wizard.errors.street')"
                    placeholder="Street and number"
                    @change="handleChange"
                    required
                />
                <InputField
                    label="Street2"
                    :error_message="$t('wizard.errors.street2')"
                    placeholder="Street2"
                    @change="handleChange"
                />
                <InputField
                    label="Zip Code"
                    :error_message="$t('wizard.errors.zip')"
                    placeholder="10000"
                    @change="handleChange"
                    required
                />
                <InputField
                    label="City"
                    :error_value="error.city"
                    :error_message="$t('wizard.errors.city')"
                    placeholder="City"
                    @change="handleChange"
                    required
                />
                <div class="input_box">
                    <label>
                        Country
                        <sup>&#42;</sup>
                    </label>
                    <country-select
                        v-model="user.country"
                        :country="user.country"
                        topCountry="DE"
                        class="single_line_input hover_border"
                        removePlaceholder
                        countryName
                    />
                </div>
                <InputField
                    label="Phone"
                    :error_value="error.phone"
                    :error_message="$t('wizard.errors.phone')"
                    placeholder="Phone Number"
                    @change="handleChange"
                    required
                />
                <InputField
                    label="Email"
                    :error_value="error.email"
                    :error_message="$t('wizard.errors.email')"
                    placeholder="Email Address"
                    @change="handleChange"
                    required
                />
                <div class="multisig-box">
                    <b>This option is only recommended for businesses</b>
                    <small>
                        Do you want to share control over your tokens?
                        <br />
                        Camino supports MultiSignature wallets. If you want multiple persons to have
                        control over your Camino tokens, please tick the box below. We will then
                        reach out to you to clarify the process and guide your through the process.
                        <br />
                        Yes, I want to share control over my tokens. Please get in contact with me.
                    </small>
                    <MultiSigCheckbox v-model="user.multisig" :explain="$t('wizard.multisig')" />
                </div>
                <div class="form_actions">
                    <SaftCheckbox v-model="user.agree" :explain="$t('wizard.agree')" required />
                    <v-btn
                        type="submit"
                        :disabled="submitUserDataDisabled"
                        class="ava_button button_secondary"
                        depressed
                    >
                        {{ $t('wizard.send') }}
                    </v-btn>
                    <small class="required_text">
                        <sup>*&nbsp;</sup>
                        Required fields
                    </small>
                </div>
            </form>
        </template>
        <template v-else>
            <div class="success_body">
                <img src="@/assets/success.svg" alt />
                <div class="success_content">
                    <span>{{ $t('wizard.success.dear') }}, {{ user.name }}</span>
                    <p>
                        {{ $t('wizard.success.thank_you_note') }}
                        <br />
                        {{ $t('wizard.success.thank_you_note2') }}
                    </p>
                    <v-btn @click="completeSaftStep" class="button_secondary">
                        {{ $t('wizard.success.start') }}
                    </v-btn>
                </div>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SaftCheckbox from '../components/Saft/SaftCheckbox.vue'
import InputField from '../components/Saft/InputField.vue'
import MultiSigCheckbox from '../components/Saft/MultiSigCheckbox.vue'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { WalletNameType } from '@/js/wallets/types'
import { generateToken } from '@/kyc_api'
import snsWebSdk from '@sumsub/websdk'
import axios from 'axios'
const { isHexStrict, toHex, toUint8Array } = require('@arcblock/forge-util')
//@ts-ignore
const EC = require('elliptic').ec

interface User {
    name: string
    surname: string
    street: string
    street2: string
    zip: string
    city: string
    country: string
    email: string
    phone: string
    agree: boolean
    multisig: boolean
}
function strip0x(input: string) {
    return isHexStrict(input) ? input.replace(/^0x/i, '') : input
}
@Component({
    components: { SaftCheckbox, InputField, MultiSigCheckbox },
})
export default class Saft extends Vue {
    nameRegex = /^([^<>()|[\]\\.,;:\s@\\"]|(\\".+\\")){2,30}$/
    emailRegex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{3,9}$/
    isLoading = false
    background = ''
    error: {
        name: boolean
        surname: boolean
        city: boolean
        email: boolean
        phone: boolean
    } = {
        name: false,
        surname: false,
        city: false,
        email: false,
        phone: false,
    }
    submitted: boolean = false
    user: User = {
        name: '',
        surname: '',
        street: '',
        street2: '',
        zip: '',
        city: '',
        country: '',
        email: '',
        phone: '',
        agree: false,
        multisig: false,
    }
    created() {
        localStorage.removeItem('Email')
        localStorage.removeItem('Phone')
    }
    async getNewAccessToken() {
        const secp256k1 = new EC('secp256k1')
        const compressed = false
        const pk = secp256k1
            .keyFromPrivate(strip0x(toHex(`0x${this.privateKeyC}`)), 'hex')
            .getPublic(compressed, 'hex')
        let PublicKey = `0x${pk}`
        const result = await generateToken('0x' + this.wallet.getEvmAddress(), PublicKey)
        return result.token
    }
    get walletType(): WalletNameType {
        return this.wallet.type
    }
    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
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
        snsWebSdkInstance.launch('#sumsub-websdk-container')
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
    async submitUserData() {
        // if (!this.userData.email || !this.userData.phone) return
        try {
            this.isLoading = true
            const accessToken = await this.getNewAccessToken()
            this.launchWebSdk(accessToken, this.user.email, this.user.phone)
            // this.userDataSubmitted = true
        } finally {
            this.isLoading = false
        }
    }
    get privateKeyC(): string | null {
        if (this.walletType === 'ledger') return null
        let wallet = this.wallet as SingletonWallet | MnemonicWallet
        return wallet.ethKey
    }
    async completeSaftStep() {
        await this.submitUserData()
        this.$emit('changestep', 3)
    }
    handleChange({ value, type }: { value: string; type: string }) {
        switch (type) {
            case 'name':
                this.user.name = value
                this.error.name = !this.nameRegex.test(value)
                break
            case 'surname':
                this.user.surname = value
                this.error.surname = !this.nameRegex.test(value)
                break
            case 'city':
                this.user.city = value
                this.error.city = !this.nameRegex.test(value)
                break
            case 'email':
                this.user.email = value
                this.error.email = !this.emailRegex.test(value)
                break
            case 'phone':
                this.user.phone = value
                this.error.phone = !this.phoneRegex.test(value)
                break
            case 'street':
                this.user.street = value
                break
            case 'street2':
                this.user.street2 = value
                break
            case 'zip code':
                this.user.zip = value
                break
            default:
                break
        }
    }

    get submitUserDataDisabled(): boolean {
        return (
            !this.user.name ||
            !this.user.surname ||
            !this.user.street ||
            !this.user.zip ||
            !this.user.city ||
            !this.user.country ||
            !this.user.email ||
            !this.user.agree ||
            this.error.name ||
            this.error.surname ||
            this.error.city ||
            this.error.email
        )
    }
    async submitSaftForm(e: Event) {
        e.preventDefault()
        if (this.submitUserDataDisabled) return
        else {
            // saving pchain address
            let wallet: MnemonicWallet = this.$store.state.activeWallet
            localStorage.setItem('P-chain-address', wallet.getCurrentAddressPlatform())
            // saving the phone and email in local storage to be used in the KYC process
            localStorage.setItem('Email', this.user.email)
            localStorage.setItem('Phone', this.user.phone)
            // put the send email request here
            axios.post('https://wallet-wizard-mailer.camino.foundation/email', {
                ...this.user,
                pChainAddress: wallet.getCurrentAddressPlatform(),
            })
        }
        this.submitted = true
    }
}
</script>
<style scoped lang="scss">
@use "../styles/main";

.saft-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.header-text {
    font-size: 25.2px;
    font-weight: 400;
    margin-bottom: 20px;
}
form {
    max-width: 650px;
    padding: 15px;
    border-radius: var(--border-radius-sm);
    text-align: left;
    border: var(--primary-border);
    border-width: 2px;
    input,
    select {
        background-color: var(--bg-light) !important;
        border-radius: 8px !important;
        margin-top: 4px;
    }
    .multisig-box {
        background-color: var(--bg-light);
        border-radius: var(--border-radius-sm);
        padding: 10px 10px 0px 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
}
.input_box {
    text-align: left;
    align-items: center;
    .secondary_text {
        display: flex;
        flex-direction: column;
        margin-top: 4px;
        .small_text {
            color: var(--secondary-color);
        }
    }
    .error_message {
        color: var(--error);
    }
}

img {
    width: 140px;
    height: 140px;
    max-height: none;
}
.success_body {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-direction: column;
    max-width: 600px;
}

.success_content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    .v-btn {
        max-width: 350px;
    }
}

.form_actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .required_text {
        color: var(--error);
        font-size: 14px;
        margin-top: 4px;
    }
}
sup {
    font-size: 18px;
    color: var(--error);
    top: 0em;
}
</style>
