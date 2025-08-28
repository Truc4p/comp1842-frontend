<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const isOpen = ref(false);
const hasNewMessage = ref(false);

// Simple local state for demo
const messages = ref([
  { id: 1, sender: 'bot', text: 'Hi! I\'m your WrenCos Assistant. How can I help today?' }
]);
const inputText = ref('');
const messagesWrap = ref(null);
let messageId = 2;

// Suggested FAQs
const suggestedQuestions = [
  "Questions about my order",
  "Questions about returns",
  "Questions about shipping",
  "Questions about products",
  "Track or manage my order"
];

// Show suggestions only on first use
const showSuggestions = ref(true);

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasNewMessage.value = false;
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
}

function sendMessage() {
  const value = inputText.value.trim();
  if (!value) return;
  messages.value.push({ id: messageId++, sender: 'user', text: value });
  inputText.value = '';
  scrollToBottom();
  // Simulated assistant response
  setTimeout(() => {
    messages.value.push({ id: messageId++, sender: 'bot', text: 'Thanks for your message! I\'ll get back with tips shortly.' });
    if (!isOpen.value) hasNewMessage.value = true;
    scrollToBottom();
  }, 500);
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesWrap.value) {
      messagesWrap.value.scrollTop = messagesWrap.value.scrollHeight;
    }
  });
}

onMounted(() => {
  const stored = localStorage.getItem('chat_show_suggestions');
  if (stored === 'false') {
    showSuggestions.value = false;
  }
  // Always show suggestions for a fresh conversation (only welcome message exists)
  if (messages.value.length <= 1) {
    showSuggestions.value = true;
  }
  window.addEventListener('click', outsideClose);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', outsideClose);
});

function hideSuggestions() {
  showSuggestions.value = false;
  try { localStorage.setItem('chat_show_suggestions', 'false'); } catch (e) {}
}

function useSuggestion(q) {
  inputText.value = q;
  sendMessage();
  hideSuggestions();
}

function showSuggestionsPanel() {
  showSuggestions.value = true;
}
</script>

<template>
  <div class="chat-root">
    <!-- Floating Button -->
    <button id="chat-button" class="chat-fab" @click.stop="toggle" aria-label="Open chat">
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <path fill="currentColor" d="M12 3C6.477 3 2 6.94 2 11.8c0 2.45 1.204 4.66 3.162 6.23V22l3.6-1.98c1.002.28 2.07.43 3.238.43 5.523 0 10-3.94 10-8.85S17.523 3 12 3Z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <path fill="currentColor" d="M7.05 7.05a1 1 0 0 1 1.414 0L12 10.586l3.536-3.536a1 1 0 1 1 1.414 1.414L13.414 12l3.536 3.536a1 1 0 0 1-1.414 1.414L12 13.414l-3.536 3.536a1 1 0 0 1-1.414-1.414L10.586 12 7.05 8.464a1 1 0 0 1 0-1.414Z"/>
      </svg>
      <span v-if="hasNewMessage" class="badge"></span>
    </button>

    <!-- Chat Panel -->
    <transition name="chat-slide">
      <div v-if="isOpen" id="chat-panel" class="chat-panel" @click.stop>
        <div class="chat-header">
          <div class="header-title">
            <h3 class="text-white">WrenCos Assistant</h3>
          </div>
          <div class="header-actions">
            <button class="icon-btn" @click="clearChat" aria-label="Clear conversation">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 8v7h2v-7h-2Zm4 0v7h2v-7h-2ZM6 9v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9H6Z"/></svg>
            </button>
            <button class="icon-btn" @click="isOpen=false" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M6.225 4.811L4.811 6.225L10.586 12l-5.775 5.775l1.414 1.414L12 13.414l5.775 5.775l1.414-1.414L13.414 12l5.775-5.775l-1.414-1.414L12 10.586z"/></svg>
            </button>
          </div>
        </div>

        <div ref="messagesWrap" class="messages" aria-live="polite">
          <div v-for="m in messages" :key="m.id" class="message" :class="m.sender === 'user' ? 'from-user' : 'from-bot'">
            <div class="message-bubble">{{ m.text }}</div>
          </div>
        </div>

        <div v-if="showSuggestions" class="suggestions">
          <div class="suggestions-bar">
            <span class="suggestions-title">Quick questions</span>
            <button class="suggestions-close" @click="hideSuggestions" aria-label="Hide suggestions">×</button>
          </div>
          <button
            v-for="q in suggestedQuestions"
            :key="q"
            class="chip"
            @click="useSuggestion(q)"
          >{{ q }}</button>
        </div>
        <button
          v-else
          class="suggestions-hint suggestions-hint--floating"
          @click="showSuggestionsPanel"
          aria-label="Show suggestions"
        >
          ?
        </button>

        <div class="composer">
          <input
            v-model="inputText"
            class="composer-input"
            type="text"
            placeholder="Write a message..."
            @keydown="onKeydown"
            aria-label="Message input"
          />
          <button class="send-btn" @click="sendMessage" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="send-icon"><path fill="currentColor" d="M2 21l21-9L2 3v7l15 2l-15 2z"/></svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
  
</template>

<style scoped>
.chat-root { position: fixed; right: 24px; bottom: 24px; z-index: 50; width:auto; height:auto; }
.chat-fab { position:absolute; bottom:0; right:0; background: linear-gradient(135deg, var(--primary-400), var(--primary-700)); color:var(--primary-50); width:64px; height:64px; border-radius:9999px; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 25px rgba(0,0,0,.18); border:none; cursor:pointer; }
.chat-fab:hover { background: var(--primary-800); }
.icon { width:28px; height:28px; }
.badge { position:absolute; top:-2px; right:-2px; width:10px; height:10px; background: var(--primary-500); border-radius:9999px; border:2px solid var(--primary-50); }

.chat-panel { position:absolute; right:0; bottom:88px; width: 380px; max-height: 70vh; background: var(--primary-50); color:var(--primary-950); border-radius:24px; box-shadow:0 20px 45px rgba(0,0,0,.25); overflow:hidden; display:flex; flex-direction:column; }
.chat-header { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; background: linear-gradient(135deg, var(--primary-600), var(--primary-400)); color: var(--primary-50); }
.header-title { display:flex; align-items:center; gap:10px; }
.header-title h3 { font-size:18px; margin:0; font-weight:700; }
.header-actions { display:flex; align-items:center; gap:8px; }
.icon-btn { background: transparent; border:none; color:inherit; cursor:pointer; padding:6px; border-radius:8px; }
.icon-btn:hover { background: rgba(255,255,255,.15); }
.header-icon { width:18px; height:18px; }

.messages { flex:1; overflow:auto; padding:16px; background: linear-gradient(180deg, var(--primary-50), #fff); }
.message { display:flex; margin-bottom:10px; }
.message-bubble { max-width: 75%; padding:10px 12px; border-radius:14px; font-size:14px; line-height:1.4; box-shadow:0 4px 12px rgba(0,0,0,.06); }
.from-user { justify-content:flex-end; }
.from-user .message-bubble { background: var(--primary-600); color: var(--primary-50); border-bottom-right-radius:3px; }
.from-bot .message-bubble { background: var(--primary-200); color: var(--primary-900); border-bottom-left-radius:3px;}

.composer { display:flex; gap:8px; padding:12px; background:#fff; }
.composer-input { flex:1; border:1px solid var(--primary-200); background:#fff; border-radius:12px; padding:10px 12px; outline:none; }
.composer-input:focus { border-color: var(--primary-500); box-shadow: 0 0 0 2px rgba(201,127,152,.25); }
.send-btn { width:44px; height:44px; border:none; border-radius:12px; background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); color: var(--primary-50); cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 18px rgba(0,0,0,.12); }
.send-btn:hover { background: var(--primary-700); }
.send-icon { width:20px; height:20px; }

.suggestions { display:flex; flex-wrap:wrap; gap:8px; padding:8px 12px 12px 12px; border-top:1px solid var(--primary-100); background:#fff; }
.chip { border:1px solid var(--primary-200); background: var(--primary-50); color: var(--primary-800); padding:8px 10px; border-radius:9999px; font-size:12px; cursor:pointer; }
.chip:hover { background:#fff; color: var(--primary-900); border-color: var(--primary-500); }

.suggestions-bar { width:100%; display:flex; align-items:center; justify-content:space-between; padding:4px 2px 6px 2px; }
.suggestions-title { font-size:14px; font-weight:700; color: var(--primary-700); }
.suggestions-close { font-size:14px; font-weight:700; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; border:none; border-radius:6px; background: transparent; color: var(--primary-700); cursor:pointer; }
.suggestions-close:hover { background: var(--primary-50); color: var(--primary-900); }

.suggestions-hint { display:inline-flex; align-items:center; justify-content:center; gap:6px; color: var(--primary-700); font-size:12px; }
.suggestions-hint--floating { position:absolute; right:12px; bottom:64px; background:#fff; border:1px solid var(--primary-200); border-radius:9999px; padding:6px 10px; box-shadow:0 6px 16px rgba(0,0,0,.08); cursor:pointer; }
.suggestions-hint--floating:hover { border-color: var(--primary-500); color: var(--primary-900); }

.chat-slide-enter-from, .chat-slide-leave-to { opacity:0; transform: translateY(20px) scale(.98); }
.chat-slide-enter-active, .chat-slide-leave-active { transition: all .2s ease; }
</style>


