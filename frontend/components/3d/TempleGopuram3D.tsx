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

function TempleGopuram2DCanvas({
  selectedHotspot,
  onSelectHotspot,
}: {
  selectedHotspot: Hotspot;
  onSelectHotspot: (spot: Hotspot) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let clock = 0;

    // Devotional glowing golden aura motes
    const particles: { x: number; y: number; s: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        s: 1.0 + Math.random() * 2.0,
        vy: 0.001 + Math.random() * 0.002,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      clock += 0.02;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      const w = canvas.width;
      const h = canvas.height;

      // 1. Twilight Devotional Sky Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0f0814'); // Deep night cosmic purple
      bgGrad.addColorStop(0.55, '#241018'); // Warm temple twilight
      bgGrad.addColorStop(0.85, '#451a14'); // Saffron sunset glow
      bgGrad.addColorStop(1, '#1b120c'); // Granite courtyard shadow
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Distant Horizon Golden Halo
      const haloGrad = ctx.createRadialGradient(w * 0.5, h * 0.65, 10, w * 0.5, h * 0.65, w * 0.55);
      haloGrad.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
      haloGrad.addColorStop(0.6, 'rgba(180, 83, 9, 0.12)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Floating Golden Aura Particles
      particles.forEach((p) => {
        p.y -= p.vy;
        if (p.y < 0) p.y = 1;
        const px = p.x * w;
        const py = p.y * h;
        const pulse = 0.7 + Math.sin(clock * 2 + p.x * 10) * 0.3;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha * pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, p.s * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Ground Prakaram (Granite Plinth)
      const groundY = h * 0.82;
      const baseGrad = ctx.createLinearGradient(0, groundY, 0, h);
      baseGrad.addColorStop(0, '#382a23');
      baseGrad.addColorStop(0.3, '#2a1f1a');
      baseGrad.addColorStop(1, '#150f0c');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Decorative plinth moulding gold line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(w * 0.05, groundY);
      ctx.lineTo(w * 0.95, groundY);
      ctx.stroke();

      const cx = w * 0.5;

      // 5. Pillared Maha Mandapam (Left & Right Colonnades)
      const isMandapam = selectedHotspot.id === 'mandapam';
      const pillarXOffsets = [-0.38, -0.30, -0.22, 0.22, 0.30, 0.38];
      pillarXOffsets.forEach((ratio) => {
        const px = cx + ratio * w;
        const pw = 8 * dpr;
        const ph = h * 0.22;
        const py = groundY - ph;
        ctx.fillStyle = isMandapam ? '#854d0e' : '#3f3129';
        ctx.fillRect(px - pw / 2, py, pw, ph);
        ctx.fillStyle = isMandapam ? '#facc15' : '#6b5447';
        ctx.fillRect(px - pw, py - 4 * dpr, pw * 2, 4 * dpr);
        ctx.fillRect(px - pw * 0.8, groundY - 4 * dpr, pw * 1.6, 4 * dpr);
      });

      ctx.fillStyle = isMandapam ? '#b45309' : '#4a3b32';
      ctx.fillRect(cx - w * 0.42, groundY - h * 0.22 - 6 * dpr, w * 0.24, 6 * dpr);
      ctx.fillRect(cx + w * 0.18, groundY - h * 0.22 - 6 * dpr, w * 0.24, 6 * dpr);

      // 6. Central Rajagopuram Vimana
      const isGopuram = selectedHotspot.id === 'gopuram';
      const isSanctum = selectedHotspot.id === 'sanctum';
      const isKalasam = selectedHotspot.id === 'kalasam';

      const tiers = 6;
      const gopuramBaseY = groundY;
      const gopuramTotalH = h * 0.62;
      const tierH = gopuramTotalH / tiers;
      const baseW = w * 0.36;

      for (let i = 0; i < tiers; i++) {
        const progress = i / tiers;
        const currentW = baseW * (1 - progress * 0.65);
        const topW = baseW * (1 - (i + 1) / tiers * 0.65);
        const ty = gopuramBaseY - (i + 1) * tierH;

        ctx.beginPath();
        ctx.moveTo(cx - currentW / 2, ty + tierH);
        ctx.lineTo(cx + currentW / 2, ty + tierH);
        ctx.lineTo(cx + topW / 2, ty);
        ctx.lineTo(cx - topW / 2, ty);
        ctx.closePath();

        const tierGrad = ctx.createLinearGradient(cx - currentW / 2, 0, cx + currentW / 2, 0);
        if (isGopuram) {
          tierGrad.addColorStop(0, '#5a121d');
          tierGrad.addColorStop(0.5, '#991b1b');
          tierGrad.addColorStop(1, '#5a121d');
        } else {
          tierGrad.addColorStop(0, i % 2 === 0 ? '#4c1d24' : '#2b1b17');
          tierGrad.addColorStop(0.5, i % 2 === 0 ? '#6e1b24' : '#452b22');
          tierGrad.addColorStop(1, i % 2 === 0 ? '#4c1d24' : '#2b1b17');
        }
        ctx.fillStyle = tierGrad;
        ctx.fill();

        ctx.strokeStyle = isGopuram ? '#fde047' : '#d4af37';
        ctx.lineWidth = (2 + (tiers - i) * 0.4) * dpr;
        ctx.beginPath();
        ctx.moveTo(cx - currentW / 2 - 4 * dpr, ty + tierH);
        ctx.lineTo(cx + currentW / 2 + 4 * dpr, ty + tierH);
        ctx.stroke();

        const nicheCount = 3 + (tiers - i);
        for (let n = 0; n < nicheCount; n++) {
          const nx = cx - (currentW * 0.4) + (currentW * 0.8 / Math.max(1, nicheCount - 1)) * n;
          const ny = ty + tierH * 0.45;
          ctx.fillStyle = '#1e090d';
          ctx.beginPath();
          ctx.arc(nx, ny, 3.5 * dpr, Math.PI, 0);
          ctx.lineTo(nx + 3.5 * dpr, ny + 4 * dpr);
          ctx.lineTo(nx - 3.5 * dpr, ny + 4 * dpr);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 7. Garbhagriha (Inner Sanctum Doorway)
      const doorW = baseW * 0.28;
      const doorH = h * 0.16;
      const doorY = groundY - doorH;

      ctx.strokeStyle = isSanctum ? '#fef08a' : '#d4af37';
      ctx.lineWidth = 3.5 * dpr;
      ctx.strokeRect(cx - doorW / 2, doorY, doorW, doorH);

      const sanctumGrad = ctx.createRadialGradient(cx, doorY + doorH * 0.5, 4, cx, doorY + doorH * 0.5, doorW);
      sanctumGrad.addColorStop(0, '#ffffff');
      sanctumGrad.addColorStop(0.3, '#ffd700');
      sanctumGrad.addColorStop(0.7, '#ea580c');
      sanctumGrad.addColorStop(1, '#2a0a0d');
      ctx.fillStyle = sanctumGrad;
      ctx.fillRect(cx - doorW / 2 + 2 * dpr, doorY + 2 * dpr, doorW - 4 * dpr, doorH - 2 * dpr);

      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.arc(cx, doorY + doorH * 0.45, 7 * dpr, 0, Math.PI * 2);
      ctx.fill();

      [-doorW * 0.7, doorW * 0.7].forEach((dx) => {
        const lx = cx + dx;
        const ly = groundY - 14 * dpr;
        ctx.fillStyle = '#b45309';
        ctx.fillRect(lx - 2 * dpr, ly, 4 * dpr, 14 * dpr);
        const flamePulse = Math.sin(clock * 8 + dx) * 2 * dpr;
        ctx.fillStyle = '#ffedd5';
        ctx.beginPath();
        ctx.arc(lx, ly - 3 * dpr, (4 * dpr) + flamePulse * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 8. Top Apex: Golden Kalasams (Stupis)
      const apexY = gopuramBaseY - gopuramTotalH;
      const kalasamOffsets = [-14 * dpr, 0, 14 * dpr];

      if (isKalasam) {
        const kalasamAura = ctx.createRadialGradient(cx, apexY - 15 * dpr, 5, cx, apexY - 15 * dpr, 45 * dpr);
        kalasamAura.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        kalasamAura.addColorStop(0.4, 'rgba(255, 215, 0, 0.6)');
        kalasamAura.addColorStop(1, 'rgba(255, 165, 0, 0)');
        ctx.fillStyle = kalasamAura;
        ctx.beginPath();
        ctx.arc(cx, apexY - 15 * dpr, 45 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      kalasamOffsets.forEach((kox, kidx) => {
        const kx = cx + kox;
        const ky = apexY;
        const kScale = kidx === 1 ? 1.25 : 1.0;

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(kx, ky - 8 * dpr * kScale, 5 * dpr * kScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(kx - 3 * dpr * kScale, ky - 8 * dpr * kScale);
        ctx.lineTo(kx, ky - 22 * dpr * kScale);
        ctx.lineTo(kx + 3 * dpr * kScale, ky - 8 * dpr * kScale);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(kx, ky - 22 * dpr * kScale, 1.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      // 9. Dhwajasthambam (Golden Flagstaff)
      const isFlagstaff = selectedHotspot.id === 'dhwajasthambam';
      const mastX = cx + w * 0.12;
      const mastH = h * 0.48;
      const mastTopY = groundY - mastH;

      const mastGrad = ctx.createLinearGradient(mastX - 3 * dpr, 0, mastX + 3 * dpr, 0);
      mastGrad.addColorStop(0, '#b45309');
      mastGrad.addColorStop(0.5, isFlagstaff ? '#fef08a' : '#fbbf24');
      mastGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = mastGrad;
      ctx.fillRect(mastX - 3 * dpr, mastTopY, 6 * dpr, mastH);

      for (let r = 0; r < 8; r++) {
        const ry = mastTopY + (mastH / 8) * r;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(mastX - 5 * dpr, ry, 10 * dpr, 2.5 * dpr);
      }

      const flagW = 28 * dpr;
      const flagH = 18 * dpr;
      const wave = Math.sin(clock * 5) * 3 * dpr;

      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(mastX + 3 * dpr, mastTopY + 4 * dpr);
      ctx.quadraticCurveTo(mastX + flagW * 0.5, mastTopY + 2 * dpr + wave, mastX + flagW, mastTopY + 12 * dpr + wave);
      ctx.lineTo(mastX + 3 * dpr, mastTopY + 4 * dpr + flagH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(mastX, mastTopY - 3 * dpr, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // 10. Selected Hotspot Pulse Badge Indicator
      let targetIndicator: { x: number; y: number; label: string } | null = null;
      if (selectedHotspot.id === 'kalasam') {
        targetIndicator = { x: cx, y: apexY - 24 * dpr, label: 'Kalasam' };
      } else if (selectedHotspot.id === 'gopuram') {
        targetIndicator = { x: cx, y: gopuramBaseY - gopuramTotalH * 0.55, label: 'Rajagopuram' };
      } else if (selectedHotspot.id === 'sanctum') {
        targetIndicator = { x: cx, y: doorY + doorH * 0.45, label: 'Garbhagriha' };
      } else if (selectedHotspot.id === 'dhwajasthambam') {
        targetIndicator = { x: mastX, y: mastTopY + mastH * 0.4, label: 'Dhwajasthambam' };
      } else if (selectedHotspot.id === 'mandapam') {
        targetIndicator = { x: cx - w * 0.30, y: groundY - h * 0.12, label: 'Maha Mandapam' };
      }

      if (targetIndicator) {
        const pulseR = (12 + Math.sin(clock * 4) * 4) * dpr;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(targetIndicator.x, targetIndicator.y, pulseR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(targetIndicator.x, targetIndicator.y, 3 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedHotspot]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickYRatio = (e.clientY - rect.top) / rect.height;
    const clickXRatio = (e.clientX - rect.left) / rect.width;

    if (clickYRatio < 0.28) {
      const spot = TEMPLE_HOTSPOTS.find((s) => s.id === 'kalasam');
      if (spot) onSelectHotspot(spot);
    } else if (clickXRatio > 0.58 && clickXRatio < 0.68) {
      const spot = TEMPLE_HOTSPOTS.find((s) => s.id === 'dhwajasthambam');
      if (spot) onSelectHotspot(spot);
    } else if (clickXRatio < 0.35 || clickXRatio > 0.65) {
      const spot = TEMPLE_HOTSPOTS.find((s) => s.id === 'mandapam');
      if (spot) onSelectHotspot(spot);
    } else if (clickYRatio > 0.62) {
      const spot = TEMPLE_HOTSPOTS.find((s) => s.id === 'sanctum');
      if (spot) onSelectHotspot(spot);
    } else {
      const spot = TEMPLE_HOTSPOTS.find((s) => s.id === 'gopuram');
      if (spot) onSelectHotspot(spot);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="w-full h-full block cursor-pointer"
      title="Click on the temple architecture to explore each sacred hotspot"
    />
  );
}

export default function TempleGopuram3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { confirmAction, showAlert } = useConfirmAlert();
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(TEMPLE_HOTSPOTS[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webGlFailed, setWebGlFailed] = useState(false);

  const autoRotateRef = useRef(true);
  autoRotateRef.current = autoRotate;

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

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn('WebGL init failed in TempleGopuram3D, activating 2D fallback:', err);
      setWebGlFailed(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('TempleGopuram3D: WebGL context lost');
      setWebGlFailed(true);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

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

      if (autoRotateRef.current) {
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
        {/* 3D WebGL Canvas or 2D Resilient Canvas */}
        <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#1e0e0a] to-stone-950 border border-amber-400/40 shadow-inner">
          {webGlFailed ? (
            <TempleGopuram2DCanvas
              selectedHotspot={selectedHotspot}
              onSelectHotspot={selectHotspot}
            />
          ) : (
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          )}

          <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[10px] text-stone-300 flex items-center gap-1.5 pointer-events-none">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>Interactive {webGlFailed ? 'Temple Architecture Canvas' : '3D Vastu Shilpa Sastra Model'}</span>
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
