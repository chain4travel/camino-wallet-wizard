<template>
    <div class="stage_2" v-if="!walletCreated">
        <div class="modal_main">
            <div class="modal_body">
                <div id="sumsub-websdk-container"></div>
                <!-- <div class="kyc_action">
                    <v-btn type="cancel" @click="walletCreated = true" class="submit_but">
                        Done & Next
                    </v-btn>
                </div> -->
            </div>
            <div class="verification--text">
                <p>Verification might take a while.</p>
                <p>You will receive your result via Email.</p>
                <p>
                    If you don't receive your result within 24 hours, please contact
                    <a href="mailto:investors@camino.network" class="presale">
                        investors@camino.network
                    </a>
                </p>
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
    @Prop() walle!: WalletType
    @Prop() verificationCompleted!: boolean
    walletCreated: boolean = this.verificationCompleted ? true : false
    doneWalletCreation() {
        this.walletCreated = true
    }
}
</script>
<style scoped lang="scss">
@use '../styles/abstracts/mixins';

/* .v-stepper__wrapper {
    display: flex;
    justify-content: center;
} */
.kyc_action {
    display: flex;
    justify-content: flex-end;
}
.presale {
    color: var(--secondary-color);
    text-decoration: none;
}
.stage_2 {
    width: 100%;
}
.verification--text {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 1rem;
    p {
        text-align: center;
    }
}

.modal_main::v-deep {
    display: flex;
    align-items: center;
    flex-direction: column;
    /* background-color: red; */

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
        @include mixins.mobile-device {
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

.submit_but {
    // width: 100%;
    height: 48px !important;
    border-radius: 12px !important;
    background-color: #0085ff !important;
    text-transform: capitalize !important;
    color: #fff !important;
    font-size: 1rem !important;
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
