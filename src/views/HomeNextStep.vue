<template>
    <div class="home" v-if="!starting">
        <v-stepper class="steper" :value="step">
            <v-stepper-header class="steper__header elevation-0">
                <v-stepper-step step="1" :complete="step > 1">Create Wallet</v-stepper-step>
                <v-stepper-step step="2" :complete="step > 2">Personal Data</v-stepper-step>
                <v-stepper-step step="3" :complete="step > 3">KYC Verification</v-stepper-step>
            </v-stepper-header>
        </v-stepper>
        <div class="home--wrapper">
            <div class="header">
                <img src="@/assets/wallet-logo.svg" alt />
                <div class="header--title">Camino Pre-Sale Wizard</div>
            </div>
            <div class="content">
                <h1 class="content--desc">
                    In the first step, we will create an access key phrase for you.
                    <br />
                    <br />
                    The key phrase consists of 24 random words. These words in their specific order
                    represent the unique key to your wallet and Camino tokens.
                    <br />
                    <br />
                    Chain4Travel will never save your key phrase and will never ask you for your key
                    phrase.
                    <br />
                    <br />
                    <div class="warningg">ATTENTION</div>
                    Anyone who knows your key phrase has full, unlimited control over your tokens,
                    so please keep the key phrase in one or more secure locations that only you have
                    access to.
                    <div class="text--bold">
                        <span>Keep it in one or more secure locations.</span>
                        <br />
                        <span>Do not share it with anyone.</span>
                    </div>
                </h1>
                <div class="content--access-create">Click next to create your personal wallet.</div>
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
    step = 1
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
.text--bold {
    margin-top: 10px;
    font-weight: bold;
}
.home {
    min-height: calc(100vh - 80px) !important;
    background-image: none !important;
    background-size: cover !important;
    background-position: center !important;
    align-items: center !important;
    background-repeat: no-repeat !important;
    overflow: hidden !important;
    min-width: 100vw !important;
    display: flex !important;
    flex-direction: column !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    justify-content: flex-start !important;
    .steper {
        min-height: auto !important;
        padding-top: 50px !important;
        padding-bottom: 50px !important;
    }
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
                padding: 25px;
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
.warningg {
    color: red;
    background-color: transparent;
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
