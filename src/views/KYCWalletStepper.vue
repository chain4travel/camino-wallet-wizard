<template>
    <v-stepper class="steper" :value="step">
        <v-stepper-header class="steper__header elevation-0">
            <v-stepper-step step="1" :complete="step > 1">Personal Data</v-stepper-step>
            <v-stepper-step step="2" :complete="step > 2">Confirmation</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="steper__body">
            <v-stepper-content step="1" key="1">
                <PChainSaft
                    :pchainAddress="pchainAddress"
                    @update:pchainAddress="pchainAddress = $event"
                    @changestep="changeStep"
                />
            </v-stepper-content>

            <v-stepper-content step="2" key="2">
                <div>
                    <div class="success_body">
                        <div class="success_content" style="padding: 20px">
                            <span class="success-title">
                                <b>Your request has been successfully submitted</b>
                            </span>
                            <span>
                                You will receive a public sale registration confirmation via email
                                in the next 24 hours.
                            </span>
                            <span>
                                Please do not hesitate to contact
                                <a href="mailto:publicsale@camino.network">
                                    publicsale@camino.network
                                </a>
                                in case you have any questions.
                            </span>
                            <span>You may close this window now.</span>
                        </div>
                    </div>
                </div>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import PChainSaft from './PChainSaft.vue'

@Component({
    name: 'home',
    components: { PChainSaft },
})
export default class KYCWalletStepper extends Vue {
    step = 1
    pchainAddress = ''
    mounted() {}

    changeStep(s: number) {
        this.step = s
    }
}
</script>
<style scoped lang="scss">
@use '../styles/abstracts/mixins';
.success_body {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-direction: column;
    max-width: 700px;
}
.success_content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    text-align: center;
    .v-btn {
        max-width: 350px;
    }
}
.success-title {
    font-size: 25px;
}
@include mixins.mobile-device {
    .success-title {
        font-size: 20px;
    }
    .success_content {
        font-size: 14px;
    }
}
</style>
