'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import {
  Coins,
  Sparkles,
  RotateCw,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  TrendingUp,
} from 'lucide-react';

interface SacredSwarnaHundi3DProps {
  className?: string;
  onCoinDropped?: (amount: number) => void;
  templeName?: string;
  compact?: boolean;
}

export default function SacredSwarnaHundi3D({
  className = 'w-full h-[420px]',
  onCoinDropped,
  templeName = 'Sri Vasavi Kanyaka Parameswari Temple',
  compact = false,
}: SacredSwarnaHundi3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [coinsDroppedCount, setCoinsDroppedCount] = useState<number>(342);
  const [totalAccumulated, setTotalAccumulated] = useState<number>(285700);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastDropAmount, setLastDropAmount] = useState<number | null>(null);

  // Three.js object references
  const hundiGroupRef = useRef<THREE.Group | null>(null);
  const activeCoinsGroupRef = useRef<THREE.Group | null>(null);
  const sparkleParticlesRef = useRef<THREE.Points | null>(null);
  const hundiLightRef = useRef<THREE.PointLight | null>(null);

  const presetAmounts = [101, 251, 501, 1001, 2501, 5001];

  const triggerCoinDrop = (dropAmount: number) => {
    if (isDropping) return;
    setIsDropping(true);
    setLastDropAmount(dropAmount);

    if (soundEnabled) {
      templeAudio.playCoinDrop(0.7);
    }

    // Spawn 3D Animated Coin in the scene
    if (activeCoinsGroupRef.current) {
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.95,
        roughness: 0.15,
      });

      const coinGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.06, 32);
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);

      // Starting position high above the slot
      coinMesh.position.set(0, 4.2, 0);
      coinMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      // Custom physics metadata
      (coinMesh as any).velocity = {
        y: -0.12,
        rotX: 0.15,
        rotZ: 0.12,
      };

      activeCoinsGroupRef.current.add(coinMesh);
    }

    // Flash light & trigger golden sparkle burst
    if (hundiLightRef.current) {
      hundiLightRef.current.intensity = 4.5;
    }

    setTimeout(() => {
      setCoinsDroppedCount((c) => c + 1);
      setTotalAccumulated((t) => t + dropAmount);
      setIsDropping(false);

      if (hundiLightRef.current) {
        hundiLightRef.current.intensity = 2.0;
      }

      if (onCoinDropped) {
        onCoinDropped(dropAmount);
      }
    }, 1100);
  };

  const handleAmountClick = (val: number) => {
    setSelectedAmount(val);
    setCustomAmount('');
    triggerCoinDrop(val);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedAmount(parsed);
      triggerCoinDrop(parsed);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 6.2);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e0, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe082, 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb45309, 1.5);
    rimLight.position.set(-4, 4, -4);
    scene.add(rimLight);

    // Hundi Aperture Golden Glow
    const hundiLight = new THREE.PointLight(0xffb300, 2.0, 8);
    hundiLight.position.set(0, 2.8, 0);
    hundiLightRef.current = hundiLight;
    scene.add(hundiLight);

    // 3. Hundi 3D Model Group
    const hundiGroup = new THREE.Group();
    hundiGroupRef.current = hundiGroup;

    // Materials
    const goldBrassMat = new THREE.MeshStandardMaterial({
      color: 0xdfa535,
      metalness: 0.88,
      roughness: 0.22,
    });

    const polishedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      metalness: 0.95,
      roughness: 0.15,
    });

    const darkCopperMat = new THREE.MeshStandardMaterial({
      color: 0x8d5b1b,
      metalness: 0.8,
      roughness: 0.35,
    });

    // 1. Plinth / Lotus Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(1.8, 2.1, 0.35, 36);
    const baseMesh = new THREE.Mesh(baseGeo, goldBrassMat);
    baseMesh.position.y = 0.17;
    baseMesh.receiveShadow = true;
    hundiGroup.add(baseMesh);

    // Base Lotus Petal Ring
    const petalRingGeo = new THREE.TorusGeometry(1.9, 0.09, 16, 36);
    const petalRing = new THREE.Mesh(petalRingGeo, darkCopperMat);
    petalRing.rotation.x = Math.PI / 2;
    petalRing.position.y = 0.32;
    hundiGroup.add(petalRing);

    // 2. Main Pot Vessel (Bulbous Kalasham Body)
    const bellyGeo = new THREE.SphereGeometry(1.5, 36, 24);
    bellyGeo.scale(1.0, 0.88, 1.0);
    const bellyMesh = new THREE.Mesh(bellyGeo, goldBrassMat);
    bellyMesh.position.y = 1.35;
    bellyMesh.castShadow = true;
    bellyMesh.receiveShadow = true;
    hundiGroup.add(bellyMesh);

    // Ornamental Mid-Belly Decorative Belt
    const beltGeo = new THREE.TorusGeometry(1.51, 0.07, 16, 48);
    beltGeo.scale(1.0, 0.88, 1.0);
    const beltMesh = new THREE.Mesh(beltGeo, polishedGoldMat);
    beltMesh.rotation.x = Math.PI / 2;
    beltMesh.position.y = 1.35;
    hundiGroup.add(beltMesh);

    // Embossed Central Sacred Yantra Emblem
    const emblemGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 24);
    const emblemMesh = new THREE.Mesh(emblemGeo, polishedGoldMat);
    emblemMesh.rotation.x = Math.PI / 2;
    emblemMesh.position.set(0, 1.35, 1.48);
    hundiGroup.add(emblemMesh);

    // 3. Neck & Collar
    const neckGeo = new THREE.CylinderGeometry(0.85, 1.1, 0.6, 32);
    const neckMesh = new THREE.Mesh(neckGeo, darkCopperMat);
    neckMesh.position.y = 2.15;
    hundiGroup.add(neckMesh);

    // Neck Flared Ring
    const collarGeo = new THREE.TorusGeometry(0.9, 0.08, 16, 36);
    const collarMesh = new THREE.Mesh(collarGeo, polishedGoldMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 2.45;
    hundiGroup.add(collarMesh);

    // 4. Domed Lid with Coin Slot
    const lidGeo = new THREE.CylinderGeometry(0.95, 0.85, 0.35, 36);
    const lidMesh = new THREE.Mesh(lidGeo, goldBrassMat);
    lidMesh.position.y = 2.65;
    hundiGroup.add(lidMesh);

    // Coin Aperture (Slot)
    const slotRimGeo = new THREE.BoxGeometry(0.85, 0.06, 0.18);
    const slotRim = new THREE.Mesh(slotRimGeo, darkCopperMat);
    slotRim.position.y = 2.83;
    hundiGroup.add(slotRim);

    // 5. Kalasha Finial Crown on Top
    const kalashPeakGeo = new THREE.ConeGeometry(0.25, 0.6, 16);
    const kalashPeak = new THREE.Mesh(kalashPeakGeo, polishedGoldMat);
    kalashPeak.position.set(0.65, 2.9, 0);
    kalashPeak.rotation.z = -0.2;
    hundiGroup.add(kalashPeak);

    const kalashPeakLeft = new THREE.Mesh(kalashPeakGeo, polishedGoldMat);
    kalashPeakLeft.position.set(-0.65, 2.9, 0);
    kalashPeakLeft.rotation.z = 0.2;
    hundiGroup.add(kalashPeakLeft);

    scene.add(hundiGroup);

    // 4. Active Coins Falling Group
    const activeCoinsGroup = new THREE.Group();
    activeCoinsGroupRef.current = activeCoinsGroup;
    scene.add(activeCoinsGroup);

    // 5. Sparkle Particles around Hundi
    const sparkleCount = 35;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      sparklePos[i * 3] = (Math.random() - 0.5) * 3.5;
      sparklePos[i * 3 + 1] = 0.5 + Math.random() * 3.0;
      sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }

    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xffe082,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const sparkleParticles = new THREE.Points(sparkleGeo, sparkleMat);
    sparkleParticlesRef.current = sparkleParticles;
    scene.add(sparkleParticles);

    // 6. Interactive Mouse Hover Parallax Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetRotY = x * 0.5;
      targetRotX = y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth Gentle Idle & Mouse Tilt
      hundiGroup.rotation.y += (targetRotY - hundiGroup.rotation.y) * 0.05 + 0.003;
      hundiGroup.rotation.x += (targetRotX - hundiGroup.rotation.x) * 0.05;

      // Animate active coins falling into slot
      for (let i = activeCoinsGroup.children.length - 1; i >= 0; i--) {
        const coin = activeCoinsGroup.children[i] as any;
        if (coin.velocity) {
          coin.position.y += coin.velocity.y;
          coin.rotation.x += coin.velocity.rotX;
          coin.rotation.z += coin.velocity.rotZ;

          // Once coin reaches the slot height (y <= 2.8)
          if (coin.position.y <= 2.8) {
            // Shrink and remove coin
            coin.scale.subScalar(0.1);
            if (coin.scale.x <= 0.1) {
              activeCoinsGroup.remove(coin);
            }
          }
        }
      }

      // Sparkle ambient twinkle
      if (sparkleParticlesRef.current) {
        const pArray = sparkleParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkleCount; i++) {
          pArray[i * 3 + 1] += 0.005;
          if (pArray[i * 3 + 1] > 3.8) {
            pArray[i * 3 + 1] = 0.5;
          }
        }
        sparkleParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-devotional-gold/60 shadow-2xl">
      {/* Golden Aura Ambiance Glow */}
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-devotional-maroon/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-devotional-gold/30 bg-stone-950/60 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-devotional-gold text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-bounce-short" />
            SACRED 3D E-HUNDI SEVA
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-amber-200">
            Swarna Hundi • {templeName}
          </h3>
        </div>

        {/* Audio Toggle & Verified Shield */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Tax-Exempt 80G
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-400 hover:text-amber-300 transition-colors"
            title={soundEnabled ? 'Mute coin drop sound' : 'Unmute coin drop sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative">
        <div ref={mountRef} className={className} />

        {/* Real-Time Live Offering Counters Ribbon */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <div className="px-3 py-1.5 rounded-xl bg-stone-950/80 border border-devotional-gold/40 backdrop-blur-md text-left shadow-lg">
            <p className="text-[10px] uppercase font-bold text-stone-400">Total Seva Accumulated</p>
            <p className="text-lg font-serif font-black text-amber-300">
              ₹{totalAccumulated.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-stone-900/80 border border-stone-700 backdrop-blur-md text-[11px] text-stone-300 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span><strong>{coinsDroppedCount}</strong> Coins Offered Today</span>
          </div>
        </div>

        {/* Last Drop Coin Notification Badge */}
        {lastDropAmount && (
          <div className="absolute top-4 right-4 z-10 animate-fadeIn flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-devotional-gold backdrop-blur-md text-xs font-bold text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Offered ₹{lastDropAmount.toLocaleString('en-IN')} in E-Hundi!</span>
          </div>
        )}
      </div>

      {/* Preset Offerings Ribbon */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-stone-950 via-stone-900 to-stone-950/80 border-t border-devotional-gold/30 backdrop-blur-md space-y-3">
        <p className="text-xs font-bold text-stone-300 text-left flex items-center justify-between">
          <span>Select Offering to Drop into 3D Hundi:</span>
          <span className="text-[11px] text-amber-300/80 font-normal">Click any coin to offer</span>
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={isDropping}
              onClick={() => handleAmountClick(amt)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold font-serif transition-all active:scale-95 disabled:opacity-50 border flex flex-col items-center justify-center gap-0.5 ${
                selectedAmount === amt
                  ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-stone-950 border-amber-300 shadow-gold'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-amber-200 border-devotional-gold/40'
              }`}
            >
              <span className="text-[10px] text-stone-400 font-sans">🪙 Drop</span>
              <span>₹{amt}</span>
            </button>
          ))}
        </div>

        {/* Custom Offering Input */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
              ₹
            </span>
            <input
              type="number"
              min="1"
              placeholder="Custom offering amount..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={isDropping || !customAmount}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5" />
            {isDropping ? 'Dropping...' : 'Drop Coin'}
          </button>
        </form>
      </div>
    </div>
  );
}
