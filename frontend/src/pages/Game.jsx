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

    // Bullets
    this.bullets = this.add.group();
    this.lastShotAt = 0;
    this.bulletSpeed = 650;

    // Targets (4 corners)
    const pad = 120;
    const targets = [
      { id: 'target1', x: pad, y: pad },
      { id: 'target2', x: width - pad, y: pad },
      { id: 'target3', x: pad, y: height - pad },
      { id: 'target4', x: width - pad, y: height - pad },
    ];

    this.targets = targets.map((t) => this._createTarget(t.id, t.x, t.y));

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
  }

  update(time, delta) {
    const { width, height } = this.scale;

    // Move
    const speed = 280;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown) vx -= 1;
    if (this.cursors.right.isDown) vx += 1;
    if (this.cursors.up.isDown) vy -= 1;
    if (this.cursors.down.isDown) vy += 1;
    const len = Math.hypot(vx, vy) || 1;
    vx = (vx / len) * speed * (delta / 1000);
    vy = (vy / len) * speed * (delta / 1000);
    this.player.x = Phaser.Math.Clamp(this.player.x + vx, 20, width - 20);
    this.player.y = Phaser.Math.Clamp(this.player.y + vy, 20, height - 20);

    // Aim
    const dx = this.pointer.worldX - this.player.x;
    const dy = this.pointer.worldY - this.player.y;
    const angle = Math.atan2(dy, dx) + Math.PI / 2;
    this.player.rotation = angle;

    // Shoot (hold mouse)
    if (this.pointer.isDown && time - this.lastShotAt > this.shotCooldownMs) {
      this.lastShotAt = time;
      this._shoot();
    }

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

  _shoot() {
    if (this.bullets.getLength() > this.maxBullets) return;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.pointer.worldX, this.pointer.worldY);
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
            Controls: WASD move · Mouse aim · Hold click to shoot
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
        onClose={() => setOpenedCardId(null)}
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

