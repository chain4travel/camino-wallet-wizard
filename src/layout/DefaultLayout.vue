<template>
    <v-main>
        <Navbar />
        <div class="content">
            <slot></slot>
        </div>
    </v-main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/SimpleNavbar.vue'
@Component({
    components: { Navbar },
})
export default class DefaultLayout extends Vue {}
</script>
<style scoped>
.content {
    /* height: calc(100vh - 80px); */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
