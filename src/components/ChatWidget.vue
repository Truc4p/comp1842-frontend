<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isOpen = ref(false);
const hasNewMessage = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasNewMessage.value = false;
  }
}

function close(e) {
  if (!isOpen.value) return;
  const panel = document.getElementById('chat-panel');
  const button = document.getElementById('chat-button');
  if (panel && !panel.contains(e.target) && button && !button.contains(e.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', close);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', close);
});
</script>

<template>
  <div class="chat-root">
    <!-- Floating Button -->
    <button id="chat-button" class="chat-fab" @click.stop="toggle">
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
          <div>
            <h3 class="text-white">Let us help</h3>
            <p class="subtitle">We will be back soon</p>
          </div>
          <button class="close" @click="toggle" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M7.05 7.05a1 1 0 0 1 1.414 0L12 10.586l3.536-3.536a1 1 0 1 1 1.414 1.414L13.414 12l3.536 3.536a1 1 0 0 1-1.414 1.414L12 13.414l-3.536 3.536a1 1 0 0 1-1.414-1.414L10.586 12 7.05 8.464a1 1 0 0 1 0-1.414Z"/></svg>
          </button>
        </div>

        <div class="chat-content">
          <ul class="menu">
            <li class="menu-item">I have a question about my order.</li>
            <li class="menu-item">I have a question about returns.</li>
            <li class="menu-item">I have a shipping question.</li>
            <li class="menu-item">I have a question about your products!</li>
          </ul>

          <button class="primary-card">
            <span class="pkg-icon">📦</span>
            <span>Track and manage my orders</span>
            <span class="chev"></span>
          </button>

          <div class="input-card">
            <div class="input-wrap">
              <input type="text" placeholder="Leave a message" />
            </div>
          </div>
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

.chat-panel { position:absolute; right:0; bottom:88px; width: 360px; max-height: 70vh; background: linear-gradient(135deg, var(--primary-700), var(--primary-400)); color:var(--primary-50); border-radius:24px; box-shadow:0 20px 45px rgba(0,0,0,.25); overflow:hidden; display:flex; flex-direction:column; }
.chat-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02)); }
.chat-header h3 { font-size:14px; margin:0 0 4px 0; }
.chat-header .subtitle { margin:0; opacity:.9; }
.chat-header .close { background:transparent; border:none; color:var(--primary-50); cursor:pointer; }
.header-icon { width:22px; height:22px; }

.chat-content { padding:16px; background: radial-gradient(1200px 400px at 50% -200px, rgba(255,255,255,.08), rgba(255,255,255,0)); overflow:auto; }
.menu { list-style:none; padding:0; margin:0 0 12px 0; background:var(--primary-50); border-radius:16px; color: var(--primary-950); box-shadow: var(--shadow-soft); overflow:hidden; }
.menu-item { background: transparent; margin:0; padding:16px 18px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; }
.menu-item:last-child { border-bottom:none; }
.menu-item::after { content:'›'; opacity:.8; color: var(--primary-800); }
.menu-item:hover { background: var(--primary-200); color: var(--primary-900); }

.chev::after { content:'›'; opacity:.8; color: var(--primary-800); }

.primary-card { width:100%; background:var(--primary-50); color: var(--primary-950); border:none; padding:16px; border-radius:16px; display:flex; align-items:center; justify-content:space-between; font-weight:600; cursor:pointer; margin:12px 0; }
.primary-card .pkg-icon { font-size:14px; margin-right:2px; }
.primary-card .chev { color: var(--primary-800); font-size:14px; }

.input-card { background:var(--primary-50); color: var(--primary-950); border-radius:16px; padding:12px; display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.avatar-group { display:flex; }
.avatar { width:28px; height:28px; border-radius:9999px; background: var(--primary-100); display:flex; align-items:center; justify-content:center; font-weight:700; margin-right:-6px; border:2px solid var(--primary-50); }
.input-wrap { flex:1; display:flex; align-items:center; gap:8px; }
.input-wrap input { flex:1; border:none; outline:none; background:transparent; padding:8px; }

.chat-slide-enter-from, .chat-slide-leave-to { opacity:0; transform: translateY(20px) scale(.98); }
.chat-slide-enter-active, .chat-slide-leave-active { transition: all .2s ease; }
</style>


