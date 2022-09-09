<template>
    <div class="stage_2">
        <div class="cols">
            <!-- LEFT -->
            <div class="mneumonic_disp_col">
                <div class="mnemonic_disp">
                    <span class="mnemonic_title">Your mnemonic key phrase</span>
                    <p
                        class="phrase_raw"
                        v-bind:class="{
                            verified: isVerified,
                        }"
                    >
                        {{ keyPhrase.getValue() }}
                    </p>
                    <div class="mneumonic_button_container" v-if="!isVerified">
                        <button @click="createKey" class="ava_button but_randomize button_primary">
                            <fa icon="sync"></fa>
                            <span>{{ $t('create.regenerate') }}</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- RIGHT -->
            <div class="phrase_disp_col">
                <template v-if="!isVerified">
                    <img v-if="$root.theme === 'day'" src="@/assets/keyphrase.png" alt />
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
                <header class="success_header" v-else>
                    <h1>
                        {{ $t('create.success_title') }}
                    </h1>
                    <p>
                        it's time to enter some personal data se we can prepare your SAFT agreement
                    </p>
                    <b>Please go to the following step.</b>
                    <!-- <p>{{ $t('create.success_desc') }}</p> -->
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
                        VERIFY KEY PHRASE
                    </button>
                </div>
                <!-- STEP 2b - ACCESS -->
                <div class="access_cont" v-if="isVerified">
                    <paper-wallet
                        ref="print_modal"
                        v-if="walletType === 'mnemonic'"
                        :wallet="activeWallet"
                    ></paper-wallet>
                    <div class="submit">
                        <transition name="fade" mode="out-in">
                            <template v-if="isLoad">
                                <Spinner class="spinner"></Spinner>
                            </template>
                            <template v-else>
                                <div>
                                    <button
                                        :disabled="walletType !== 'mnemonic'"
                                        @click="viewPrintModal"
                                        class="but_primary ava_button button_secondary print--button"
                                    >
                                        Print keyphrase
                                    </button>
                                    <button
                                        class="button_primary ava_button access generate"
                                        @click="completeFirstStep"
                                        :disabled="!canSubmit"
                                    >
                                        next step
                                    </button>
                                </div>
                            </template>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Spinner from '@/components/misc/Spinner.vue'
import * as bip39 from 'bip39'
import PaperWallet from '@/components/modals/PaperWallet/PaperWallet.vue'
import VerifyMnemonic from '@/components/modals/VerifyMnemonic.vue'
import MnemonicCopied from '@/components/CreateWalletWorkflow/MnemonicCopied.vue'
import MnemonicPhrase from '@/js/wallets/MnemonicPhrase'
import { WalletNameType, WalletType } from '@/js/wallets/types'

@Component({
    components: {
        Spinner,
        VerifyMnemonic,
        MnemonicCopied,
        PaperWallet,
    },
})
export default class CreateWalletStep extends Vue {
    @Prop() changestep: any
    isLoad: boolean = false
    keyPhrase: MnemonicPhrase | null = null
    isSecured: boolean = false
    isVerified: boolean = false
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

    get canSubmit(): boolean {
        // if(!this.rememberValid) return false;
        return true
    }
    get activeWallet(): WalletType | null {
        return this.$store.state.activeWallet
    }
    get walletType(): WalletNameType {
        let wallet = this.activeWallet
        if (!wallet) return 'mnemonic'
        return wallet.type
    }
    verifyMnemonic() {
        // @ts-ignore
        this.$refs.verify.open()
    }
    $refs!: {
        // modal: Modal
        print_modal: PaperWallet
    }
    viewPrintModal() {
        this.$refs.print_modal.open()
    }
    async complete() {
        let result = await this.access()
        console.log(result)
        console.log('gooood')
        this.isLoad = false
        this.isVerified = true
    }
    async access(): Promise<void> {
        if (!this.keyPhrase) return
        this.isLoad = true
        let parent = this
        return await parent.$store.dispatch('accessWallet', this.keyPhrase!.getValue())
    }
    completeFirstStep() {
        this.$emit('changestep', 2)
    }
}
</script>

<style lang="scss">
@use "../styles/main";

.print--button {
    margin-right: 15px;
}
.steper {
    width: 100vw;
    height: 100vh;
    max-width: 1100px;
    margin-top: 100px;
    border: none !important;
    display: flex;
    flex-direction: column;
    background-color: transparent !important;
    box-shadow: none !important;
    &__header {
        /* background-color: turquoise !important; */
        .v-stepper__label {
            color: white !important;
        }
        box-shadow: var(--box-shadow) !important;
        .v-divider {
            border-color: var(--tooltip-bg) !important;
        }
        border: var(--secondary-border);
    }
    &__body {
        flex-grow: 1;
        margin-top: 50px;
        /* display: flex; */
        /* align-items: center; */
        /* background-color: yellow !important; */
    }
    .success_header {
        display: flex;
        flex-direction: column;
        gap: 15px;
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
        .mnemonic_title {
            font-size: 24px;
            font-weight: 700;
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

@include main.mobile-device {
    .mnemonic_title {
        font-size: 20px;
        font-weight: 700;
        text-align: center;
    }
    .mneumonic_disp_col {
        display: flex;
        justify-content: center;
    }
    .mneumonic_button_container {
        display: flex;
        justify-content: center;
    }
}
</style>
