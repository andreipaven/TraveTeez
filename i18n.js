import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './src/Languages/en.json';
import ro from './src/Languages/ro.json';

const resources = {
    en: {translation: en},
    ro: {translation: ro},
};

async function initI18n() {
    let deviceLanguage = 'en';

    try {
        const loc = await Localization.getLocalizationAsync();
        deviceLanguage = loc.locale.split('-')[0]; // ex: "ro-RO" devine "ro"
    } catch (e) {
        deviceLanguage = 'en'; // fallback
    }

    i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v3',
            resources,
            lng: deviceLanguage,
            fallbackLng: 'en',
            debug: false,
            interpolation: {escapeValue: false},
        });

    console.log('Device language detected:', deviceLanguage);
}

initI18n();

export default i18n;
