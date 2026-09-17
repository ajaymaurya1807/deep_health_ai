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
  isLoggedIn: true,
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
  currentRoute: 'home',
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
        saveUser();
      }
    } else {
      state.user = { ...defaultUser };
      saveUser();
    }
  } catch (e) {
    state.user = { ...defaultUser };
  }
}

function saveUser() {
  try {
    localStorage.setItem('dh_user', JSON.stringify(state.user));
  } catch (e) {}
}

// Toast System
function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Router
function handleRoute() {
  const hash = window.location.hash.slice(1).toLowerCase() || 'home';
  const validRoutes = ['home', 'scanner', 'pricing', 'login', 'register', 'forgot-password', 'profile', 'about', 'contact'];
  const route = validRoutes.includes(hash) ? hash : 'home';
  state.currentRoute = route;

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

// Profile Page Dual-State Renderer
function renderProfile() {
  const loggedInView = document.getElementById('profile-logged-in-view');
  const loggedOutView = document.getElementById('profile-logged-out-view');

  if (state.user && state.user.isLoggedIn) {
    if (loggedInView) loggedInView.style.display = 'block';
    if (loggedOutView) loggedOutView.style.display = 'none';

    const u = state.user;
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const phoneEl = document.getElementById('profile-phone');
    const avatarEl = document.getElementById('profile-avatar');
    const scansLeftEl = document.getElementById('profile-scans-left');
    const pointsEl = document.getElementById('profile-points');
    const refCodeEl = document.getElementById('profile-ref-code');
    const historyContainer = document.getElementById('scan-history-list');

    if (nameEl) nameEl.textContent = u.name;
    if (emailEl) emailEl.textContent = u.email;
    if (phoneEl) phoneEl.textContent = u.phone;
    if (avatarEl) avatarEl.textContent = (u.name || 'M')[0].toUpperCase();
    if (scansLeftEl) scansLeftEl.textContent = u.freeScansRemaining;
    if (pointsEl) pointsEl.textContent = u.points;
    if (refCodeEl) refCodeEl.textContent = u.referralCode;

    if (historyContainer) {
      if (u.scans && u.scans.length > 0) {
        historyContainer.innerHTML = u.scans.map(s => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid var(--border-color); flex-wrap:wrap; gap:10px;">
            <div>
              <div style="font-weight:700; color:var(--primary); font-size:1rem;">Scan #${s.id} · Score: <span style="color:#059669;">${s.wellnessScore}/100</span></div>
              <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:3px;">
                ${s.date} • BP: ${s.bp} • Pulse: ${s.heartRate} • HRV: ${s.hrv}
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="viewScanReport('${s.id}')">View Report</button>
          </div>
        `).join('');
      } else {
        historyContainer.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9rem;">No previous scans recorded yet. Start your first scan above!</p>`;
      }
    }
  } else {
    // Show logged-out view with Sign In / Create Account tabs right on Profile
    if (loggedInView) loggedInView.style.display = 'none';
    if (loggedOutView) loggedOutView.style.display = 'block';
  }
}

// Switch between Sign In and Create Account on Profile
function switchProfileAuth(mode) {
  const signinBtn = document.getElementById('profile-tab-signin-btn');
  const registerBtn = document.getElementById('profile-tab-register-btn');
  const signinPanel = document.getElementById('profile-signin-subpanel');
  const registerPanel = document.getElementById('profile-register-subpanel');

  if (mode === 'signin') {
    if (signinBtn) signinBtn.classList.add('active');
    if (registerBtn) registerBtn.classList.remove('active');
    if (signinPanel) signinPanel.style.display = 'block';
    if (registerPanel) registerPanel.style.display = 'none';
  } else {
    if (signinBtn) signinBtn.classList.remove('active');
    if (registerBtn) registerBtn.classList.add('active');
    if (signinPanel) signinPanel.style.display = 'none';
    if (registerPanel) registerPanel.style.display = 'block';
  }
}

function quickFillMaya() {
  const emailInp = document.getElementById('prof-login-email');
  const pwdInp = document.getElementById('prof-login-password');
  if (emailInp) emailInp.value = 'maya.demo@deephealthindia.io';
  if (pwdInp) pwdInp.value = 'f2a46be2';
  showToast('Credentials filled for Maya', 'default');
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
  updateNavbar();
  renderProfile();
  showToast('You have been signed out successfully.', 'default');
  window.location.hash = '#profile';
}

function viewScanReport(scanId) {
  showToast(`Loading clinical report for Scan #${scanId}…`, 'default');
  window.location.hash = '#scanner';
}

// Form Handlers
function setupForms() {
  // Embedded Profile Login Form
  const profLoginForm = document.getElementById('profile-sub-login-form');
  if (profLoginForm) {
    profLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('prof-login-email').value.trim();
      const password = document.getElementById('prof-login-password').value.trim();

      if (!email || !password) {
        showToast('Please enter email and password.', 'error');
        return;
      }

      state.user = {
        ...defaultUser,
        email: email.includes('@') ? email : 'maya.demo@deephealthindia.io',
        isLoggedIn: true
      };
      saveUser();
      updateNavbar();
      renderProfile();
      showToast(`Welcome back, ${state.user.name}!`, 'success');
    });
  }

  // Embedded Profile Register Form
  const profRegForm = document.getElementById('profile-sub-register-form');
  if (profRegForm) {
    profRegForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prof-reg-name').value.trim();
      const phone = document.getElementById('prof-reg-phone').value.trim();
      const email = document.getElementById('prof-reg-email').value.trim();
      const pwd = document.getElementById('prof-reg-password').value;
      const ref = document.getElementById('prof-reg-ref').value.trim();

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
      saveUser();
      updateNavbar();
      renderProfile();

      showToast('Account created! 1 Free Scan & 25 Points added.', 'success');
    });
  }

  // Main Login Form
  const loginForm = document.getElementById('login-form');
  const toggleLoginPwd = document.getElementById('toggle-login-pwd');

  // Pre-fill dummy login credentials
  const emailInp = document.getElementById('login-email');
  const pwdInp = document.getElementById('login-password');
  if (emailInp && !emailInp.value) emailInp.value = 'maya.demo@deephealthindia.io';
  if (pwdInp && !pwdInp.value) pwdInp.value = 'f2a46be2';

  const profEmailInp = document.getElementById('prof-login-email');
  const profPwdInp = document.getElementById('prof-login-password');
  if (profEmailInp && !profEmailInp.value) profEmailInp.value = 'maya.demo@deephealthindia.io';
  if (profPwdInp && !profPwdInp.value) profPwdInp.value = 'f2a46be2';

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
      updateNavbar();
      renderProfile();
      showToast(`Welcome back, ${state.user.name}!`, 'success');
      window.location.hash = '#profile';
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
      saveUser();
      updateNavbar();
      renderProfile();

      showToast('Account created! 1 Free Scan & 25 Points added.', 'success');
      window.location.hash = '#profile';
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
window.switchProfileAuth = switchProfileAuth;
window.quickFillMaya = quickFillMaya;
window.togglePwdVisibility = togglePwdVisibility;

// Initialize on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  initAppState();
  setupForms();
  handleRoute();
});

window.addEventListener('hashchange', handleRoute);
