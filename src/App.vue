<template>
    <v-app>
        <v-main>
            <template>
                <DefaultLayout>
                    <Home />
                </DefaultLayout>
            </template>
        </v-main>
    </v-app>
</template>
<script>
import Home from '@/views/Home.vue'
import DefaultLayout from './layout/DefaultLayout.vue'

export default {
    components: {
        Home,
        DefaultLayout,
    },
    async created() {
        // Init language preference
        let locale = localStorage.getItem('lang')
        if (locale) {
            this.$root.$i18n.locale = locale
        }

        await this.$store.dispatch('Network/init')
        this.$store.dispatch('Assets/initErc20List')
        this.$store.dispatch('Assets/ERCNft/init')
        this.$store.dispatch('updateAvaxPrice')
    },
    computed: {
        isNavbar() {
            if (this.$route.path.includes('/wallet')) {
                return false
            }
            return true
        },
    },
    metaInfo: {
        meta: [
            {
                vmid: 'description',
                name: 'description',
                content:
                    'Camino wallet is a simple, highly secure, non-custodial crypto wallet for storing CAM.',
            },
            {
                vmid: 'og:description',
                name: 'description',
                content:
                    'Camino wallet is a simple, highly secure, non-custodial crypto wallet for storing CAM.',
            },
            {
                vmid: 'og:title',
                name: 'og:title',
                content: 'Camino Institutional Sale Wizard',
            },
        ],
        title: 'Camino Institutional Sale Wizard',
    },
}
</script>

<style scoped lang="scss">
@use './styles/main';

.main_cols {
    &[wallet_view] {
        height: 100vh;

        #router_view {
            padding: 0;
            padding-bottom: 0px;
        }
    }

    #router_view {
        position: relative;
        min-height: calc(100vh);
        /* padding: main.$container_padding_m; */
    }
}

#router_view {
    position: relative;
    /* padding: main.$container_padding_m; */
}
</style>

<style lang="scss">
@use './styles/main';

html {
    height: 100%;
    overflow: auto;
}

body {
    height: 100%;
    width: 100vw;
    min-width: 300px;
    max-width: 100vw;
}

p {
    margin: 0px !important;
}

#app {
    min-height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: var(--primary-color);
    background-color: var(--bg) !important;
    font-family: 'Inter', sans-serif;
    transition-duration: 0.2s;
}

#nav {
    height: 69px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
    background-color: var(--bg-wallet-light);
    padding: main.$container_padding_m;
}

@include main.mobile-device {
    #nav {
        padding: main.$container_padding_mobile;
        display: flex !important;
    }

    .panel {
        display: none !important;
    }
    .main_cols {
        &[wallet_view] {
            #router_view {
                padding: 0;
            }
        }

        #router_view {
            padding: main.$container_padding_s;
        }
    }

    #router_view {
        padding: main.$container_padding_s;
    }
}

@include main.medium-device {
    .main_cols {
        &[wallet_view] {
            grid-template-columns: 180px 1fr 240px !important;
        }
    }
}

@media only screen and (max-width: main.$width_s) {
    #router_view {
        padding: main.$container_padding_s;
    }
    #nav {
        padding: main.$container_padding_s;
    }
}
</style>
