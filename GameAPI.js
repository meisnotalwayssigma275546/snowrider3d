/**
 * GameAPI.js - Comprehensive JavaScript Bridge for Unity WebGL / Il2Cpp (Assembly-CSharp)
 * 
 * Target Game Architecture:
 * - Runtime: Unity WebGL (Il2Cpp compiled to WebAssembly 32-bit)
 * - Assembly: Assembly-CSharp.dll
 * 
 * Provides direct JS <-> Unity control over:
 * - Player State (speed, physics, jumps, orientation, god mode, sledge data)
 * - Game Flow (score, gifts/currency, lifecycle modes, time scale, ads)
 * - UI & Text (DataText variables, Text3D, LocalizedText, Canvas controllers)
 * - Customization / Inventory (skins, owned sleds)
 * - Low-level WASM memory inspection & manipulation (HEAP32, HEAPF32, HEAPU8)
 */

(function (global) {
  'use strict';

  // --- Static Offset & Metadata Catalog ---
  const OFFSETS = {
    // PlayerControl instance memory offsets (32-bit pointers)
    PlayerControl: {
      data: 0x0C,                // SledgeData pointer
      genData: 0x10,             // GenData pointer
      skinData: 0x14,            // SkinData pointer
      collisionPoint: 0x18,      // SledgePoint pointer
      sledgeModel: 0x1C,         // Transform pointer
      collisionRays: 0x20,       // List<CollisionRay>
      physicsSledgePrefab: 0x24, // ScriptableObj
      rearParticles: 0x28,       // ParticleSystem
      physicsSledge: 0x2C,       // GameObject
      hRot: 0x30,                // float (horizontal tilt)
      vRot: 0x34,                // float (vertical tilt)
      moveSpeed: 0x38,           // float (target forward speed)
      currMoveSpeed: 0x3C,       // float (actual instantaneous speed)
      maxTouchJumpDelta: 0x40,   // float
      touchLeftTime: 0x44,       // float
      touchRightTime: 0x48,      // float
      touchLeftPressed: 0x4C,    // bool (1 byte)
      touchRightPressed: 0x4D,   // bool (1 byte)
      touchLeftThisFrame: 0x4E,  // bool (1 byte)
      touchRightThisFrame: 0x4F, // bool (1 byte)
      jumpStartTime: 0x50,       // float
      alreadyJumped: 0x54,       // bool (1 byte)
      isGrounded: 0x55,          // bool (1 byte)
      scoreCanvasPrefab: 0x58,   // GameObject
      scoreCanvas: 0x5C,         // GameObject
      prevMovSpeed: 0x68,        // float
      prevH: 0x6C                // float
    },

    // SledgeData ScriptableObject field offsets
    SledgeData: {
      baseMoveSpeed: 0x0C,                // float
      speedAcceleration: 0x10,            // float
      speedAccelerationAmplitude: 0x14,   // float
      rotationSpeed: 0x18,                // float
      rotationSmoothness: 0x1C,           // float
      modelRotationSmoothness: 0x20,      // float
      pointJumpDelay: 0x24,               // float
      jumpSpeed: 0x28                     // float
    },

    // GameControl static fields offsets
    GameControl: {
      giftsThisGame: 0x00,          // int32
      bestNow: 0x04,                // bool (1 byte)
      shadowDistStart: 0x08,        // float
      shadowDistPlay: 0x0C,         // float
      shadowDistEnd: 0x10,          // float
      startTransitionDur: 0x14,     // float
      playStartTransitionDur: 0x18, // float
      playTransitionDur: 0x1C,      // float
      startTransitionDel: 0x20,     // float
      score: 0x24,                  // int32
      gameMode: 0x28,               // int32 (0: intro, 1: main, 2: play, 3: end)
      canProceed: 0x68              // bool (1 byte)
    },

    // GUIControl instance offsets
    GUIControl: {
      currentCanvas: 0x40,          // GameObject pointer
      paused: 0x44                  // bool (1 byte)
    },

    // DataText instance offsets
    DataText: {
      variableName: 0x0C,           // String pointer
      text: 0x10                    // UnityEngine.UI.Text pointer
    },

    // Text3D instance offsets
    Text3D: {
      data: 0x0C,                   // Text3DData
      text: 0x10,                   // String pointer
      scale: 0x14,                  // float
      gapDistance: 0x18,            // float
      offset: 0x1C,                 // float
      letters: 0x20                 // List<GameObject>
    }
  };

  /**
   * Internal bridge context holding references to Unity WebGL instances and modules
   */
  const BridgeContext = {
    unityInstance: null,
    module: null,
    playerControlPtr: 0,
    gameControlStaticPtr: 0,
    guiControlPtr: 0,
    cachedTextComponents: new Map(),

    init(explicitExports) {
      if (typeof global.unityInstance !== 'undefined') {
        this.unityInstance = global.unityInstance;
      } else if (typeof global.gameInstance !== 'undefined') {
        this.unityInstance = global.gameInstance;
      }

      if (explicitExports) {
        this.module = explicitExports;
      } else if (typeof global.Module !== 'undefined') {
        this.module = global.Module;
      } else if (this.unityInstance && this.unityInstance.Module) {
        this.module = this.unityInstance.Module;
      }
    }
  };

  // --- Low-Level Memory Helpers ---
  const Memory = {
    init(exports) {
      BridgeContext.init(exports);
    },

    getHEAP32() {
      const mod = BridgeContext.module || global.Module;
      return mod && mod.HEAP32 ? mod.HEAP32 : null;
    },

    getHEAPF32() {
      const mod = BridgeContext.module || global.Module;
      return mod && mod.HEAPF32 ? mod.HEAPF32 : null;
    },

    getHEAPU8() {
      const mod = BridgeContext.module || global.Module;
      return mod && mod.HEAPU8 ? mod.HEAPU8 : null;
    },

    readInt32(ptr) {
      if (!ptr) return 0;
      const heap = this.getHEAP32();
      return heap ? heap[ptr >> 2] : 0;
    },

    writeInt32(ptr, value) {
      if (!ptr) return false;
      const heap = this.getHEAP32();
      if (heap) {
        heap[ptr >> 2] = value;
        return true;
      }
      return false;
    },

    readFloat(ptr) {
      if (!ptr) return 0.0;
      const heap = this.getHEAPF32();
      return heap ? heap[ptr >> 2] : 0.0;
    },

    writeFloat(ptr, value) {
      if (!ptr) return false;
      const heap = this.getHEAPF32();
      if (heap) {
        heap[ptr >> 2] = value;
        return true;
      }
      return false;
    },

    readBool(ptr) {
      if (!ptr) return false;
      const heap = this.getHEAPU8();
      return heap ? !!heap[ptr] : false;
    },

    writeBool(ptr, value) {
      if (!ptr) return false;
      const heap = this.getHEAPU8();
      if (heap) {
        heap[ptr] = value ? 1 : 0;
        return true;
      }
      return false;
    },

    readIl2CppString(ptr) {
      if (!ptr) return '';
      const length = this.readInt32(ptr + 0x08);
      if (length <= 0 || length > 4096) return '';
      const heapU8 = this.getHEAPU8();
      if (!heapU8) return '';
      const chars = [];
      const charPtr = ptr + 0x0C;
      for (let i = 0; i < length; i++) {
        const charCode = heapU8[charPtr + (i * 2)] | (heapU8[charPtr + (i * 2) + 1] << 8);
        chars.push(String.fromCharCode(charCode));
      }
      return chars.join('');
    },

    writeIl2CppString(ptr, newStr) {
      if (!ptr) return false;
      const heapU8 = this.getHEAPU8();
      if (!heapU8) return false;
      const currentLen = this.readInt32(ptr + 0x08);
      const writeLen = Math.min(newStr.length, currentLen);
      const charPtr = ptr + 0x0C;
      for (let i = 0; i < writeLen; i++) {
        const code = newStr.charCodeAt(i);
        heapU8[charPtr + (i * 2)] = code & 0xFF;
        heapU8[charPtr + (i * 2) + 1] = (code >> 8) & 0xFF;
      }
      this.writeInt32(ptr + 0x08, writeLen);
      return true;
    },

    deref(basePtr, offsets) {
      let current = basePtr;
      for (let i = 0; i < offsets.length; i++) {
        if (!current) return 0;
        current = this.readInt32(current + offsets[i]);
      }
      return current;
    }
  };

  // --- High-Level Unity SendMessage Invoker ---
  function sendUnityMessage(targetObject, method, param) {
    const inst = BridgeContext.unityInstance || global.unityInstance || global.gameInstance;
    if (inst && typeof inst.SendMessage === 'function') {
      try {
        if (param !== undefined) {
          inst.SendMessage(targetObject, method, param);
        } else {
          inst.SendMessage(targetObject, method);
        }
        return true;
      } catch (err) {
        console.warn(`[GameAPI] SendMessage('${targetObject}', '${method}') failed:`, err);
      }
    }
    return false;
  }

  // --- Active Automation Loops (God Mode, Infinite Jump, Speed Lock) ---
  const Automation = {
    godMode: false,
    infiniteJump: false,
    bunnyHop: false,
    speedLock: null,
    giftLock: null,

    init() {
      // Global Spacebar interceptor for Infinite Air Jump
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
          if (Automation.infiniteJump) {
            Player.jump();
          }
        }
      });

      // Frame tick loop for God Mode & continuous properties
      const tick = () => {
        if (Automation.godMode) {
          // If memory pointer is discovered, lock grounded
          if (BridgeContext.playerControlPtr) {
            Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.isGrounded, true);
            Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.alreadyJumped, false);
          }
        }

        if (Automation.speedLock !== null) {
          if (BridgeContext.playerControlPtr) {
            Memory.writeFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.currMoveSpeed, Automation.speedLock);
            Memory.writeFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.moveSpeed, Automation.speedLock);
          }
        }

        if (Automation.giftLock !== null) {
          if (BridgeContext.gameControlStaticPtr) {
            Memory.writeInt32(BridgeContext.gameControlStaticPtr + OFFSETS.GameControl.giftsThisGame, Automation.giftLock);
          }
        }

        if (Automation.bunnyHop) {
          Player.jump();
        }

        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  };

  // --- Player API ---
  const Player = {
    setPointer(ptr) {
      BridgeContext.playerControlPtr = ptr;
    },

    getPointer() {
      return BridgeContext.playerControlPtr;
    },

    getSpeed() {
      if (BridgeContext.playerControlPtr) {
        return Memory.readFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.moveSpeed);
      }
      return 0.0;
    },

    setSpeed(value) {
      const val = parseFloat(value);
      Automation.speedLock = val;
      if (BridgeContext.playerControlPtr) {
        Memory.writeFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.moveSpeed, val);
        Memory.writeFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.currMoveSpeed, val);
      }
      sendUnityMessage('Player', 'setSpeed', val);
      return true;
    },

    clearSpeedLock() {
      Automation.speedLock = null;
    },

    getCurrSpeed() {
      if (BridgeContext.playerControlPtr) {
        return Memory.readFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.currMoveSpeed);
      }
      return 0.0;
    },

    getTilt() {
      if (BridgeContext.playerControlPtr) {
        return {
          hRot: Memory.readFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.hRot),
          vRot: Memory.readFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.vRot)
        };
      }
      return { hRot: 0, vRot: 0 };
    },

    setTilt(hRot, vRot) {
      if (BridgeContext.playerControlPtr) {
        if (hRot !== undefined) Memory.writeFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.hRot, parseFloat(hRot));
        if (vRot !== undefined) Memory.writeFloat(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.vRot, parseFloat(vRot));
        return true;
      }
      return false;
    },

    isGrounded() {
      if (BridgeContext.playerControlPtr) {
        return Memory.readBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.isGrounded);
      }
      return true;
    },

    setGrounded(isGrounded) {
      if (BridgeContext.playerControlPtr) {
        return Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.isGrounded, isGrounded);
      }
      return false;
    },

    jump() {
      if (BridgeContext.playerControlPtr) {
        Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.alreadyJumped, false);
        Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.isGrounded, true);
      }
      return sendUnityMessage('Player', 'Jump') || sendUnityMessage('PlayerControl', 'Jump');
    },

    die() {
      return sendUnityMessage('Player', 'Die') || sendUnityMessage('PlayerControl', 'Die');
    },

    respawn() {
      return sendUnityMessage('Player', 'Spawn') || sendUnityMessage('PlayerControl', 'Spawn');
    },

    setGodMode(enable) {
      Automation.godMode = !!enable;
      if (Automation.godMode) {
        this.setGrounded(true);
      }
      return Automation.godMode;
    },

    setInfiniteJump(enable) {
      Automation.infiniteJump = !!enable;
      return Automation.infiniteJump;
    },

    setBunnyHop(enable) {
      Automation.bunnyHop = !!enable;
      return Automation.bunnyHop;
    },

    simulateLeft(pressed) {
      if (BridgeContext.playerControlPtr) {
        Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.touchLeftPressed, !!pressed);
        Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.touchLeftThisFrame, !!pressed);
      }
    },

    simulateRight(pressed) {
      if (BridgeContext.playerControlPtr) {
        Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.touchRightPressed, !!pressed);
        Memory.writeBool(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.touchRightThisFrame, !!pressed);
      }
    },

    getSledgeData() {
      if (!BridgeContext.playerControlPtr) return null;
      const dataPtr = Memory.readInt32(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.data);
      if (!dataPtr) return null;

      return {
        baseMoveSpeed: Memory.readFloat(dataPtr + OFFSETS.SledgeData.baseMoveSpeed),
        speedAcceleration: Memory.readFloat(dataPtr + OFFSETS.SledgeData.speedAcceleration),
        rotationSpeed: Memory.readFloat(dataPtr + OFFSETS.SledgeData.rotationSpeed),
        jumpSpeed: Memory.readFloat(dataPtr + OFFSETS.SledgeData.jumpSpeed)
      };
    },

    setSledgeData(updates) {
      if (!BridgeContext.playerControlPtr || !updates) return false;
      const dataPtr = Memory.readInt32(BridgeContext.playerControlPtr + OFFSETS.PlayerControl.data);
      if (!dataPtr) return false;

      if ('baseMoveSpeed' in updates) Memory.writeFloat(dataPtr + OFFSETS.SledgeData.baseMoveSpeed, updates.baseMoveSpeed);
      if ('speedAcceleration' in updates) Memory.writeFloat(dataPtr + OFFSETS.SledgeData.speedAcceleration, updates.speedAcceleration);
      if ('rotationSpeed' in updates) Memory.writeFloat(dataPtr + OFFSETS.SledgeData.rotationSpeed, updates.rotationSpeed);
      if ('jumpSpeed' in updates) Memory.writeFloat(dataPtr + OFFSETS.SledgeData.jumpSpeed, updates.jumpSpeed);
      return true;
    }
  };

  // --- Game Flow & State API ---
  const Game = {
    setStaticPointer(ptr) {
      BridgeContext.gameControlStaticPtr = ptr;
    },

    getScore() {
      if (BridgeContext.gameControlStaticPtr) {
        return Memory.readInt32(BridgeContext.gameControlStaticPtr + OFFSETS.GameControl.score);
      }
      return 0;
    },

    setScore(value) {
      const val = parseInt(value, 10);
      if (BridgeContext.gameControlStaticPtr) {
        Memory.writeInt32(BridgeContext.gameControlStaticPtr + OFFSETS.GameControl.score, val);
      }
      sendUnityMessage('GameControl', 'UpdateScore', val);
      return true;
    },

    getGifts() {
      if (BridgeContext.gameControlStaticPtr) {
        return Memory.readInt32(BridgeContext.gameControlStaticPtr + OFFSETS.GameControl.giftsThisGame);
      }
      return 0;
    },

    setGifts(amount) {
      const val = parseInt(amount, 10);
      if (BridgeContext.gameControlStaticPtr) {
        Memory.writeInt32(BridgeContext.gameControlStaticPtr + OFFSETS.GameControl.giftsThisGame, val);
      }
      sendUnityMessage('GameControl', 'set_gifts', val);
      return true;
    },

    lockGifts(amount) {
      Automation.giftLock = parseInt(amount, 10);
      this.setGifts(Automation.giftLock);
    },

    clearGiftLock() {
      Automation.giftLock = null;
    },

    getGameMode() {
      const modes = ['intro', 'main', 'play', 'end'];
      if (BridgeContext.gameControlStaticPtr) {
        const modeIndex = Memory.readInt32(BridgeContext.gameControlStaticPtr + OFFSETS.GameControl.gameMode);
        return modes[modeIndex] || 'unknown';
      }
      return 'unknown';
    },

    pause() {
      sendUnityMessage('GameManager', 'OnPauseGame');
      sendUnityMessage('GUIControl', 'OnWait');
      this.setTimeScale(0.0);
      return true;
    },

    resume() {
      sendUnityMessage('GameManager', 'OnResumeGame');
      sendUnityMessage('GUIControl', 'OnPlay');
      this.setTimeScale(1.0);
      return true;
    },

    startPlay() {
      sendUnityMessage('GameControl', 'Play');
      sendUnityMessage('GUIControl', 'OnPlay');
      return true;
    },

    returnToMenu() {
      sendUnityMessage('GameControl', 'Main');
      sendUnityMessage('GUIControl', 'OnMain');
      return true;
    },

    setTimeScale(scale) {
      const val = parseFloat(scale);
      sendUnityMessage('SlowMotion', 'setSpeed', val);
      sendUnityMessage('SlowMotion', 'Apply', val);
      return true;
    },

    showAd() {
      return sendUnityMessage('GameManager', 'ShowAd');
    },

    showRewardedAd() {
      sendUnityMessage('GameManager', 'OnRewardedVideoSuccess');
      sendUnityMessage('GameManagerGD', 'OnRewardedVideoSuccess');
      return true;
    }
  };

  // --- UI & Text Control API ---
  const UI = {
    setText(elementName, newText) {
      if (sendUnityMessage(elementName, 'SetText', String(newText))) return true;
      if (sendUnityMessage(elementName, 'Show', String(newText))) return true;

      if (BridgeContext.cachedTextComponents.has(elementName)) {
        const textPtr = BridgeContext.cachedTextComponents.get(elementName);
        return Memory.writeIl2CppString(textPtr, String(newText));
      }

      console.warn(`[GameAPI.UI] Target text element '${elementName}' not located.`);
      return false;
    },

    show3DText(str) {
      return sendUnityMessage('Text3D', 'Show', String(str));
    },

    registerTextPointer(name, ptr) {
      BridgeContext.cachedTextComponents.set(name, ptr);
    },

    getAllTextComponents() {
      return Array.from(BridgeContext.cachedTextComponents.entries()).map(([k, v]) => ({
        name: k,
        pointer: '0x' + v.toString(16)
      }));
    },

    changeCanvas(canvasName) {
      return sendUnityMessage('CanvasManager', 'ChangeCanvas', canvasName) ||
             sendUnityMessage('GUIControl', 'ChangeCanvas', canvasName);
    }
  };

  // --- Skins & Inventory API ---
  const Skins = {
    unlockAll() {
      sendUnityMessage('SledSkinControl', 'Read');
      sendUnityMessage('ShopGUIControl', 'OnClickSleds');
      return true;
    },

    setCurrentSkin(skinIndex) {
      return sendUnityMessage('GameControl', 'set_currentSkin', parseInt(skinIndex, 10));
    }
  };

  // --- Export GameAPI to global window ---
  global.GameAPI = {
    init: (exports) => BridgeContext.init(exports),
    isReady: () => !!(BridgeContext.unityInstance || global.unityInstance || global.gameInstance),
    sendMessage: (target, method, param) => sendUnityMessage(target, method, param),
    Player,
    Game,
    UI,
    Skins,
    Memory,
    Automation,
    OFFSETS,
    Context: BridgeContext
  };

  Automation.init();

  if (typeof document !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      BridgeContext.init();
    } else {
      document.addEventListener('DOMContentLoaded', () => BridgeContext.init());
    }
  }

})(typeof window !== 'undefined' ? window : this);
