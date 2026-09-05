'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { Landmark, Sparkles, Compass, Eye, Info, MapPin } from 'lucide-react';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

interface Hotspot {
  id: string;
  name: string;
  sanskrit: string;
  desc: string;
  pos: [number, number, number];
}

const TEMPLE_HOTSPOTS: Hotspot[] = [
  {
    id: 'kalasam',
    name: 'Golden Kalasams (Stupi)',
    sanskrit: 'स्वर्ण कलश',
    desc: 'Sacred energy conductors atop the Rajagopuram attracting cosmic divine frequencies to the sanctum.',
    pos: [0, 5.8, 0],
  },
  {
    id: 'gopuram',
    name: 'Rajagopuram (Spire)',
    sanskrit: 'राजगोपुरम्',
    desc: 'Multi-tiered pyramidal Dravidian vimana decorated with sculptural vignettes of Goddess Vasavi Matha.',
    pos: [0, 3.2, 0],
  },
  {
    id: 'sanctum',
    name: 'Garbhagriha (Inner Sanctum)',
    sanskrit: 'गर्भगृह',
    desc: 'The innermost sanctuary consecrated with the divine moola vigraha of Sri Vasavi Kanyaka Parameswari.',
    pos: [0, 0.8, -0.2],
  },
  {
    id: 'dhwajasthambham',
    name: 'Dhwajasthambham (Flagstaff)',
    sanskrit: 'ध्वजस्तम्भ',
    desc: 'The cosmic axis pillar connecting Earthly prayers with celestial blessings, covered in brass & gold.',
    pos: [0, 1.6, 2.5],
  },
  {
    id: 'mandapam',
    name: 'Maha Mandapam (Pillar Hall)',
    sanskrit: 'महामण्डप',
    desc: 'Carved granite pillared congregation hall where devotees perform collective Sankalpa and Bhajans.',
    pos: [1.8, 1.2, 0.8],
  },
];

export default function TempleGopuram3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { confirmAction, showAlert } = useConfirmAlert();
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(TEMPLE_HOTSPOTS[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  const handleSponsorSeva = async () => {
    const confirmed = await confirmAction({
      title: `Sponsor ${selectedHotspot.name} Seva?`,
      message: `Are you sure you want to sponsor the seva dedicated to ${selectedHotspot.name} (${selectedHotspot.sanskrit}) for ₹2,501?`,
      confirmText: 'Sponsor Seva (₹2,501)',
      variant: 'change',
    });
    if (!confirmed) return;
    showAlert({
      type: 'change',
      title: 'Seva Dedicated',
      message: `🛕 Seva dedicated to ${selectedHotspot.name}! May Sri Vasavi Matha bless your family.`,
    });
  };

  const selectHotspot = (spot: Hotspot) => {
    setSelectedHotspot(spot);
    templeAudio.playFlowerChime(0.4);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 11);
    camera.lookAt(0, 2.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Warm Devotional Lighting
    const ambient = new THREE.AmbientLight(0xfff0dd, 1.0);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffb84d, 2.2);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const goldPoint = new THREE.PointLight(0xd4af37, 2.5, 15);
    goldPoint.position.set(0, 3, 2);
    scene.add(goldPoint);

    // Temple Complex 3D Model Group
    const templeGroup = new THREE.Group();

    // Materials
    const graniteMat = new THREE.MeshStandardMaterial({
      color: 0x4a3b32,
      roughness: 0.7,
      metalness: 0.15,
    });
    const maroonMat = new THREE.MeshStandardMaterial({
      color: 0x6e1b24,
      roughness: 0.6,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe0a838,
      metalness: 0.9,
      roughness: 0.25,
    });

    // 1. Temple Courtyard Base / Prakaram
    const baseGeo = new THREE.BoxGeometry(8, 0.3, 9);
    const baseMesh = new THREE.Mesh(baseGeo, graniteMat);
    baseMesh.position.y = 0.15;
    baseMesh.receiveShadow = true;
    templeGroup.add(baseMesh);

    // 2. Multi-Tiered Gopuram Tower
    const tiers = 6;
    for (let i = 0; i < tiers; i++) {
      const tierW = 3.6 - i * 0.45;
      const tierD = 2.8 - i * 0.35;
      const tierH = 0.65;
      const tierGeo = new THREE.BoxGeometry(tierW, tierH, tierD);
      const tierMesh = new THREE.Mesh(tierGeo, i % 2 === 0 ? maroonMat : goldMat);
      tierMesh.position.set(0, 1.2 + i * 0.65, 0);
      tierMesh.castShadow = true;
      templeGroup.add(tierMesh);

      // Decorative Cornice Ribs on each tier
      const corniceGeo = new THREE.BoxGeometry(tierW + 0.2, 0.1, tierD + 0.2);
      const cornice = new THREE.Mesh(corniceGeo, goldMat);
      cornice.position.set(0, 1.5 + i * 0.65, 0);
      templeGroup.add(cornice);
    }

    // 3. Golden Kalasams (3 Stupis on Top)
    [-0.5, 0, 0.5].forEach((xOffset) => {
      const kalasamGeo = new THREE.ConeGeometry(0.18, 0.7, 16);
      const kalasamMesh = new THREE.Mesh(kalasamGeo, goldMat);
      kalasamMesh.position.set(xOffset, 5.4, 0);
      kalasamMesh.castShadow = true;
      templeGroup.add(kalasamMesh);

      const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const sphere = new THREE.Mesh(sphereGeo, goldMat);
      sphere.position.set(xOffset, 5.8, 0);
      templeGroup.add(sphere);
    });

    // 4. Carved Pillared Mandapam Hall
    const pillarPositions = [
      [-2.8, 0.8, 2.0],
      [-1.4, 0.8, 2.0],
      [1.4, 0.8, 2.0],
      [2.8, 0.8, 2.0],
      [-2.8, 0.8, 0.0],
      [2.8, 0.8, 0.0],
    ];

    pillarPositions.forEach(([px, py, pz]) => {
      const pGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.8, 12);
      const pMesh = new THREE.Mesh(pGeo, graniteMat);
      pMesh.position.set(px, py + 0.6, pz);
      pMesh.castShadow = true;
      templeGroup.add(pMesh);
    });

    // 5. Dhwajasthambam (Golden Flagmast)
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.2, 16);
    const poleMesh = new THREE.Mesh(poleGeo, brassMat);
    poleMesh.position.set(0, 1.6, 2.8);
    poleMesh.castShadow = true;
    templeGroup.add(poleMesh);

    const flagGeo = new THREE.BoxGeometry(0.4, 0.3, 0.04);
    const flagMesh = new THREE.Mesh(flagGeo, goldMat);
    flagMesh.position.set(0.22, 2.9, 2.8);
    templeGroup.add(flagMesh);

    // 6. Sanctum Doorway Arch
    const doorGeo = new THREE.BoxGeometry(1.2, 1.6, 0.4);
    const doorMesh = new THREE.Mesh(doorGeo, goldMat);
    doorMesh.position.set(0, 0.8, 1.4);
    templeGroup.add(doorMesh);

    scene.add(templeGroup);

    // Floating Golden Aura Particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = Math.random() * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    // Mouse Controls
    let mouseX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      targetRotationY = mouseX * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (autoRotate) {
        templeGroup.rotation.y += 0.004;
      } else {
        templeGroup.rotation.y += (targetRotationY - templeGroup.rotation.y) * 0.05;
      }

      // Particle floating
      const positions = pSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        positions[i * 3 + 1] -= 0.008;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 8;
        }
      }
      pSystem.geometry.attributes.position.needsUpdate = true;

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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  return (
    <div className="bg-stone-900/90 rounded-3xl p-6 sm:p-8 border-2 border-devotional-gold/60 shadow-[0_20px_60px_rgba(212,175,55,0.25)] text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-amber-400" /> DRAVIDIAN TEMPLE ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            3D Temple Gopuram & Mandapam Explorer
          </h2>
        </div>

        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all ${
            autoRotate
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow'
              : 'bg-stone-950 border-stone-700 text-stone-300'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          {autoRotate ? '360° Auto-Orbit Active' : 'Manual View Control'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D WebGL Canvas */}
        <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#1e0e0a] to-stone-950 border border-amber-400/40 shadow-inner">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[10px] text-stone-300 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>Interactive 3D Vastu Shilpa Sastra Model</span>
          </div>
        </div>

        {/* Selected Architectural Feature */}
        <div className="lg:col-span-5 bg-stone-950 p-6 rounded-2xl border border-amber-400/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-devotional-saffron" />
              <h3 className="font-serif font-bold text-xl text-white">{selectedHotspot.name}</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-devotional-maroon text-amber-300 font-serif font-bold">
              {selectedHotspot.sanskrit}
            </span>
          </div>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed border-l-2 border-amber-400 pl-3 italic">
            "{selectedHotspot.desc}"
          </p>

          <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1 text-stone-300">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Agama Sastra Significance:
            </div>
            <p className="text-[11px] text-stone-400">
              Constructed according to ancient Vysya Vastu principles ensuring divine energy alignment and auspicious vibrations.
            </p>
          </div>

          <button
            onClick={handleSponsorSeva}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs shadow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Landmark className="w-4 h-4 text-devotional-maroon" />
            Sponsor {selectedHotspot.name} Seva (₹2,501)
          </button>
        </div>
      </div>

      {/* Hotspots Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
        {TEMPLE_HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            onClick={() => selectHotspot(spot)}
            className={`p-3 rounded-xl text-left border transition-all space-y-1 ${
              selectedHotspot.id === spot.id
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-gold scale-102'
                : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
            }`}
          >
            <div className="text-[11px] font-bold text-white flex items-center justify-between">
              <span>{spot.name.split(' ')[0]}</span>
              <Info className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[10px] text-stone-400 font-serif truncate">{spot.sanskrit}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
