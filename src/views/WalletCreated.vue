<template>
    <div class="success_body">
        <img src="@/assets/success.svg" alt="" />
        <div class="success_content">
            <h1>Congratulation!</h1>
            <span>
                You have successfully created your account and verified it. You can now head out to
                the wallet.
            </span>
        </div>
        <v-btn @click="goToWallet" class="button_secondary submit_but">Access Wallet</v-btn>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

@Component({
    name: 'WalletCreated',
})
export default class WalletCreated extends Vue {
    goToWallet() {
        window.open('https://suite.camino.network/wallet')
    }
}
</script>
<style scoped lang="scss">
@use "../styles/main";

.success_body {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-direction: column;
    text-align: center;
    max-width: 600px;
    img {
        width: 140px;
        height: 140px;
        max-height: none;
    }
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

.submit_but {
    width: 100%;
    height: 48px !important;
    border-radius: 12px !important;
    background-color: #0085ff !important;
    text-transform: capitalize !important;
    color: #fff !important;
    font-size: 1rem !important;
}
</style>
