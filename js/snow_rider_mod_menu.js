/**
 * SNOW RIDER 3D — REBUILT MOD CONSOLE
 * ----------------------------------------------------------------------------
 * Powered directly by GameAPI (zero raw WASM scanning or manual anchoring required).
 * 
 * Features:
 * - High-Tech Obsidian Glassmorphism UI (isolated in Shadow DOM)
 * - Invincible-Style Elastic Inertia Jiggle Physics (liquid spring wobble on drag)
 * - Freeform Resizable Window with corner grip handle
 * - Integrated Speed Gear Engine (Real-Time TimeScale)
 * - Full Cheat Suite:
 *     * Player Physics: God Mode, Infinite Air Jump, Bunny Hop, Speedhack, Super Jump, Steering, Respawn
 *     * Game & Economy: Infinite Presents, Score Setter & Multipliers, Game Flow Controls, Ad Bypasser
 *     * Skins & Visuals: Unlock All Sleds, Skin Selector, Canvas Teleporter, Atmosphere Shaders, UI Text Overrides
 *     * Unity Console: Direct SendMessage dispatcher
 * - Keyboard shortcut: Insert key to toggle
 */

;(function () {
  'use strict';

  if (window.__srmmConsoleInstalled) return;
  window.__srmmConsoleInstalled = true;

  // --- API Proxy Helpers ---
  function getAPI() {
    return window.GameAPI || null;
  }

  function callAPI(fn, fallback) {
    const api = getAPI();
    if (api && typeof fn === 'function') {
      try {
        return fn(api);
      } catch (err) {
        console.warn('[ModConsole] API call error:', err);
      }
    }
    if (typeof fallback === 'function') return fallback();
    return false;
  }

  // --- DOM Helpers ---
  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    children.forEach(c => n.appendChild(c));
    return n;
  }

  function makeSwitch(initial, onChange) {
    const input = el('input', { type: 'checkbox' });
    if (initial) input.checked = true;
    input.addEventListener('change', () => onChange(input.checked));
    const track = el('span', { class: 'srmm-track' });
    const wrap = el('label', { class: 'srmm-switch' }, [input, track]);
    return { wrap, input };
  }

  function whenBodyReady(cb) {
    if (document.body) { cb(); return; }
    const obs = new MutationObserver(() => {
      if (document.body) { obs.disconnect(); cb(); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  /* ============================================================
   * INERTIA JIGGLE PHYSICS ("Invincible" Style Wobble)
   * ============================================================ */
  function makeDraggableWithJiggle(handle, panel) {
    let dx = 0, dy = 0, dragging = false;
    let lastX = 0, lastY = 0;
    let vx = 0, vy = 0;
    let animId = null;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.srmm-headbtn') || e.target.closest('.srmm-switch') || e.target.closest('input')) return;
      dragging = true;
      if (animId) cancelAnimationFrame(animId);

      const r = panel.getBoundingClientRect();
      dx = e.clientX - r.left;
      dy = e.clientY - r.top;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = 0;
      vy = 0;
      panel.style.right = 'auto';
      panel.classList.add('srmm-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      vx = (e.clientX - lastX) * 0.75 + vx * 0.25;
      vy = (e.clientY - lastY) * 0.75 + vy * 0.25;
      lastX = e.clientX;
      lastY = e.clientY;

      const newLeft = Math.max(10, Math.min(window.innerWidth - 60, e.clientX - dx));
      const newTop = Math.max(10, Math.min(window.innerHeight - 60, e.clientY - dy));

      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';

      // Dynamic Inertia Tilt & Skew
      const tilt = Math.max(-14, Math.min(14, vx * 0.22));
      const skew = Math.max(-7, Math.min(7, vx * -0.12));
      const scale = 1 + Math.min(0.04, Math.hypot(vx, vy) * 0.0015);
      panel.style.transform = `translate3d(0,0,0) rotate(${tilt}deg) skewX(${skew}deg) scale(${scale})`;
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove('srmm-dragging');

      // Decaying Spring Damping Bounce on Release
      let currentTilt = Math.max(-14, Math.min(14, vx * 0.22));
      let currentSkew = Math.max(-7, Math.min(7, vx * -0.12));
      let springV = 0;

      function springDecay() {
        const force = -0.22 * currentTilt - 0.28 * springV;
        springV += force;
        currentTilt += springV;
        currentSkew *= 0.85;

        panel.style.transform = `translate3d(0,0,0) rotate(${currentTilt.toFixed(2)}deg) skewX(${currentSkew.toFixed(2)}deg) scale(1)`;

        if (Math.abs(currentTilt) > 0.05 || Math.abs(springV) > 0.05) {
          animId = requestAnimationFrame(springDecay);
        } else {
          panel.style.transform = 'translate3d(0,0,0) rotate(0deg) skewX(0deg) scale(1)';
        }
      }
      animId = requestAnimationFrame(springDecay);
    });
  }

  /* ============================================================
   * CORNER RESIZING ENGINE
   * ============================================================ */
  function makeResizable(panel, handle) {
    let startW, startH, startX, startY, resizing = false;
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      resizing = true;
      startW = panel.offsetWidth;
      startH = panel.offsetHeight;
      startX = e.clientX;
      startY = e.clientY;
      panel.classList.add('srmm-resizing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const newW = Math.max(340, Math.min(850, startW + (e.clientX - startX)));
      const newH = Math.max(420, Math.min(window.innerHeight * 0.92, startH + (e.clientY - startY)));
      panel.style.width = newW + 'px';
      panel.style.height = newH + 'px';
    });

    window.addEventListener('mouseup', () => {
      if (resizing) {
        resizing = false;
        panel.classList.remove('srmm-resizing');
      }
    });
  }

  /* ============================================================
   * CSS STYLES (Cyberpunk Glassmorphism)
   * ============================================================ */
  const CSS = `
  :host { all: initial; }
  * { box-sizing: border-box; }

  .srmm-root, .srmm-fab, .srmm-toasts {
    --bg-base: rgba(10, 15, 29, 0.88);
    --surface-1: rgba(22, 32, 54, 0.55);
    --surface-2: rgba(30, 44, 74, 0.45);
    --border-subtle: rgba(255, 255, 255, 0.1);
    
    --neon-cyan: #00f2fe;
    --neon-blue: #4facfe;
    --neon-purple: #8e2de2;
    --neon-green: #38ef7d;
    --neon-danger: #ff3366;
    
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-dim: #64748b;
    
    --radius-xl: 18px;
    --radius-lg: 12px;
    --radius-md: 8px;
    --radius-sm: 6px;
    --radius-pill: 9999px;
    
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--text-primary);
  }

  .srmm-mono { font-family: ui-monospace, Menlo, Consolas, monospace; }

  /* Floating Action Button (FAB) */
  .srmm-fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 2147483000;
    width: 50px; height: 50px; border-radius: var(--radius-pill);
    background: radial-gradient(circle at 30% 30%, #00f2fe, #4facfe 50%, #1e1b4b 95%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 25px rgba(0, 242, 254, 0.4), 0 0 15px rgba(79, 172, 254, 0.2);
    font-size: 22px; color: #fff;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
  }
  .srmm-fab:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 242, 254, 0.6);
  }
  .srmm-fab.hidden { display: none; }

  /* Main Console Window */
  .srmm-root {
    position: fixed; top: 25px; right: 25px; width: 420px; height: 610px; z-index: 2147483000;
    background: var(--bg-base);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-subtle);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.1);
    display: flex; flex-direction: column; overflow: hidden;
    opacity: 0; transform: scale(0.95) translateY(-8px);
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top right;
  }
  .srmm-root.open { opacity: 1; transform: scale(1) translateY(0); }
  .srmm-root.hidden { display: none; }
  .srmm-root.srmm-dragging { user-select: none; box-shadow: 0 35px 90px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0, 242, 254, 0.25); }

  /* Header */
  .srmm-head {
    display: flex; align-items: center; gap: 10px; padding: 13px 16px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
    border-bottom: 1px solid var(--border-subtle);
    cursor: grab; user-select: none; flex-shrink: 0;
  }
  .srmm-head:active { cursor: grabbing; }
  .srmm-logo-badge {
    width: 28px; height: 28px; border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: bold; color: #fff;
    box-shadow: 0 2px 8px rgba(0, 242, 254, 0.35);
  }
  .srmm-title { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .srmm-title b { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 0.2px; }
  .srmm-status-line { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .srmm-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--neon-green); box-shadow: 0 0 8px var(--neon-green); flex-shrink: 0; }
  .srmm-status-line span { font-size: 10.5px; color: var(--text-secondary); }
  
  .srmm-headbtn {
    width: 26px; height: 26px; border-radius: var(--radius-sm); border: none;
    background: rgba(255, 255, 255, 0.06); color: var(--text-secondary);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: all 0.15s ease;
  }
  .srmm-headbtn:hover { background: rgba(255, 255, 255, 0.15); color: #fff; }

  /* Speed Gear Bar */
  .srmm-speedgear {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 8px 16px; background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid var(--border-subtle);
    font-size: 11px; flex-shrink: 0;
  }
  .srmm-speed-label { display: flex; align-items: center; gap: 5px; font-weight: 600; color: var(--neon-cyan); }
  .srmm-speed-presets { display: flex; align-items: center; gap: 4px; }
  .srmm-preset-btn {
    background: rgba(255, 255, 255, 0.06); border: 1px solid var(--border-subtle);
    color: var(--text-secondary); border-radius: 4px; padding: 2px 7px; font-size: 10.5px; cursor: pointer;
    transition: all 0.12s ease;
  }
  .srmm-preset-btn:hover { background: rgba(0, 242, 254, 0.2); color: #fff; }
  .srmm-preset-btn.active { background: var(--neon-cyan); color: #000; font-weight: 700; border-color: var(--neon-cyan); }

  /* Navigation Tabs */
  .srmm-tabs { position: relative; display: flex; padding: 0 12px; border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; overflow-x: auto; }
  .srmm-tabs::-webkit-scrollbar { display: none; }
  .srmm-tab-btn {
    padding: 10px 12px; background: none; border: none; cursor: pointer;
    color: var(--text-dim); font-size: 12.5px; font-weight: 600; white-space: nowrap;
    transition: color 0.16s ease;
  }
  .srmm-tab-btn:hover { color: var(--text-secondary); }
  .srmm-tab-btn.active { color: #fff; }
  .srmm-tab-indicator {
    position: absolute; bottom: -1px; height: 2px; border-radius: 2px;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-blue));
    box-shadow: 0 0 10px var(--neon-cyan);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Body Content */
  .srmm-body {
    flex: 1; overflow-y: auto; padding: 14px 16px 20px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .srmm-body::-webkit-scrollbar { width: 6px; }
  .srmm-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.14); border-radius: 6px; }
  .srmm-body::-webkit-scrollbar-track { background: transparent; }

  .srmm-section {
    background: var(--surface-1); border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg); padding: 12px 14px; display: flex; flex-direction: column; gap: 8px;
  }
  .srmm-section-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;
    color: var(--neon-cyan); display: flex; align-items: center; justify-content: space-between;
  }

  /* Rows */
  .srmm-row {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 7px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
  .srmm-row:last-child { border-bottom: none; }
  .srmm-row-label { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .srmm-row-label .title { font-size: 12.5px; font-weight: 600; color: #fff; }
  .srmm-row-label .sub { font-size: 10.5px; color: var(--text-dim); }
  .srmm-row-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

  /* Inputs & Buttons */
  .srmm-input, .srmm-select {
    background: rgba(0, 0, 0, 0.35); border: 1px solid var(--border-subtle); color: #fff;
    border-radius: var(--radius-sm); padding: 6px 8px; font-size: 11.5px; width: 75px;
    transition: all 0.15s ease;
  }
  .srmm-input:focus, .srmm-select:focus {
    outline: none; border-color: var(--neon-cyan);
    box-shadow: 0 0 8px rgba(0, 242, 254, 0.3); background: rgba(0, 0, 0, 0.5);
  }
  .srmm-input.wide { width: 100%; }
  .srmm-select { width: auto; cursor: pointer; }

  .srmm-btn {
    background: rgba(255, 255, 255, 0.07); border: 1px solid var(--border-subtle); color: #fff;
    border-radius: var(--radius-sm); padding: 5px 10px; font-size: 11.5px; font-weight: 600; cursor: pointer;
    transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 5px;
  }
  .srmm-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-1px); }
  .srmm-btn:active { transform: translateY(0) scale(0.98); }
  .srmm-btn.primary {
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue));
    border: none; color: #000; font-weight: 700;
    box-shadow: 0 3px 12px rgba(0, 242, 254, 0.3);
  }
  .srmm-btn.primary:hover { box-shadow: 0 5px 18px rgba(0, 242, 254, 0.5); filter: brightness(1.08); }
  .srmm-btn.small { padding: 4px 8px; font-size: 11px; }

  /* Toggle Switch */
  .srmm-switch { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; }
  .srmm-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
  .srmm-track {
    position: absolute; inset: 0; background: rgba(255, 255, 255, 0.16);
    border-radius: var(--radius-pill); cursor: pointer; transition: all 0.2s ease;
  }
  .srmm-track::before {
    content: ""; position: absolute; width: 14px; height: 14px; left: 3px; top: 3px;
    background: #fff; border-radius: 50%; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
  .srmm-switch input:checked + .srmm-track {
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue));
    box-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
  }
  .srmm-switch input:checked + .srmm-track::before { transform: translateX(16px); }

  /* Corner Resizer */
  .srmm-resizer {
    position: absolute; bottom: 0; right: 0; width: 16px; height: 16px;
    cursor: nwse-resize; z-index: 10; display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 3px;
  }
  .srmm-resizer::after {
    content: ""; width: 7px; height: 7px;
    border-right: 2px solid var(--neon-cyan); border-bottom: 2px solid var(--neon-cyan);
    opacity: 0.65;
  }
  .srmm-resizer:hover::after { opacity: 1; }

  /* Toast Alerts */
  .srmm-toasts { position: fixed; bottom: 82px; right: 24px; z-index: 2147483000; display: flex; flex-direction: column; gap: 7px; align-items: flex-end; }
  .srmm-toast {
    background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff;
    padding: 8px 14px; border-radius: var(--radius-md); font-size: 12px; font-weight: 600;
    opacity: 0; transform: translateY(6px); transition: all 0.2s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5); display: flex; align-items: center; gap: 7px;
  }
  .srmm-toast.show { opacity: 1; transform: translateY(0); }
  .srmm-toast.success { border-color: rgba(56, 239, 125, 0.4); }
  .srmm-toast.danger { border-color: rgba(255, 51, 102, 0.4); }
  `;

  // --- Toaster ---
  function createToaster(shadow) {
    const host = el('div', { class: 'srmm-toasts' });
    shadow.appendChild(host);
    return function toast(msg, kind = 'info') {
      const icon = kind === 'success' ? '✓' : kind === 'danger' ? '✕' : 'ℹ';
      const t = el('div', { class: `srmm-toast ${kind}` }, [
        el('span', { text: icon, style: 'color: var(--neon-cyan)' }),
        el('span', { text: msg })
      ]);
      host.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 220);
      }, 1800);
    };
  }

  // --- UI Row Helper ---
  function addRow(container, title, sub, controlEl) {
    const r = el('div', { class: 'srmm-row' }, [
      el('div', { class: 'srmm-row-label' }, [
        el('span', { class: 'title', text: title }),
        ...(sub ? [el('span', { class: 'sub', text: sub })] : [])
      ]),
      el('div', { class: 'srmm-row-controls' }, [controlEl])
    ]);
    container.appendChild(r);
    return r;
  }

  /* ============================================================
   * TAB 1: PLAYER & PHYSICS
   * ============================================================ */
  function buildPlayerTab(toast) {
    const wrap = el('div', { style: 'display: flex; flex-direction: column; gap: 12px;' });

    const sec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: 'Player Physics & Flight' })])
    ]);

    // 1. God Mode
    const godSwitch = makeSwitch(false, (on) => {
      callAPI(api => api.Player.setGodMode(on));
      toast(on ? 'God Mode Enabled' : 'God Mode Disabled', on ? 'success' : 'info');
    });
    addRow(sec, 'God Mode (Invincibility)', 'Locks grounded status & prevents crash states', godSwitch.wrap);

    // 2. Infinite Air Jump
    const jumpSwitch = makeSwitch(false, (on) => {
      callAPI(api => api.Player.setInfiniteJump(on));
      toast(on ? 'Infinite Air Jump Enabled (Spacebar)' : 'Infinite Jump Disabled', on ? 'success' : 'info');
    });
    addRow(sec, 'Infinite Air Jump', 'Allows jumping consecutively in mid-air', jumpSwitch.wrap);

    // 3. Bunny Hop / Auto Jump
    const bunnySwitch = makeSwitch(false, (on) => {
      callAPI(api => api.Player.setBunnyHop(on));
      toast(on ? 'Auto Bunny Hop Enabled' : 'Bunny Hop Disabled', on ? 'success' : 'info');
    });
    addRow(sec, 'Bunny Hop (Auto Jump)', 'Automatically jumps continuously on ground', bunnySwitch.wrap);

    // 4. Forward Speedhack
    const speedIn = el('input', { class: 'srmm-input', value: '50' });
    const speedBtn = el('button', { class: 'srmm-btn small primary', text: 'Set Speed' });
    speedBtn.onclick = () => {
      const val = parseFloat(speedIn.value) || 30;
      callAPI(api => api.Player.setSpeed(val));
      toast(`Forward speed set to ${val}`, 'success');
    };
    addRow(sec, 'Forward Speedhack', 'Overrides player longitudinal speed', el('div', { class: 'srmm-row-controls' }, [speedIn, speedBtn]));

    // Quick Speed Presets
    const presetRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: 'Normal (25)', onclick: () => { speedIn.value = '25'; speedBtn.click(); } }),
      el('button', { class: 'srmm-btn small', text: 'Fast (45)', onclick: () => { speedIn.value = '45'; speedBtn.click(); } }),
      el('button', { class: 'srmm-btn small', text: 'Nitro (70)', onclick: () => { speedIn.value = '70'; speedBtn.click(); } }),
      el('button', { class: 'srmm-btn small', text: 'Warp (100)', onclick: () => { speedIn.value = '100'; speedBtn.click(); } })
    ]);
    sec.appendChild(presetRow);

    // 5. Super Jump Launch Power
    const jumpPowerIn = el('input', { class: 'srmm-input', value: '25' });
    const jumpPowerBtn = el('button', { class: 'srmm-btn small', text: 'Set' });
    jumpPowerBtn.onclick = () => {
      const v = parseFloat(jumpPowerIn.value) || 25;
      callAPI(api => api.Player.setSledgeData({ jumpSpeed: v }));
      toast(`Jump speed set to ${v}`, 'success');
    };
    addRow(sec, 'Super Jump Velocity', 'Upward vertical launch impulse', el('div', { class: 'srmm-row-controls' }, [jumpPowerIn, jumpPowerBtn]));

    // 6. Steering Responsiveness
    const steerIn = el('input', { class: 'srmm-input', value: '2.5' });
    const steerBtn = el('button', { class: 'srmm-btn small', text: 'Set' });
    steerBtn.onclick = () => {
      const v = parseFloat(steerIn.value) || 1.0;
      callAPI(api => api.Player.setSledgeData({ rotationSpeed: v * 30 }));
      toast(`Steering agility boosted`, 'success');
    };
    addRow(sec, 'Steering Agility', 'Angular turn responsiveness', el('div', { class: 'srmm-row-controls' }, [steerIn, steerBtn]));

    // 7. Instant Respawn & Manual Jump Actions
    const actRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small primary', text: '⬆ Trigger Jump', onclick: () => { callAPI(api => api.Player.jump()); toast('Jump!', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '↺ Respawn Summit', onclick: () => { callAPI(api => api.Player.respawn()); toast('Respawned at summit', 'info'); } })
    ]);
    sec.appendChild(actRow);

    wrap.appendChild(sec);
    return wrap;
  }

  /* ============================================================
   * TAB 2: GAME & ECONOMY
   * ============================================================ */
  function buildEconomyTab(toast) {
    const wrap = el('div', { style: 'display: flex; flex-direction: column; gap: 12px;' });

    const sec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: 'Score & Gifts Economy' })])
    ]);

    // 1. Gift Granter
    const giftPresets = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: '+500 Gifts', onclick: () => { callAPI(api => api.Game.setGifts(500)); toast('+500 Gifts added', 'success'); } }),
      el('button', { class: 'srmm-btn small', text: '+2,500 Gifts', onclick: () => { callAPI(api => api.Game.setGifts(2500)); toast('+2,500 Gifts added', 'success'); } }),
      el('button', { class: 'srmm-btn small primary', text: 'Max (999,999)', onclick: () => { callAPI(api => api.Game.lockGifts(999999)); toast('Gifts locked at 999,999', 'success'); } })
    ]);
    addRow(sec, 'Add Gifts / Presents', 'Direct session gift boost', giftPresets);

    // 2. Custom Score Injection
    const scoreIn = el('input', { class: 'srmm-input', placeholder: '99999' });
    const scoreBtn = el('button', { class: 'srmm-btn small primary', text: 'Set Score' });
    scoreBtn.onclick = () => {
      const v = parseInt(scoreIn.value, 10) || 10000;
      callAPI(api => api.Game.setScore(v));
      toast(`Score set to ${v}`, 'success');
    };
    addRow(sec, 'Distance Score Setter', 'Inject any score directly', el('div', { class: 'srmm-row-controls' }, [scoreIn, scoreBtn]));

    // 3. Score Multiplier
    const multRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: '2x', onclick: () => { callAPI(api => api.Game.setScore((api.Game.getScore() || 100) * 2)); toast('Score doubled (2x)', 'success'); } }),
      el('button', { class: 'srmm-btn small', text: '5x', onclick: () => { callAPI(api => api.Game.setScore((api.Game.getScore() || 100) * 5)); toast('Score 5x', 'success'); } }),
      el('button', { class: 'srmm-btn small', text: '10x', onclick: () => { callAPI(api => api.Game.setScore((api.Game.getScore() || 100) * 10)); toast('Score 10x', 'success'); } }),
      el('button', { class: 'srmm-btn small primary', text: '50x', onclick: () => { callAPI(api => api.Game.setScore((api.Game.getScore() || 100) * 50)); toast('Score 50x', 'success'); } })
    ]);
    addRow(sec, 'Score Multiplier', 'Quick multiplication factor', multRow);

    // 4. Bypass Rewarded Ads
    const adBtn = el('button', { class: 'srmm-btn small primary', text: 'Claim Ad Reward' });
    adBtn.onclick = () => {
      callAPI(api => api.Game.showRewardedAd());
      toast('Rewarded Ad bonus granted!', 'success');
    };
    addRow(sec, 'Bypass Rewarded Ads', 'Get ad rewards without ads', adBtn);

    // 5. Game Flow Controls
    const flowRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: '▶ Start Play', onclick: () => { callAPI(api => api.Game.startPlay()); toast('Run started', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '⏸ Pause', onclick: () => { callAPI(api => api.Game.pause()); toast('Paused', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '⏵ Resume', onclick: () => { callAPI(api => api.Game.resume()); toast('Resumed', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '☰ Menu', onclick: () => { callAPI(api => api.Game.returnToMenu()); toast('Returned to Menu', 'info'); } })
    ]);
    addRow(sec, 'Game Lifecycle Controls', 'Direct game mode triggers', flowRow);

    wrap.appendChild(sec);
    return wrap;
  }

  /* ============================================================
   * TAB 3: SKINS & VISUALS
   * ============================================================ */
  function buildVisualsTab(toast) {
    const wrap = el('div', { style: 'display: flex; flex-direction: column; gap: 12px;' });

    const sec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: 'Customization & Shaders' })])
    ]);

    // 1. Unlock All Sleds
    const unlockBtn = el('button', { class: 'srmm-btn small primary', text: 'Unlock All Sleds' });
    unlockBtn.onclick = () => {
      callAPI(api => api.Skins.unlockAll());
      toast('All Sled Skins Unlocked', 'success');
    };
    addRow(sec, 'Unlock All Sleds', 'Unlocks every skin in the shop', unlockBtn);

    // 2. Direct Skin Switcher
    const skinSel = el('select', { class: 'srmm-select' }, [
      el('option', { value: '0', text: 'Classic Wood Sled' }),
      el('option', { value: '1', text: 'Standard Sled' }),
      el('option', { value: '2', text: 'Modern Sled' }),
      el('option', { value: '3', text: 'Rocket Sled' }),
      el('option', { value: '4', text: 'Santa Sleigh' }),
      el('option', { value: '5', text: 'Hover Sled' })
    ]);
    skinSel.onchange = () => {
      callAPI(api => api.Skins.setCurrentSkin(parseInt(skinSel.value, 10)));
      toast(`Equipped ${skinSel.options[skinSel.selectedIndex].text}`, 'info');
    };
    addRow(sec, 'Equip Sled Skin', 'Instant model replacement', skinSel);

    // 3. Canvas Teleporter
    const canvasSel = el('select', { class: 'srmm-select' }, [
      el('option', { value: '', text: 'Teleport to…' }),
      el('option', { value: 'playCanvasPrefab', text: 'Play Screen' }),
      el('option', { value: 'shopCanvasPrefab', text: 'Shop Screen' }),
      el('option', { value: 'sledsCanvasPrefab', text: 'Sleds Garage' }),
      el('option', { value: 'settingsCanvasPrefab', text: 'Settings' }),
      el('option', { value: 'introCanvasPrefab', text: 'Intro Screen' })
    ]);
    canvasSel.onchange = () => {
      if (canvasSel.value) {
        callAPI(api => api.UI.changeCanvas(canvasSel.value));
        toast(`Switched canvas to ${canvasSel.value}`, 'info');
      }
    };
    addRow(sec, 'Canvas Teleporter', 'Direct UI scene transition', canvasSel);

    // 4. Atmosphere Shaders
    const shaderSel = el('select', { class: 'srmm-select' }, [
      el('option', { value: 'none', text: 'Default Slope' }),
      el('option', { value: 'cyberpunk', text: 'Cyberpunk Neon' }),
      el('option', { value: 'aurora', text: 'Borealis Aurora' }),
      el('option', { value: 'thermal', text: 'Thermal Night Vision' }),
      el('option', { value: 'sunset', text: 'Golden Sunset' }),
      el('option', { value: 'matrix', text: 'Matrix Green' }),
      el('option', { value: 'vapor', text: 'Vaporwave Dream' })
    ]);
    shaderSel.onchange = () => {
      const canvas = document.querySelector('#unity-canvas, #gameContainer canvas, canvas');
      if (!canvas) { toast('Canvas not found', 'danger'); return; }
      switch (shaderSel.value) {
        case 'cyberpunk':
          canvas.style.filter = 'hue-rotate(180deg) saturate(2.2) contrast(1.25)'; break;
        case 'aurora':
          canvas.style.filter = 'hue-rotate(95deg) saturate(1.8) brightness(1.1)'; break;
        case 'thermal':
          canvas.style.filter = 'invert(1) hue-rotate(90deg) contrast(1.6)'; break;
        case 'sunset':
          canvas.style.filter = 'sepia(0.65) saturate(2) brightness(1.05)'; break;
        case 'matrix':
          canvas.style.filter = 'hue-rotate(60deg) saturate(3) contrast(1.3)'; break;
        case 'vapor':
          canvas.style.filter = 'hue-rotate(270deg) saturate(1.8) brightness(1.15)'; break;
        default:
          canvas.style.filter = ''; break;
      }
      toast(`Shader: ${shaderSel.options[shaderSel.selectedIndex].text}`, 'info');
    };
    addRow(sec, 'Atmosphere Shaders', 'Real-time WebGL canvas post-FX', shaderSel);

    // 5. 3D World Text Injector
    const textIn = el('input', { class: 'srmm-input wide', placeholder: 'Message' });
    const textBtn = el('button', { class: 'srmm-btn small primary', text: 'Show 3D' });
    textBtn.onclick = () => {
      if (textIn.value) {
        callAPI(api => api.UI.show3DText(textIn.value));
        toast('3D Text Triggered', 'info');
      }
    };
    addRow(sec, '3D World Banner', 'Displays 3D text in world', el('div', { class: 'srmm-row-controls' }, [textIn, textBtn]));

    wrap.appendChild(sec);
    return wrap;
  }

  /* ============================================================
   * TAB 4: UNITY DISPATCHER (Direct SendMessage Console)
   * ============================================================ */
  function buildConsoleTab(toast) {
    const wrap = el('div', { style: 'display: flex; flex-direction: column; gap: 12px;' });

    const sec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: 'Direct Unity SendMessage Dispatcher' })])
    ]);

    const targetIn = el('input', { class: 'srmm-input wide srmm-mono', placeholder: 'Target GameObject (e.g. Player, GameControl)' });
    const methodIn = el('input', { class: 'srmm-input wide srmm-mono', placeholder: 'Method Name (e.g. Jump, Play, Spawn)' });
    const argIn = el('input', { class: 'srmm-input wide srmm-mono', placeholder: 'Parameter (optional)' });
    const sendBtn = el('button', { class: 'srmm-btn small primary', text: 'Dispatch SendMessage' });

    sendBtn.onclick = () => {
      const target = targetIn.value.trim();
      const method = methodIn.value.trim();
      const arg = argIn.value.trim();
      if (!target || !method) {
        toast('Target & Method required', 'danger');
        return;
      }
      const ok = callAPI(api => api.sendMessage(target, method, arg !== '' ? arg : undefined));
      if (ok) {
        toast(`Dispatched: ${target}.${method}()`, 'success');
      } else {
        toast(`Failed: ${target}.${method}()`, 'danger');
      }
    };

    sec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [targetIn]));
    sec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [methodIn]));
    sec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [argIn]));
    sec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [sendBtn]));

    wrap.appendChild(sec);
    return wrap;
  }

  /* ============================================================
   * MAIN PANEL ASSEMBLY
   * ============================================================ */
  function buildPanel(shadow) {
    const toast = createToaster(shadow);

    // Floating Action Button
    const fab = el('button', { class: 'srmm-fab hidden', title: 'Open Mod Console (Insert)' }, [
      el('span', { text: '❄' })
    ]);

    const root = el('div', { class: 'srmm-root hidden' });

    // Header with status indicator & controls
    const statusDot = el('span', { class: 'srmm-dot' });
    const statusText = el('span', { text: 'Game Connected' });
    const minBtn = el('button', { class: 'srmm-headbtn', text: '–', title: 'Minimize' });
    const closeBtn = el('button', { class: 'srmm-headbtn', text: '✕', title: 'Close (Insert to Toggle)' });

    const head = el('div', { class: 'srmm-head' }, [
      el('div', { class: 'srmm-logo-badge', text: '❄' }),
      el('div', { class: 'srmm-title' }, [
        el('b', { text: 'Snow Rider 3D' }),
        el('div', { class: 'srmm-status-line' }, [statusDot, statusText])
      ]),
      minBtn,
      closeBtn
    ]);

    minBtn.addEventListener('click', () => {
      body.style.display = body.style.display === 'none' ? '' : 'none';
      speedBar.style.display = body.style.display === 'none' ? 'none' : '';
    });
    closeBtn.addEventListener('click', () => hidePanel());

    // Speed Gear Bar
    const speedBar = el('div', { class: 'srmm-speedgear' });
    const speedLabel = el('div', { class: 'srmm-speed-label' }, [
      el('span', { text: '⚡ Speed:' }),
      el('span', { id: 'srmm-cur-speed', text: '1.0x', style: 'color:#fff' })
    ]);
    const presets = el('div', { class: 'srmm-speed-presets' });
    [0.2, 0.5, 1.0, 2.0, 5.0, 10.0].forEach((rate) => {
      const b = el('button', { class: `srmm-preset-btn ${rate === 1.0 ? 'active' : ''}`, text: `${rate}x` });
      b.onclick = () => {
        presets.querySelectorAll('.srmm-preset-btn').forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        callAPI(api => api.Game.setTimeScale(rate));
        shadow.getElementById('srmm-cur-speed').textContent = `${rate}x`;
        toast(`Game Speed: ${rate}x`, 'info');
      };
      presets.appendChild(b);
    });
    speedBar.appendChild(speedLabel);
    speedBar.appendChild(presets);

    // Navigation Tabs
    const tabIndicator = el('div', { class: 'srmm-tab-indicator' });
    const tab1Btn = el('button', { class: 'srmm-tab-btn active', text: 'Physics' });
    const tab2Btn = el('button', { class: 'srmm-tab-btn', text: 'Economy' });
    const tab3Btn = el('button', { class: 'srmm-tab-btn', text: 'Skins & Visuals' });
    const tab4Btn = el('button', { class: 'srmm-tab-btn', text: 'Dispatcher' });
    const tabs = el('div', { class: 'srmm-tabs' }, [tabIndicator, tab1Btn, tab2Btn, tab3Btn, tab4Btn]);

    const body = el('div', { class: 'srmm-body' });
    const tab1 = buildPlayerTab(toast);
    const tab2 = buildEconomyTab(toast);
    const tab3 = buildVisualsTab(toast);
    const tab4 = buildConsoleTab(toast);
    tab2.style.display = 'none';
    tab3.style.display = 'none';
    tab4.style.display = 'none';
    body.appendChild(tab1);
    body.appendChild(tab2);
    body.appendChild(tab3);
    body.appendChild(tab4);

    const allTabs = [tab1, tab2, tab3, tab4];
    const allBtns = [tab1Btn, tab2Btn, tab3Btn, tab4Btn];

    function selectTab(index) {
      allBtns.forEach((b, i) => b.classList.toggle('active', i === index));
      allTabs.forEach((t, i) => t.style.display = i === index ? '' : 'none');
      moveIndicator();
    }

    allBtns.forEach((btn, index) => {
      btn.onclick = () => selectTab(index);
    });

    function moveIndicator() {
      const active = tabs.querySelector('.srmm-tab-btn.active');
      if (!active) return;
      tabIndicator.style.width = active.offsetWidth + 'px';
      tabIndicator.style.transform = `translateX(${active.offsetLeft}px)`;
    }

    // Corner Resizer Handle
    const resizer = el('div', { class: 'srmm-resizer' });

    root.appendChild(head);
    root.appendChild(speedBar);
    root.appendChild(tabs);
    root.appendChild(body);
    root.appendChild(resizer);

    shadow.appendChild(fab);
    shadow.appendChild(root);

    // Apply Dragging with Jiggle Physics & Resizing
    makeDraggableWithJiggle(head, root);
    makeResizable(root, resizer);

    requestAnimationFrame(moveIndicator);
    window.addEventListener('resize', moveIndicator);

    function showPanel() {
      fab.classList.add('hidden');
      root.classList.remove('hidden');
      requestAnimationFrame(() => root.classList.add('open'));
    }
    function hidePanel() {
      root.classList.remove('open');
      setTimeout(() => root.classList.add('hidden'), 200);
      fab.classList.remove('hidden');
    }

    fab.addEventListener('click', showPanel);
    showPanel();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Insert' || e.code === 'Insert') {
        root.classList.contains('hidden') ? showPanel() : hidePanel();
      }
    });

    // Check GameAPI status
    setInterval(() => {
      const api = getAPI();
      const ready = api && api.isReady();
      statusDot.style.background = ready ? 'var(--neon-green)' : 'var(--neon-cyan)';
      statusDot.style.boxShadow = ready ? '0 0 8px var(--neon-green)' : '0 0 8px var(--neon-cyan)';
      statusText.textContent = ready ? 'Unity Connected' : 'GameAPI Ready';
    }, 1000);
  }

  function boot() {
    const host = document.createElement('div');
    host.id = 'srmm-console-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    shadow.appendChild(styleEl);
    buildPanel(shadow);
  }

  whenBodyReady(boot);
})();
