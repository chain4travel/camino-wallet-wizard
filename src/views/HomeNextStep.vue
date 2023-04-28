<template>
    <div class="home" v-if="!starting">
        <div class="home--wrapper">
            <h2 class="content--title">Camino Institutional Sale Wizard</h2>
            <div class="content">
                <span class="content--desc">
                    In the first step, a key phrase will be created.
                    <br />
                    <br />
                    The key phrase consists of 24 random words. These words in their specific order
                    represent the unique key to your wallet and Camino tokens.
                    <br />
                    <br />
                    The Camino Network Foundation or Chain4Travel AG will never save your key phrase
                    and will never ask you for your key phrase.
                    <br />
                    <br />
                    <div class="attention">ATTENTION</div>
                    Anyone who knows your key phrase has full, unlimited control over your tokens,
                    so please keep the key phrase in one or more secure locations that only you have
                    access to.
                    <div class="text--bold">
                        <span>Keep it in one or more secure locations.</span>
                        <br />
                        <span>Do not share it with anyone.</span>
                    </div>
                </span>
            </div>
            <div class="access-create">Click next to create your personal wallet</div>
            <v-btn @click="goToStepper" class="button_primary submit_but">Next</v-btn>
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

.attention {
    color: #e84970;
    text-transform: uppercase;
    font-weight: 700;
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
