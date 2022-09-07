<template>
    <div class="home" v-if="!starting">
        <svg
            class="blur"
            width="1019"
            height="621"
            viewBox="0 0 1019 621"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_f_2551_2336)">
                <ellipse cx="509.5" cy="310.5" rx="369.5" ry="170.5" fill="none" />
            </g>
            <defs>
                <filter
                    id="filter0_f_2551_2336"
                    x="0"
                    y="0"
                    width="1019"
                    height="621"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur_2551_2336" />
                </filter>
            </defs>
        </svg>
        <div class="home--wrapper">
            <div class="header">
                <img src="@/assets/wallet-logo.svg" alt />
                <div class="header--title">Camino Pre-Sale Wizard</div>
            </div>
            <div class="content">
                <h1 class="content--desc">
                    <!-- The Camino Pre-Sale Wizard guides you through all naccesary steps for you to
                    receive your Camino Tokens. -->
                    In the first step of the wizard, we will create an access key phrasee to your
                    wallet for you.
                    <br />
                    <br />
                    The key phrase consists of 24 random words. These words in their specific order
                    represent the key to your wallet and Camino tokens.
                    <br />
                    <br />
                    Chain4travel will not save your key phrase and will never ask you for your key
                    phrase.
                    <br />
                    <br />
                    Anyone, who knows these words in their specifix orderhas full control over your
                    tokens.
                    <br />
                    <br />
                    <strong>
                        Keep the key phrase in one or more secure locations that only you have
                        access to.
                    </strong>
                </h1>
                <div class="content--access-create">
                    Click on next to create your key phrase and your personal wallet.
                </div>
            </div>
            <div class="buttons-wrapper">
                <v-btn @click="goToStepper" class="ava_button button_secondary submit_but">
                    Next
                </v-btn>
            </div>
        </div>
    </div>
    <Steper v-else />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Steper from './Steper.vue'

@Component({
    name: 'home',
    components: { Steper },
})
export default class Home extends Vue {
    starting = false
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
@use "../styles/main";

.home {
    padding: 15px;
    padding-top: 50px;
    padding-bottom: 50px;
    display: flex;
    justify-content: center;
    min-height: calc(100vh - 80px);
    background-image: url('../assets/home_background.svg');
    background-size: cover;
    background-position: center;
    align-items: center;
    background-repeat: no-repeat;
    overflow: hidden;
    min-width: 100vw;
    svg {
        g {
            ellipse {
                fill: var(--bg);
            }
        }
    }
    .blur {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    &--wrapper {
        z-index: 1;
        margin-top: 100px;
        margin-bottom: 100px;
        display: flex;
        flex-direction: column;
        gap: 30px;
        align-items: center;
        .header {
            font-size: main.$l-size;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .content {
            max-width: 750px;
            text-align: center;
            &--desc {
                text-align: left;
                background-color: var(--bg-light-2);
                border-radius: var(--border-radius-sm);
                margin-bottom: 30px;
                font-size: 20px;
                padding: 15px;
                font-weight: 500;
            }
            &--access-create {
                // margin-bottom: 30px;
                font-size: 18px;
                color: var(--primary-color-light);
            }
        }
    }
    .buttons-wrapper {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
        align-items: center;
        .v-btn {
            min-width: 175px;
        }
    }
}
.tos {
    margin-top: 14px !important;
    text-align: center;
}

.submit_but {
    width: 100px;
}
/* ==========================================
   Nav
   ========================================== */

@include main.mobile-device {
    .home {
        svg {
            width: 300px;
        }
        .header {
            &--title {
                font-size: main.$l-size-mobile;
            }
        }
        .content {
            &--desc {
                font-size: 16px;
            }
            &--access-create {
                font-size: 14px;
            }
        }
    }
}

@media only screen and (max-width: 600px) {
}
</style>
