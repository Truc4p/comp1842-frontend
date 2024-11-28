// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcomeMessage: 'Welcome to our website!',
    details: 'Details',
    addToCart: 'Add to Cart',
    login: 'Login',
    register: 'Register'
  },
  vi: {
    welcomeMessage: 'Chào mừng bạn đến với trang web của chúng tôi!',
    details: 'Chi tiết',
    addToCart: 'Thêm vào giỏ hàng',
    login: 'Đăng nhập',
    register: 'Đăng ký',
  }
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;