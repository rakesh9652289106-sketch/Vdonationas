'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { Sparkles, Flame, BellRing, Flower2, Volume2, VolumeX, Sun, Moon, Sunrise, Eye } from 'lucide-react';

interface InteractiveDarshanSanctum3DProps {
  className?: string;
  onCoinDrop?: () => void;
}

export type DarshanTimeOfDay = 'suprabhatam' | 'madhyahna' | 'sandhya' | 'maha_aarti';

export default function InteractiveDarshanSanctum3D({
  className = 'w-full h-[540px]',
}: InteractiveDarshanSanctum3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<DarshanTimeOfDay>('sandhya');
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isAartiActive, setIsAartiActive] = useState(false);
  const [isFlowerShowerActive, setIsFlowerShowerActive] = useState(false);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [isIncenseActive, setIsIncenseActive] = useState(true);
  const [blessingMessage, setBlessingMessage] = useState<string | null>(null);

  // References to dynamic 3D elements for callbacks
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bellMeshRef = useRef<THREE.Group | null>(null);
  const bellSwingRef = useRef({ swinging: false, angle: 0, speed: 0 });
  const aartiFlameRef = useRef<THREE.PointLight | null>(null);
  const aartiGroupRef = useRef<THREE.Group | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const mainSpotLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const triggerFlowerShowerRef = useRef<(() => void) | null>(null);

  // Trigger Bell Ring
  const handleRingBell = useCallback(() => {
    setIsBellRinging(true);
    bellSwingRef.current.swinging = true;
    bellSwingRef.current.speed = 0.25;
    if (!isAudioMuted) {
      templeAudio.playTempleBell(0.8);
    }
    setBlessingMessage('🔔 Sacred Temple Ghanta Ringing... Divine Vibrations Awoken!');
    setTimeout(() => {
      setIsBellRinging(false);
      setTimeout(() => setBlessingMessage(null), 2500);
    }, 2000);
  }, [isAudioMuted]);

  // Trigger Flower Shower (Pushparchana)
  const handleFlowerShower = useCallback(() => {
    setIsFlowerShowerActive(true);
    if (triggerFlowerShowerRef.current) {
      triggerFlowerShowerRef.current();
    }
    if (!isAudioMuted) {
      templeAudio.playFlowerChime(0.5);
    }
    setBlessingMessage('🌺 Pushparchana Seva Offered to Sri Vasavi Matha!');
    setTimeout(() => {
      setIsFlowerShowerActive(false);
      setTimeout(() => setBlessingMessage(null), 2500);
    }, 3500);
  }, [isAudioMuted]);

  // Trigger Mangala Aarti
  const handleOfferAarti = useCallback(() => {
    setIsAartiActive((prev) => {
      const next = !prev;
      if (next) {
        if (!isAudioMuted) {
          templeAudio.playShankhaSound(0.5);
          setTimeout(() => templeAudio.playTempleBell(0.6), 800);
        }
        setBlessingMessage('🪔 Maha Mangala Aarti Seva in Progress... Om Sri Vasavi Kanyaka Parameswaryai Namaha!');
      } else {
        setBlessingMessage(null);
      }
      return next;
    });
  }, [isAudioMuted]);

  // Toggle Drone / Sacred Sound
  const toggleSound = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    templeAudio.toggleDrone(!nextMuted, 0.12);
  };

  // Switch Lighting Preset
  const handleTimePreset = (preset: DarshanTimeOfDay) => {
    setTimeOfDay(preset);
    if (!ambientLightRef.current || !mainSpotLightRef.current || !rimLightRef.current) return;

    if (preset === 'suprabhatam') {
      ambientLightRef.current.color.setHex(0xfff0dd);
      ambientLightRef.current.intensity = 1.4;
      mainSpotLightRef.current.color.setHex(0xffc56e);
      mainSpotLightRef.current.intensity = 2.4;
      rimLightRef.current.color.setHex(0xff9933);
    } else if (preset === 'madhyahna') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.8;
      mainSpotLightRef.current.color.setHex(0xfff3d1);
      mainSpotLightRef.current.intensity = 3.0;
      rimLightRef.current.color.setHex(0xffd700);
    } else if (preset === 'sandhya') {
      ambientLightRef.current.color.setHex(0x5c2b16);
      ambientLightRef.current.intensity = 1.1;
      mainSpotLightRef.current.color.setHex(0xffaa33);
      mainSpotLightRef.current.intensity = 2.0;
      rimLightRef.current.color.setHex(0xd4af37);
    } else if (preset === 'maha_aarti') {
      ambientLightRef.current.color.setHex(0x8a1c14);
      ambientLightRef.current.intensity = 1.5;
      mainSpotLightRef.current.color.setHex(0xff6600);
      mainSpotLightRef.current.intensity = 3.5;
      rimLightRef.current.color.setHex(0xffcc00);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x1a0d0a, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 7.8);
    camera.lookAt(0, 2.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Temple Sanctum Lighting
    const ambientLight = new THREE.AmbientLight(0x73381a, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const mainSpotLight = new THREE.DirectionalLight(0xffb84d, 2.2);
    mainSpotLight.position.set(2, 6, 6);
    scene.add(mainSpotLight);
    mainSpotLightRef.current = mainSpotLight;

    const rimLight = new THREE.PointLight(0xffa500, 3.0, 10);
    rimLight.position.set(0, 2.4, 2.2);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 3. Sanctum Architecture Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe5a93c,
      metalness: 0.9,
      roughness: 0.3,
    });
    const carvedWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d1c06,
      roughness: 0.8,
      metalness: 0.1,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe0e6ed,
      metalness: 0.85,
      roughness: 0.2,
    });

    // 4. Sanctum Pillars & Arch (Prabhavali Mandapam)
    const mandapamGroup = new THREE.Group();

    // Ornate Golden Arch (Prabhavali Ring)
    const torusGeo = new THREE.TorusGeometry(2.3, 0.12, 16, 64, Math.PI);
    const archMesh = new THREE.Mesh(torusGeo, goldMat);
    archMesh.position.set(0, 2.4, -0.2);
    mandapamGroup.add(archMesh);

    // Flame projections on Arch
    for (let i = 0; i <= 14; i++) {
      const angle = (Math.PI / 14) * i;
      const fx = Math.cos(angle) * 2.3;
      const fy = Math.sin(angle) * 2.3 + 2.4;
      const flameCone = new THREE.ConeGeometry(0.08, 0.28, 8);
      const flameMesh = new THREE.Mesh(flameCone, goldMat);
      flameMesh.position.set(fx, fy, -0.2);
      flameMesh.rotation.z = angle - Math.PI / 2;
      mandapamGroup.add(flameMesh);
    }

    // Left & Right Pillars
    [-2.2, 2.2].forEach((x) => {
      const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 4.6, 16);
      const pillarMesh = new THREE.Mesh(pillarGeo, goldMat);
      pillarMesh.position.set(x, 2.3, -0.1);
      mandapamGroup.add(pillarMesh);

      // Pillar base & capital
      const baseBox = new THREE.BoxGeometry(0.6, 0.25, 0.6);
      const baseMesh = new THREE.Mesh(baseBox, carvedWoodMat);
      baseMesh.position.set(x, 0.12, -0.1);
      mandapamGroup.add(baseMesh);

      const topBox = new THREE.BoxGeometry(0.6, 0.25, 0.6);
      const topMesh = new THREE.Mesh(topBox, carvedWoodMat);
      topMesh.position.set(x, 4.5, -0.1);
      mandapamGroup.add(topMesh);
    });

    // 5. Sanctum Pedestal (Peetham)
    const peethamGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.7, 32);
    const peethamMesh = new THREE.Mesh(peethamGeo, silverMat);
    peethamMesh.position.set(0, 0.35, 0);
    mandapamGroup.add(peethamMesh);

    scene.add(mandapamGroup);

    // 6. Sacred Sri Vasavi Matha Murti Image Plane
    const murtiGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/vasavi_goddess_sacred.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const murtiGeo = new THREE.PlaneGeometry(4.2, 4.2);
      const murtiMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const murtiMesh = new THREE.Mesh(murtiGeo, murtiMat);
      murtiMesh.position.set(0, 2.45, 0.05);
      murtiGroup.add(murtiMesh);
    });
    scene.add(murtiGroup);

    // 7. Hanging Brass Temple Bell (Rings with physics)
    const bellGroup = new THREE.Group();
    const bellChainGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
    const bellChainMesh = new THREE.Mesh(bellChainGeo, brassMat);
    bellChainMesh.position.set(0, 0.7, 0);
    bellGroup.add(bellChainMesh);

    const bellConeGeo = new THREE.CylinderGeometry(0.08, 0.35, 0.45, 24);
    const bellMesh = new THREE.Mesh(bellConeGeo, brassMat);
    bellMesh.position.set(0, 0, 0);
    bellGroup.add(bellMesh);

    const bellClapperGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const clapperMesh = new THREE.Mesh(bellClapperGeo, brassMat);
    clapperMesh.position.set(0, -0.2, 0);
    bellGroup.add(clapperMesh);

    bellGroup.position.set(-1.8, 3.8, 1.2);
    scene.add(bellGroup);
    bellMeshRef.current = bellGroup;

    // 8. Diya Lamps on Left & Right
    const diyasGroup = new THREE.Group();
    const diyaPositions = [
      [-1.5, 0.7, 1.2],
      [1.5, 0.7, 1.2],
      [-0.9, 0.7, 1.4],
      [0.9, 0.7, 1.4],
    ];

    diyaPositions.forEach(([dx, dy, dz]) => {
      const diyaBowlGeo = new THREE.CylinderGeometry(0.18, 0.08, 0.12, 16);
      const diyaBowl = new THREE.Mesh(diyaBowlGeo, brassMat);
      diyaBowl.position.set(dx, dy, dz);
      diyasGroup.add(diyaBowl);

      // Diya Flame Mesh
      const flameGeo = new THREE.ConeGeometry(0.04, 0.14, 8);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(dx, dy + 0.11, dz);
      diyasGroup.add(flame);
    });
    scene.add(diyasGroup);

    // 9. 3D Aarti Thali with Orbiting Motion
    const aartiGroup = new THREE.Group();
    const thaliPlateGeo = new THREE.CylinderGeometry(0.5, 0.45, 0.06, 24);
    const thaliPlate = new THREE.Mesh(thaliPlateGeo, goldMat);
    aartiGroup.add(thaliPlate);

    const aartiFlameGeo = new THREE.ConeGeometry(0.08, 0.25, 12);
    const aartiFlameMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const aartiFlameMesh = new THREE.Mesh(aartiFlameGeo, aartiFlameMat);
    aartiFlameMesh.position.set(0, 0.15, 0);
    aartiGroup.add(aartiFlameMesh);

    const aartiPointLight = new THREE.PointLight(0xff6600, 3.5, 5);
    aartiPointLight.position.set(0, 0.3, 0);
    aartiGroup.add(aartiPointLight);
    aartiFlameRef.current = aartiPointLight;

    aartiGroup.position.set(0, 1.4, 2.2);
    scene.add(aartiGroup);
    aartiGroupRef.current = aartiGroup;

    // 10. Dhoop / Incense Smoke Particle System
    const smokeCount = 70;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeSpeeds = new Float32Array(smokeCount);

    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 0.4 + 1.2;
      smokePositions[i * 3 + 1] = Math.random() * 2.8 + 0.7;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4 + 1.2;
      smokeSpeeds[i] = 0.006 + Math.random() * 0.008;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

    const smokeMat = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 0.14,
      transparent: true,
      opacity: 0.35,
    });
    const smokeSystem = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeSystem);

    // 11. Flower Shower (Pushparchana) Dynamic System
    const flowerCount = 180;
    const flowersGeo = new THREE.BufferGeometry();
    const flowerPositions = new Float32Array(flowerCount * 3);
    const flowerVelocities = new Float32Array(flowerCount * 3);
    const flowerActive = new Uint8Array(flowerCount);

    for (let i = 0; i < flowerCount; i++) {
      flowerPositions[i * 3] = (Math.random() - 0.5) * 6;
      flowerPositions[i * 3 + 1] = 6 + Math.random() * 3;
      flowerPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      flowerVelocities[i * 3] = (Math.random() - 0.5) * 0.015;
      flowerVelocities[i * 3 + 1] = -(0.02 + Math.random() * 0.03);
      flowerVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
      flowerActive[i] = 0;
    }
    flowersGeo.setAttribute('position', new THREE.BufferAttribute(flowerPositions, 3));

    const flowersMat = new THREE.PointsMaterial({
      color: 0xff6b35,
      size: 0.22,
      transparent: true,
      opacity: 0.9,
    });
    const flowerSystem = new THREE.Points(flowersGeo, flowersMat);
    scene.add(flowerSystem);

    // Flower Shower Trigger Hook
    triggerFlowerShowerRef.current = () => {
      for (let i = 0; i < flowerCount; i++) {
        flowerActive[i] = 1;
        flowerPositions[i * 3] = (Math.random() - 0.5) * 4.5;
        flowerPositions[i * 3 + 1] = 5.2 + Math.random() * 2.5;
        flowerPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
      flowersGeo.attributes.position.needsUpdate = true;
    };

    // 12. Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 2.2;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / height - 0.5) * 2;
      targetCameraX = nx * 1.2;
      targetCameraY = 2.2 - ny * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 13. Animation Loop
    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      // Smooth camera interpolation
      mouseX += (targetCameraX - mouseX) * 0.05;
      mouseY += (targetCameraY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 2.2, 0);

      // Bell physics swinging
      if (bellMeshRef.current && bellSwingRef.current.swinging) {
        bellSwingRef.current.angle = Math.sin(clock * 12) * bellSwingRef.current.speed;
        bellMeshRef.current.rotation.z = bellSwingRef.current.angle;
        bellSwingRef.current.speed *= 0.97;
        if (bellSwingRef.current.speed < 0.005) {
          bellSwingRef.current.swinging = false;
          bellMeshRef.current.rotation.z = 0;
        }
      }

      // Aarti motion (Circular devotional waving path)
      if (aartiGroupRef.current) {
        if (isAartiActive) {
          aartiGroupRef.current.visible = true;
          aartiGroupRef.current.position.x = Math.sin(clock * 3.5) * 1.2;
          aartiGroupRef.current.position.y = 1.8 + Math.cos(clock * 3.5) * 0.6;
          aartiGroupRef.current.position.z = 2.0 + Math.sin(clock * 1.8) * 0.4;
          if (aartiFlameRef.current) {
            aartiFlameRef.current.intensity = 4.0 + Math.sin(clock * 15) * 1.5;
          }
        } else {
          aartiGroupRef.current.visible = true;
          aartiGroupRef.current.position.set(0, 0.9, 1.8);
          if (aartiFlameRef.current) {
            aartiFlameRef.current.intensity = 1.8 + Math.sin(clock * 5) * 0.4;
          }
        }
      }

      // Diya flicker lighting
      if (rimLightRef.current) {
        rimLightRef.current.intensity = 2.8 + Math.sin(clock * 6) * 0.5 + Math.cos(clock * 14) * 0.3;
      }

      // Smoke particles rising
      if (isIncenseActive) {
        const sPos = smokeSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < smokeCount; i++) {
          sPos[i * 3 + 1] += smokeSpeeds[i];
          sPos[i * 3] += Math.sin(clock * 1.5 + i) * 0.003;
          if (sPos[i * 3 + 1] > 3.8) {
            sPos[i * 3 + 1] = 0.7;
            sPos[i * 3] = (Math.random() - 0.5) * 0.4 + 1.2;
          }
        }
        smokeSystem.geometry.attributes.position.needsUpdate = true;
      }

      // Flower Shower Animation
      const fPos = flowerSystem.geometry.attributes.position.array as Float32Array;
      let anyFlowerActive = false;
      for (let i = 0; i < flowerCount; i++) {
        if (flowerActive[i]) {
          anyFlowerActive = true;
          fPos[i * 3] += flowerVelocities[i * 3] + Math.sin(clock * 2 + i) * 0.004;
          fPos[i * 3 + 1] += flowerVelocities[i * 3 + 1];
          fPos[i * 3 + 2] += flowerVelocities[i * 3 + 2];
          if (fPos[i * 3 + 1] < 0.4) {
            flowerActive[i] = 0;
            fPos[i * 3 + 1] = 6;
          }
        }
      }
      if (anyFlowerActive) {
        flowersGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      templeAudio.toggleDrone(false);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isAartiActive, isIncenseActive]);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#260f0d] to-stone-950 border-2 border-devotional-gold/60 shadow-[0_20px_70px_rgba(212,175,55,0.35)] ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Darshan Timing & Lighting Selector */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>3D LIVE SANCTUM</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 bg-stone-950/80 backdrop-blur-md p-1 rounded-full border border-stone-700/60 text-[11px]">
          <button
            onClick={() => handleTimePreset('suprabhatam')}
            className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'suprabhatam'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Morning Suprabhatam Lighting"
          >
            <Sunrise className="w-3 h-3" /> Morning
          </button>
          <button
            onClick={() => handleTimePreset('madhyahna')}
            className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'madhyahna'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Midday Abhishekam Lighting"
          >
            <Sun className="w-3 h-3" /> Midday
          </button>
          <button
            onClick={() => handleTimePreset('sandhya')}
            className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'sandhya'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Evening Deeparadhana Lighting"
          >
            <Moon className="w-3 h-3" /> Evening
          </button>
          <button
            onClick={() => handleTimePreset('maha_aarti')}
            className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'maha_aarti'
                ? 'bg-devotional-saffron text-white font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Maha Aarti Special Lighting"
          >
            <Flame className="w-3 h-3" /> Maha Aarti
          </button>
        </div>
      </div>

      {/* Top Right: Audio Toggle & Fullscreen hint */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
            isAudioMuted
              ? 'bg-stone-900/80 border-stone-700 text-stone-400 hover:text-white'
              : 'bg-devotional-gold/30 border-devotional-gold text-amber-300 shadow-gold'
          }`}
          title={isAudioMuted ? 'Unmute Sacred Chant & Sounds' : 'Mute Sounds'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
        </button>
      </div>

      {/* Floating Dynamic Blessing Banner */}
      {blessingMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl bg-amber-950/90 backdrop-blur-md border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-serif font-bold text-center shadow-[0_10px_35px_rgba(212,175,55,0.4)] animate-bounce">
          {blessingMessage}
        </div>
      )}

      {/* Bottom Interactive Seva Actions Toolbar */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-center sm:justify-between gap-3 bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-devotional-gold/40 shadow-2xl">
        <div className="flex items-center gap-2 text-stone-300 text-xs font-serif hidden md:flex">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Move mouse / touch to explore 3D Sanctum perspective</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Seva Action 1: Ring Bell */}
          <button
            onClick={handleRingBell}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isBellRinging
                ? 'bg-amber-400 text-stone-950 scale-105 shadow-gold'
                : 'bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-400/40'
            }`}
          >
            <BellRing className={`w-4 h-4 text-amber-400 ${isBellRinging ? 'animate-bounce' : ''}`} />
            <span>Ring Ghanta</span>
          </button>

          {/* Seva Action 2: Flower Shower */}
          <button
            onClick={handleFlowerShower}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isFlowerShowerActive
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105'
                : 'bg-stone-900/90 hover:bg-stone-800 text-orange-300 border border-orange-400/40'
            }`}
          >
            <Flower2 className={`w-4 h-4 text-orange-400 ${isFlowerShowerActive ? 'animate-spin' : ''}`} />
            <span>Offer Pushparchana</span>
          </button>

          {/* Seva Action 3: Offer Mangala Aarti */}
          <button
            onClick={handleOfferAarti}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isAartiActive
                ? 'bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 scale-105 shadow-gold'
                : 'bg-gradient-to-r from-devotional-maroon to-devotional-saffron text-white hover:brightness-110'
            }`}
          >
            <Flame className={`w-4 h-4 text-amber-300 ${isAartiActive ? 'animate-pulse' : ''}`} />
            <span>{isAartiActive ? 'Maha Aarti Active' : 'Wave Karpoora Aarti'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
