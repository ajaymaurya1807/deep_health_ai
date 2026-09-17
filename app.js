/**
 * Deep Health AI - Complete Web Application Engine
 */

// Initial State (Populated with Maya's account details from deephealthindia.io)
const defaultUser = {
  name: 'Maya',
  email: 'maya.demo@deephealthindia.io',
  phone: '+919369118779',
  referralCode: 'DHP6LDPD',
  points: 25,
  freeScansRemaining: 1,
  isLoggedIn: false,
  scans: [
    {
      id: 'SC-9102',
      date: '17 Sep 2026, 09:45 PM',
      wellnessScore: 88,
      bp: '118/78 mmHg',
      heartRate: '72 BPM',
      hrv: '48 ms',
      stress: '32 (Low)',
      status: 'Optimal'
    }
  ]
};

// State Store
let state = {
  user: null,
  currentRoute: 'login',
  cameraStream: null,
  isScanning: false,
  scanTimeLeft: 30,
  scanTimer: null,
  currentSelectedPlan: null
};

// Initialize State
function initAppState() {
  try {
    const saved = localStorage.getItem('dh_user');
    if (saved) {
      state.user = JSON.parse(saved);
      if (state.user.email === 'jockey7040@gmail.com') {
        state.user.email = 'maya.demo@deephealthindia.io';
      }
    } else {
      state.user = { ...defaultUser };
    }
    // On app launch, start in logged-out state so login page appears first
    if (!sessionStorage.getItem('dh_session_active')) {
      state.user.isLoggedIn = false;
    }
    saveUser();
  } catch (e) {
    state.user = { ...defaultUser, isLoggedIn: false };
  }
}

function saveUser() {
  try {
    localStorage.setItem('dh_user', JSON.stringify(state.user));
  } catch (e) {}
}

// Toast System (Guaranteed Top-Center Display)
function showToast(message, type = 'default') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Force top-center alignment via inline styles
  container.style.position = 'fixed';
  container.style.top = '16px';
  container.style.bottom = 'auto';
  container.style.left = '50%';
  container.style.right = 'auto';
  container.style.transform = 'translateX(-50%)';
  container.style.zIndex = '99999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.pointerEvents = 'none';
  container.style.width = 'calc(100% - 32px)';
  container.style.maxWidth = '460px';

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const bg = type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : 'rgba(15, 23, 42, 0.94)';
  const border = type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : 'rgba(255, 255, 255, 0.15)';
  
  toast.style.cssText = `
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    margin: 0 auto 6px auto !important;
    background: ${bg} !important;
    color: #ffffff !important;
    padding: 10px 18px !important;
    border-radius: 99px !important;
    font-size: 0.88rem !important;
    font-weight: 600 !important;
    box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid ${border} !important;
    pointer-events: auto !important;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
    transform: translateY(-20px);
    opacity: 0;
  `;
  
  toast.innerHTML = `<span style="font-size:1.05rem; line-height:1;">${type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger smooth drop down animation from top
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Router
function handleRoute() {
  let hash = window.location.hash.slice(1).toLowerCase();

  // Authentication & Launch Routing:
  // If user is not logged in, redirect to login page (unless viewing register or forgot-password)
  const isAuth = state.user && state.user.isLoggedIn;
  if (!isAuth) {
    if (hash !== 'register' && hash !== 'forgot-password') {
      hash = 'login';
      if (window.location.hash !== '#login') {
        window.location.hash = '#login';
      }
    }
  } else if (!hash || hash === 'login') {
    // If logged in and at empty or login, route to home
    hash = 'home';
    if (window.location.hash !== '#home') {
      window.location.hash = '#home';
    }
  }

  const validRoutes = ['home', 'scanner', 'pricing', 'login', 'register', 'forgot-password', 'profile', 'about', 'contact'];
  const route = validRoutes.includes(hash) ? hash : (isAuth ? 'home' : 'login');
  state.currentRoute = route;

  // Show / Hide Bottom Navigation Bar based on auth screens
  const bottomNav = document.getElementById('app-bottom-nav');
  if (bottomNav) {
    if (route === 'login' || route === 'register' || route === 'forgot-password') {
      bottomNav.style.display = 'none';
      document.body.style.paddingBottom = '0px';
    } else {
      bottomNav.style.display = 'flex';
      document.body.style.paddingBottom = '76px';
    }
  }

  // Update Page Views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`${route === 'forgot-password' ? 'forgot' : route}-view`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update Dynamic Header Page Title
  const pageTitles = {
    home: 'Deep Health AI',
    scanner: 'AI Biometric Scanner',
    pricing: 'Plans & Pricing',
    profile: 'My Profile',
    about: 'About Us',
    contact: 'Contact Us',
    login: 'Sign In',
    register: 'Create Account',
    'forgot-password': 'Reset Password'
  };
  const titleEl = document.getElementById('header-page-title');
  if (titleEl) {
    titleEl.textContent = pageTitles[route] || 'Deep Health AI';
  }

  // Update Top Navbar Active Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });

  // Update Bottom Navigation Bar Active Tabs
  document.querySelectorAll('.bottom-tab, .bottom-tab-scan').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.route === route);
  });

  // Handle Route Specific Lifecycle
  if (route === 'scanner') {
    startCamera();
    startPpgSimulation();
  } else {
    stopCamera();
  }

  if (route === 'profile') {
    renderProfile();
  }

  updateNavbar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navbar Authentication & User State Updates
function updateNavbar() {
  const navAuth = document.getElementById('nav-auth-actions');
  if (!navAuth) return;

  if (state.user && state.user.isLoggedIn) {
    navAuth.innerHTML = `
      <div class="points-pill" title="Your reward points (1 Pt = ₹1)">
        <span>⭐</span> ${state.user.points} Pts
      </div>
      <a href="#profile" class="user-pill" title="View Profile">
        <div class="user-avatar">${(state.user.name || 'M')[0].toUpperCase()}</div>
        <span class="user-info-text">${state.user.name || 'User'}</span>
      </a>
      <button class="btn btn-secondary btn-sm" onclick="logout()" title="Sign Out">Logout</button>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="#profile" class="btn btn-secondary btn-sm" onclick="switchProfileAuth('signin')">Sign In</a>
      <a href="#profile" class="btn btn-primary btn-sm" onclick="switchProfileAuth('register')">Get Started</a>
    `;
  }
}

// Camera Management
async function startCamera() {
  const video = document.getElementById('camera-feed');
  const placeholder = document.getElementById('camera-placeholder');
  if (!video) return;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      state.cameraStream = stream;
      video.srcObject = stream;
      video.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
      return;
    } catch (err) {
      console.warn('Camera access denied or unavailable, using simulation:', err);
    }
  }

  // If no hardware camera, show clean animated sensor mode
  if (placeholder) {
    placeholder.style.display = 'flex';
    placeholder.innerHTML = `
      <div style="width:64px; height:64px; border-radius:50%; border:2px dashed #00bcd4; display:flex; align-items:center; justify-content:center; margin-bottom:12px; animation:pulseOval 2s infinite ease-in-out;">
        <span style="font-size:2rem;">👤</span>
      </div>
      <p style="font-weight:600; color:#fff;">AI Optical Sensor Active</p>
      <p style="font-size:0.85rem; color:#94a3b8; max-width:280px; margin-top:4px;">Position face inside oval. Ready for biometric scan.</p>
    `;
  }
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(track => track.stop());
    state.cameraStream = null;
  }
}

// Real-time Canvas PPG Waveform Animation
let ppgAnimationId = null;
function startPpgSimulation() {
  const canvas = document.getElementById('ppg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;
  
  if (ppgAnimationId) cancelAnimationFrame(ppgAnimationId);

  function draw() {
    if (state.currentRoute !== 'scanner') return;
    
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = state.isScanning ? '#10b981' : '#00bcd4';
    
    const centerY = canvas.height / 2;
    const speed = state.isScanning ? 0.08 : 0.04;
    t += speed;
    
    for (let x = 0; x < canvas.width; x += 4) {
      const pos = (x * 0.04) - t;
      const y = centerY + Math.sin(pos) * 10 - Math.sin(pos * 2) * 5 + Math.sin(pos * 3) * 2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ppgAnimationId = requestAnimationFrame(draw);
  }
  draw();
}

// 30-Second Biometric Scan Logic
function triggerScan() {
  if (state.isScanning) return;

  state.isScanning = true;
  state.scanTimeLeft = 30;

  const oval = document.getElementById('face-oval');
  const scanLine = document.getElementById('scan-line');
  const timerDisplay = document.getElementById('scan-timer-display');
  const progressFill = document.getElementById('scan-progress-fill');
  const statusText = document.getElementById('scan-status-text');
  const btnStart = document.getElementById('btn-start-scan');
  const reportCard = document.getElementById('scan-report-card');

  if (oval) oval.classList.add('scanning');
  if (scanLine) scanLine.classList.add('active');
  if (reportCard) reportCard.style.display = 'none';
  if (btnStart) {
    btnStart.disabled = true;
    btnStart.innerHTML = `<span>Scanning (30s)…</span>`;
  }

  showToast('Scan initiated. Please hold still and look at the camera.', 'default');

  const phrases = [
    'Measuring micro-vascular pulse…',
    'Sampling heart rate variability…',
    'Analyzing autonomic balance…',
    'Evaluating arterial wave velocity…',
    'Synthesizing biometric profile…'
  ];

  clearInterval(state.scanTimer);
  state.scanTimer = setInterval(() => {
    state.scanTimeLeft--;
    const percent = Math.round(((30 - state.scanTimeLeft) / 30) * 100);

    if (timerDisplay) timerDisplay.textContent = `${state.scanTimeLeft}s`;
    if (progressFill) progressFill.style.width = `${percent}%`;

    const phraseIdx = Math.floor((30 - state.scanTimeLeft) / 6);
    if (statusText && phrases[phraseIdx]) {
      statusText.textContent = phrases[phraseIdx];
    }

    if (state.scanTimeLeft <= 0) {
      clearInterval(state.scanTimer);
      finishScan();
    }
  }, 1000);
}

function finishScan() {
  state.isScanning = false;
  const oval = document.getElementById('face-oval');
  const scanLine = document.getElementById('scan-line');
  const btnStart = document.getElementById('btn-start-scan');
  const statusText = document.getElementById('scan-status-text');
  const reportCard = document.getElementById('scan-report-card');
  const timestampEl = document.getElementById('report-timestamp');

  if (oval) oval.classList.remove('scanning');
  if (scanLine) scanLine.classList.remove('active');
  if (btnStart) {
    btnStart.disabled = false;
    btnStart.innerHTML = `<span>Scan Again</span>`;
  }
  if (statusText) statusText.textContent = 'Scan completed successfully';

  // Decrement free scan if available
  if (state.user) {
    if (state.user.freeScansRemaining > 0) {
      state.user.freeScansRemaining--;
    }
    
    // Save new record
    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    state.user.scans.unshift({
      id: `SC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: nowStr,
      wellnessScore: 88,
      bp: '118/78 mmHg',
      heartRate: '72 BPM',
      hrv: '48 ms',
      stress: '32 (Low)',
      status: 'Optimal'
    });
    saveUser();
    updateNavbar();
  }

  if (timestampEl) {
    timestampEl.textContent = `Generated on ${new Date().toLocaleTimeString('en-IN')}`;
  }
  if (reportCard) {
    reportCard.style.display = 'block';
    reportCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast('Scan complete! Your health report is ready.', 'success');
}

// Profile Page Renderer
function renderProfile() {
  const loggedInView = document.getElementById('profile-logged-in-view');
  if (loggedInView) loggedInView.style.display = 'block';

  const u = state.user || defaultUser;
  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const phoneEl = document.getElementById('profile-phone');
  const avatarEl = document.getElementById('profile-avatar');

  if (nameEl) nameEl.textContent = u.name || 'Maya';
  if (emailEl) emailEl.textContent = u.email || 'maya.demo@deephealthindia.io';
  if (phoneEl) phoneEl.textContent = u.phone || '+919369118779';
  if (avatarEl) avatarEl.textContent = (u.name || 'M')[0].toUpperCase();
}

function togglePwdVisibility(inputId) {
  const inp = document.getElementById(inputId);
  if (inp) {
    inp.type = inp.type === 'password' ? 'text' : 'password';
  }
}

// Checkout & Subscription Modal
function openCheckout(planName, price, scans) {
  state.currentSelectedPlan = { planName, price, scans };
  
  const modal = document.getElementById('checkout-modal');
  const nameEl = document.getElementById('modal-plan-name');
  const priceEl = document.getElementById('modal-plan-price');
  const scansEl = document.getElementById('modal-plan-scans');
  
  if (nameEl) nameEl.textContent = planName;
  if (priceEl) priceEl.textContent = `₹${price}`;
  if (scansEl) scansEl.textContent = `${scans} Scan(s) · Valid for ${scans === 1 ? '7' : '30'} Days`;

  updateCheckoutTotal();
  if (modal) modal.classList.add('active');
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

function updateCheckoutTotal() {
  if (!state.currentSelectedPlan) return;
  const usePointsCheckbox = document.getElementById('modal-use-points');
  const finalPriceEl = document.getElementById('modal-final-price');
  
  let finalPrice = state.currentSelectedPlan.price;
  const userPoints = state.user ? state.user.points : 0;
  
  if (usePointsCheckbox && usePointsCheckbox.checked && userPoints > 0) {
    const discount = Math.min(userPoints, Math.floor(finalPrice * 0.5));
    finalPrice -= discount;
  }

  if (finalPriceEl) finalPriceEl.textContent = `₹${Math.max(0, finalPrice)}`;
}

function processPayment() {
  if (!state.currentSelectedPlan) return;
  const plan = state.currentSelectedPlan;

  // Deduct points if checked
  const usePointsCheckbox = document.getElementById('modal-use-points');
  if (usePointsCheckbox && usePointsCheckbox.checked && state.user && state.user.points > 0) {
    const discount = Math.min(state.user.points, Math.floor(plan.price * 0.5));
    state.user.points -= discount;
  }

  // Add scans to user account
  if (state.user) {
    state.user.freeScansRemaining += plan.scans;
    saveUser();
    updateNavbar();
  }

  closeCheckout();
  showToast(`Payment successful! ${plan.scans} scan(s) added to your account.`, 'success');
  window.location.hash = '#home';
}

// User Actions
function logout() {
  if (state.user) {
    state.user.isLoggedIn = false;
    saveUser();
  }
  sessionStorage.removeItem('dh_session_active');
  updateNavbar();
  renderProfile();
  showToast('You have been signed out successfully.', 'default');
  window.location.hash = '#login';
}

function viewScanReport(scanId) {
  showToast(`Loading clinical report for Scan #${scanId}…`, 'default');
  window.location.hash = '#scanner';
}

// Form Handlers
function setupForms() {
  // Main Login Form
  const loginForm = document.getElementById('login-form');
  const toggleLoginPwd = document.getElementById('toggle-login-pwd');

  // Pre-fill dummy login credentials
  const emailInp = document.getElementById('login-email');
  const pwdInp = document.getElementById('login-password');
  if (emailInp && !emailInp.value) emailInp.value = 'maya.demo@deephealthindia.io';
  if (pwdInp && !pwdInp.value) pwdInp.value = 'f2a46be2';

  if (toggleLoginPwd) {
    toggleLoginPwd.addEventListener('click', () => {
      const pwdInp = document.getElementById('login-password');
      if (pwdInp) {
        pwdInp.type = pwdInp.type === 'password' ? 'text' : 'password';
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!email || !password) {
        showToast('Please enter both email and password.', 'error');
        return;
      }

      if (state.user) {
        state.user.isLoggedIn = true;
        if (email.includes('@')) state.user.email = email;
        saveUser();
      }
      sessionStorage.setItem('dh_session_active', '1');
      updateNavbar();
      renderProfile();
      showToast(`Welcome back, ${state.user.name}!`, 'success');
      window.location.hash = '#home';
    });
  }

  // Main Register Form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pwd = document.getElementById('reg-password').value;
      const confirmPwd = document.getElementById('reg-confirm-password').value;
      const ref = document.getElementById('reg-referral').value.trim();

      if (pwd !== confirmPwd) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        showToast('Please enter a valid 10-digit Indian mobile number.', 'error');
        return;
      }

      state.user = {
        name: name || 'New Member',
        email: email,
        phone: `+91${phone}`,
        referralCode: ref || 'DH' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        points: 25,
        freeScansRemaining: 1,
        isLoggedIn: true,
        scans: []
      };
      sessionStorage.setItem('dh_session_active', '1');
      saveUser();
      updateNavbar();
      renderProfile();

      showToast('Account created! 1 Free Scan & 25 Points added.', 'success');
      window.location.hash = '#home';
    });
  }

  // Forgot Password Form
  const forgotForm = document.getElementById('forgot-form');
  const forgotAlert = document.getElementById('forgot-alert');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (forgotAlert) forgotAlert.style.display = 'block';
      showToast('A temporary password has been sent to your email.', 'success');
    });
  }

  // Copy Referral Button
  const btnCopyRef = document.getElementById('btn-copy-referral');
  if (btnCopyRef) {
    btnCopyRef.addEventListener('click', () => {
      const code = state.user ? state.user.referralCode : 'DHP6LDPD';
      const url = `https://deephealthindia.io/register?ref=${code}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast(`Referral link copied: ${url}`, 'success');
        });
      } else {
        showToast(`Referral Code: ${code}`, 'success');
      }
    });
  }

  // Scanner Actions
  const btnStartScan = document.getElementById('btn-start-scan');
  if (btnStartScan) {
    btnStartScan.addEventListener('click', triggerScan);
  }

  const btnToggleCamera = document.getElementById('btn-toggle-camera');
  if (btnToggleCamera) {
    btnToggleCamera.addEventListener('click', startCamera);
  }

  // Download PDF Report
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      window.print();
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent to our team.', 'success');
      contactForm.reset();
    });
  }
}

// Global Exposes for inline HTML handlers
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.updateCheckoutTotal = updateCheckoutTotal;
window.processPayment = processPayment;
window.logout = logout;
window.viewScanReport = viewScanReport;
window.togglePwdVisibility = togglePwdVisibility;

// Initialize on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  initAppState();
  setupForms();
  handleRoute();
});

window.addEventListener('hashchange', handleRoute);
