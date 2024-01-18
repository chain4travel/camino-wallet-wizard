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
                    <a href="/legal">Terms & Conditions</a>
                    .
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

                <div>
                    <label>
                        Purchase Amount
                        <small class="small_text">(in CHF) (min. 1,000)</small>
                        <sup>&#42;</sup>
                    </label>
                    <vue-number
                        class="single_line_input"
                        v-model="user.purchaseAmount"
                        v-bind="number"
                    ></vue-number>
                    <div class="secondary_text">
                        <small class="error_message" v-if="error.purchaseAmount != ''">
                            {{ error.purchaseAmount }}
                        </small>
                    </div>
                </div>

                <div>
                    <label>
                        Currency
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
import { KYC_VARIANT } from '@/constants'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletNameType } from '@/js/wallets/types'
import { generateToken, getPublicKey } from '@/kyc_api'
import snsWebSdk from '@sumsub/websdk'
import axios from 'axios'
import { Component, Vue, Watch } from 'vue-property-decorator'
import InputField from '../components/Saft/InputField.vue'
import MultiSigCheckbox from '../components/Saft/MultiSigCheckbox.vue'
import SaftCheckbox from '../components/Saft/SaftCheckbox.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'
import { Prop } from 'vue-property-decorator'

interface User {
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
export default class Saft extends Vue {
    @Prop() name!: string
    @Prop() email!: string
    @Prop() phone!: string
    @Prop() surname!: string
    nameRegex = /^([^<>()|[\]\\.,;:@\\"0-9]|(\\".+\\")){2,64}$/
    emailRegex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{3,9}$/
    purchaseAmountRegex = /^(?:1000(?:[.,]0*)?|[1-9]\d{3,}(?:[.,]\d+)?)$/
    isLoading = false
    background = ''
    price = 123.45
    number = {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 4,
        masked: false,
    }
    whiteList = [
        'AX',
        'AL',
        'AD',
        'AO',
        'AI',
        'AG',
        'AM',
        'AR',
        'AW',
        'AT',
        'AU',
        'AZ',
        'BS',
        'BH',
        'BB',
        'BE',
        'BZ',
        'BJ',
        'BM',
        'BT',
        'BQ',
        'BW',
        'BR',
        'BN',
        'BG',
        'BF',
        'KH',
        'CA',
        'CV',
        'KY',
        'CX',
        'CK',
        'CC',
        'CO',
        'KM',
        'CR',
        'CL',
        'HR',
        'CY',
        'CW',
        'CZ',
        'DK',
        'DJ',
        'DM',
        'DO',
        'EC',
        'EE',
        'SV',
        'GQ',
        'SZ',
        'FK',
        'FO',
        'FM',
        'FJ',
        'FI',
        'FR',
        'GF',
        'GL',
        'DE',
        'GM',
        'GE',
        'GR',
        'GD',
        'GP',
        'GU',
        'GT',
        'GG',
        'GY',
        'HN',
        'HK',
        'HU',
        'IS',
        'IN',
        'ID',
        'IE',
        'IL',
        'IT',
        'JM',
        'JP',
        'JE',
        'JO',
        'KZ',
        'KE',
        'KI',
        'XK',
        'KW',
        'KG',
        'LV',
        'LA',
        'LT',
        'LU',
        'MO',
        'MQ',
        'YT',
        'MG',
        'MW',
        'MY',
        'MV',
        'MT',
        'MH',
        'MR',
        'MU',
        'MX',
        'MC',
        'MN',
        'MS',
        'MZ',
        'NA',
        'NR',
        'NZ',
        'NC',
        'NU',
        'NF',
        'MP',
        'NO',
        'OM',
        'PK',
        'PW',
        'PS',
        'PA',
        'PY',
        'PG',
        'PE',
        'PH',
        'PL',
        'PF',
        'PT',
        'PR',
        'RE',
        'RO',
        'RW',
        'BL',
        'MF',
        'SH',
        'PM',
        'SX',
        'KN',
        'LC',
        'VC',
        'WS',
        'SM',
        'ST',
        'SA',
        'SN',
        'SC',
        'SG',
        'SK',
        'SI',
        'SB',
        'KR',
        'ZA',
        'ES',
        'SR',
        'SE',
        'CH',
        'TJ',
        'TW',
        'TH',
        'TL',
        'NL',
        'TG',
        'TK',
        'TO',
        'TT',
        'TC',
        'TV',
        'TR',
        'UG',
        'AE',
        'GB',
        'TZ',
        'UY',
        'UZ',
        'VN',
        'VU',
        'VI',
        'WF',
        'ZM',
    ]
    error: {
        name: boolean
        surname: boolean
        city: boolean
        email: boolean
        phone: boolean
        purchaseAmount: string
        preferredCurrency: boolean
    } = {
        name: false,
        surname: false,
        city: false,
        email: false,
        phone: false,
        purchaseAmount: '',
        preferredCurrency: false,
    }
    submitted: boolean = false
    user: User = {
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
    @Watch('user.purchaseAmount')
    onPurchaseAmountChange() {
        if (this.user.purchaseAmount < 1000)
            this.error.purchaseAmount = 'Purchase amount must be at least 1000'
        else this.error.purchaseAmount = ''
    }
    get privateKeyC(): string | null {
        if (this.walletType === 'ledger') return null
        let wallet = this.wallet as SingletonWallet | MnemonicWallet
        return wallet.ethKey
    }
    handleChange({ value, type }: { value: string; type: string }) {
        switch (type) {
            case 'company name (please only provide if the company is the buyer)':
                this.user.company = value
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
            case 'currency':
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
            this.user.purchaseAmount < 1000 ||
            this.error.name ||
            this.error.surname ||
            this.error.city ||
            this.error.email ||
            this.error.purchaseAmount != ''
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
            if (this.privateKeyC) {
                // getPublicKey
                const publicKey = getPublicKey(this.privateKeyC)
                // put the send email request here
                axios.post('http://localhost:3000/email', {
                    ...this.user,
                    pChainAddress: wallet.getCurrentAddressPlatform(),
                    publicKey,
                    wizard: true,
                })
            }
        }
        this.submitted = true
        this.$emit('update:name', this.user.name)
        this.$emit('update:surname', this.user.surname)
        this.$emit('update:email', this.user.email)
        this.$emit('update:phone', this.user.phone)
        this.$emit('changestep', 3)
    }
}
</script>
<style scoped lang="scss">
@use '../styles/main';

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
</style>
