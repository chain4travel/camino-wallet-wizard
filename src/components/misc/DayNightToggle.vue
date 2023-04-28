<template>
    <button @click="toggle">
        <svg-icon type="mdi" :path="path"></svg-icon>
    </button>
</template>
<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiWeatherSunny } from '@mdi/js'
export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            val: false,
            path: mdiWeatherSunny,
        }
    },
    methods: {
        setNight() {
            this.val = true
            localStorage.setItem('theme', 'night')
            document.documentElement.setAttribute('data-theme', 'night')
            this.$root.theme = 'night'
        },
        setDay() {
            this.val = false
            localStorage.setItem('theme', 'day')
            document.documentElement.setAttribute('data-theme', 'day')
            this.$root.theme = 'day'
        },
        toggle() {
            this.val = !this.val
            if (this.val) {
                this.setNight()
            } else {
                this.setDay()
            }
        },
    },
    mounted() {
        let theme = localStorage.getItem('theme')

        if (!theme) {
            this.setDay()
            return
        }

        if (theme === 'night') {
            this.setNight()
        }
    },
}
</script>
<style scoped lang="scss">
button {
    display: flex;
    align-items: center;
    img {
        max-height: 18px;
    }
}
</style>
