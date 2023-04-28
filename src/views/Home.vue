<template>
    <div class="home" v-if="!starting">
        <div class="home--wrapper">
            <h2 class="content--title">Camino Institutional Sale Wizard</h2>
            <div class="content">
                <div class="content--desc">
                    <span>
                        Welcome to the Camino Institutional Sale Wizard.
                        <br />
                        <br />
                        This wizard guides you through the process of
                        <ul>
                            <li>Creating your wallet</li>
                            <li>Filling in your personal & company data</li>
                            <li>
                                KYC
                                <small>(Know-Your-Customer) / Identity verification</small>
                            </li>
                        </ul>
                        <br />
                        For security reasons, this wizard does not save any data.
                        <br />
                        <br />
                        Therefore, please complete the wizard in one session which will take no
                        longer than 15 minutes.
                        <br />
                        <br />
                        <span>If you have any questions or remarks, please contact</span>
                        <a href="mailto:investors@camino.network" class="presale">
                            investors@camino.network
                        </a>
                    </span>
                </div>
            </div>
            <div class="access-create">Click Start to start the Wizard</div>
            <v-btn @click="goToStepper" class="button_primary submit_but">Start</v-btn>
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
        &--title {
            font-size: 2.75rem;
            color: var(--text-color);
            text-align: center;
        }
        &--desc {
            font-size: 1.125rem;
            line-height: 1.5;
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
}

/* ==========================================
   Nav
   ========================================== */

@include main.mobile-device {
    .content {
        &--title {
            font-size: 18px;
        }
        &--desc {
            font-size: 16px;
        }
        &--access-create {
            font-size: 14px;
        }
    }
}
</style>
