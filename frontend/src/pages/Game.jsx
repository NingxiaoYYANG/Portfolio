import { useEffect, useMemo, useRef, useState } from 'react';
import Phaser from 'phaser';
import Modal from '../components/Modal';

const STORAGE_KEY = 'portfolio_unlocks_v1';

const unlockCards = {
  target1: {
    title: 'CourseMaper (COMP3900)',
    body:
      'Led a 3–6 person team to build a webapp that analyses course outlines and exam questions using Bloom’s Taxonomy. Implemented backend parsing/classification with a pre-trained BERT model, plus visual analytics and CI/CD.',
    tags: ['React', 'Flask', 'Python', 'BERT', 'CI/CD'],
  },
  target2: {
    title: 'SkillVerse (Hackathon)',
    body:
      'Led a 5-person team to build an AI-powered decentralised certification platform. Implemented NFT credential issuing via IPFS and used OpenAI API to generate a skill tree from user input.',
    tags: ['React', 'Solidity', 'IPFS', 'OpenAI API'],
  },
  target3: {
    title: 'UNSW Tutor (C++ & Rust)',
    body:
      'Tutored students in designing, building, and testing C++/Rust programs; ran code reviews and explained Rust ownership/borrowing for safe concurrency.',
    tags: ['C++', 'Rust', 'Code Review'],
  },
  target4: {
    title: 'MistWalker (GameDev)',
    body:
      'Top-down cooperative survival game built with Y3 Editor. Implemented movement, damage, UI, buffs, and item/unit mechanics under contest constraints.',
    tags: ['GameDev', 'UI', 'Gameplay Systems'],
  },
};

function readUnlocks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUnlocks(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

class TopdownShootScene extends Phaser.Scene {
  constructor({ emitter, initialUnlocks, effectsEnabled = true, maxBullets = 40, shotCooldownMs = 120 }) {
    super('TopdownShootScene');
    this.emitter = emitter;
    this.initialUnlocks = initialUnlocks || {};
    this.effectsEnabled = effectsEnabled;
    this.maxBullets = maxBullets;
    this.shotCooldownMs = shotCooldownMs;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x0b1020);

    // Player (simple triangle)
    this.player = this.add.triangle(width / 2, height / 2, 0, 18, 10, 0, 20, 18, 0xffffff);
    this.player.setOrigin(0.5, 0.5);

    // Controls
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.pointer = this.input.activePointer;

    // Touch controls for mobile (only for touch events, not mouse)
    this.touchMovePointer = null;
    this.touchShootPointer = null;
    this.input.addPointer(1); // Add second pointer for multi-touch
    
    // Track touch positions (only for touch events, not mouse)
    this.input.on('pointerdown', (pointer) => {
      // Only handle touch events, ignore mouse events
      const isTouch = pointer.event && (pointer.event.pointerType === 'touch' || pointer.event.touches);
      if (!isTouch) return;
      
      const touchX = pointer.x;
      const screenWidth = this.scale.width;
      
      // Left half of screen = movement, right half = shooting
      if (touchX < screenWidth / 2) {
        this.touchMovePointer = pointer;
      } else {
        this.touchShootPointer = pointer;
      }
    });
    
    this.input.on('pointerup', (pointer) => {
      // Only handle touch events
      const isTouch = pointer.event && (pointer.event.pointerType === 'touch' || pointer.event.touches);
      if (!isTouch) return;
      
      if (this.touchMovePointer === pointer) {
        this.touchMovePointer = null;
      }
      if (this.touchShootPointer === pointer) {
        this.touchShootPointer = null;
      }
    });
    
    this.input.on('pointermove', (pointer) => {
      // Only handle touch events
      const isTouch = pointer.event && (pointer.event.pointerType === 'touch' || pointer.event.touches);
      if (!isTouch) return;
      
      if (this.touchMovePointer === pointer || this.touchShootPointer === pointer) {
        // Update pointer position
        pointer.updateWorldPoint(this.cameras.main);
      }
    });

    // Bullets
    this.bullets = this.add.group();
    this.lastShotAt = 0;
    this.bulletSpeed = 650;

    // Targets - initialize with random positions within screen bounds
    const pad = 120;
    const minX = pad;
    const maxX = width - pad;
    const minY = pad;
    const maxY = height - pad;
    
    // Create targets with random starting positions
    const targets = [
      { id: 'target1', x: Phaser.Math.Between(minX, maxX), y: Phaser.Math.Between(minY, maxY) },
      { id: 'target2', x: Phaser.Math.Between(minX, maxX), y: Phaser.Math.Between(minY, maxY) },
      { id: 'target3', x: Phaser.Math.Between(minX, maxX), y: Phaser.Math.Between(minY, maxY) },
      { id: 'target4', x: Phaser.Math.Between(minX, maxX), y: Phaser.Math.Between(minY, maxY) },
    ];

    this.targets = targets.map((t) => this._createTarget(t.id, t.x, t.y));
    
    // Initialize random movement for each target
    this.targets.forEach((target) => {
      if (!target.unlocked) {
        // Random velocity
        target.vx = Phaser.Math.Between(-50, 50);
        target.vy = Phaser.Math.Between(-50, 50);
        // Movement boundaries
        target.minX = pad;
        target.maxX = width - pad;
        target.minY = pad;
        target.maxY = height - pad;
      }
    });

    // Apply initial unlocks (hide already-unlocked)
    Object.entries(this.initialUnlocks || {}).forEach(([id, unlocked]) => {
      if (!unlocked) return;
      const target = this.targets.find((x) => x.id === id);
      if (target) this._setTargetUnlocked(target);
    });

    // Reset hook
    this.emitter.on('reset', () => {
      this.targets.forEach((t) => this._resetTarget(t));
    });
    
    // Clear touch pointers hook (when modal closes)
    this.emitter.on('clearTouchPointers', () => {
      this.touchMovePointer = null;
      this.touchShootPointer = null;
    });
  }

  update(time, delta) {
    const { width, height } = this.scale;

    // Move - keyboard or touch
    const speed = 280;
    let vx = 0;
    let vy = 0;
    
    // Keyboard controls
    if (this.cursors.left.isDown) vx -= 1;
    if (this.cursors.right.isDown) vx += 1;
    if (this.cursors.up.isDown) vy -= 1;
    if (this.cursors.down.isDown) vy += 1;
    
    // Touch movement controls (left side of screen)
    if (this.touchMovePointer && this.touchMovePointer.isDown) {
      const dx = this.touchMovePointer.worldX - this.player.x;
      const dy = this.touchMovePointer.worldY - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        // Move towards touch point
        vx = dx / dist;
        vy = dy / dist;
      }
    }
    
    const len = Math.hypot(vx, vy) || 1;
    vx = (vx / len) * speed * (delta / 1000);
    vy = (vy / len) * speed * (delta / 1000);
    this.player.x = Phaser.Math.Clamp(this.player.x + vx, 20, width - 20);
    this.player.y = Phaser.Math.Clamp(this.player.y + vy, 20, height - 20);

    // Aim - use pointer or touch shoot pointer
    const aimPointer = this.touchShootPointer || this.pointer;
    const dx = aimPointer.worldX - this.player.x;
    const dy = aimPointer.worldY - this.player.y;
    const angle = Math.atan2(dy, dx) + Math.PI / 2;
    this.player.rotation = angle;

    // Shoot (hold mouse or touch on right side)
    // On desktop: mouse always shoots (regardless of position)
    // On mobile: only touch on right side shoots
    const isMouseDown = this.pointer.isDown && 
                       (!this.pointer.event || this.pointer.event.pointerType !== 'touch');
    const isTouchShooting = this.touchShootPointer && this.touchShootPointer.isDown;
    const isShooting = isMouseDown || isTouchShooting;
    
    if (isShooting && time - this.lastShotAt > this.shotCooldownMs) {
      this.lastShotAt = time;
      this._shoot(aimPointer);
    }
    
    // Update target positions (random movement)
    this.targets.forEach((target) => {
      if (target.unlocked || !target.visible) return;
      
      // Move target
      target.x += target.vx * (delta / 1000);
      target.y += target.vy * (delta / 1000);
      
      // Boundary checking and bounce
      if (target.x <= target.minX || target.x >= target.maxX) {
        target.vx = -target.vx;
        target.x = Phaser.Math.Clamp(target.x, target.minX, target.maxX);
        // Randomize velocity on bounce
        target.vy = Phaser.Math.Between(-50, 50);
      }
      if (target.y <= target.minY || target.y >= target.maxY) {
        target.vy = -target.vy;
        target.y = Phaser.Math.Clamp(target.y, target.minY, target.maxY);
        // Randomize velocity on bounce
        target.vx = Phaser.Math.Between(-50, 50);
      }
      
      // Update visual positions
      target.body.setPosition(target.x, target.y);
      target.outline.setPosition(target.x, target.y);
      target.label.setPosition(target.x, target.y + 42);
      target.barBg.setPosition(target.x, target.y - 46);
      target.barFill.setPosition(target.x - target.barFill.width / 2, target.y - 46);
      
      // Update hit rectangle
      target.hitRect.setPosition(target.x - 27, target.y - 27);
    });

    // Update bullets
    const toRemove = [];
    this.bullets.getChildren().forEach((b) => {
      b.x += b.vx * (delta / 1000);
      b.y += b.vy * (delta / 1000);
      b.life -= delta;
      if (b.life <= 0 || b.x < -40 || b.y < -40 || b.x > width + 40 || b.y > height + 40) {
        toRemove.push(b);
        return;
      }

      // Collisions with targets
      for (const t of this.targets) {
        if (t.unlocked) continue;
        if (!t.visible) continue;
        const hit = Phaser.Geom.Intersects.CircleToRectangle(
          new Phaser.Geom.Circle(b.x, b.y, 4),
          t.hitRect
        );
        if (hit) {
          toRemove.push(b);
          this._hitTarget(t);
          break;
        }
      }
    });

    toRemove.forEach((b) => {
      this.bullets.remove(b, true, true);
      b.destroy();
    });
  }

  _shoot(pointer = null) {
    if (this.bullets.getLength() > this.maxBullets) return;
    const aimPointer = pointer || this.pointer;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, aimPointer.worldX, aimPointer.worldY);
    const vx = Math.cos(angle) * this.bulletSpeed;
    const vy = Math.sin(angle) * this.bulletSpeed;

    const bullet = this.add.circle(this.player.x, this.player.y, 3, 0xffffff, 0.95);
    bullet.vx = vx;
    bullet.vy = vy;
    bullet.life = 1200; // ms
    this.bullets.add(bullet);
  }

  _createTarget(id, x, y) {
    const maxHp = 12;
    const body = this.add.rectangle(x, y, 54, 54, 0x223bff, 0.28);
    const outline = this.add.rectangle(x, y, 54, 54).setStrokeStyle(2, 0x7aa2ff, 0.9);
    const label = this.add.text(x, y + 42, id.toUpperCase(), { fontSize: '12px', color: '#aab7ff' }).setOrigin(0.5, 0.5);

    // HP bar (cartoon)
    const barW = 70;
    const barBg = this.add.rectangle(x, y - 46, barW, 10, 0x000000, 0.35).setStrokeStyle(1, 0xffffff, 0.15);
    const barFill = this.add.rectangle(x - barW / 2, y - 46, barW, 10, 0x7cfc92, 0.9).setOrigin(0, 0.5);

    const target = {
      id,
      x,
      y,
      maxHp,
      hp: maxHp,
      unlocked: false,
      body,
      outline,
      label,
      barBg,
      barFill,
      hitRect: new Phaser.Geom.Rectangle(x - 27, y - 27, 54, 54),
      visible: true,
    };
    return target;
  }

  _setTargetUnlocked(t) {
    t.unlocked = true;
    t.visible = false;
    [t.body, t.outline, t.label, t.barBg, t.barFill].forEach((o) => o.setVisible(false));
  }

  _resetTarget(t) {
    t.unlocked = false;
    t.visible = true;
    t.hp = t.maxHp;
    [t.body, t.outline, t.label, t.barBg, t.barFill].forEach((o) => o.setVisible(true));
    
    // Reset to random position and velocity
    const { width, height } = this.scale;
    const pad = 120;
    t.x = Phaser.Math.Between(pad, width - pad);
    t.y = Phaser.Math.Between(pad, height - pad);
    t.vx = Phaser.Math.Between(-50, 50);
    t.vy = Phaser.Math.Between(-50, 50);
    
    // Update visual positions
    t.body.setPosition(t.x, t.y);
    t.outline.setPosition(t.x, t.y);
    t.label.setPosition(t.x, t.y + 42);
    t.barBg.setPosition(t.x, t.y - 46);
    t.barFill.setPosition(t.x - t.barFill.width / 2, t.y - 46);
    t.hitRect.setPosition(t.x - 27, t.y - 27);
    
    this._updateBar(t);
  }

  _hitTarget(t) {
    t.hp = Math.max(0, t.hp - 1);
    // quick flash (optional)
    if (this.effectsEnabled) {
      t.outline.setStrokeStyle(3, 0xffffff, 1);
      this.time.delayedCall(60, () => {
        if (!t.unlocked) t.outline.setStrokeStyle(2, 0x7aa2ff, 0.9);
      });
    }

    this._updateBar(t);
    if (t.hp <= 0) {
      this._setTargetUnlocked(t);
      this.emitter.emit('unlock', t.id);
    }
  }

  _updateBar(t) {
    const pct = t.hp / t.maxHp;
    const barW = 70;
    t.barFill.width = barW * pct;
    t.barFill.fillColor = pct > 0.5 ? 0x7cfc92 : pct > 0.2 ? 0xffd36e : 0xff6b6b;
  }
}

export default function Game({ onSkip }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  const [unlockState, setUnlockState] = useState(() => readUnlocks());
  const [openedCardId, setOpenedCardId] = useState(null);
  const initialUnlocksRef = useRef(unlockState);

  const emitter = useMemo(() => new Phaser.Events.EventEmitter(), []);

  const [effectsEnabled, setEffectsEnabled] = useState(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    return mq ? !mq.matches : true;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scene = new TopdownShootScene({
      emitter,
      initialUnlocks: initialUnlocksRef.current,
      effectsEnabled,
      maxBullets: effectsEnabled ? 40 : 24,
      shotCooldownMs: effectsEnabled ? 120 : 170,
    });
    const config = {
      type: Phaser.CANVAS,
      parent: el,
      width: el.clientWidth,
      height: el.clientHeight,
      backgroundColor: '#0b1020',
      scene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      game.scale.resize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onUnlock = (id) => {
      setUnlockState((prev) => {
        const next = { ...(prev || {}), [id]: true };
        writeUnlocks(next);
        return next;
      });
      setOpenedCardId(id);
    };
    emitter.on('unlock', onUnlock);

    return () => {
      emitter.off('unlock', onUnlock);
      window.removeEventListener('resize', onResize);
      game.destroy(true);
      gameRef.current = null;
    };
  }, [emitter, effectsEnabled]);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUnlockState({});
    emitter.emit('reset');
  };

  const card = openedCardId ? unlockCards[openedCardId] : null;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* 控制区：Skip 和 Restart 按钮 */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
        <button
          onClick={() => {
            if (onSkip) {
              onSkip();
            } else {
              // 默认行为：滚动到 about
              const el = document.getElementById('about');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }}
          className="px-6 py-3 rounded-xl font-semibold text-base transition-all bg-gradient-to-r from-blue-500/80 to-indigo-500/80 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Skip to Portfolio ↓
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Restart
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Mini Game</h1>
          <p className="text-gray-300 mt-2">
            Shoot the 4 targets to unlock info cards. Progress is saved locally.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Controls: WASD move · Mouse aim · Hold click to shoot<br />
            Mobile: Touch left side to move · Touch right side to aim & shoot
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setEffectsEnabled((v) => !v)}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-100"
        >
          Effects: {effectsEnabled ? 'On' : 'Low'}
        </button>
        <span className="text-sm text-gray-400">
          (Low mode reduces flashes and bullet load for smoother performance)
        </span>
      </div>

      <div className="relative w-full h-[65vh] rounded-2xl border border-white/10 overflow-hidden bg-black/20">
        <div ref={containerRef} className="absolute inset-0" />

        <div className="absolute left-4 bottom-4 text-xs text-gray-300 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
          Unlocked: {Object.keys(unlockState || {}).length}/4
        </div>
      </div>

      <Modal
        isOpen={!!card}
        title={card?.title}
        onClose={() => {
          setOpenedCardId(null);
          // Clear touch pointers when modal closes to allow user to continue playing
          emitter.emit('clearTouchPointers');
        }}
      >
        {card && (
          <div className="space-y-3">
            <p className="text-gray-200 leading-relaxed">{card.body}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {card.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

