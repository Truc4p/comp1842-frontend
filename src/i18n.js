// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcomeMessage: 'Welcome to our website!',
    // Add more translations here
  },
  vi: {
    welcomeMessage: 'Chào mừng bạn đến với trang web của chúng tôi!',
    // Add more translations here
  }
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;