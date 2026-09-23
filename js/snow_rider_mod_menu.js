/**
 * SNOW RIDER 3D — REBUILT MOD CONSOLE
 * ----------------------------------------------------------------------------
 * Powered directly by GameAPI with direct Unity WebGL fallback execution.
 * 
 * Includes:
 * - Basic Tab: Essential cheats (God Mode, Inf Jump, Speedhack, Score/Gifts, Sled Unlocks)
 * - Complex Tab: SledgeData Physics Engine, Memory Pointers, Shaders, Canvas Teleport & Dispatcher
 * - Input Propagation Isolation (Fixes Unity stealing number/keyboard inputs)
 * - Inertia Jiggle Physics & Freeform Resizable Window
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
        const res = fn(api);
        if (res !== false && res !== undefined) return res;
      } catch (err) {
        console.warn('[ModConsole] API call error:', err);
      }
    }
    if (typeof fallback === 'function') return fallback();
    return false;
  }

  // Direct Unity SendMessage fallback if GameAPI instance is delayed
  function directUnitySend(target, method, param) {
    const inst = window.gameInstance || window.unityInstance || (window.GameAPI && window.GameAPI.Context && window.GameAPI.Context.unityInstance);
    if (inst && typeof inst.SendMessage === 'function') {
      try {
        if (param !== undefined) {
          inst.SendMessage(target, method, param);
        } else {
          inst.SendMessage(target, method);
        }
        return true;
      } catch (e) {
        console.warn(`[ModConsole] Direct SendMessage failed for ${target}.${method}:`, e);
      }
    }
    return false;
  }

  // --- DOM Helpers & Event Isolation ---
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

  // Input helper with complete event propagation stopping to fix Unity input stealing
  function makeInput(attrs = {}) {
    const input = el('input', attrs);
    const isolate = (e) => e.stopPropagation();
    input.addEventListener('keydown', isolate);
    input.addEventListener('keyup', isolate);
    input.addEventListener('keypress', isolate);
    input.addEventListener('input', isolate);
    return input;
  }

  function makeSelect(attrs = {}, children = []) {
    const select = el('select', attrs, children);
    const isolate = (e) => e.stopPropagation();
    select.addEventListener('keydown', isolate);
    select.addEventListener('keyup', isolate);
    select.addEventListener('keypress', isolate);
    return select;
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
   * INERTIA JIGGLE PHYSICS
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

      const tilt = Math.max(-14, Math.min(14, vx * 0.22));
      const skew = Math.max(-7, Math.min(7, vx * -0.12));
      const scale = 1 + Math.min(0.04, Math.hypot(vx, vy) * 0.0015);
      panel.style.transform = `translate3d(0,0,0) rotate(${tilt}deg) skewX(${skew}deg) scale(${scale})`;
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove('srmm-dragging');

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
   * CSS STYLES
   * ============================================================ */
  const CSS = `
  :host { all: initial; }
  * { box-sizing: border-box; }

  .srmm-root, .srmm-fab, .srmm-toasts {
    --bg-base: rgba(10, 15, 29, 0.92);
    --surface-1: rgba(22, 32, 54, 0.6);
    --surface-2: rgba(30, 44, 74, 0.5);
    --border-subtle: rgba(255, 255, 255, 0.12);
    
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

  .srmm-root {
    position: fixed; top: 25px; right: 25px; width: 440px; height: 630px; z-index: 2147483000;
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
  .srmm-tabs { position: relative; display: flex; padding: 0 12px; border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; }
  .srmm-tab-btn {
    flex: 1; padding: 11px 0; background: none; border: none; cursor: pointer;
    color: var(--text-dim); font-size: 13px; font-weight: 700; text-align: center;
    transition: color 0.16s ease; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .srmm-tab-btn:hover { color: var(--text-secondary); }
  .srmm-tab-btn.active { color: #fff; }
  .srmm-tab-indicator {
    position: absolute; bottom: -1px; height: 3px; border-radius: 2px;
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

  .srmm-row {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 7px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
  .srmm-row:last-child { border-bottom: none; }
  .srmm-row-label { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .srmm-row-label .title { font-size: 12.5px; font-weight: 600; color: #fff; }
  .srmm-row-label .sub { font-size: 10.5px; color: var(--text-dim); }
  .srmm-row-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

  .srmm-input, .srmm-select {
    background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-subtle); color: #fff;
    border-radius: var(--radius-sm); padding: 6px 8px; font-size: 11.5px; width: 85px;
    transition: all 0.15s ease;
  }
  .srmm-input:focus, .srmm-select:focus {
    outline: none; border-color: var(--neon-cyan);
    box-shadow: 0 0 8px rgba(0, 242, 254, 0.3); background: rgba(0, 0, 0, 0.65);
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
   * BASIC TAB (MAIN CHEATS & ESSENTIALS)
   * ============================================================ */
  function buildBasicTab(toast) {
    const wrap = el('div', { style: 'display: flex; flex-direction: column; gap: 12px;' });

    // Section 1: Movement & Invincibility
    const physSec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: '⚡ Player & Flight Essentials' })])
    ]);

    // God Mode
    const godSwitch = makeSwitch(false, (on) => {
      callAPI(api => api.Player.setGodMode(on), () => { directUnitySend('Player', 'set_isGrounded', 1); });
      toast(on ? 'God Mode Activated' : 'God Mode Deactivated', on ? 'success' : 'info');
    });
    addRow(physSec, 'God Mode (Invincible)', 'Prevents crash states & forces grounded physics', godSwitch.wrap);

    // Infinite Jump
    const jumpSwitch = makeSwitch(false, (on) => {
      callAPI(api => api.Player.setInfiniteJump(on));
      toast(on ? 'Infinite Air Jump Enabled (Spacebar)' : 'Infinite Jump Disabled', on ? 'success' : 'info');
    });
    addRow(physSec, 'Infinite Air Jump', 'Jump continuously in mid-air', jumpSwitch.wrap);

    // Auto Bunny Hop
    const bunnySwitch = makeSwitch(false, (on) => {
      callAPI(api => api.Player.setBunnyHop(on));
      toast(on ? 'Auto Bunny Hop Enabled' : 'Bunny Hop Disabled', on ? 'success' : 'info');
    });
    addRow(physSec, 'Auto Bunny Hop', 'Automatic continuous jump loop', bunnySwitch.wrap);

    // Speedhack Input & Controls
    const speedIn = makeInput({ class: 'srmm-input', value: '45', type: 'number' });
    const speedBtn = el('button', { class: 'srmm-btn small primary', text: 'Set Speed' });
    speedBtn.onclick = () => {
      const val = parseFloat(speedIn.value) || 30;
      callAPI(api => api.Player.setSpeed(val), () => directUnitySend('Player', 'setSpeed', val));
      toast(`Forward Speed: ${val}`, 'success');
    };
    addRow(physSec, 'Forward Speedhack', 'Overrides player longitudinal speed', el('div', { class: 'srmm-row-controls' }, [speedIn, speedBtn]));

    // Speed Quick Presets
    const presetRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: 'Normal (25)', onclick: () => { speedIn.value = '25'; speedBtn.click(); } }),
      el('button', { class: 'srmm-btn small', text: 'Fast (45)', onclick: () => { speedIn.value = '45'; speedBtn.click(); } }),
      el('button', { class: 'srmm-btn small', text: 'Nitro (70)', onclick: () => { speedIn.value = '70'; speedBtn.click(); } }),
      el('button', { class: 'srmm-btn small primary', text: 'Warp (120)', onclick: () => { speedIn.value = '120'; speedBtn.click(); } })
    ]);
    physSec.appendChild(presetRow);

    // Instant Actions
    const actionRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small primary', text: '⬆ Jump Now', onclick: () => { callAPI(api => api.Player.jump(), () => directUnitySend('Player', 'Jump')); toast('Jump!', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '↺ Respawn', onclick: () => { callAPI(api => api.Player.respawn(), () => directUnitySend('Player', 'Spawn')); toast('Respawning...', 'info'); } })
    ]);
    physSec.appendChild(actionRow);

    // Section 2: Economy & Unlocks
    const ecoSec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: '🎁 Economy & Unlocks' })])
    ]);

    // Gifts Adder
    const giftRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: '+500', onclick: () => { callAPI(api => api.Game.setGifts(500), () => directUnitySend('GameControl', 'set_gifts', 500)); toast('+500 Gifts', 'success'); } }),
      el('button', { class: 'srmm-btn small', text: '+5,000', onclick: () => { callAPI(api => api.Game.setGifts(5000), () => directUnitySend('GameControl', 'set_gifts', 5000)); toast('+5,000 Gifts', 'success'); } }),
      el('button', { class: 'srmm-btn small primary', text: 'Max (999k)', onclick: () => { callAPI(api => api.Game.lockGifts(999999), () => directUnitySend('GameControl', 'set_gifts', 999999)); toast('Gifts locked at 999,999', 'success'); } })
    ]);
    addRow(ecoSec, 'Presents / Currency', 'Inject gifts into session', giftRow);

    // Score Injector
    const scoreIn = makeInput({ class: 'srmm-input', value: '9999', type: 'number' });
    const scoreBtn = el('button', { class: 'srmm-btn small primary', text: 'Set Score' });
    scoreBtn.onclick = () => {
      const v = parseInt(scoreIn.value, 10) || 1000;
      callAPI(api => api.Game.setScore(v), () => directUnitySend('GameControl', 'UpdateScore', v));
      toast(`Score set to ${v}`, 'success');
    };
    addRow(ecoSec, 'Distance Score Setter', 'Instant distance score override', el('div', { class: 'srmm-row-controls' }, [scoreIn, scoreBtn]));

    // Unlock All Sleds
    const unlockBtn = el('button', { class: 'srmm-btn small primary', text: 'Unlock All' });
    unlockBtn.onclick = () => {
      callAPI(api => api.Skins.unlockAll(), () => {
        directUnitySend('SledSkinControl', 'Read');
        directUnitySend('ShopGUIControl', 'OnClickSleds');
      });
      toast('All Sled Skins Unlocked', 'success');
    };
    addRow(ecoSec, 'Unlock All Sleds', 'Unlocks all shop items', unlockBtn);

    // Bypass Rewarded Ads
    const adBtn = el('button', { class: 'srmm-btn small', text: 'Claim Ad Reward' });
    adBtn.onclick = () => {
      callAPI(api => api.Game.showRewardedAd(), () => directUnitySend('GameManager', 'OnRewardedVideoSuccess'));
      toast('Rewarded Ad bonus granted!', 'success');
    };
    addRow(ecoSec, 'Bypass Video Ads', 'Get ad rewards directly', adBtn);

    // Lifecycle Controls
    const lifeRow = el('div', { class: 'srmm-row', style: 'border:none' }, [
      el('button', { class: 'srmm-btn small', text: '▶ Start Play', onclick: () => { callAPI(api => api.Game.startPlay(), () => directUnitySend('GameControl', 'Play')); toast('Started', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '⏸ Pause', onclick: () => { callAPI(api => api.Game.pause(), () => directUnitySend('GameManager', 'OnPauseGame')); toast('Paused', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '⏵ Resume', onclick: () => { callAPI(api => api.Game.resume(), () => directUnitySend('GameManager', 'OnResumeGame')); toast('Resumed', 'info'); } }),
      el('button', { class: 'srmm-btn small', text: '☰ Menu', onclick: () => { callAPI(api => api.Game.returnToMenu(), () => directUnitySend('GameControl', 'Main')); toast('Menu', 'info'); } })
    ]);
    addRow(ecoSec, 'Game Controls', 'Direct flow triggers', lifeRow);

    wrap.appendChild(physSec);
    wrap.appendChild(ecoSec);
    return wrap;
  }

  /* ============================================================
   * COMPLEX TAB (ADVANCED ENGINE, MEMORY, SHADERS & DISPATCHER)
   * ============================================================ */
  function buildComplexTab(toast) {
    const wrap = el('div', { style: 'display: flex; flex-direction: column; gap: 12px;' });

    // Section 1: SledgeData ScriptableObject Tuning
    const sledgeSec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: '🛠 Sledge Physics Tuning (ScriptableObject)' })])
    ]);

    // Jump Launch Impulse
    const jumpPowIn = makeInput({ class: 'srmm-input', value: '30', type: 'number' });
    const jumpPowBtn = el('button', { class: 'srmm-btn small primary', text: 'Apply' });
    jumpPowBtn.onclick = () => {
      const v = parseFloat(jumpPowIn.value) || 25;
      callAPI(api => api.Player.setSledgeData({ jumpSpeed: v }));
      toast(`Jump Impulse set to ${v}`, 'success');
    };
    addRow(sledgeSec, 'Jump Velocity Impulse', 'Upward vertical launch velocity', el('div', { class: 'srmm-row-controls' }, [jumpPowIn, jumpPowBtn]));

    // Rotation / Steering Agility
    const steerIn = makeInput({ class: 'srmm-input', value: '3.0', type: 'number' });
    const steerBtn = el('button', { class: 'srmm-btn small', text: 'Apply' });
    steerBtn.onclick = () => {
      const v = parseFloat(steerIn.value) || 1.0;
      callAPI(api => api.Player.setSledgeData({ rotationSpeed: v * 30 }));
      toast(`Steering agility multiplier: ${v}x`, 'success');
    };
    addRow(sledgeSec, 'Steering Agility Rate', 'Angular turn responsiveness', el('div', { class: 'srmm-row-controls' }, [steerIn, steerBtn]));

    // Acceleration Ramp Rate
    const accelIn = makeInput({ class: 'srmm-input', value: '15', type: 'number' });
    const accelBtn = el('button', { class: 'srmm-btn small', text: 'Apply' });
    accelBtn.onclick = () => {
      const v = parseFloat(accelIn.value) || 5;
      callAPI(api => api.Player.setSledgeData({ speedAcceleration: v }));
      toast(`Acceleration rate: ${v}`, 'success');
    };
    addRow(sledgeSec, 'Base Acceleration Ramp', 'Speed gain acceleration rate', el('div', { class: 'srmm-row-controls' }, [accelIn, accelBtn]));

    // Section 2: Visual Shaders & Canvas Teleport
    const visSec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: '🎨 Canvas Scene & Post-FX Shaders' })])
    ]);

    // Skin Selector
    const skinSel = makeSelect({ class: 'srmm-select' }, [
      el('option', { value: '0', text: 'Classic Wood Sled' }),
      el('option', { value: '1', text: 'Standard Sled' }),
      el('option', { value: '2', text: 'Modern Sled' }),
      el('option', { value: '3', text: 'Rocket Sled' }),
      el('option', { value: '4', text: 'Santa Sleigh' }),
      el('option', { value: '5', text: 'Hover Sled' })
    ]);
    skinSel.onchange = () => {
      callAPI(api => api.Skins.setCurrentSkin(parseInt(skinSel.value, 10)), () => directUnitySend('GameControl', 'set_currentSkin', parseInt(skinSel.value, 10)));
      toast(`Equipped ${skinSel.options[skinSel.selectedIndex].text}`, 'info');
    };
    addRow(visSec, 'Direct Skin Equip', 'Instant model replacement', skinSel);

    // Canvas Teleporter
    const canvasSel = makeSelect({ class: 'srmm-select' }, [
      el('option', { value: '', text: 'Select Canvas…' }),
      el('option', { value: 'playCanvasPrefab', text: 'Play Screen' }),
      el('option', { value: 'shopCanvasPrefab', text: 'Shop Screen' }),
      el('option', { value: 'sledsCanvasPrefab', text: 'Sleds Garage' }),
      el('option', { value: 'settingsCanvasPrefab', text: 'Settings' }),
      el('option', { value: 'introCanvasPrefab', text: 'Intro Screen' })
    ]);
    canvasSel.onchange = () => {
      if (canvasSel.value) {
        callAPI(api => api.UI.changeCanvas(canvasSel.value), () => directUnitySend('GUIControl', 'ChangeCanvas', canvasSel.value));
        toast(`Canvas: ${canvasSel.value}`, 'info');
      }
    };
    addRow(visSec, 'Canvas Teleporter', 'Direct UI scene transition', canvasSel);

    // Atmosphere Shaders
    const shaderSel = makeSelect({ class: 'srmm-select' }, [
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
      if (!canvas) { toast('Canvas element not found', 'danger'); return; }
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
    addRow(visSec, 'Atmosphere Shader', 'Real-time WebGL post-processing', shaderSel);

    // Section 3: WASM Memory Pointer Inspector
    const memSec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: '🔍 WASM Heap & Pointer Inspector' })])
    ]);

    const memStatusText = el('span', { class: 'srmm-mono', text: '0x00000000', style: 'font-size: 11px; color: var(--neon-cyan);' });
    const scanBtn = el('button', { class: 'srmm-btn small', text: 'Inspect Pointers' });
    scanBtn.onclick = () => {
      const api = getAPI();
      if (api && api.Context) {
        const pPtr = api.Player.getPointer();
        memStatusText.textContent = pPtr ? `PlayerControl: 0x${pPtr.toString(16).toUpperCase()}` : 'Heap Unbound / Searching';
        toast(pPtr ? `PlayerControl at 0x${pPtr.toString(16)}` : 'WASM Heap Active', 'info');
      } else {
        memStatusText.textContent = 'Direct WebGL Mode';
        toast('Direct WebGL Bridge Active', 'info');
      }
    };
    addRow(memSec, 'Player Instance Pointer', '32-bit Il2Cpp instance location', el('div', { class: 'srmm-row-controls' }, [memStatusText, scanBtn]));

    // Section 4: Direct Unity Dispatcher
    const consoleSec = el('div', { class: 'srmm-section' }, [
      el('div', { class: 'srmm-section-title' }, [el('span', { text: '💻 Raw Unity SendMessage Dispatcher' })])
    ]);

    const targetIn = makeInput({ class: 'srmm-input wide srmm-mono', placeholder: 'Target GameObject (e.g. Player, GameControl)' });
    const methodIn = makeInput({ class: 'srmm-input wide srmm-mono', placeholder: 'Method Name (e.g. Jump, Play, setSpeed)' });
    const argIn = makeInput({ class: 'srmm-input wide srmm-mono', placeholder: 'Parameter (optional string/number)' });
    const sendBtn = el('button', { class: 'srmm-btn small primary', text: 'Dispatch SendMessage' });

    sendBtn.onclick = () => {
      const target = targetIn.value.trim();
      const method = methodIn.value.trim();
      const arg = argIn.value.trim();
      if (!target || !method) {
        toast('Target & Method required', 'danger');
        return;
      }

      let parsedArg = arg;
      if (arg !== '' && !isNaN(arg)) parsedArg = Number(arg);

      const ok = callAPI(
        api => api.sendMessage(target, method, arg !== '' ? parsedArg : undefined),
        () => directUnitySend(target, method, arg !== '' ? parsedArg : undefined)
      );

      if (ok) {
        toast(`Dispatched: ${target}.${method}(${arg})`, 'success');
      } else {
        toast(`Failed: ${target}.${method}()`, 'danger');
      }
    };

    consoleSec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [targetIn]));
    consoleSec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [methodIn]));
    consoleSec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [argIn]));
    consoleSec.appendChild(el('div', { class: 'srmm-row', style: 'border:none' }, [sendBtn]));

    wrap.appendChild(sledgeSec);
    wrap.appendChild(visSec);
    wrap.appendChild(memSec);
    wrap.appendChild(consoleSec);
    return wrap;
  }

  /* ============================================================
   * MAIN PANEL ASSEMBLY
   * ============================================================ */
  function buildPanel(shadow) {
    const toast = createToaster(shadow);

    const fab = el('button', { class: 'srmm-fab hidden', title: 'Open Mod Console (Insert)' }, [
      el('span', { text: '❄' })
    ]);

    const root = el('div', { class: 'srmm-root hidden' });

    const statusDot = el('span', { class: 'srmm-dot' });
    const statusText = el('span', { text: 'Unity Connected' });
    const minBtn = el('button', { class: 'srmm-headbtn', text: '–', title: 'Minimize' });
    const closeBtn = el('button', { class: 'srmm-headbtn', text: '✕', title: 'Close (Insert to Toggle)' });

    const head = el('div', { class: 'srmm-head' }, [
      el('div', { class: 'srmm-logo-badge', text: '❄' }),
      el('div', { class: 'srmm-title' }, [
        el('b', { text: 'Snow Rider 3D Console' }),
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

    // Speed Gear Engine
    const speedBar = el('div', { class: 'srmm-speedgear' });
    const speedLabel = el('div', { class: 'srmm-speed-label' }, [
      el('span', { text: '⚡ TimeScale:' }),
      el('span', { id: 'srmm-cur-speed', text: '1.0x', style: 'color:#fff' })
    ]);
    const presets = el('div', { class: 'srmm-speed-presets' });
    [0.2, 0.5, 1.0, 2.0, 5.0, 10.0].forEach((rate) => {
      const b = el('button', { class: `srmm-preset-btn ${rate === 1.0 ? 'active' : ''}`, text: `${rate}x` });
      b.onclick = () => {
        presets.querySelectorAll('.srmm-preset-btn').forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        callAPI(api => api.Game.setTimeScale(rate), () => {
          directUnitySend('SlowMotion', 'setSpeed', rate);
          directUnitySend('SlowMotion', 'Apply', rate);
        });
        shadow.getElementById('srmm-cur-speed').textContent = `${rate}x`;
        toast(`Game Speed: ${rate}x`, 'info');
      };
      presets.appendChild(b);
    });
    speedBar.appendChild(speedLabel);
    speedBar.appendChild(presets);

    // Primary Tabs: BASIC & COMPLEX
    const tabIndicator = el('div', { class: 'srmm-tab-indicator' });
    const basicTabBtn = el('button', { class: 'srmm-tab-btn active', text: 'Basic' });
    const complexTabBtn = el('button', { class: 'srmm-tab-btn', text: 'Complex' });
    const tabs = el('div', { class: 'srmm-tabs' }, [tabIndicator, basicTabBtn, complexTabBtn]);

    const body = el('div', { class: 'srmm-body' });
    const basicTab = buildBasicTab(toast);
    const complexTab = buildComplexTab(toast);
    complexTab.style.display = 'none';

    body.appendChild(basicTab);
    body.appendChild(complexTab);

    const allTabs = [basicTab, complexTab];
    const allBtns = [basicTabBtn, complexTabBtn];

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

    const resizer = el('div', { class: 'srmm-resizer' });

    root.appendChild(head);
    root.appendChild(speedBar);
    root.appendChild(tabs);
    root.appendChild(body);
    root.appendChild(resizer);

    shadow.appendChild(fab);
    shadow.appendChild(root);

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

    setInterval(() => {
      const api = getAPI();
      const ready = !!(api && api.isReady()) || !!(window.gameInstance || window.unityInstance);
      statusDot.style.background = ready ? 'var(--neon-green)' : 'var(--neon-cyan)';
      statusDot.style.boxShadow = ready ? '0 0 8px var(--neon-green)' : '0 0 8px var(--neon-cyan)';
      statusText.textContent = ready ? 'Unity Active' : 'Waiting for Game';
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