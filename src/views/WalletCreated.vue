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
        <v-btn @click="goToWallet" class="button_secondary">Access Wallet</v-btn>
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
        window.open('https://simple-wallet.camino.network/')
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
</style>
