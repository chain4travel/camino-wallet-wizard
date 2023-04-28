<template>
    <v-main>
        <Navbar />
        <div class="content">
            <slot></slot>
        </div>
        <Footer />
    </v-main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/SimpleNavbar.vue'
import Footer from '@/components/Footer.vue'
@Component({
    components: { Navbar, Footer },
})
export default class DefaultLayout extends Vue {}
</script>
<style lang="scss">
.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
}

.v-main {
    min-height: 100vh;

    &__wrap {
        display: flex;
        flex-direction: column;
    }
}
</style>
