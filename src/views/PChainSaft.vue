<template>
    <div class="saft-view">
        <template>
            <h1 class="header-text">{{ $t('wizard.title') }}</h1>
            <h1 class="header-text">{{ $t('wizard.subtitle') }}</h1>
            <form @submit.prevent="submitSaftForm">
                <InputField
                    label="Company Name (please only provide if the company is the buyer)"
                    :error_message="$t('wizard.errors.company')"
                    placeholder="Company Name"
                    @change="handleChange"
                />
                <InputField
                    label="P-Chain Address"
                    :error_value="error.pchainAddress != ''"
                    :error_message="error.pchainAddress"
                    placeholder="Your P-Chain Address"
                    @change="handleChange"
                    required
                />
                <InputField
                    label="Name"
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
                        Country of Residency
                        <sup>&#42;</sup>
                    </label>
                    <country-select
                        v-model="user.country"
                        :country="user.country"
                        class="single_line_input hover_border"
                        removePlaceholder
                        countryName
                        :whiteList="whiteList"
                        required
                    />
                </div>
                <div
                    style="margin-bottom: 10px; margin-top: 5px; font-size: 12px"
                    class="discalmer-text"
                >
                    Due to local restrictions, some countries are excluded from the public sale.
                    Please find more information in the
                    <a
                        href="https://camino.network/static/docs/Terms_and_Conditions_of_Use_Public_Sale_2024.pdf"
                        target="_blank"
                    >
                        Terms & Conditions
                    </a>
                    .
                </div>
                <InputField
                    label="Email"
                    :error_value="error.email"
                    :error_message="$t('wizard.errors.email')"
                    placeholder="Email Address"
                    @change="handleChange"
                    required
                />

                <div>
                    <label>
                        Purchase Amount
                        <small class="small_text">(in CHF) (min. 1,000)</small>
                        <sup>&#42;</sup>
                    </label>
                    <div class="purshace_inputs">
                        <vue-number
                            class="single_line_input"
                            v-model="user.purchaseAmount"
                            v-bind="number"
                        ></vue-number>
                        <span v-if="user.purchaseAmount && error.purchaseAmount === ''">=</span>
                        <div
                            class="purchased_amount"
                            :style="{
                                display:
                                    user.purchaseAmount && error.purchaseAmount === ''
                                        ? 'flex'
                                        : 'none',
                            }"
                        >
                            <span style="display: flex; align-items: center">
                                {{ formattedPurchaseAmount }}
                                <img class="cam_icon" src="@/assets/cam.svg" alt="cam" />
                            </span>
                            +
                            <span style="display: flex; align-items: center">
                                {{ formattedReward }}
                                <img
                                    class="cam_icon"
                                    src="@/assets/cam.svg"
                                    alt="cam"
                                    style="margin-right: 5px"
                                />
                                Reward
                            </span>
                        </div>
                    </div>
                    <div class="secondary_text">
                        <small class="error_message" v-if="error.purchaseAmount != ''">
                            {{ error.purchaseAmount }}
                        </small>
                    </div>
                </div>

                <div>
                    <label>
                        Preferred Payment Currency
                        <sup>&#42;</sup>
                    </label>
                    <select
                        v-model="user.preferredCurrency"
                        @change="handleChange"
                        name="currency"
                        id="currency"
                        class="single_line_input hover_border"
                        required
                    >
                        <option value="" disabled selected>Select Currency</option>
                        <option value="EUR">EUR</option>
                        <option value="CHF">CHF</option>
                        <option value="USD">USD</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                    </select>
                </div>

                <div class="form_actions">
                    <SaftCheckbox v-model="user.agree" :explain="$t('wizard.agree')" required />
                    <div style="display: flex; flex-direction: row; width: 100%">
                        <v-checkbox
                            class="checkbox"
                            v-model="termsAndConditions"
                            style="width: max-content"
                        />
                        <div class="label" slot="label" style="font-size: 12px">
                            I accept the
                            <a
                                href="https://camino.network/static/docs/Terms_and_Conditions_of_Use_Public_Sale_2024.pdf"
                                target="_blank"
                            >
                                Terms & Conditions
                            </a>
                        </div>
                    </div>
                    <v-btn
                        type="submit"
                        :disabled="submitUserDataDisabled"
                        class="ava_button button_secondary submit_but"
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
    </div>
</template>
<script lang="ts">
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletNameType } from '@/js/wallets/types'
import axios from 'axios'
import { Component, Vue, Watch } from 'vue-property-decorator'
import InputField from '../components/Saft/InputField.vue'
import MultiSigCheckbox from '../components/Saft/MultiSigCheckbox.vue'
import SaftCheckbox from '../components/Saft/SaftCheckbox.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'
import { Prop } from 'vue-property-decorator'
import { WalletHelper } from '@/helpers/wallet_helper'
import { BN } from '@c4tplatform/caminojs/dist'
import { AddressState, WHITE_LIST } from '@/constants'
import { ava } from '@/AVA'
import { isValidPChainAddress } from '@/helpers/address_helper'

interface User {
    pchainAddress: string
    company: string
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
    purchaseAmount: number
    preferredCurrency: string
}

@Component({
    components: { SaftCheckbox, InputField, MultiSigCheckbox, VueNumber },
})
export default class PChainSaft extends Vue {
    @Prop() name!: string
    @Prop() email!: string
    @Prop() phone!: string
    @Prop() surname!: string
    @Prop() purchaseAmount!: number
    whiteList = WHITE_LIST
    nameRegex = /^([^<>()|[\]\\.,;:@\\"0-9]|(\\".+\\")){2,64}$/
    emailRegex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{3,9}$/
    purchaseAmountRegex = /^(?:1000(?:[.,]0*)?|[1-9]\d{3,}(?:[.,]\d+)?)$/
    isLoading = false
    background = ''
    price = 123.45
    termsAndConditions = false
    number = {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 4,
        masked: false,
    }
    error: {
        name: boolean
        surname: boolean
        city: boolean
        email: boolean
        phone: boolean
        purchaseAmount: string
        preferredCurrency: boolean
        pchainAddress: string
    } = {
        name: false,
        surname: false,
        city: false,
        email: false,
        phone: false,
        purchaseAmount: '',
        preferredCurrency: false,
        pchainAddress: '',
    }
    submitted: boolean = false
    user: User = {
        pchainAddress: '',
        company: '',
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
        purchaseAmount: 0,
        preferredCurrency: '',
    }
    created() {
        localStorage.removeItem('Email')
        localStorage.removeItem('Phone')
    }
    get walletType(): WalletNameType {
        return this.wallet.type
    }
    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
    }

    get formattedPurchaseAmount(): string {
        const amount = this.user.purchaseAmount / 0.15
        const result = amount.toFixed(2).endsWith('.00')
            ? Math.floor(amount)
            : Number(amount.toFixed(2))

        return new Intl.NumberFormat('en-US').format(result)
    }

    get formattedReward(): string {
        const reward = (this.user.purchaseAmount / 0.15) * 0.06
        const result = reward.toFixed(2).endsWith('.00')
            ? Math.floor(reward)
            : Number(reward.toFixed(2))

        return new Intl.NumberFormat('en-US').format(result)
    }

    @Watch('user.purchaseAmount')
    onPurchaseAmountChange() {
        if (this.user.purchaseAmount < 1000)
            this.error.purchaseAmount = 'Purchase amount must be at least 1000'
        else this.error.purchaseAmount = ''
    }
    validatePurchaseAmount(value: any) {
        const maxValue = 9999999
        if (value > maxValue) {
            this.user.purchaseAmount = maxValue
        }
    }
    get privateKeyC(): string | null {
        if (this.walletType === 'ledger') return null
        let wallet = this.wallet as SingletonWallet | MnemonicWallet
        return wallet.ethKey
    }
    async isMultisig() {
        try {
            await ava.PChain().getMultisigAlias(this.user.pchainAddress)
            return true
        } catch (error) {
            return false
        }
    }

    @Watch('user.pchainAddress')
    async onPchainAddressChange() {
        if (!this.user.pchainAddress) {
            this.error.pchainAddress = ''
            return
        } else {
            if (!isValidPChainAddress(this.user.pchainAddress)) {
                this.error.pchainAddress = 'Invalid P-Chain Address'
                return
            }

            const l = await this.isKYCVerified(this.user.pchainAddress)
            this.error.pchainAddress = !l ? 'P-Chain Address provided is not KYC verified' : ''
        }
    }

    async isKYCVerified(address: string) {
        const BN_ONE = new BN(1)
        const isMultisig = await this.isMultisig()
        const isValidAddress = await isValidPChainAddress(address)

        if (!isValidAddress) return false
        if (isMultisig) {
            let result = await WalletHelper.getAddressState(address)
            let isKYCVerified = !result.and(BN_ONE.shln(AddressState.KYC_VERIFIED)).isZero()
            if (isKYCVerified) return true

            try {
                const response = await ava.PChain().getMultisigAlias(address)
                if (response?.addresses) {
                    for (const addr of response.addresses) {
                        result = await WalletHelper.getAddressState(addr)
                        isKYCVerified = !result.and(BN_ONE.shln(AddressState.KYC_VERIFIED)).isZero()
                        if (isKYCVerified) return true
                    }
                    return false
                }
            } catch (error) {
                return false
            }
            return false
        } else {
            const result = await WalletHelper.getAddressState(address)

            return !result.and(BN_ONE.shln(AddressState.KYC_VERIFIED)).isZero()
        }
    }

    trimSpaces(value: any): string {
        return value.trimStart()
    }

    async handleChange({ value, type }: { value: string; type: string }) {
        switch (type) {
            case 'company name (please only provide if the company is the buyer)':
                this.user.company = value
                break
            case 'p-chain address':
                this.user.pchainAddress = this.trimSpaces(value)
                break
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
            case 'street':
                this.user.street = value
                break
            case 'street2':
                this.user.street2 = value
                break
            case 'zip code':
                this.user.zip = value
                break
            case 'preferred payment currency':
                this.user.preferredCurrency = value
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
            !this.user.purchaseAmount ||
            !this.user.preferredCurrency ||
            !this.user.pchainAddress ||
            !this.termsAndConditions ||
            this.user.purchaseAmount < 1000 ||
            this.error.name ||
            this.error.surname ||
            this.error.city ||
            this.error.email ||
            this.error.purchaseAmount != '' ||
            this.error.pchainAddress != ''
        )
    }

    async submitSaftForm(e: Event) {
        e.preventDefault()
        if (this.submitUserDataDisabled) return
        else {
            const multisig = await this.isMultisig()
            // saving pchain address
            localStorage.setItem('P-chain-address', this.user.pchainAddress)
            // saving the phone and email in local storage to be used in the KYC process
            localStorage.setItem('Email', this.user.email)
            localStorage.setItem('Phone', this.user.phone)
            if (this.user.pchainAddress) {
                axios.post('https://wallet-wizard-mailer.camino.network/email', {
                    company: this.user.company,
                    KYCWallet: true,
                    name: this.user.name,
                    surname: this.user.surname,
                    street: this.user.street,
                    street2: this.user.street2,
                    zip: this.user.zip,
                    city: this.user.city,
                    country: this.user.country,
                    email: this.user.email,
                    agree: this.user.agree,
                    multisig: multisig,
                    pchainAddress: this.user.pchainAddress,
                    purchaseAmount: this.user.purchaseAmount,
                    preferredCurrency: this.user.preferredCurrency,
                    wizard: true,
                })
                axios.post('https://wallet-wizard-mailer.camino.network/kyc', {
                    email: this.user.email,
                    name: `${this.user.name} ${this.user.surname}`,
                    purchasedAmount: `${this.formattedPurchaseAmount}`,
                    rewardAmount: `${this.formattedReward}`,
                    pchainAddress: `${this.user.pchainAddress}`,
                })
            }
        }
        this.submitted = true
        this.$emit('update:name', this.user.name)
        this.$emit('update:surname', this.user.surname)
        this.$emit('update:email', this.user.email)
        this.$emit('update:phone', this.user.phone)
        this.$emit('update:pchainAddress', this.user.pchainAddress)
        this.$emit('changestep', 2)
    }
}
</script>
<style scoped lang="scss">
@use '../styles/main';
@use "../styles/abstracts/mixins";

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
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    max-width: 700px;
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

.discalmer-text {
    color: #fa6602;
    margin-bottom: 10px;
    margin-top: 5px;
    font-size: 12px;
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
.submit_but {
    width: 100%;
    height: 48px !important;
    border-radius: 12px !important;
    background-color: #0085ff !important;
    text-transform: capitalize !important;
    color: #fff !important;
    font-size: 1rem !important;
}

.secondary_text {
    display: flex;
    flex-direction: column;
    margin-top: 4px;
    .error_message {
        color: var(--error);
    }
}

.purshace_inputs {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.purchased_amount {
    background-color: var(--bg-light) !important;
    border-radius: 8px !important;
    margin-top: 4px;
    display: block;
    width: 100%;
    padding: 5px 12px;
    border: 1px solid var(--bg-light);
    border-radius: 3px;
    color: var(--primary-color);
    padding: 12px;
    gap: 5px;
}

.cam_icon {
    width: 20px;
    height: 20px;
    margin-left: 5px;
}

.v-input--selection-controls {
    padding-top: 0px !important;
    margin-top: 0px !important;
}

@include mixins.mobile-device {
    .header-text {
        font-size: 16px;
    }
    label {
        font-size: 13px;
    }
    select,
    input,
    .v-number,
    .purshace_inputs {
        font-size: 12px;
    }
}

@media (max-width: 600px) {
    .purshace_inputs {
        flex-direction: column;
        gap: 10px;
    }
}
</style>
