<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';

const API_BASE_URL = 'http://localhost:3000';

const isOpen = ref(false);
const hasNewMessage = ref(false);
const isLoading = ref(false);
const sessionId = ref(null);
const currentFlow = ref('menu'); // 'menu' or 'chat'

// Messages and chat state
const messages = ref([]);
const inputText = ref('');
const messagesWrap = ref(null);

// FAQs and suggestions
const faqs = ref([]);
const faqCategories = ref([
  "Questions about my order",
  "Questions about returns",
  "Questions about shipping",
  "Questions about products",
  "Questions about skincare",
]);

// Flow state
const showCategories = ref(true);
const selectedCategory = ref(null);

// Generate session ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Format bot messages for better readability
function formatBotMessage(text) {
  if (!text) return text;

  // We'll produce safe HTML: escape input, then convert markdown-like bold/italic and newlines
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // basic readability tweaks on plain text first (preserve where to break into paragraphs)
  let interim = text
    .replace(/\?\s+/g, '?\n\n')
    .replace(/\s+(However|Additionally|Finally|Remember|Let me know)/g, '\n\n$1')
    // Break before sentences that start with "This" (covers "This daily cream", "This serum", etc.)
    .replace(/\.\s+(This\b)/gi, '.\n\n$1')
    .replace(/\.\s+(This\s+(?:serum|cream|product|cleanser))/gi, '.\n\n$1')
    .replace(/\.\s+(Remember\s+to)/gi, '.\n\n$1')
    .trim();

  // escape any HTML the AI returned so we don't inject markup
  let escaped = escapeHtml(interim);

  // convert markdown bold (**text**) and italics (_text_) to HTML
  // note: operate on escaped text so resulting tags are safe
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/_(.+?)_/g, '<em>$1</em>');

  // convert paragraphs: split on double newlines into <p> blocks, single newlines to <br>
  const paragraphs = escaped
    .split(/\n\s*\n/)
    .map(p => p.replace(/\n/g, '<br>'))
    .filter(p => p.trim().length > 0);

  return paragraphs.map(p => `<p>${p}</p>`).join('');
}

// Initialize chat
async function initializeChat() {
  if (!sessionId.value) {
    sessionId.value = generateSessionId();
  }

  // Load conversation history
  await loadConversationHistory();

  // Load FAQs
  await loadFAQs();

  // Add welcome message if no history
  if (messages.value.length === 0) {
    addBotMessage("Hi! I'm your Wrencos Beauty Assistant.\nHow can I help you today?");
    showCategories.value = true;
  }
}

// Load FAQs from backend
async function loadFAQs() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/faqs?limit=100`);
    const result = await response.json();
    if (result.success) {
      faqs.value = result.data;
    }
  } catch (error) {
    console.error('Error loading FAQs:', error);
  }
}

// Load conversation history
async function loadConversationHistory() {
  if (!sessionId.value) return;

  try {
    const response = await fetch(`${API_BASE_URL}/chat/conversation/${sessionId.value}`);
    const result = await response.json();
    if (result.success && result.data.messages.length > 0) {
      messages.value = result.data.messages.map((msg, index) => ({
        id: index + 1,
        sender: msg.role === 'user' ? 'user' : 'bot',
        text: msg.role === 'user' ? msg.content : formatBotMessage(msg.content),
        timestamp: msg.timestamp,
        relatedProducts: msg.relatedProducts || [],
        faq: msg.faq
      }));
      showCategories.value = false;
      currentFlow.value = 'chat';
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
  }
}

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasNewMessage.value = false;
    initializeChat();
    scrollToBottom();
  }
}

function outsideClose(e) {
  if (!isOpen.value) return;
  const panel = document.getElementById('chat-panel');
  const button = document.getElementById('chat-button');
  if (panel && !panel.contains(e.target) && button && !button.contains(e.target)) {
    isOpen.value = false;
  }
}

function clearChat() {
  messages.value = [];
  sessionId.value = generateSessionId();
  showCategories.value = true;
  selectedCategory.value = null;
  currentFlow.value = 'menu';
}

function backToMenu() {
  currentFlow.value = 'menu';
  showCategories.value = true;
  selectedCategory.value = null;
}

// Add message to chat
function addUserMessage(text) {
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text: text,
    timestamp: new Date()
  });
  scrollToBottom();
}

function addBotMessage(text, relatedProducts = [], faq = null) {
  const formattedText = formatBotMessage(text);
  // If the chat panel is closed, mark that there's a new message so the
  // floating button can show a badge. This makes `hasNewMessage` meaningful.
  if (!isOpen.value) {
    hasNewMessage.value = true;
  }
  messages.value.push({
    id: Date.now(),
    sender: 'bot',
    text: formattedText,
    timestamp: new Date(),
    relatedProducts: relatedProducts,
    faq: faq
  });
  scrollToBottom();
}

// Flow 1: Handle FAQ category selection
function selectFAQCategory(category) {
  selectedCategory.value = category;
  showCategories.value = false;
}

// Flow 1: Get FAQs filtered by category
const filteredFAQs = computed(() => {
  if (!selectedCategory.value) return [];

  let categoryFilter = '';
  switch (selectedCategory.value) {
    case 'Questions about my order':
      categoryFilter = 'orders';
      break;
    case 'Questions about returns':
      categoryFilter = 'returns';
      break;
    case 'Questions about shipping':
      categoryFilter = 'shipping';
      break;
    case 'Questions about products':
      categoryFilter = 'products';
      break;
    case 'Questions about skincare':
      categoryFilter = 'skincare';
      break;
    default:
      return faqs.value;
  }

  return faqs.value.filter(faq => faq.category === categoryFilter);
});

// Flow 1: Handle predefined FAQ selection
async function selectFAQ(faq) {
  addUserMessage(faq.question);
  isLoading.value = true;
  showCategories.value = false;
  selectedCategory.value = null;
  currentFlow.value = 'chat';

  try {
    const response = await fetch(`${API_BASE_URL}/chat/faq/${faq._id}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId.value
      })
    });

    const result = await response.json();
    if (result.success) {
      addBotMessage(result.data.answer, [], faq);
    } else {
      addBotMessage("Sorry, I couldn't retrieve that information. Please try again.");
    }
  } catch (error) {
    console.error('Error getting FAQ answer:', error);
    addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
  } finally {
    isLoading.value = false;
  }
}

// Flow 2: Send message to AI
async function sendAIMessage(message = null) {
  const text = message || inputText.value.trim();
  if (!text) return;

  addUserMessage(text);
  inputText.value = '';
  isLoading.value = true;
  showCategories.value = false;
  selectedCategory.value = null;
  currentFlow.value = 'chat';

  try {
    const response = await fetch(`${API_BASE_URL}/chat/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId.value
      })
    });

    const result = await response.json();
    if (result.success) {
      addBotMessage(
        result.data.message,
        result.data.relatedProducts || [],
        null
      );
    } else {
      addBotMessage("Sorry, I couldn't process your message. Please try again.");
    }
  } catch (error) {
    console.error('Error sending AI message:', error);
    addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
  } finally {
    isLoading.value = false;
  }
}

function sendMessage() {
  sendAIMessage();
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

async function scrollToBottom() {
  await nextTick();
  if (messagesWrap.value) {
    messagesWrap.value.scrollTop = messagesWrap.value.scrollHeight;
  }
}

onMounted(() => {
  document.addEventListener('click', outsideClose);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', outsideClose);
});
</script>

<template>
  <div class="chat-root">
    <!-- Floating Button -->
    <button id="chat-button" class="chat-fab" @click.stop="toggle" aria-label="Open chat">
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <path fill="currentColor"
          d="M12 3C6.477 3 2 6.94 2 11.8c0 2.45 1.204 4.66 3.162 6.23V22l3.6-1.98c1.002.28 2.07.43 3.238.43 5.523 0 10-3.94 10-8.85S17.523 3 12 3Z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <path fill="currentColor"
          d="M7.05 7.05a1 1 0 0 1 1.414 0L12 10.586l3.536-3.536a1 1 0 1 1 1.414 1.414L13.414 12l3.536 3.536a1 1 0 0 1-1.414 1.414L12 13.414l-3.536 3.536a1 1 0 0 1-1.414-1.414L10.586 12 7.05 8.464a1 1 0 0 1 0-1.414Z" />
      </svg>
      <span v-if="hasNewMessage" class="badge"></span>
    </button>

    <!-- Chat Panel -->
    <transition name="chat-slide">
      <div v-if="isOpen" id="chat-panel" class="chat-panel" @click.stop>
        <div class="chat-header">
          <div class="header-title">
            <h3 class="text-white">Assistant</h3>
            <span v-if="currentFlow === 'chat'" class="flow-indicator">AI Chat</span>
            <span v-else class="flow-indicator">Quick Help</span>
          </div>
          <div class="header-actions">
            <button class="icon-btn" @click="backToMenu" aria-label="Back to menu">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="currentColor">
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </button>
            <button class="icon-btn" @click="clearChat" aria-label="Clear conversation">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="header-icon">
                <path fill="currentColor"
                  d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 8v7h2v-7h-2Zm4 0v7h2v-7h-2ZM6 9v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9H6Z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="chat-content-flex"
          @click="currentFlow === 'menu' ? (currentFlow = 'chat', showCategories = false, selectedCategory = null) : null">
          <!-- Messages -->
          <div ref="messagesWrap" class="messages" aria-live="polite">
            <div v-for="m in messages" :key="m.id" class="message"
              :class="m.sender === 'user' ? 'from-user' : 'from-bot'">
              <div class="message-bubble">
                <div class="message-text" v-if="m.sender === 'bot'" v-html="m.text"></div>
                <div class="message-text" v-else>{{ m.text }}</div>
                <!-- Show related products if any -->
                <div v-if="m.relatedProducts && m.relatedProducts.length > 0" class="related-products">
                  <div v-for="product in m.relatedProducts.slice(0, 3)" :key="product._id" class="product-card">
                    <div class="product-info">
                      <span class="product-name">{{ product.name }}</span>
                      <span v-if="product.price" class="product-price">${{ product.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Loading indicator -->
            <div v-if="isLoading" class="message from-bot">
              <div class="message-bubble typing">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <!-- Menu/FAQ and Composer sections remain outside chat-content-flex for correct flex layout -->
        </div>

        <!-- Flow 1: Menu/FAQ Selection -->
        <div v-if="currentFlow === 'menu'" class="menu-section">
          <!-- FAQ Categories -->
          <div v-if="showCategories" class="faq-categories">
            <div class="suggestions-title">Frequently Asked Questions</div>
            <button v-for="category in faqCategories" :key="category" class="suggestion-btn"
              @click="selectFAQCategory(category)">
              {{ category }}
            </button>
          </div>

          <!-- Category-specific FAQs -->
          <div v-if="selectedCategory" class="faq-category-section">
            <div class="category-header">
              <button class="back-to-categories-btn" @click="showCategories = true; selectedCategory = null">
                < </button>
                  <h4>{{ selectedCategory }}</h4>
            </div>
            <div class="faqs-list">
              <button v-for="faq in filteredFAQs" :key="faq._id" class="faq-item" @click="selectFAQ(faq)">
                <span class="faq-question">{{ faq.question }}</span>
              </button>
              <div v-if="filteredFAQs.length === 0" class="no-faqs">
                No questions available for this category yet.
              </div>
            </div>
          </div>
        </div>

        <!-- Flow 2: Chat Input -->
        <div v-if="currentFlow === 'chat'" class="composer">
          <input v-model="inputText" class="composer-input" type="text" placeholder="Ask me anything about skincare..."
            @keydown="onKeydown" :disabled="isLoading" aria-label="Message input" />
          <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputText.trim()"
            aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="send-icon">
              <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2l-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.chat-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  width: auto;
  height: auto;
}

.chat-fab {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #c97f98, #9b4d6b);
  color: white;
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .18);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-fab:hover {
  background: linear-gradient(135deg, #b5718a, #8a4460);
  transform: scale(1.05);
}

.icon {
  width: 28px;
  height: 28px;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #ff4757;
  border-radius: 9999px;
  border: 2px solid white;
}

.chat-panel {
  position: absolute;
  right: 0;
  bottom: 88px;
  width: 380px;
  max-height: 80vh;
  background: white;
  color: #333;
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, .25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-content-flex {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-content-flex:hover {
  background-color: rgba(201, 127, 152, 0.05);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: linear-gradient(135deg, #c97f98, #9b4d6b);
  color: white;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title h3 {
  font-size: 18px;
  margin: 0;
  font-weight: 700;
}

.flow-indicator {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, .15);
}

.header-icon {
  width: 18px;
  height: 18px;
}

.messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
  background: linear-gradient(180deg, #f8f9fa, #fff);
  min-height: 0;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message-bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .06);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.from-user {
  justify-content: flex-end;
}

.from-user .message-bubble {
  background: #c97f98;
  color: white;
  border-bottom-right-radius: 3px;
}

.from-bot .message-bubble {
  background: #F8EAE1;
  /* other choice light grey #f1f3f5 */
  color: #671C39;
  border-bottom-left-radius: 3px;
  white-space: pre-line;
  word-wrap: break-word;
  line-height: 1.6;
}

/* Improve readability for long bot messages */
.from-bot .message-bubble p {
  margin: 0 0 8px 0;
}

.from-bot .message-bubble p:last-child {
  margin-bottom: 0;
}

/* Style for product mentions and prices */
.from-bot .message-bubble strong {
  font-weight: 600;
  color: #8C3154;
}

/* Add some spacing for better readability */
.from-bot .message-bubble {
  text-align: left;
}

/* Styles for rendered HTML inside messages: higher specificity to override resets */
.message-bubble .message-text {
  line-height: 1.72;
}

.message-bubble .message-text p {
  display: block;
  margin: 0 0 14px 0 !important;
  color: inherit;
}

.message-bubble .message-text p:last-child {
  margin-bottom: 0 !important;
}

/* ensure consecutive paragraphs have visible gap */
.message-bubble .message-text p+p {
  margin-top: 14px !important;
}

/* The bot message HTML is injected via v-html, so those <p> elements do not
   receive the component's scoped attribute. Use the deep selector so the
   rules apply to injected markup and ensure clear paragraph spacing. */
.message-bubble :deep(p) {
  display: block;
  margin: 0 0 14px 0;
  color: inherit;
  line-height: 1.72;
}

.message-bubble :deep(p:last-child) {
  margin-bottom: 0;
}

.message-bubble :deep(p + p) {
  margin-top: 14px;
}

.message-bubble .message-text strong {
  font-weight: 700;
  color: #8C3154;
}

.message-bubble .message-text em {
  font-style: italic;
  color: #5a2a3a;
}

.typing {
  background: #f1f3f5 !important;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #c97f98;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {

  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.related-products {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.product-card {
  margin: 4px 0;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 12px;
  font-weight: 500;
}

.product-price {
  font-size: 12px;
  color: #c97f98;
  font-weight: 600;
}

.menu-section {
  padding: 16px;
  background: white;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.suggestion-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  margin: 4px 0;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.suggestion-btn:hover {
  background: #FDF6F0;
  border-color: #c97f98;
}

.faqs-list {
  max-height: 200px;
  overflow-y: auto;
}

.faq-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  margin: 4px 0;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.faq-item:hover {
  background: #FDF6F0;
  border-color: #c97f98;
}

.faq-question {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.faq-categories {
  margin-bottom: 16px;
}

.faq-category-section {
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.category-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #8C3154;
}

.back-to-categories-btn {
  background: #F8EAE1;
  color: #671C39;
  padding: 4px 8px;
  border-radius: 16px;
  /* define an explicit border so border-color changes are visible */
  border: 1px solid #F8EAE1;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s ease;
}

.back-to-categories-btn:hover {
  /* change border color on hover and slightly darken background for feedback */
  border-color: #671C39;
  background: #F4DCD8;
}

.no-faqs {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  font-size: 14px;
}

.composer {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #fff;
}

.composer-input {
  flex: 1;
  border: 1px solid #e9ecef;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;
}

.composer-input:focus {
  border-color: #c97f98;
  box-shadow: 0 0 0 2px rgba(201, 127, 152, .25);
}

.composer-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #c97f98, #9b4d6b);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, .12);
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b5718a, #8a4460);
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.send-icon {
  width: 20px;
  height: 20px;
}

.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
