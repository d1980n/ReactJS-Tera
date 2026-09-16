import './style.css'

// --- CONFIG ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-tera.smartsystem.id';

// --- STATE ---
interface Device {
  id: string;
  uuid: string;
  name: string;
  color: string;
  status: 'online' | 'offline';
}

let devices: Device[] = [
  { id: '1', uuid: '123e4567-e89b-12d3-a456-426614174001', name: 'TERA-001', color: '#2563eb', status: 'online' },
  { id: '2', uuid: '123e4567-e89b-12d3-a456-426614174002', name: 'TERA-002', color: '#d97706', status: 'online' },
  { id: '3', uuid: '123e4567-e89b-12d3-a456-426614174003', name: 'TERA-003', color: '#db2777', status: 'online' },
  { id: '4', uuid: '123e4567-e89b-12d3-a456-426614174004', name: 'TERA-004', color: '#475569', status: 'offline' },
  { id: '5', uuid: '123e4567-e89b-12d3-a456-426614174005', name: 'TERA-005', color: '#475569', status: 'offline' },
  { id: '6', uuid: '123e4567-e89b-12d3-a456-426614174006', name: 'TERA-006', color: '#475569', status: 'offline' },
  { id: '7', uuid: '123e4567-e89b-12d3-a456-426614174007', name: 'TERA-007', color: '#475569', status: 'offline' },
  { id: '8', uuid: '123e4567-e89b-12d3-a456-426614174008', name: 'TERA-008', color: '#475569', status: 'offline' },
  { id: '9', uuid: '123e4567-e89b-12d3-a456-426614174009', name: 'TERA-009', color: '#475569', status: 'offline' },
  { id: '10', uuid: '123e4567-e89b-12d3-a456-426614174010', name: 'TERA-010', color: '#475569', status: 'offline' }
];

let currentDevicePage = 1;
const devicesPerPage = 6;

let currentLogPage = 1;
const logsPerPage = 6;

const topImages = [
  'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503454537195-1dc534b25fc5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=400&fit=crop'
];

const sideImages = [
  'https://images.unsplash.com/photo-1555252834-01007cb48123?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544281679-6b3a2ce65158?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1457140880126-11116c276326?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506085523414-99884cdfa0a4?w=400&h=400&fit=crop'
];

const faceImages = [
  'https://images.unsplash.com/photo-1522771930-78848d926053?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1604145663737-25e2db89f244?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1433832597046-4f10e10ac080?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1491013516836-7dbf43681043?w=400&h=400&fit=crop'
];

const locations = ['Posyandu Melati', 'Posyandu Mawar', 'Puskesmas Cempaka', 'Klinik Sejahtera', 'RSUD Bunda'];

const baseDate = new Date();

// Generate 20 log entries to show more data, spanning recent days
const logs = Array.from({ length: 20 }, (_, i) => {
  const deviceIndex = i % 3; // Cycle through TERA-001, 002, 003
  const deviceNames = ['TERA-001', 'TERA-002', 'TERA-003'];
  
  const daysOffset = Math.floor(i / 5); // Groups of 5 items per day starting from today backwards
  const logDate = new Date(baseDate);
  logDate.setDate(logDate.getDate() - daysOffset);

  const h = 8 + (i % 8);
  const m = (10 + (i * 12)) % 60;
  const s = (i * 17) % 60;
  
  const paddedY = logDate.getFullYear();
  const paddedMon = (logDate.getMonth() + 1).toString().padStart(2, '0');
  const paddedD = logDate.getDate().toString().padStart(2, '0');
  const paddedH = h.toString().padStart(2, '0');
  const paddedM = m.toString().padStart(2, '0');
  const paddedS = s.toString().padStart(2, '0');

  // Randomize characteristics
  const weight = (3.5 + (i * 0.4) % 4).toFixed(1);
  const height = (50 + (i * 1.5) % 25).toFixed(1);
  const hex = 'E200001D4811' + (1000 + i).toString();

  return {
    time: `${paddedY}-${paddedMon}-${paddedD} ${paddedH}:${paddedM}:${paddedS}`,
    deviceId: deviceNames[deviceIndex],
    deviceLoc: locations[i % locations.length],
    rfid: hex,
    weight: parseFloat(weight),
    height: parseFloat(height),
    cam1: topImages[i % topImages.length],
    cam2: sideImages[i % sideImages.length],
    cam3: faceImages[i % faceImages.length]
  };
});

// Sort logs by time descending
logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

let selectedFilter = 'Semua Timbangan';

// Filter Date State
let selectedDateFilterType = 'today'; // 'today' | 'range'
let filterStartDate = '';
let filterEndDate = '';


function renderLogin() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
    <div class="login-page mounted">
      <div class="login-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>

      <div class="login-card">
        <div class="login-branding">
          <div class="branding-content">
            <div class="branding-logo-wrapper">
              <img src="/logo-tera.png" alt="TERA Logo" class="branding-logo" />
            </div>
            <h1 class="branding-title">TERA SYSTEM</h1>
            <p class="branding-subtitle" style="font-size: 1.1rem; margin-top: -5px; opacity: 0.9;">Tera - Portal management</p>
            <div class="branding-divider"></div>
            <p class="branding-desc">
              Portal administrasi untuk konfigurasi dan melihat riwayat log pengukuran dari perangkat timbangan elektronik ramah anak (TERA).
            </p>
            <div class="branding-features">
              <div class="feature-item">
                <i class="ri-scales-3-line"></i>
                <span>Timbangan IoT</span>
              </div>
              <div class="feature-item">
                <i class="ri-camera-lens-line"></i>
                <span>Integrasi Kamera ESP32</span>
              </div>
              <div class="feature-item">
                <i class="ri-rfid-line"></i>
                <span>Pemindaian RFID</span>
              </div>
            </div>
          </div>
          <div class="branding-footer">
            <p>© 2026 TERA System</p>
          </div>
        </div>

        <div class="login-form-panel">
          <div class="form-content">
            <div class="form-header">
              <div class="mobile-logo">
                <img src="/logo-tera.png" alt="TERA" class="mobile-logo-img" />
                <span class="mobile-logo-text">TERA</span>
              </div>
              <h2>Selamat Datang!</h2>
              <p>Masuk ke portal admin TERA</p>
            </div>

            <div id="loginError" class="alert alert-error" style="display: none;">
              <i class="ri-error-warning-line"></i>
              <span id="loginErrorText"></span>
            </div>

            <form id="loginForm">
              <div class="input-group">
                <label for="email">
                  <i class="ri-mail-line"></i>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  autocomplete="email"
                  required
                />
              </div>

              <div class="input-group">
                <label for="password">
                  <i class="ri-lock-line"></i>
                  Password
                </label>
                <div class="password-wrapper">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    autocomplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    class="toggle-password"
                    id="togglePassword"
                    tabindex="-1"
                  >
                    <i class="ri-eye-line" id="togglePasswordIcon"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="login-submit-btn" id="submitBtn">
                <span class="btn-content" id="submitBtnContent">
                  <i class="ri-login-box-line"></i>
                  <span>Masuk</span>
                </span>
                <span class="spinner-wrapper" id="submitSpinner" style="display: none;">
                  <span class="spinner"></span>
                  <span>Masuk...</span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('loginForm') as HTMLFormElement;
  const errorAlert = document.getElementById('loginError') as HTMLDivElement;
  const errorText = document.getElementById('loginErrorText') as HTMLSpanElement;
  const togglePwdBtn = document.getElementById('togglePassword') as HTMLButtonElement;
  const pwdInput = document.getElementById('password') as HTMLInputElement;
  const togglePwdIcon = document.getElementById('togglePasswordIcon') as HTMLElement;
  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  const submitBtnContent = document.getElementById('submitBtnContent') as HTMLSpanElement;
  const submitSpinner = document.getElementById('submitSpinner') as HTMLSpanElement;

  togglePwdBtn.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      togglePwdIcon.className = 'ri-eye-off-line';
    } else {
      pwdInput.type = 'password';
      togglePwdIcon.className = 'ri-eye-line';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';
    
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = pwdInput.value;

    submitBtn.disabled = true;
    submitBtnContent.style.display = 'none';
    submitSpinner.style.display = 'flex';

    setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('tera_logged_in', 'true');
          if (data.nama) sessionStorage.setItem('tera_user_name', data.nama);
          if (data.role) sessionStorage.setItem('tera_user_role', data.role);
          renderDashboard();
        } else {
          errorText.textContent = 'email atau password salah';
          errorAlert.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtnContent.style.display = 'flex';
          submitSpinner.style.display = 'none';
        }
      } catch (error) {
          errorText.textContent = 'Gagal terhubung ke server';
          errorAlert.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtnContent.style.display = 'flex';
          submitSpinner.style.display = 'none';
      }
    }, 500);
  });
}

function renderDashboard() {
  const userName = sessionStorage.getItem('tera_user_name') || 'Admin Tera';
  const userRole = sessionStorage.getItem('tera_user_role') || 'Administrator';

  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-header" style="height: auto; padding: 20px 16px;">
          <div class="logo-icon"><img src="/logo-tera.png" alt="Tera Logo" style="width: 32px; height: 32px; object-fit: contain;" /></div>
          <div class="logo-text">
            <h1 style="font-size: 1.2rem; margin-bottom: 2px;">Tera</h1>
            <p style="font-size: 10px; line-height: 1.3; color: var(--text-secondary); font-weight: 500;">
              Portal management
            </p>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <a href="#" class="nav-item active" id="nav-home">
            <i class="ri-home-line"></i> Home
          </a>
          <a href="#" class="nav-item" id="nav-log">
            <i class="ri-file-list-3-line"></i> Show Log
          </a>
        </nav>
      </aside>
      
      <main class="main-wrapper">
        <header class="topbar">
          <div class="topbar-left">
            <button class="mobile-menu-btn"><i class="ri-menu-line"></i></button>
            <div class="search-box" style="visibility: hidden;">
              <i class="ri-search-line search-icon"></i>
              <input type="text" placeholder="Cari..." />
            </div>
          </div>
          <div class="topbar-right">
            <div class="user-profile">
              <div class="avatar"><i class="ri-user-smile-line"></i></div>
              <div class="user-info">
                <span class="user-name">${userName}</span>
                <span class="user-role" style="text-transform: capitalize;">${userRole}</span>
              </div>
            </div>
            <button class="logout-btn" id="logoutBtn" title="Keluar">
              <i class="ri-shut-down-line"></i>
            </button>
          </div>
        </header>
        
        <div class="content-body" id="dashboard-content">
          <!-- Content injected here -->
        </div>
      </main>
    </div>

    <!-- Image Modal -->
    <div id="imageModal" style="display: none; position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.8); align-items: center; justify-content: center; padding: 20px;">
        <div style="position: relative; max-width: 90%; max-height: 90%; background: #1e293b; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
            <button id="closeModalBtn" style="position: absolute; top: -15px; right: -15px; width: 36px; height: 36px; border-radius: 50%; background: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <i class="ri-close-line"></i>
            </button>
            <div style="display: flex; justify-content: space-between; color: white; padding: 0 8px;">
                <span style="font-weight: 600; font-size: 14px;" id="modalCameraName">Kamera ESP32</span>
                <span style="font-size: 13px; color: #94a3b8;" id="modalTimestamp"></span>
            </div>
            <img id="modalImg" src="" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px;" />
        </div>
    </div>

    <!-- Device Modal -->
    <div id="deviceModal" style="display: none; position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; padding: 20px;">
      <div style="background: white; border-radius: 12px; width: 400px; max-width: 100%; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
        <h3 id="deviceModalTitle" style="margin-top: 0; margin-bottom: 20px;">Tambah Perangkat Baru</h3>
        <input type="hidden" id="deviceIdInput" />
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">UUID Perangkat</label>
          <input type="text" id="deviceUuidInput" placeholder="Misal: 123e4567-e89b-..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Nama Perangkat</label>
          <input type="text" id="deviceNameInput" placeholder="Misal: TERA-004" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Warna Label</label>
          <input type="color" id="deviceColorInput" value="#3b82f6" style="width: 100%; height: 40px; padding: 2px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="closeDeviceModalBtn" style="padding: 10px 16px; border: 1px solid #cbd5e1; background: white; border-radius: 6px; cursor: pointer; font-weight: 600;">Batal</button>
          <button id="saveDeviceBtn" style="padding: 10px 16px; border: none; background: var(--primary-color); color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">Simpan</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('logoutBtn')!.addEventListener('click', () => {
    sessionStorage.removeItem('tera_logged_in');
    renderLogin();
  });

  const navHome = document.getElementById('nav-home')!;
  const navLog = document.getElementById('nav-log')!;
  
  navHome.addEventListener('click', (e) => {
    e.preventDefault();
    navHome.classList.add('active');
    navLog.classList.remove('active');
    renderHome();
  });

  navLog.addEventListener('click', (e) => {
    e.preventDefault();
    navLog.classList.add('active');
    navHome.classList.remove('active');
    renderLog();
  });

  // Modal logic
  document.getElementById('closeModalBtn')!.addEventListener('click', () => {
    document.getElementById('imageModal')!.style.display = 'none';
  });
  
  document.getElementById('imageModal')!.addEventListener('click', (e) => {
    if (e.target === document.getElementById('imageModal')) {
        document.getElementById('imageModal')!.style.display = 'none';
    }
  });

  // Device Modal Logic
  document.getElementById('closeDeviceModalBtn')!.addEventListener('click', () => {
    document.getElementById('deviceModal')!.style.display = 'none';
  });

  document.getElementById('saveDeviceBtn')!.addEventListener('click', () => {
    const id = (document.getElementById('deviceIdInput') as HTMLInputElement).value;
    const uuid = (document.getElementById('deviceUuidInput') as HTMLInputElement).value;
    const name = (document.getElementById('deviceNameInput') as HTMLInputElement).value;
    const color = (document.getElementById('deviceColorInput') as HTMLInputElement).value;

    if (!uuid || !name) {
      alert("UUID dan Nama Perangkat harus diisi!");
      return;
    }

    if (id) {
      // Edit
      const device = devices.find(d => d.id === id);
      if (device) {
        device.uuid = uuid;
        device.name = name;
        device.color = color;
      }
    } else {
      // Add
      devices.push({
        id: Date.now().toString(),
        uuid,
        name,
        color,
        status: 'offline'
      });
    }

    document.getElementById('deviceModal')!.style.display = 'none';
    renderHome();
  });

  renderHome();
}

function renderHome() {
  const content = document.getElementById('dashboard-content')!;
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  
  const totalPages = Math.ceil(devices.length / devicesPerPage);
  if (currentDevicePage > totalPages && totalPages > 0) currentDevicePage = totalPages;
  if (currentDevicePage < 1) currentDevicePage = 1;

  const startIndex = (currentDevicePage - 1) * devicesPerPage;
  const currentDevices = devices.slice(startIndex, startIndex + devicesPerPage);

  let deviceRows = '';
  currentDevices.forEach(d => {
    deviceRows += `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
          <div style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${d.color};"></div>
            ${d.name}
          </div>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #64748b; font-size: 12px;">
          ${d.uuid}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
          ${d.status === 'online' 
            ? '<span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;"><i class="ri-wifi-line"></i> Online</span>'
            : '<span style="background: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;"><i class="ri-wifi-off-line"></i> Offline</span>'
          }
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right;">
          <button onclick="window.editDevice('${d.id}')" style="background: transparent; border: none; color: #3b82f6; cursor: pointer; margin-right: 8px;" title="Edit"><i class="ri-pencil-line"></i></button>
          <button onclick="window.deleteDevice('${d.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer;" title="Hapus"><i class="ri-delete-bin-line"></i></button>
        </td>
      </tr>
    `;
  });

  let paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml += '<div style="display: flex; justify-content: flex-end; align-items: center; gap: 6px; margin-top: 16px;">';
    paginationHtml += `<button onclick="window.changeDevicePage(${currentDevicePage - 1})" ${currentDevicePage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} class="btn-page" style="padding: 6px 8px; background: white; border: 1px solid #cbd5e1; border-radius: 6px;"><i class="ri-arrow-left-s-line"></i></button>`;
    
    for (let i = 1; i <= totalPages; i++) {
       const activeStyle = i === currentDevicePage ? 'background: var(--primary-color); color: white; border: 1px solid var(--primary-color);' : 'background: white; color: var(--text-primary); border: 1px solid #cbd5e1;';
       paginationHtml += `<button onclick="window.changeDevicePage(${i})" style="width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-weight: 600; ${activeStyle}">${i}</button>`;
    }

    paginationHtml += `<button onclick="window.changeDevicePage(${currentDevicePage + 1})" ${currentDevicePage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} class="btn-page" style="padding: 6px 8px; background: white; border: 1px solid #cbd5e1; border-radius: 6px;"><i class="ri-arrow-right-s-line"></i></button>`;
    paginationHtml += '</div>';
  }

  content.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h2>Beranda TERA</h2>
        <p>Tera - Portal management</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--primary-light); color: var(--primary-color);">
          <i class="ri-router-line"></i>
        </div>
        <div class="stat-info">
          <h3>Perangkat Aktif</h3>
          <p class="stat-value">${onlineCount} Unit</p>
          <span class="stat-trend trend-up"><i class="ri-check-line"></i> Online</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #f1f5f9; color: #64748b;">
          <i class="ri-router-line"></i>
        </div>
        <div class="stat-info">
          <h3>Perangkat Nonaktif</h3>
          <p class="stat-value">${offlineCount} Unit</p>
          <span class="stat-trend" style="color: #64748b;"><i class="ri-wifi-off-line"></i> Offline</span>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 24px; background: white; border-radius: 16px; border: 1px solid var(--border-color); padding: 20px;">
       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
         <h3 style="margin: 0;">Manajemen Perangkat TERA</h3>
         <button onclick="window.addDevice()" style="background: var(--primary-color); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 6px;">
           <i class="ri-add-line"></i> Tambah Perangkat
         </button>
       </div>
       <div style="overflow-x: auto;">
         <table style="width: 100%; border-collapse: collapse; text-align: left;">
           <thead>
             <tr>
               <th style="padding: 12px 16px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Nama Perangkat</th>
               <th style="padding: 12px 16px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">UUID</th>
               <th style="padding: 12px 16px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Status</th>
               <th style="padding: 12px 16px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; text-align: right;">Aksi</th>
             </tr>
           </thead>
           <tbody>
             ${deviceRows}
           </tbody>
         </table>
       </div>
       ${paginationHtml}
    </div>
  `;
}

// Global functions for Home CRUD
(window as any).changeDevicePage = (page: number) => {
  currentDevicePage = page;
  renderHome();
};

(window as any).changeLogPage = (page: number) => {
  currentLogPage = page;
  renderLog();
};

let cachedTotal = 0;

async function renderLog() {
  const content = document.getElementById('dashboard-content')!;
  
  content.innerHTML = '<div style="padding: 40px; text-align: center; color: #64748b;"><i class="ri-loader-4-line ri-spin" style="font-size: 24px;"></i><p>Memuat data...</p></div>';
  
  let currentLogs: any[] = [];
  try {
    const params = new URLSearchParams();
    if (selectedFilter !== 'Semua Timbangan') params.append('deviceId', selectedFilter);
    if (selectedDateFilterType === 'today') {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      params.append('startDate', today);
      params.append('endDate', today);
    } else if (selectedDateFilterType === 'range' && filterStartDate && filterEndDate) {
      params.append('startDate', filterStartDate);
      params.append('endDate', filterEndDate);
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/logs/${currentLogPage}${qs}`);
    
    if (response.ok) {
      const resData = await response.json();
      const data = resData.data || [];
      cachedTotal = resData.total || 0;
      
      currentLogs = data.map((l: any) => {
        let dateStr = '';
        if (l.timestamp) {
           const ts = l.timestamp < 1e11 ? l.timestamp * 1000 : l.timestamp;
           const d = new Date(ts);
           const pad = (n: number) => n.toString().padStart(2, '0');
           dateStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        }
        return {
          time: dateStr || 'N/A',
          deviceId: l.device_info?.name || 'Unknown',
          deviceLoc: l.device_info?.lokasi || 'Unknown Location',
          rfid: l.rfid || '-',
          weight: l.weight || 0,
          height: l.height || 0,
          cam1: l.pict1 || '',
          cam2: l.pict2 || '',
          cam3: l.pict3 || '',
          cam1_box: l.derivatif_info?.pict1_box || '',
          cam2_box: l.derivatif_info?.pict2_box || '',
          cam3_box: l.derivatif_info?.pict3_box || '',
          height1_box: l.derivatif_info?.height1_box || 0,
          height2_box: l.derivatif_info?.height2_box || 0,
          height3_box: l.derivatif_info?.height3_box || 0,
          bmi_desc: l.derivatif_info?.bmi_desc || '',
          bmi_val: l.derivatif_info?.bmi_val || 0
        };
      });
    }
  } catch(e) {
    console.error('Failed to fetch logs:', e);
    content.innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;"><i class="ri-error-warning-line" style="font-size: 24px;"></i><p>Gagal memuat data log.</p></div>';
    return;
  }

  const totalPages = Math.ceil(cachedTotal / logsPerPage);
  
  if (currentLogPage > totalPages && totalPages > 0) {
      currentLogPage = totalPages;
      renderLog();
      return;
  }
  if (currentLogPage < 1) currentLogPage = 1;

  let tbodyHtml = '';
  if (currentLogs.length === 0) {
    tbodyHtml = '<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 24px;">Tidak ada data log pada rentang ini.</td></tr>';
  } else {
    currentLogs.forEach((log) => {
        // Custom color per device based on static device list if found
        const deviceMatch = devices.find(d => d.name === log.deviceId);
        const color = deviceMatch ? deviceMatch.color : '#475569';
        const deviceStyle = `background: ${color}20; color: ${color};`;

        let bmiHtml = '<span style="color: #64748b;">-</span>';
        if (log.bmi_val > 0 || log.bmi_desc !== '-') {
            let classColor = '#64748b';
            let classification = log.bmi_desc;
            
            let c = classification.replace(/\s+/g, '');
            if (c === 'z=0' || c === '-1<z<0' || c === '0<z<1') {
                classColor = '#16a34a'; // Hijau
            } else if (c === 'z=1' || c === 'z=-1' || c === '-2<z<-1' || c === '1<z<2') {
                classColor = '#eab308'; // Kuning
            } else if (c === 'z=2' || c === 'z=-2' || c === '-3<z<-2' || c === '2<z<3') {
                classColor = '#ef4444'; // Merah
            } else if (c === 'z=3' || c === 'z=-3' || c === 'z>3' || c === 'z<-3') {
                classColor = '#7f1d1d'; // Merah Gelap
            } else if (classification === 'Normal') classColor = '#16a34a';
            else if (classification === 'Kurang') classColor = '#eab308';
            else if (classification === 'Berlebih') classColor = '#f97316';
            else if (classification.includes('Obese')) classColor = '#ef4444';

            let displayClassification = classification.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            bmiHtml = `
              <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${log.bmi_val} %</div>
              <div style="font-size: 11px; font-weight: 600; color: ${classColor};">${displayClassification}</div>
            `;
        }

        tbodyHtml += `
          <tr>
            <td>
               <div style="font-weight: 500; color: var(--text-primary); font-size: 13px;">${log.time.split(' ')[1]}</div>
               <div style="font-size: 11px; color: var(--text-muted);">${log.time.split(' ')[0]}</div>
            </td>
            <td>
               <div style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; ${deviceStyle} margin-bottom: 4px;">
                 <i class="ri-router-line"></i> ${log.deviceId}
               </div>
               <div style="font-size: 12px; color: var(--text-secondary);"><i class="ri-map-pin-line"></i> ${log.deviceLoc}</div>
            </td>
            <td>
               <div style="font-family: monospace; background: #f8fafc; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
                 <i class="ri-rfid-line"></i> ${log.rfid}
               </div>
            </td>
            <td>
               <div style="font-size: 14px; font-weight: 600; color: var(--primary-color);">${log.weight} <span style="font-size: 11px; font-weight: 400; color: var(--text-secondary);">kg</span></div>
            </td>
            <td>
               <div style="font-size: 14px; font-weight: 600; color: #0284c7;">${log.height} <span style="font-size: 11px; font-weight: 400; color: var(--text-secondary);">cm</span></div>
            </td>
            <td>
               ${bmiHtml}
            </td>
             <td>
               <div style="display: flex; gap: 6px; align-items: center;">
                  <div style="position: relative; width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer;" onclick="window.viewImage('${log.cam1}', 'ESP32 Cam 1 (Atas)', '${log.time}')" title="Cam 1 (Atas)">
                     <img src="${log.cam1}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWk0xMiAxNEM5LjMzIDE0IDQgMTUuMzQgNCAxOFYyMEgyMFYxOEMyMCAxNS4zNCAxNC42NyAxNCAxMiAxNFoiLz48L3N2Zz4=';" />
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 1px 0;">C1</div>
                  </div>
                  <div style="position: relative; width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer;" onclick="window.viewImage('${log.cam2}', 'ESP32 Cam 2 (Samping)', '${log.time}')" title="Cam 2 (Samping)">
                     <img src="${log.cam2}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWk0xMiAxNEM5LjMzIDE0IDQgMTUuMzQgNCAxOFYyMEgyMFYxOEMyMCAxNS4zNCAxNC42NyAxNCAxMiAxNFoiLz48L3N2Zz4=';" />
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 1px 0;">C2</div>
                  </div>
                  <div style="position: relative; width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer;" onclick="window.viewImage('${log.cam3}', 'ESP32 Cam 3 (Wajah)', '${log.time}')" title="Cam 3 (Wajah)">
                     <img src="${log.cam3}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWk0xMiAxNEM5LjMzIDE0IDQgMTUuMzQgNCAxOFYyMEgyMFYxOEMyMCAxNS4zNCAxNC42NyAxNCAxMiAxNFoiLz48L3N2Zz4=';" />
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 1px 0;">C3</div>
                  </div>
               </div>
            </td>
            <td>
               <div style="display: flex; gap: 6px; align-items: center;">
                  ${log.cam1_box ? 
                  `<div style="position: relative; width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 2px solid #eab308; cursor: pointer;" onclick="window.viewImage('${log.cam1_box}', '<span style=\\'font-family: Arial; font-weight: bold; font-size: 12px;\\'>tinggibadan sesuai BOX ${log.height1_box}cm</span>', '')" title="Box 1">
                     <img src="${log.cam1_box}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWk0xMiAxNEM5LjMzIDE0IDQgMTUuMzQgNCAxOFYyMEgyMFYxOEMyMCAxNS4zNCAxNC42NyAxNCAxMiAxNFoiLz48L3N2Zz4=';" />
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 1px 0;">B1</div>
                  </div>` :
                  `<div style="width: 44px; height: 44px; border-radius: 6px; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #cbd5e1;" title="Loading...">
                     <i class="ri-loader-4-line ri-spin" style="font-size: 18px;"></i>
                  </div>`
                  }
                  ${log.cam2_box ? 
                  `<div style="position: relative; width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 2px solid #eab308; cursor: pointer;" onclick="window.viewImage('${log.cam2_box}', '<span style=\\'font-family: Arial; font-weight: bold; font-size: 12px;\\'>tinggibadan sesuai BOX ${log.height2_box}cm</span>', '')" title="Box 2">
                     <img src="${log.cam2_box}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWk0xMiAxNEM5LjMzIDE0IDQgMTUuMzQgNCAxOFYyMEgyMFYxOEMyMCAxNS4zNCAxNC42NyAxNCAxMiAxNFoiLz48L3N2Zz4=';" />
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 1px 0;">B2</div>
                  </div>` :
                  `<div style="width: 44px; height: 44px; border-radius: 6px; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #cbd5e1;" title="Loading...">
                     <i class="ri-loader-4-line ri-spin" style="font-size: 18px;"></i>
                  </div>`
                  }
                  ${log.cam3_box ? 
                  `<div style="position: relative; width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 2px solid #eab308; cursor: pointer;" onclick="window.viewImage('${log.cam3_box}', '<span style=\\'font-family: Arial; font-weight: bold; font-size: 12px;\\'>tinggibadan sesuai BOX ${log.height3_box}cm</span>', '')" title="Box 3">
                     <img src="${log.cam3_box}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWk0xMiAxNEM5LjMzIDE0IDQgMTUuMzQgNCAxOFYyMEgyMFYxOEMyMCAxNS4zNCAxNC42NyAxNCAxMiAxNFoiLz48L3N2Zz4=';" />
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 1px 0;">B3</div>
                  </div>` :
                  `<div style="width: 44px; height: 44px; border-radius: 6px; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #cbd5e1;" title="Loading...">
                     <i class="ri-loader-4-line ri-spin" style="font-size: 18px;"></i>
                  </div>`
                  }
               </div>
            </td>
          </tr>
        `;
    });
  }

  let paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml += '<div style="display: flex; justify-content: flex-end; align-items: center; gap: 6px; margin-top: 16px; margin-bottom: 8px;">';
    paginationHtml += `<button onclick="window.changeLogPage(${currentLogPage - 1})" ${currentLogPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} class="btn-page" style="padding: 6px 8px; background: white; border: 1px solid #cbd5e1; border-radius: 6px;"><i class="ri-arrow-left-s-line"></i></button>`;
    
    for (let i = 1; i <= totalPages; i++) {
       const activeStyle = i === currentLogPage ? 'background: var(--primary-color); color: white; border: 1px solid var(--primary-color);' : 'background: white; color: var(--text-primary); border: 1px solid #cbd5e1;';
       paginationHtml += `<button onclick="window.changeLogPage(${i})" style="width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-weight: 600; ${activeStyle}">${i}</button>`;
    }

    paginationHtml += `<button onclick="window.changeLogPage(${currentLogPage + 1})" ${currentLogPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} class="btn-page" style="padding: 6px 8px; background: white; border: 1px solid #cbd5e1; border-radius: 6px;"><i class="ri-arrow-right-s-line"></i></button>`;
    paginationHtml += '</div>';
  }

  const devOptions = ['Semua Timbangan', ...devices.map(d => d.name)];
  const selectOptionsHtml = devOptions.map(opt => `<option value="${opt}" ${opt === selectedFilter ? 'selected' : ''}>${opt}</option>`).join('');

  content.innerHTML = `
    <style>
      .log-table th {
         background: #f8fafc;
         font-weight: 600;
         font-size: 12px;
         color: #64748b;
         text-transform: uppercase;
         letter-spacing: 0.5px;
         padding: 12px 16px;
         border-bottom: 2px solid #e2e8f0;
         text-align: left;
      }
      .log-table td {
         padding: 12px 16px;
         border-bottom: 1px solid #f1f5f9;
         vertical-align: middle;
      }
      .log-table tr:hover {
         background: #f8fafc;
      }
    </style>
    <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h2>Sistem Log Timbangan</h2>
        <p>Catatan pengukuran terkini dari perangkat TERA</p>
      </div>
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="background: #dcfce7; color: #16a34a; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
            <i class="ri-database-2-line"></i>
          </div>
          <div>
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Log Data</div>
            <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">${cachedTotal}</div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.changeLogPage(1)" style="height: 100%;">
          <i class="ri-refresh-line"></i> Refresh Log
        </button>
      </div>
    </div>
    
    <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
       <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; font-size: 13px;">
          <i class="ri-filter-3-line" style="color: var(--text-muted);"></i>
          <select id="deviceFilterSelect" onchange="window.filterLogs(this.value)" style="border: none; outline: none; background: transparent; font-weight: 500; color: var(--text-primary); cursor: pointer;">
             ${selectOptionsHtml}
          </select>
       </div>
       <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; font-size: 13px;">
          <i class="ri-calendar-line" style="color: var(--text-muted);"></i>
          <select id="dateFilterTypeSelect" onchange="window.changeDateFilter(this.value)" style="border: none; outline: none; background: transparent; font-weight: 500; color: var(--text-primary); cursor: pointer;">
             <option value="today" ${selectedDateFilterType === 'today' ? 'selected' : ''}>Data Hari Ini</option>
             <option value="range" ${selectedDateFilterType === 'range' ? 'selected' : ''}>Rentang Tanggal</option>
          </select>
       </div>
       
       ${selectedDateFilterType === 'range' ? `
       <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; font-size: 13px;">
          <input type="date" id="startDateInput" value="${filterStartDate}" onchange="window.updateDateRange()" style="border: none; outline: none; font-family: inherit; color: var(--text-primary);" />
          <span style="color: var(--text-muted); font-weight: 500;">s/d</span>
          <input type="date" id="endDateInput" value="${filterEndDate}" onchange="window.updateDateRange()" style="border: none; outline: none; font-family: inherit; color: var(--text-primary);" />
       </div>
       ` : ''}
    </div>

    <div class="data-table-container" style="overflow-x: auto; background: white; border-radius: 12px; border: 1px solid var(--border-color); padding: 0 0 16px 0;">
      <table class="data-table log-table" style="width: 100%; min-width: 800px; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr>
            <th>Time Frame</th>
            <th>Timbangan (Device)</th>
            <th>Tag RFID</th>
            <th>Berat</th>
            <th>Tinggi</th>
            <th>Risk</th>
            <th>tangkapan 3 kamera</th>
            <th>Bounding Box</th>
          </tr>
        </thead>
        <tbody>
          ${tbodyHtml}
        </tbody>
      </table>
      <div style="padding: 0 16px;">
        ${paginationHtml}
      </div>
    </div>
  `;
}

(window as any).filterLogs = (val: string) => {
  selectedFilter = val;
  currentLogPage = 1;
  renderLog();
};

(window as any).changeDateFilter = (val: string) => {
   selectedDateFilterType = val;
   currentLogPage = 1;
   if (val === 'range') {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      if (!filterStartDate) filterStartDate = today;
      if (!filterEndDate) filterEndDate = today;
   }
   renderLog();
};

(window as any).updateDateRange = () => {
   filterStartDate = (document.getElementById('startDateInput') as HTMLInputElement).value;
   filterEndDate = (document.getElementById('endDateInput') as HTMLInputElement).value;
   currentLogPage = 1;
   renderLog();
};

// Global function for the image modal
(window as any).viewImage = (src: string, camName: string, timestamp: string, isBox: boolean = false) => {
    const modal = document.getElementById('imageModal')!;
    const modalImg = document.getElementById('modalImg') as HTMLImageElement;
    const modalCamName = document.getElementById('modalCameraName') as HTMLSpanElement;
    const modalTs = document.getElementById('modalTimestamp') as HTMLSpanElement;
    
    modalImg.src = src;
    if (isBox) {
        modalCamName.innerHTML = `<span style="font-family: Arial; font-weight: bold; font-size: 12pt;">${camName}</span>`;
    } else {
        modalCamName.innerHTML = camName;
    }
    modalTs.innerHTML = timestamp;
    
    modal.style.display = 'flex';
};

if (sessionStorage.getItem('tera_logged_in') === 'true') {
  renderDashboard();
} else {
  renderLogin();
}
