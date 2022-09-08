<template>
    <div class="stage_2" v-if="!verificationCompleted">
        <div class="modal_main">
            <div class="modal_body">
                <div id="sumsub-websdk-container"></div>
            </div>
        </div>
    </div>
    <WalletCreated v-else />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'
import { WalletType } from '@c4tplatform/camino-wallet-sdk'
import WalletCreated from './WalletCreated.vue'

@Component({
    components: {
        Modal,
        WalletCreated,
    },
})
export default class KycVerification extends Vue {
    walletCreated: boolean = false
    @Prop() walle!: WalletType
    @Prop() verificationCompleted!: boolean

    doneWalletCreation() {
        this.walletCreated = true
    }
}
</script>
<style scoped lang="scss">
@use '../styles/main';

/* .v-stepper__wrapper {
    display: flex;
    justify-content: center;
} */

.stage_2 {
    width: 100%;
}

.modal_main::v-deep {
    display: flex;
    justify-content: center;
    /* background-color: white; */

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
        @include main.mobile-device {
            max-height: 90vh;
            max-width: none;
            width: 80%;
            min-height: fit-content;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
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
</style>
