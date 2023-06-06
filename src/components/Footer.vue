<template>
    <div id="footer">
        <div class="footer-content">
            <div class="first-section">
                <img v-if="$root.theme === 'day'" src="@/assets/LightModeLogo.svg" class="logo" />
                <img v-else src="@/assets/DarkModeLogo.svg" class="logo" />
                <span class="desc">
                    Camino is a fast, high-throughput open-source consortium blockchain enabling the
                    creation of travel-related products. Camino’s tech stack and consensus protocol
                    deliver unmatched speed, security, and reliability within the network.
                </span>
            </div>
            <div class="second-section">
                <div>
                    <h3 class="list-heading">Community</h3>
                    <ul>
                        <li>
                            <a
                                href="https://discord.gg/camino/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Discord
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://twitter.com/camino_network/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://t.me/camino_network"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Telegram Camino Network
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://t.me/+sSOOZn1tLqQzOWMy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Telegram Announcements
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 class="list-heading">More</h3>
                    <ul>
                        <li>
                            <a
                                href="https://github.com/chain4travel/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Github
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://blog.camino.network/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Medium
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://docs.camino.network/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Documentation
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator'
export default class Footer extends Vue {}
</script>
<style scoped lang="scss">
@use '../styles/main';
#footer {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--sidebar-background);
    padding: 24px 1.5rem;
}
.footer-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 1536px;
}
.logo {
    max-height: 40px;
    max-width: 151px;
}
.first-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
}
.second-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.list-heading {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.desc {
    color: #748ba7;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

a {
    color: #748ba7 !important;
    text-decoration: none;
}

@media (min-width: 1536px) {
    .second-section {
        grid-template-columns: repeat(3, 1fr);
    }
}

@include main.mobile-device {
    .footer-content {
        grid-template-columns: 1fr;
    }

    .first-section {
        align-items: center;
    }

    .second-section {
        grid-template-columns: repeat(2, 1fr);
    }

    li,
    .list-heading {
        text-align: center;
    }
}

@media (max-width: 600px) {
    .footer-content {
        grid-template-columns: 1fr;
    }

    .first-section {
        align-items: center;
    }

    .second-section {
        grid-template-columns: 1fr;
    }

    li,
    .list-heading {
        text-align: center;
    }
}
</style>
