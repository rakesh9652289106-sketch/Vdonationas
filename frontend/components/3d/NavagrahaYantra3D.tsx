'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { Sparkles, Sun, Shield, Orbit, HeartHandshake, Compass } from 'lucide-react';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

interface PlanetInfo {
  id: string;
  name: string;
  sanskrit: string;
  deity: string;
  gemstone: string;
  color: string;
  threeColor: number;
  distance: number;
  size: number;
  speed: number;
  mantra: string;
  benefit: string;
}

const PLANETS: PlanetInfo[] = [
  {
    id: 'surya',
    name: 'Sun (Surya)',
    sanskrit: 'ॐ सूर्याय नमः',
    deity: 'Surya Bhagavan',
    gemstone: 'Manikyam (Ruby)',
    color: '#FF4500',
    threeColor: 0xff4500,
    distance: 1.2,
    size: 0.28,
    speed: 0.8,
    mantra: 'Om Hram Hrim Hraum Sah Suryaya Namaha',
    benefit: 'Leadership, Vitality, Health, and Father blessings',
  },
  {
    id: 'chandra',
    name: 'Moon (Chandra)',
    sanskrit: 'ॐ चन्द्राय नमः',
    deity: 'Chandra Deva',
    gemstone: 'Muthyam (Pearl)',
    color: '#E0E6ED',
    threeColor: 0xe0e6ed,
    distance: 1.8,
    size: 0.22,
    speed: 1.1,
    mantra: 'Om Shram Shrim Shraum Sah Chandraya Namaha',
    benefit: 'Mental peace, emotional balance, mother blessings',
  },
  {
    id: 'mangala',
    name: 'Mars (Mangala)',
    sanskrit: 'ॐ भौमाय नमः',
    deity: 'Kuja / Subrahmanya',
    gemstone: 'Pagadam (Red Coral)',
    color: '#D22B2B',
    threeColor: 0xd22b2b,
    distance: 2.4,
    size: 0.2,
    speed: 0.6,
    mantra: 'Om Kram Krim Kraum Sah Bhaumaya Namaha',
    benefit: 'Courage, victory over debts & land prosperity',
  },
  {
    id: 'budha',
    name: 'Mercury (Budha)',
    sanskrit: 'ॐ बुधाय नमः',
    deity: 'Budha / Maha Vishnu',
    gemstone: 'Pachha (Emerald)',
    color: '#10B981',
    threeColor: 0x10b981,
    distance: 3.0,
    size: 0.21,
    speed: 0.9,
    mantra: 'Om Bram Brim Braum Sah Budhaya Namaha',
    benefit: 'Intellect, business acumen, communication skills',
  },
  {
    id: 'guru',
    name: 'Jupiter (Brihaspati)',
    sanskrit: 'ॐ गुरवे नमः',
    deity: 'Guru Bhagavan / Dakshinamurthy',
    gemstone: 'Pushparagam (Yellow Sapphire)',
    color: '#F59E0B',
    threeColor: 0xf59e0b,
    distance: 3.7,
    size: 0.35,
    speed: 0.4,
    mantra: 'Om Gram Grim Graum Sah Gurave Namaha',
    benefit: 'Wisdom, children, wealth, dharma and spiritual growth',
  },
  {
    id: 'shukra',
    name: 'Venus (Shukra)',
    sanskrit: 'ॐ शुक्राय नमः',
    deity: 'Shukra / Sri Mahalakshmi',
    gemstone: 'Vajram (Diamond)',
    color: '#F472B6',
    threeColor: 0xf472b6,
    distance: 4.4,
    size: 0.26,
    speed: 0.7,
    mantra: 'Om Dram Drim Draum Sah Shukraya Namaha',
    benefit: 'Marital bliss, luxuries, arts, beauty and vehicle yoga',
  },
  {
    id: 'shani',
    name: 'Saturn (Shani)',
    sanskrit: 'ॐ शनैश्चराय नमः',
    deity: 'Shani Bhagavan',
    gemstone: 'Neelam (Blue Sapphire)',
    color: '#3B82F6',
    threeColor: 0x3b82f6,
    distance: 5.1,
    size: 0.32,
    speed: 0.3,
    mantra: 'Om Pram Prim Praum Sah Shanaischaraya Namaha',
    benefit: 'Longevity, career stability, discipline and karmic relief',
  },
  {
    id: 'rahu',
    name: 'Rahu (North Node)',
    sanskrit: 'ॐ राहवे नमः',
    deity: 'Rahu / Durga Devi',
    gemstone: 'Gomedhikam (Hessonite)',
    color: '#8B5CF6',
    threeColor: 0x8b5cf6,
    distance: 5.8,
    size: 0.22,
    speed: 0.25,
    mantra: 'Om Bhram Bhrim Bhraum Sah Rahave Namaha',
    benefit: 'Foreign travels, sudden prosperity, overcoming illusions',
  },
  {
    id: 'ketu',
    name: 'Ketu (South Node)',
    sanskrit: 'ॐ केतवे नमः',
    deity: 'Ketu / Ganesha',
    gemstone: 'Vaidooryam (Cat’s Eye)',
    color: '#9CA3AF',
    threeColor: 0x9ca3af,
    distance: 6.4,
    size: 0.2,
    speed: 0.25,
    mantra: 'Om Stram Strim Straum Sah Ketave Namaha',
    benefit: 'Moksha, intuition, spiritual awakening and protection',
  },
];

function Navagraha2DChakraCanvas({
  selectedPlanet,
  onSelectPlanet,
}: {
  selectedPlanet: PlanetInfo;
  onSelectPlanet: (p: PlanetInfo) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let clock = 0;

    // Stable twinkling stars
    const stars: { x: number; y: number; s: number; alpha: number }[] = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        s: 0.8 + Math.random() * 1.6,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      clock += 0.016;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(cx, cy) * 0.90;

      // 1. Cosmic Deep Space Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) / 2);
      bgGrad.addColorStop(0, '#1c0915');
      bgGrad.addColorStop(0.5, '#0e040c');
      bgGrad.addColorStop(1, '#050205');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Stars
      stars.forEach((st) => {
        const sx = st.x * w;
        const sy = st.y * h;
        const twinkle = Math.sin(clock * 3 + st.x * 20) * 0.25;
        ctx.fillStyle = `rgba(255, 235, 180, ${Math.max(0.1, st.alpha + twinkle)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, st.s * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Central Sacred Sri Yantra Disc
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(clock * 0.2);

      // Outer gold circle
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, maxR * 0.16, 0, Math.PI * 2);
      ctx.stroke();

      // Golden sun rays
      for (let r = 0; r < 8; r++) {
        const ang = (Math.PI * 2 / 8) * r;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * (maxR * 0.08), Math.sin(ang) * (maxR * 0.08));
        ctx.lineTo(Math.cos(ang) * (maxR * 0.15), Math.sin(ang) * (maxR * 0.15));
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.lineWidth = 1.8 * dpr;
        ctx.stroke();
      }
      ctx.restore();

      // Center Bindu
      const binduGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, maxR * 0.06);
      binduGrad.addColorStop(0, '#ffffff');
      binduGrad.addColorStop(0.4, '#ffd700');
      binduGrad.addColorStop(1, 'rgba(255, 165, 0, 0)');
      ctx.fillStyle = binduGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.06, 0, Math.PI * 2);
      ctx.fill();

      // 4. Planetary Orbits & Spheres
      PLANETS.forEach((planet, idx) => {
        const orbitR = maxR * (0.22 + (idx / (PLANETS.length - 1)) * 0.72);

        // Orbit ring
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = planet.id === selectedPlanet.id
          ? 'rgba(255, 215, 0, 0.65)'
          : `${planet.color}40`;
        ctx.lineWidth = planet.id === selectedPlanet.id ? 2 * dpr : 1 * dpr;
        ctx.stroke();

        // Orbit angle
        const angle = (idx * (Math.PI * 2 / PLANETS.length)) + clock * (0.35 * planet.speed);
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR;
        const pSize = Math.max(5 * dpr, planet.size * 26 * dpr);

        // Planet Glow Halo
        const glowGrad = ctx.createRadialGradient(px, py, 1, px, py, pSize * 2.2);
        glowGrad.addColorStop(0, `${planet.color}dd`);
        glowGrad.addColorStop(0.5, `${planet.color}44`);
        glowGrad.addColorStop(1, `${planet.color}00`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(px, py, pSize * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Planet Sphere
        const sphereGrad = ctx.createRadialGradient(px - pSize * 0.3, py - pSize * 0.3, 1, px, py, pSize);
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.4, planet.color);
        sphereGrad.addColorStop(1, '#050505');
        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();

        // Selected Planet Target Reticle
        if (planet.id === selectedPlanet.id) {
          const reticleR = pSize * (1.8 + Math.sin(clock * 6) * 0.2);
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.arc(px, py, reticleR, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(11 * dpr)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(planet.name.split(' ')[0], px, py - reticleR - 4 * dpr);
        }
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedPlanet]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block cursor-pointer"
      style={{ background: 'transparent' }}
    />
  );
}

export default function NavagrahaYantra3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { confirmAction, showAlert } = useConfirmAlert();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo>(PLANETS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [webGlFailed, setWebGlFailed] = useState(false);

  const handleBookShantiPooja = async () => {
    const confirmed = await confirmAction({
      title: `Book ${selectedPlanet.name} Shanti Pooja?`,
      message: `Dedicate a sacred Navagraha Shanti Pooja for ${selectedPlanet.name} (Presiding Deity: ${selectedPlanet.deity}) for ₹501? Astrological blessing: ${selectedPlanet.benefit}.`,
      confirmText: 'Confirm Pooja (₹501)',
      variant: 'change',
    });
    if (!confirmed) return;

    showAlert({
      type: 'change',
      title: 'Navagraha Pooja Dedicated',
      message: `🙏 Navagraha Shanti Pooja booked for ${selectedPlanet.name}! May ${selectedPlanet.deity} shower divine grace and protection.`,
    });
  };

  const selectPlanet = (planet: PlanetInfo) => {
    setSelectedPlanet(planet);
    templeAudio.playFlowerChime(0.4);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 7.5, 9.5);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn('WebGL init failed in NavagrahaYantra3D, enabling 2D fallback:', err);
      setWebGlFailed(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('NavagrahaYantra3D: WebGL context lost');
      setWebGlFailed(true);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff0dd, 1.2);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xffd700, 3, 20);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Cosmic Yantra Central Core Group
    const yantraGroup = new THREE.Group();

    // Sacred Sri Yantra Central Disc
    const discGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
    });
    const discMesh = new THREE.Mesh(discGeo, goldMat);
    yantraGroup.add(discMesh);

    // Golden Bindu Sphere
    const binduGeo = new THREE.SphereGeometry(0.4, 24, 24);
    const binduMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const binduMesh = new THREE.Mesh(binduGeo, binduMat);
    binduMesh.position.y = 0.2;
    yantraGroup.add(binduMesh);

    scene.add(yantraGroup);

    // Planetary Rings and Spheres
    const planetMeshes: { mesh: THREE.Mesh; info: PlanetInfo; currentAngle: number }[] = [];
    const orbitRingsGroup = new THREE.Group();

    PLANETS.forEach((planet, index) => {
      // 3D Orbit Ring
      const ringGeo = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: planet.threeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      orbitRingsGroup.add(ringMesh);

      // Planet Gemstone Sphere
      const sphereGeo = new THREE.SphereGeometry(planet.size, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: planet.threeColor,
        metalness: 0.7,
        roughness: 0.2,
        emissive: planet.threeColor,
        emissiveIntensity: 0.4,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

      const startAngle = (index * (Math.PI * 2)) / PLANETS.length;
      sphereMesh.position.set(
        Math.cos(startAngle) * planet.distance,
        0,
        Math.sin(startAngle) * planet.distance
      );
      orbitRingsGroup.add(sphereMesh);

      planetMeshes.push({
        mesh: sphereMesh,
        info: planet,
        currentAngle: startAngle,
      });
    });

    scene.add(orbitRingsGroup);

    // Cosmic Star Particle Matrix
    const starCount = 100;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 20;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffe6a3,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
    });
    const starSystem = new THREE.Points(starGeo, starMat);
    scene.add(starSystem);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Center Yantra Rotation
      yantraGroup.rotation.y += 0.005;

      // Animate Planetary Orbits
      planetMeshes.forEach((item) => {
        item.currentAngle += 0.004 * item.info.speed;
        item.mesh.position.x = Math.cos(item.currentAngle) * item.info.distance;
        item.mesh.position.z = Math.sin(item.currentAngle) * item.info.distance;
        item.mesh.rotation.y += 0.02;
      });

      // Gentle Orbit Ring Tilt
      orbitRingsGroup.rotation.y += 0.001;

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
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="bg-stone-900/90 rounded-3xl p-6 sm:p-8 border-2 border-devotional-gold/60 shadow-[0_20px_60px_rgba(212,175,55,0.25)] text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Orbit className="w-4 h-4 text-amber-400" /> VEDIC ASTROLOGICAL ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            3D Interactive Navagraha Planetary Chakra
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-full border border-amber-400/40 text-xs text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time 3D Cosmic Celestial Mechanics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D WebGL Orbit Canvas or 2D Celestial Fallback */}
        <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#180a14] to-stone-950 border border-amber-400/40 shadow-inner">
          {webGlFailed ? (
            <Navagraha2DChakraCanvas
              selectedPlanet={selectedPlanet}
              onSelectPlanet={selectPlanet}
            />
          ) : (
            <div ref={mountRef} className="w-full h-full cursor-pointer" />
          )}
          
          <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[10px] text-stone-300 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>Click any planet below to tune blessings</span>
          </div>
        </div>

        {/* Selected Planet Details & Pooja Card */}
        <div className="lg:col-span-5 bg-stone-950 p-6 rounded-2xl border border-amber-400/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-4 h-4 rounded-full shadow-lg"
                style={{ backgroundColor: selectedPlanet.color }}
              />
              <h3 className="font-serif font-bold text-xl text-white">{selectedPlanet.name}</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 border border-amber-400/50 text-amber-300 font-bold">
              {selectedPlanet.gemstone}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">Vedic Beej Mantra</div>
            <p className="font-serif text-amber-300 text-sm font-semibold tracking-wide">
              {selectedPlanet.sanskrit}
            </p>
            <p className="text-xs text-stone-300 italic">"{selectedPlanet.mantra}"</p>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-300 border-b border-stone-800/80 pb-1">
              <span className="text-stone-400">Presiding Deity:</span>
              <span className="font-bold text-amber-200">{selectedPlanet.deity}</span>
            </div>
            <div className="flex justify-between text-stone-300 border-b border-stone-800/80 pb-1">
              <span className="text-stone-400">Astrological Blessings:</span>
              <span className="font-medium text-stone-200 text-right max-w-[200px]">{selectedPlanet.benefit}</span>
            </div>
          </div>

          <button
            onClick={handleBookShantiPooja}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            Book {selectedPlanet.name} Shanti Pooja (₹501)
          </button>
        </div>
      </div>

      {/* 9 Planet Quick Filter Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 pt-2">
        {PLANETS.map((planet) => (
          <button
            key={planet.id}
            onClick={() => selectPlanet(planet)}
            className={`px-2.5 py-2 rounded-xl text-center border transition-all flex flex-col items-center gap-1 ${
              selectedPlanet.id === planet.id
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-gold scale-105'
                : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: planet.color }}
            />
            <span className="text-[10px] font-bold truncate max-w-[70px]">
              {planet.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
