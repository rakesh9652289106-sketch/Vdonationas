'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import {
  Flame,
  Sparkles,
  RotateCw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Heart,
  Flower2,
  Share2,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';

interface SacredAkhandaDiya3DProps {
  className?: string;
  initiativeTitle?: string;
  initiativeCode?: string;
  onDeepamLit?: (devoteeName: string, sankalpam: string) => void;
}

export default function SacredAkhandaDiya3D({
  className = 'w-full h-[450px]',
  initiativeTitle,
  initiativeCode,
  onDeepamLit,
}: SacredAkhandaDiya3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ambience, setAmbience] = useState<'DAWN' | 'SANDHYA' | 'RATRI'>('SANDHYA');
  const [gheeLevel, setGheeLevel] = useState<number>(85);
  const [isPouringGhee, setIsPouringGhee] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [litCount, setLitCount] = useState<number>(108);
  const [isConsecrated, setIsConsecrated] = useState<boolean>(false);
  const [showSankalpaModal, setShowSankalpaModal] = useState<boolean>(false);
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [gotram, setGotram] = useState<string>('');
  const [sankalpaWish, setSankalpaWish] = useState<string>('');

  // Refs to hold Three.js elements that need runtime modification
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);
  const flameCoreRef = useRef<THREE.Mesh | null>(null);
  const emberParticlesRef = useRef<THREE.Points | null>(null);
  const petalsGroupRef = useRef<THREE.Group | null>(null);
  const diyaGroupRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bgLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Trigger Ghee Offering (Increases flame brilliance)
  const handleOfferGhee = () => {
    setIsPouringGhee(true);
    setGheeLevel((prev) => Math.min(100, prev + 15));
    if (soundEnabled) {
      templeAudio.playTempleBell(0.6);
    }

    // Temporary flame surge
    if (flameLightRef.current && flameMeshRef.current) {
      flameLightRef.current.intensity = 7.0;
      flameMeshRef.current.scale.set(1.4, 1.8, 1.4);
    }

    setTimeout(() => {
      if (flameLightRef.current && flameMeshRef.current) {
        flameLightRef.current.intensity = 4.0;
        flameMeshRef.current.scale.set(1, 1, 1);
      }
      setIsPouringGhee(false);
    }, 1500);
  };

  // Trigger Flower Offering (Pushparchana)
  const handleOfferFlowers = () => {
    if (soundEnabled) {
      templeAudio.playFlowerChime(0.5);
    }

    // Spawn falling flower petals in the 3D scene
    if (petalsGroupRef.current) {
      const petalMat = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0xff3b30 : 0xffcc00, // Hibiscus red or Marigold gold
        roughness: 0.6,
        side: THREE.DoubleSide,
      });

      for (let i = 0; i < 20; i++) {
        const petalGeo = new THREE.PlaneGeometry(0.18, 0.28);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(
          (Math.random() - 0.5) * 3,
          3 + Math.random() * 2,
          (Math.random() - 0.5) * 3
        );
        petal.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        (petal as any).velocity = {
          x: (Math.random() - 0.5) * 0.02,
          y: -0.025 - Math.random() * 0.02,
          z: (Math.random() - 0.5) * 0.02,
          rotSpeed: 0.03 + Math.random() * 0.03,
        };
        petalsGroupRef.current.add(petal);
      }
    }
  };

  // Submit Sankalpa & Light Dedicated Deepam
  const handleSankalpaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) return;

    if (soundEnabled) {
      templeAudio.playShankhaSound(0.6);
      setTimeout(() => templeAudio.playTempleBell(0.8), 600);
    }

    setLitCount((c) => c + 1);
    setIsConsecrated(true);
    setShowSankalpaModal(false);

    if (onDeepamLit) {
      onDeepamLit(devoteeName, sankalpaWish || 'Universal Peace & Family Prosperity');
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 6.8);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    bgLightRef.current = ambientLight;
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffdf99, 1.8);
    directionalLight.position.set(4, 8, 4);
    directionalLight.castShadow = true;
    dirLightRef.current = directionalLight;
    scene.add(directionalLight);

    // Flame Point Light (flickers in animation loop)
    const flameLight = new THREE.PointLight(0xff7700, 4.0, 12, 1.5);
    flameLight.position.set(0, 2.2, 0);
    flameLight.castShadow = true;
    flameLightRef.current = flameLight;
    scene.add(flameLight);

    // 3. 3D Diya Group
    const diyaGroup = new THREE.Group();
    diyaGroupRef.current = diyaGroup;

    // Brass Material with gold specular reflection
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfa535,
      metalness: 0.85,
      roughness: 0.28,
    });

    const darkBrassMaterial = new THREE.MeshStandardMaterial({
      color: 0x9b6b19,
      metalness: 0.8,
      roughness: 0.4,
    });

    const glowingOilMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0xb45309,
      emissiveIntensity: 0.4,
    });

    // Tier 1: Lotus Base Pedestal (Layered stepped rings)
    const baseGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.3, 36);
    const baseMesh = new THREE.Mesh(baseGeo, brassMaterial);
    baseMesh.position.y = 0.15;
    baseMesh.receiveShadow = true;
    diyaGroup.add(baseMesh);

    const baseRingGeo = new THREE.TorusGeometry(2.2, 0.08, 16, 36);
    const baseRing = new THREE.Mesh(baseRingGeo, darkBrassMaterial);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.25;
    diyaGroup.add(baseRing);

    // Tier 2: Fluted Stem / Pillar
    const stemGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.0, 24);
    const stemMesh = new THREE.Mesh(stemGeo, brassMaterial);
    stemMesh.position.y = 0.8;
    diyaGroup.add(stemMesh);

    // Tier 3: Stem Collar Ring
    const collarGeo = new THREE.CylinderGeometry(0.85, 0.7, 0.15, 24);
    const collarMesh = new THREE.Mesh(collarGeo, darkBrassMaterial);
    collarMesh.position.y = 1.35;
    diyaGroup.add(collarMesh);

    // Tier 4: Main Oil Reservoir (Bowl)
    const bowlGeo = new THREE.CylinderGeometry(1.6, 0.8, 0.7, 36);
    const bowlMesh = new THREE.Mesh(bowlGeo, brassMaterial);
    bowlMesh.position.y = 1.75;
    diyaGroup.add(bowlMesh);

    // Oil Pool inside Bowl
    const oilGeo = new THREE.CylinderGeometry(1.48, 1.48, 0.05, 32);
    const oilMesh = new THREE.Mesh(oilGeo, glowingOilMaterial);
    oilMesh.position.y = 2.05;
    diyaGroup.add(oilMesh);

    // Wick Holder (Center Pradakshina wick stand)
    const wickHolderGeo = new THREE.CylinderGeometry(0.18, 0.25, 0.3, 16);
    const wickHolder = new THREE.Mesh(wickHolderGeo, darkBrassMaterial);
    wickHolder.position.y = 2.15;
    diyaGroup.add(wickHolder);

    // Tier 5: The Sacred Flame (Double layered cone with emissive gradient)
    const flameGeo = new THREE.ConeGeometry(0.35, 1.1, 24);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.92,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 2.8;
    flameMeshRef.current = flameMesh;
    diyaGroup.add(flameMesh);

    // Inner Radiant Core of Flame
    const coreGeo = new THREE.ConeGeometry(0.18, 0.8, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfffaed,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 2.7;
    flameCoreRef.current = coreMesh;
    diyaGroup.add(coreMesh);

    // 4. Sacred Floating Embers / Sparks (Points Particle System)
    const emberCount = 45;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberSpeeds = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 0.8;
      emberPositions[i * 3 + 1] = 2.5 + Math.random() * 2.5;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      emberSpeeds[i] = 0.015 + Math.random() * 0.02;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const emberParticles = new THREE.Points(emberGeo, emberMat);
    emberParticlesRef.current = emberParticles;
    scene.add(emberParticles);

    // 5. Flower Petals Dynamic Group
    const petalsGroup = new THREE.Group();
    petalsGroupRef.current = petalsGroup;
    scene.add(petalsGroup);

    scene.add(diyaGroup);

    // 6. Interactive Drag & Mouse Orbiting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Subtle mouse parallax
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / width - 0.5;
        const y = (e.clientY - rect.top) / height - 0.5;
        targetRotationY = x * 0.6;
        targetRotationX = y * 0.3;
        return;
      }
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      diyaGroup.rotation.y += deltaX * 0.01;
      diyaGroup.rotation.x = Math.max(-0.4, Math.min(0.4, diyaGroup.rotation.x + deltaY * 0.01));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch handlers for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;

        diyaGroup.rotation.y += deltaX * 0.015;
        diyaGroup.rotation.x = Math.max(-0.4, Math.min(0.4, diyaGroup.rotation.x + deltaY * 0.015));
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 7. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = Date.now() * 0.005;

      // Gentle continuous idle rotation if not dragging
      if (!isDragging) {
        diyaGroup.rotation.y += (targetRotationY - diyaGroup.rotation.y) * 0.05 + 0.002;
        diyaGroup.rotation.x += (targetRotationX - diyaGroup.rotation.x) * 0.05;
      }

      // Procedural Flame Flutter & Organic Breathing
      if (flameMeshRef.current && flameCoreRef.current && flameLightRef.current) {
        const flicker = Math.sin(time * 3) * 0.08 + Math.cos(time * 7) * 0.05;
        const scaleY = 1.0 + flicker * 1.5;
        const scaleX = 1.0 - flicker * 0.5;

        flameMeshRef.current.scale.set(scaleX, scaleY, scaleX);
        flameCoreRef.current.scale.set(scaleX, scaleY * 0.95, scaleX);

        flameLightRef.current.intensity = 3.8 + Math.sin(time * 4) * 0.6 + Math.cos(time * 9) * 0.4;
      }

      // Animate Rising Embers
      if (emberParticlesRef.current) {
        const pos = emberParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < emberCount; i++) {
          pos[i * 3 + 1] += emberSpeeds[i];
          pos[i * 3] += Math.sin(time + i) * 0.003;
          if (pos[i * 3 + 1] > 5.2) {
            pos[i * 3 + 1] = 2.3;
            pos[i * 3] = (Math.random() - 0.5) * 0.6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
          }
        }
        emberParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Animate Falling Pushpa Petals
      if (petalsGroupRef.current) {
        for (let i = petalsGroupRef.current.children.length - 1; i >= 0; i--) {
          const petal = petalsGroupRef.current.children[i] as any;
          if (petal.velocity) {
            petal.position.x += petal.velocity.x;
            petal.position.y += petal.velocity.y;
            petal.position.z += petal.velocity.z;
            petal.rotation.x += petal.velocity.rotSpeed;
            petal.rotation.y += petal.velocity.rotSpeed;

            // Stop at floor
            if (petal.position.y <= 0.05) {
              petal.position.y = 0.05;
              petal.rotation.x = Math.PI / 2;
              petal.velocity.y = 0;
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
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
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Atmosphere Colors dynamically
  useEffect(() => {
    if (!sceneRef.current || !bgLightRef.current || !dirLightRef.current) return;

    if (ambience === 'DAWN') {
      bgLightRef.current.color.setHex(0xfff1dc);
      bgLightRef.current.intensity = 1.0;
      dirLightRef.current.color.setHex(0xffb74d);
    } else if (ambience === 'SANDHYA') {
      bgLightRef.current.color.setHex(0xffeedd);
      bgLightRef.current.intensity = 0.7;
      dirLightRef.current.color.setHex(0xff7043);
    } else {
      // RATRI (Deepotsavam)
      bgLightRef.current.color.setHex(0x1a120b);
      bgLightRef.current.intensity = 0.3;
      dirLightRef.current.color.setHex(0xe06d29);
    }
  }, [ambience]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-devotional-gold/60 shadow-2xl">
      {/* Dynamic Background Glow according to Ambience */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          ambience === 'DAWN'
            ? 'bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent'
            : ambience === 'SANDHYA'
            ? 'bg-gradient-to-tr from-orange-600/20 via-devotional-maroon/25 to-transparent'
            : 'bg-gradient-to-tr from-indigo-950/40 via-stone-950/80 to-transparent'
        }`}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-devotional-gold/30 backdrop-blur-md bg-stone-950/60">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-devotional-gold text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" />
            VIRTUAL 3D AKHANDA DEEPAM SANCTUM
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-200">
            {initiativeTitle ? `Sacred Flame: ${initiativeTitle}` : 'Sri Vasavi Matha Akhanda Deepam'}
          </h3>
          <p className="text-[11px] text-stone-400">
            Drag to rotate 360° • Offer ghee or flowers • Dedicate a sacred flame for eternal blessings
          </p>
        </div>

        {/* Ambience & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Ambience Buttons */}
          <div className="flex bg-stone-900/80 border border-stone-700 rounded-xl p-0.5">
            <button
              onClick={() => setAmbience('DAWN')}
              title="Dawn (Pratahkaala)"
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                ambience === 'DAWN'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" /> Dawn
            </button>
            <button
              onClick={() => setAmbience('SANDHYA')}
              title="Sandhya (Twilight Aarti)"
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                ambience === 'SANDHYA'
                  ? 'bg-devotional-saffron text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" /> Twilight
            </button>
            <button
              onClick={() => setAmbience('RATRI')}
              title="Ratri (Deepotsavam)"
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                ambience === 'RATRI'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" /> Night
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-400 hover:text-amber-300 transition-colors"
            title={soundEnabled ? 'Mute sacred chimes' : 'Unmute sacred chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative">
        <div ref={mountRef} className={className} />

        {/* Live Ghee Level Indicator on overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/70 border border-amber-500/30 backdrop-blur-md text-[11px]">
          <span className="text-stone-400 font-medium">Sacred Ghee:</span>
          <div className="w-16 h-2 rounded-full bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${gheeLevel}%` }}
            />
          </div>
          <span className="text-amber-300 font-bold font-mono">{gheeLevel}%</span>
        </div>

        {/* Consecrated Badge Overlay if Lit */}
        {isConsecrated && (
          <div className="absolute top-4 right-4 z-10 animate-bounce-short p-3 rounded-2xl bg-gradient-to-r from-devotional-maroon/90 to-amber-950/90 border border-devotional-gold backdrop-blur-md text-left shadow-xl max-w-xs">
            <div className="flex items-center gap-1.5 text-devotional-gold text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> DEEPAM CONSECRATED
            </div>
            <p className="text-xs text-stone-200 mt-0.5">
              Lit by <strong>{devoteeName}</strong>
            </p>
            {gotram && <p className="text-[10px] text-amber-300/80">Gotram: {gotram}</p>}
            <p className="text-[10px] text-stone-400 italic mt-0.5">
              &quot;Tamasa Ma Jyotirgamaya&quot; • May auspicious light prevail.
            </p>
          </div>
        )}

        {/* Dedicated Flame Counter Ribbon */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 border border-devotional-gold/40 backdrop-blur-md text-xs text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span><strong>{litCount}</strong> Sacred Deepams Offered Today</span>
        </div>
      </div>

      {/* Bottom Interactive Ritual Actions Ribbon */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-stone-950 via-stone-900 to-stone-950/80 border-t border-devotional-gold/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Offer Ghee */}
          <button
            onClick={handleOfferGhee}
            disabled={isPouringGhee}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-gold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-stone-950" />
            {isPouringGhee ? 'Surging Flame...' : 'Offer Ghee (Ghrita Seva)'}
          </button>

          {/* Action 2: Pushparchana (Flowers) */}
          <button
            onClick={handleOfferFlowers}
            className="px-4 py-2.5 rounded-xl bg-devotional-maroon/70 hover:bg-devotional-maroon border border-devotional-gold/50 text-amber-200 font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <Flower2 className="w-4 h-4 text-amber-300" />
            Pushparchana (Flowers)
          </button>
        </div>

        {/* Action 3: Dedicate a Flame (Sankalpam) */}
        <button
          onClick={() => setShowSankalpaModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 ml-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          Light Your Dedicated Deepam
        </button>
      </div>

      {/* Devotee Sankalpa Modal */}
      {showSankalpaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-stone-900 rounded-3xl border-2 border-devotional-gold p-6 space-y-5 text-stone-100 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl border border-amber-500/40">
                🪔
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-200">
                Akhanda Deepam Sankalpam
              </h3>
              <p className="text-xs text-stone-400">
                Dedicate an eternal lamp flame with your sacred gotram & prayers.
              </p>
            </div>

            <form onSubmit={handleSankalpaSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-stone-300">
                  Devotee / Family Name <span className="text-devotional-saffron">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Smt. Lakshmi & Sri Suresh Gupta"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-stone-300">Gothram (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Kasyapa, Bharadwaja, etc."
                  value={gotram}
                  onChange={(e) => setGotram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-stone-300">Prayer / Sankalpam Wish</label>
                <textarea
                  rows={2}
                  placeholder="e.g., For good health, prosperity, and successful initiative completion."
                  value={sankalpaWish}
                  onChange={(e) => setSankalpaWish(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSankalpaModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-700 text-stone-300 font-bold text-xs hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active:scale-95 transition-all"
                >
                  Light Deepam 🙏
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
