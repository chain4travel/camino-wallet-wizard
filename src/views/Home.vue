<template>
    <div class="home" v-if="!starting">
        <div class="not-mobile-friendly please_note" v-if="$isMobile()">
            <span>
                <strong>Please note:</strong>
                For an enhanced user experience and safety, this tool is optimized for desktop use,
                and we recommend avoiding its use on mobile devices.
            </span>
        </div>
        <div class="home--wrapper">
            <h2 class="content--title">Camino Network Public Sale Wizard</h2>
            <div class="content">
                <div class="content--desc">
                    <span>
                        Welcome to the Camino Network Public Sale.
                        <br />
                        <br />
                        The following wizard will guide you through the following steps:
                        <ul>
                            <li>Creating your Camino Network wallet</li>
                            <li>Filling in your personal / company data</li>
                            <li>
                                KYC
                                <small>(Know-Your-Customer) / Identity verification</small>
                            </li>
                        </ul>
                        <br />
                        For security reasons, this wizard does not save any data.
                        <br />
                        <br />
                        Please complete the wizard in one session. This will take no longer than 15
                        minutes.
                        <br />
                        <br />
                        <span>
                            <div class="attention">ATTENTION</div>
                            <p>
                                If you have an existing KYC verified Camino Wallet or have any
                                questions, please contact
                                <a href="mailto:publicsale@camino.network" class="presale">
                                    publicsale@camino.network
                                </a>
                            </p>
                        </span>
                    </span>
                </div>
            </div>
            <div style="display: flex; flex-direction: row; width: 100%">
                <v-checkbox class="checkbox" v-model="accept" style="width: max-content" />
                <div class="label" slot="label">
                    I accept the
                    <a
                        href="https://camino.network/static/docs/Terms_and_Conditions_of_Use_Public_Sale_2024.pdf"
                        target="_blank"
                    >
                        Terms & Conditions
                    </a>
                </div>
            </div>

            <v-btn @click="goToStepper" class="button_primary submit_but" :disabled="!accept">
                Start
            </v-btn>
        </div>
    </div>
    <HomeNextStep v-else />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import HomeNextStep from './HomeNextStep.vue'

@Component({
    name: 'home',
    components: { HomeNextStep },
})
export default class Home extends Vue {
    starting = false
    accept = false
    mounted() {
        this.starting = false
        localStorage.removeItem('Email')
        localStorage.removeItem('Phone')
    }

    goToStepper() {
        // go to stepper view whitout router
        this.starting = true
    }
}
</script>

<style scoped lang="scss">
@use '../styles/abstracts/mixins';

.home {
    display: flex;
    flex-direction: column;
    padding: 15px;
    padding-top: 50px;
    padding-bottom: 50px;
    // justify-content: center;
    background-size: cover;
    background-position: center;
    align-items: center;
    background-repeat: no-repeat;
    overflow: hidden;
    min-width: 100vw;
    .blur {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    &--wrapper {
        display: flex;
        flex-direction: column;
        z-index: 1;
        background-color: var(--bg-wallet-light);
        padding: 32px;
        border-radius: 18px;
        gap: 1.5rem;
        max-width: 800px;
        align-items: center;
        margin: 0px 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px !important ;
        border: 1px solid rgba(145, 158, 171, 0.24) !important;
    }

    .content {
        width: 100%;
        &--title {
            font-size: 2.75rem;
            color: var(--text-color);
            text-align: center;
        }
        &--desc {
            font-size: 1.125rem;
            line-height: 1.5;
            width: 100%;
        }
    }

    .presale {
        color: var(--secondary-color);
        text-decoration: none;
    }

    .click-start {
        color: #475569;
    }

    .access-create {
        font-size: 0.875rem;
        // font-size: 18px;
        color: var(--text-color);
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

    .label {
        font-size: 12px;
        margin-top: 16px;
        padding-top: 8px;
    }
    .not-mobile-friendly {
        display: flex;
        border-radius: 8px;
        max-width: 800px;
        width: -moz-available;
        width: -webkit-fill-available;
        width: stretch;
        margin: 0px 10px 20px 10px;
        padding: 10px;

        span {
            font-size: 14px;
            width: 100%;
        }
    }
    .please_note {
        background-color: #ecce73 !important;
        color: #000 !important;
    }

    .attention {
        color: #e84970;
        text-transform: uppercase;
        font-weight: 700;
    }
}

@media only screen and (max-width: 900px) {
    .home {
        padding: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        &--wrapper {
            padding: 20px;
            gap: 1rem;
        }
        .content {
            &--title {
                font-size: 28px;
            }
            &--desc {
                font-size: 14px;
            }
            &--access-create {
                font-size: 14px;
            }
        }
        .label {
            font-size: 12px;
            margin-top: 10px;
            padding-top: 4px;
        }
        .v-input {
            margin-top: 8px;
            padding-top: 4px;
        }
    }

    .not-mobile-friendly {
        max-width: 600px !important;
    }
}
</style>
