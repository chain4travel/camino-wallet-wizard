import VueI18n from 'vue-i18n'
import Vue from 'vue'
import { ava } from '@/AVA'

Vue.use(VueI18n)

import en from '../locales/en.json'

const messages = {
    en,
}

const modifiers = {
    native: () => ava.getPrimaryAssetAlias(),
    project: () => 'Camino',
}

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en',
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    messages, // set locale messages
    modifiers,
})

export default i18n
