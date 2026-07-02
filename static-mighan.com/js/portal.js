/**
 * Mighantect SaaS User Portal — Shared JS
 * Handles: auth, API calls, UI helpers
 */

var API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:9797' 
  : 'https://' + window.location.hostname;

// ═══════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════

function getToken() {
  return localStorage.getItem('mighan_user_token');
}

function setToken(token) {
  localStorage.setItem('mighan_user_token', token);
}

function clearToken() {
  localStorage.removeItem('mighan_user_token');
}

function isLoggedIn() {
  return !!getToken();
}

async function api(path, opts) {
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
  
  var token = getToken();
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  
  try {
    var resp = await fetch(API_BASE + path, opts);
    var data = await resp.json().catch(function() { return null; });
    return { ok: resp.ok, status: resp.status, data: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function getUser() {
  if (!isLoggedIn()) return null;
  var result = await api('/api/v1/auth/me');
  return result.ok && result.data ? result.data.user : null;
}

function logout() {
  clearToken();
  window.location.href = '/login';
}

// ═══════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════

function showToast(message, type) {
  type = type || 'info';
  var toast = document.getElementById('toast') || document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  requestAnimationFrame(function() {
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
  });
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatDate(iso) {
  if (!iso) return '-';
  var d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ═══════════════════════════════════════════════════
// ROUTE GUARD
// ═══════════════════════════════════════════════════

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

function redirectIfAuth() {
  if (isLoggedIn() && window.location.pathname.includes('/login')) {
    window.location.href = '/dashboard';
  }
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  // Auto-redirect if on login page but already logged in
  redirectIfAuth();
});
