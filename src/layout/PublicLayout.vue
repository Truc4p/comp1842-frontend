<!-- src/layout/PublicLayout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <PublicNavbar />
    
    <main class="flex-grow w-full">
      <router-view />
    </main>
    
    <footer class="modern-footer text-white py-16">
      <div class="container mx-auto px-6 footer-content">
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="footer-section">
            <div class="footer-brand">
              <div class="footer-logo">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span class="footer-brand-text">WrenCos</span>
            </div>
            <p class="footer-description">{{ t('footerDescription') || 'Your trusted partner for quality products and exceptional service. Experience the difference with our premium collection.' }}</p>
            
            <!-- Newsletter Signup -->
            <div class="footer-newsletter">
              <h4>{{ t('stayUpdated') || 'Stay Updated' }}</h4>
              <p>{{ t('newsletterDesc') || 'Get the latest updates on new products and exclusive offers.' }}</p>
              <div class="newsletter-form">
                <input type="email" class="newsletter-input" :placeholder="t('enterEmail') || 'Enter your email'">
                <button class="newsletter-btn">{{ t('subscribe') || 'Subscribe' }}</button>
              </div>
            </div>
          </div>
          
          <!-- Quick Links Section -->
          <div class="footer-section">
            <h3>{{ t('quickLinks') || 'Quick Links' }}</h3>
            <ul class="footer-links">
              <li><router-link to="/login">{{ t('products') || 'Products' }}</router-link></li>
              <li><router-link to="/login">{{ t('categories') || 'Categories' }}</router-link></li>
              <li><router-link to="/login">{{ t('newArrivals') || 'New Arrivals' }}</router-link></li>
              <li><router-link to="/login">{{ t('specialOffers') || 'Special Offers' }}</router-link></li>
              <li><router-link to="/register">{{ t('createAccount') || 'Create Account' }}</router-link></li>
            </ul>
          </div>
          
          <!-- Support Section -->
          <div class="footer-section">
            <h3>{{ t('support') || 'Support' }}</h3>
            <ul class="footer-links">
              <li><a href="#contact">{{ t('contactUs') || 'Contact Us' }}</a></li>
              <li><a href="#help">{{ t('helpCenter') || 'Help Center' }}</a></li>
              <li><a href="#shipping">{{ t('shippingInfo') || 'Shipping Info' }}</a></li>
              <li><a href="#returns">{{ t('returns') || 'Returns' }}</a></li>
              <li><a href="#faq">{{ t('faq') || 'FAQ' }}</a></li>
            </ul>
          </div>
        </div>
        
        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>© {{ new Date().getFullYear() }} WrenCos. {{ t('allRightsReserved') || 'All rights reserved.' }}</p>
          </div>
          
          <div class="footer-social">
            <a href="#" aria-label="Facebook">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
          
          <div class="footer-legal">
            <a href="#privacy">{{ t('privacyPolicy') || 'Privacy Policy' }}</a>
            <a href="#terms">{{ t('termsOfService') || 'Terms of Service' }}</a>
            <a href="#cookies">{{ t('cookiePolicy') || 'Cookie Policy' }}</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import PublicNavbar from "./Public-Navbar.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
/* Additional custom styles for enhanced layout */
.gradient-text {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>