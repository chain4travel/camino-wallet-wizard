<template>
    <div id="nav">
        <div class="nav-content">
            <ConfirmLogout ref="logout"></ConfirmLogout>
            <div class="logo">
                <img v-if="$root.theme === 'day'" src="@/assets/LightModeLogo.svg" class="logo" />
                <img v-else src="@/assets/DarkModeLogo.svg" class="logo" />
            </div>
            <v-spacer></v-spacer>

            <div class="buts_right">
                <DayNightToggle class="action_but"></DayNightToggle>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import LanguageSelect from './misc/LanguageSelect/LanguageSelect.vue'
import DayNightToggle from '@/components/misc/DayNightToggle.vue'
import NetworkMenu from './NetworkSettings/NetworkMenu.vue'
import ConfirmLogout from '@/components/modals/ConfirmLogout.vue'
import AccountMenu from '@/components/wallet/sidebar/AccountMenu.vue'
@Component({
    components: {
        AccountMenu,
        NetworkMenu,
        DayNightToggle,
        ConfirmLogout,
        LanguageSelect,
    },
})
export default class Navbar extends Vue {
    isDrawer: boolean = false

    get isAuth(): boolean {
        return this.$store.state.isAuth
    }

    logout(): void {
        // @ts-ignore
        this.$refs.logout.open()
        this.isDrawer = false
    }
}
</script>
<style scoped lang="scss">
@use '../styles/main';

img {
    max-height: 25px;
}

a {
    text-decoration: none;
    font-weight: normal;
    white-space: nowrap;
}

button {
    font-weight: normal;
}

.daynight {
    margin-right: 15px;
}

.v-list--nav {
    height: inherit;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

#nav {
    border-bottom: 1px solid rgba(145, 158, 171, 0.24) !important;
    .logo {
        display: flex;
        align-items: center;
        color: var(--primary-color-light) !important;
        font-size: 11px;
        font-weight: 700;

        &:hover {
            opacity: 0.7;
        }

        img {
            width: 120px;
            height: 36px;
            max-height: none !important;
            object-fit: contain;
            margin-right: 5px;
        }
    }
    display: flex;
    align-items: center;
    justify-content: center;
    height: 69px;
    position: relative;
    background-color: var(--bg-wallet-light);
    z-index: 2;
    padding: 0 1.5rem;
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1536px;
    height: 100%;
    width: 100%;
    padding: 0;
}

.buts_right {
    display: flex;
    align-items: center;

    a {
        margin: 0;
    }
}

.action_but {
    color: var(--primary-color) !important;
    padding: 0 12px;
    border-radius: var(--border-radius-sm);
}

.mobile_right {
    display: none;
}

.mobile_bottom {
}

.mobile_account_menu {
    display: flex;
    flex-direction: column;
    padding: 8px 8px;
    button:not(last-child) {
        margin-bottom: 16px;
    }
}

.lang_mobile,
.lang_web {
    width: max-content;
    margin: 0;
}

@include main.medium-device {
    img {
        max-height: 18px;
    }
    .buts_right {
        button {
            font-size: 11px;
        }
    }
}

@include main.mobile-device {
    .lang_web {
        display: none;
    }

    .buts_right {
        .router-link-exact-active {
            background-color: #42b983;
        }
    }

    .mobile_right {
        display: block;
    }

    .mobile_drawer {
        color: var(--primary-color) !important;
    }

    .mobile_account_menu {
        margin-bottom: 16px;
        padding: 0px;
    }

    .logout {
        padding: 16px 0px !important;
    }
}
</style>
<style lang="scss">
.mobile_menu {
    overflow: visible !important;
    background-color: var(--bg-light) !important;

    .v-list-item,
    .v-list-item--link {
        color: var(--primary-color-light) !important;
    }

    .v-list-item--active {
        color: var(--primary-color) !important;
    }

    a,
    .logout {
        display: block;
        padding: 8px 8px;
        color: var(--primary-color-light) !important;
    }

    .router-link-exact-active {
        background-color: var(--bg-wallet);
        color: var(--primary-color) !important;
        border-radius: var(--border-radius-sm);
    }
    .mobile_account_menu {
        button:not(:last-of-type) {
            margin-bottom: 8px;
        }
        button:not(:first-of-type) {
            margin-top: 8px;
        }
    }
}
.v-overlay__scrim {
    height: 100vh !important;
}
</style>
