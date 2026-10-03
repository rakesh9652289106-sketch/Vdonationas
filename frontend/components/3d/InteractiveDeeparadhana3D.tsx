'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { useAuth } from '@/lib/auth-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { Flame, Sparkles, Share2, CheckCircle2, RotateCcw, Heart, ShieldCheck } from 'lucide-react';

interface InteractiveDeeparadhana3DProps {
  className?: string;
}

export default function InteractiveDeeparadhana3D({
  className = 'w-full',
}: InteractiveDeeparadhana3DProps) {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const { showAlert } = useConfirmAlert();

  const [isLit, setIsLit] = useState(true);
  const isLitRef = useRef(true);
  isLitRef.current = isLit;

  const [flameIntensity, setFlameIntensity] = useState(1);
  const [devoteeName, setDevoteeName] = useState(user?.fullName || '');
  const [gotram, setGotram] = useState(user?.gotram || '1 - ACHAYANASA');
  const [intention, setIntention] = useState('Family Prosperity, Health & Divine Grace (ఆయురారోగ్య ఐశ్వర్యాభివృద్ధి)');
  const [consecratedAt, setConsecratedAt] = useState<string | null>(null);

  const handleLightDeepam = () => {
    setIsLit(true);
    templeAudio.playTempleBell(0.7);
    templeAudio.playFlowerChime(0.5);
    setConsecratedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    showAlert({
      type: 'change',
      title: '🪔 Akhanda Deepam Consecrated',
      message: `Divine Ghee Diya consecrated for ${devoteeName || 'Devotee'} (${gotram}). May Sri Vasavi Matha's eternal light dispel all obstacles.`,
    });
  };

  const handleToggleFlame = () => {
    if (isLit) {
      setIsLit(false);
      showAlert({
        type: 'warning',
        title: 'Deepam Extinguished',
        message: 'You have extinguished the virtual diya. Click "Light Sacred Diya" to rekindle the flame.',
      });
    } else {
      handleLightDeepam();
    }
  };

  const handleShareBlessing = () => {
    const text = `🪔 Consecrated Akhanda Deeparadhana for Sri Vasavi Kanyaka Parameswari Matha, Penugonda!\n\nDevotee: ${devoteeName || 'Sri Vasavi Devotee'}\nGotram: ${gotram}\nSankalpam: ${intention}\n\nMay the sacred flame bring wisdom and abundance to your home. Explore online darshan at: ${typeof window !== 'undefined' ? window.location.origin : ''}/darshan`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showAlert({
        type: 'change',
        title: 'Sankalpam Copied',
        message: 'Deepa Sankalpam blessing details copied to clipboard! Ready to share on WhatsApp.',
      });
    }
  };

  useEffect(() => {
    if (!containerEl) return;
    const container = containerEl;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 1.4, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL failed in InteractiveDeeparadhana3D:', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0c0806, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // Devotional Ambient & Diya Illumination
    const ambientLight = new THREE.AmbientLight(0xffedd5, 1.1);
    scene.add(ambientLight);

    const goldDirectional = new THREE.DirectionalLight(0xffbe3b, 1.8);
    goldDirectional.position.set(4, 8, 5);
    scene.add(goldDirectional);

    // Warm Flame Point Light
    const flamePointLight = new THREE.PointLight(0xff6a00, 3.2, 10);
    flamePointLight.position.set(0, 2.3, 0);
    scene.add(flamePointLight);

    const rimLight = new THREE.DirectionalLight(0x78350f, 0.9);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Brass & Gold Materials
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.88,
      roughness: 0.24,
    });

    const polishedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.16,
    });

    const darkBrassMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      metalness: 0.82,
      roughness: 0.35,
    });

    const gheeMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    const wickMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.9,
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
    });

    const lampGroup = new THREE.Group();

    // 1. BASE: Stepped Ornate Circular Pedestal
    const baseGeo1 = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 32);
    const baseMesh1 = new THREE.Mesh(baseGeo1, darkBrassMat);
    baseMesh1.position.y = 0.1;
    lampGroup.add(baseMesh1);

    const baseGeo2 = new THREE.CylinderGeometry(1.3, 1.5, 0.25, 32);
    const baseMesh2 = new THREE.Mesh(baseGeo2, brassMat);
    baseMesh2.position.y = 0.32;
    lampGroup.add(baseMesh2);

    // Lotus Petals Ring around base
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.18, 0.4, 4);
      const petalMesh = new THREE.Mesh(petalGeo, polishedBrassMat);
      petalMesh.position.set(Math.cos(angle) * 1.45, 0.22, Math.sin(angle) * 1.45);
      petalMesh.rotation.z = -Math.PI / 4;
      petalMesh.rotation.y = angle;
      lampGroup.add(petalMesh);
    }

    // 2. STEM: Ornate Turned Pillar Shaft
    const stemBaseGeo = new THREE.CylinderGeometry(0.35, 0.6, 0.4, 24);
    const stemBaseMesh = new THREE.Mesh(stemBaseGeo, brassMat);
    stemBaseMesh.position.y = 0.65;
    lampGroup.add(stemBaseMesh);

    const stemGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.1, 24);
    const stemMesh = new THREE.Mesh(stemGeo, polishedBrassMat);
    stemMesh.position.y = 1.35;
    lampGroup.add(stemMesh);

    // Ornate rings along stem
    [1.0, 1.4, 1.7].forEach((ry) => {
      const ringGeo = new THREE.TorusGeometry(0.3, 0.08, 12, 24);
      const ringMesh = new THREE.Mesh(ringGeo, brassMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = ry;
      lampGroup.add(ringMesh);
    });

    // 3. OIL BOWL (THALI / KATORI): Conical Flared Oil Reservoir
    const bowlOuterGeo = new THREE.CylinderGeometry(1.4, 0.3, 0.45, 32);
    const bowlOuterMesh = new THREE.Mesh(bowlOuterGeo, polishedBrassMat);
    bowlOuterMesh.position.y = 2.05;
    lampGroup.add(bowlOuterMesh);

    // Ghee pool inside bowl
    const gheeGeo = new THREE.CylinderGeometry(1.25, 1.1, 0.1, 32);
    const gheeMesh = new THREE.Mesh(gheeGeo, gheeMat);
    gheeMesh.position.y = 2.18;
    lampGroup.add(gheeMesh);

    // 4. PANCHA-MUKHA (5 WICKS & 5 NOZZLE CHANNELS)
    const wickMeshes: THREE.Mesh[] = [];
    const flameMeshes: THREE.Mesh[] = [];
    const flameLights: THREE.PointLight[] = [];

    // 5 Wick Positions (Center + 4 Cardinal/Pentagonal Spokes)
    const wickPositions: [number, number, number][] = [
      [0, 2.24, 0], // Central Akhanda Wick
      [1.15, 2.22, 0], // East
      [-1.15, 2.22, 0], // West
      [0, 2.22, 1.15], // South
      [0, 2.22, -1.15], // North
    ];

    wickPositions.forEach((pos, idx) => {
      // Brass Nozzle Beak
      if (idx > 0) {
        const beakGeo = new THREE.ConeGeometry(0.18, 0.35, 8);
        const beakMesh = new THREE.Mesh(beakGeo, polishedBrassMat);
        beakMesh.position.set(pos[0] * 1.05, pos[1] - 0.05, pos[2] * 1.05);
        beakMesh.rotation.x = pos[2] !== 0 ? (pos[2] > 0 ? Math.PI / 3 : -Math.PI / 3) : 0;
        beakMesh.rotation.z = pos[0] !== 0 ? (pos[0] > 0 ? -Math.PI / 3 : Math.PI / 3) : 0;
        lampGroup.add(beakMesh);
      }

      // Cotton Wick
      const wickGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.18, 8);
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.set(pos[0], pos[1] + 0.06, pos[2]);
      lampGroup.add(wickMesh);
      wickMeshes.push(wickMesh);

      // Tear-Drop 3D Flame
      const flameGeo = new THREE.ConeGeometry(idx === 0 ? 0.16 : 0.12, idx === 0 ? 0.55 : 0.42, 16);
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(pos[0], pos[1] + (idx === 0 ? 0.38 : 0.3), pos[2]);
      lampGroup.add(flameMesh);
      flameMeshes.push(flameMesh);

      // Local Wick Glow Light
      const wLight = new THREE.PointLight(idx === 0 ? 0xffaa00 : 0xff7700, idx === 0 ? 1.8 : 0.9, 4);
      wLight.position.set(pos[0], pos[1] + 0.35, pos[2]);
      lampGroup.add(wLight);
      flameLights.push(wLight);
    });

    // 5. CROWNING FINIAL: Sacred Brass Lakshmi/Hamsa Top
    const finialGeo = new THREE.CylinderGeometry(0.08, 0.16, 0.6, 12);
    const finialMesh = new THREE.Mesh(finialGeo, polishedBrassMat);
    finialMesh.position.y = 2.45;
    lampGroup.add(finialMesh);

    const finialCrownGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const finialCrownMesh = new THREE.Mesh(finialCrownGeo, brassMat);
    finialCrownMesh.position.y = 2.8;
    lampGroup.add(finialCrownMesh);

    scene.add(lampGroup);

    // 6. SACRED CAMPHOR SMOKE & EMBER PARTICLES
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 1.5;
      pPos[i * 3 + 1] = 2.4 + Math.random() * 2.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfff3b0,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    // Interactive Drag to Rotate Diya
    let isDragging = false;
    let prevX = 0;
    let rotationSpeed = 0.006;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      lampGroup.rotation.y += dx * rotationSpeed;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => handleResize());
      ro.observe(container);
    }

    // Animation Loop
    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.035;

      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        lampGroup.rotation.y += 0.003;
      }

      // Flame flickering physics
      const currentlyLit = isLitRef.current;
      flameMeshes.forEach((flame, i) => {
        if (currentlyLit) {
          flame.visible = true;
          const flicker = 1 + Math.sin(clock * 8 + i * 2) * 0.15 + (Math.random() - 0.5) * 0.08;
          flame.scale.set(flicker, flicker * 1.1, flicker);
          flameLights[i].intensity = (i === 0 ? 2.0 : 1.0) * flicker;
        } else {
          flame.visible = false;
          flameLights[i].intensity = 0;
        }
      });

      flamePointLight.intensity = currentlyLit ? 3.0 + Math.sin(clock * 10) * 0.5 : 0;
      pSystem.visible = currentlyLit;

      // Embers rising
      if (currentlyLit) {
        const positions = pSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pCount; i++) {
          positions[i * 3 + 1] += 0.012;
          positions[i * 3] += (Math.random() - 0.5) * 0.005;
          if (positions[i * 3 + 1] > 5.0) {
            positions[i * 3 + 1] = 2.4;
            positions[i * 3] = (Math.random() - 0.5) * 0.8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
          }
        }
        pSystem.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    handleResize();
    renderer.render(scene, camera);
    animate();

    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      try {
        renderer.dispose();
      } catch (e) {}
    };
  }, [containerEl]);

  return (
    <div className="bg-stone-900/90 rounded-3xl p-6 sm:p-8 border-2 border-devotional-gold/60 shadow-[0_20px_60px_rgba(212,175,55,0.25)] text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" /> ETERNAL DEVOTIONAL FLAME
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            3D Akhanda Deeparadhana (అఖండ దీపారాధన)
          </h2>
          <p className="text-stone-400 text-xs mt-0.5">
            Light a sacred 5-wick (Pancha-Mukha) brass ghee lamp consecrated for your family gotram & well-being
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFlame}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer transition-all shadow-md ${
              isLit
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/30'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Flame className={`w-4 h-4 ${isLit ? 'text-devotional-saffron animate-bounce' : 'text-stone-500'}`} />
            <span>{isLit ? 'Flame Glowing (Lit)' : 'Light Sacred Diya'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D WebGL Canvas */}
        <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#180e0a] to-stone-950 border border-amber-400/40 shadow-inner">
          <div ref={setContainerEl} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[10px] text-stone-300 flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Drag horizontally to rotate 360° • Pancha-Mukha Ghee Lamp</span>
          </div>

          <div className="absolute top-3 right-3 bg-amber-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 text-[10px] text-amber-300 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isLit ? 'Akhanda Jyoti Lit' : 'Ready to Light'}</span>
          </div>
        </div>

        {/* Personalized Deepa Sankalpam Dedication Form */}
        <div className="lg:col-span-5 bg-stone-950 p-6 rounded-2xl border border-amber-400/50 space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-devotional-saffron" />
              Family Deepa Sankalpam
            </h3>
            {consecratedAt && (
              <span className="text-[10px] text-emerald-400 font-mono">
                Lit at {consecratedAt}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Devotee / Karta Name
              </label>
              <input
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Arya Vysya Gotram
              </label>
              <input
                type="text"
                value={gotram}
                onChange={(e) => setGotram(e.target.value)}
                placeholder="e.g. 44 - MOUTHKALYASA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Prayer Intention / Sankalpam
              </label>
              <textarea
                rows={2}
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="State your prayer for Vasavi Matha's blessings"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:ring-2 focus:ring-amber-400 resize-none text-[11px]"
              />
            </div>
          </div>

          {/* Deepa Sloka Banner */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200/90 font-serif italic text-center">
            "దీపజ్యోతిః పరబ్రహ్మ దీపజ్యోతిర్ జనార్దనః |<br />
            దీపో హరతు మే పాపం సంధ్యాదీప నమోऽస్తుతే ||"
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleLightDeepam}
              className="py-3 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold shadow-gold hover:brightness-110 active-press transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-devotional-maroon" />
              <span>Consecrate Flame</span>
            </button>

            <button
              onClick={handleShareBlessing}
              className="py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-400/40 text-amber-300 font-bold hover:brightness-110 active-press transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Share Sankalpam</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
