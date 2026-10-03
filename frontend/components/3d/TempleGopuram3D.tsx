'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { Landmark, Sparkles, Compass, Eye, EyeOff, Info, MapPin, RotateCcw, RotateCw, Rotate3d, ShieldAlert, Maximize2, Minimize2, X } from 'lucide-react';
import { useGopuramExplorerVisibility } from '@/lib/feature-flags';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

// hide1: Flag to hide architectural details card & hotspot selection buttons for now
export const HIDE1_DEFAULT = true;

interface Hotspot {
  id: string;
  name: string;
  shortName: string;
  sanskrit: string;
  desc: string;
  highlight: string;
  icon: string;
  pos: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPos: [number, number, number];
}

const TEMPLE_HOTSPOTS: Hotspot[] = [
  {
    id: 'kalasam',
    name: 'Swarna Kalasam',
    shortName: 'Swarna Kalasam',
    sanskrit: 'स्वर्ण कलश',
    desc: 'Sacred golden pinnacle stupi crowning the central Vimana, drawing cosmic divine frequencies into the Garbhagriha.',
    highlight: '24K Gold Plated • Vedic Stupi Pinnacle',
    icon: '🪔',
    pos: [0.3, 5.8, -0.2],
    cameraTarget: [0.3, 5.2, -0.2],
    cameraPos: [-2.5, 6.2, 5.0],
  },
  {
    id: 'gopuram',
    name: 'Swarna Vimana',
    shortName: 'Swarna Vimana',
    sanskrit: 'स्वर्ण विमानम्',
    desc: 'Multi-tiered Dravidian golden vimana sculpted with ornamental salas, karnakutas, and sacred devakoshta niches.',
    highlight: 'Agama Sastra • 5-Tier Golden Shikhara',
    icon: '🛕',
    pos: [0.3, 3.4, -0.2],
    cameraTarget: [0.3, 3.2, -0.2],
    cameraPos: [-5.5, 4.8, 6.5],
  },
  {
    id: 'sanctum',
    name: 'Krishna Shila Garbhagriha',
    shortName: 'Garbhagriha',
    sanskrit: 'कृष्णशिला गर्भगृह',
    desc: 'The sacred inner sanctuary constructed from polished black granite stone, consecrating the divine vigraha of Sri Vasavi Matha.',
    highlight: 'Polished Black Granite • Moola Vigraha Sanctum',
    icon: '✨',
    pos: [0.3, 1.2, -0.2],
    cameraTarget: [0.3, 1.2, -0.2],
    cameraPos: [1.8, 2.2, 5.8],
  },
  {
    id: 'mandapam',
    name: 'Stambha Mandapam',
    shortName: 'Stambha Mandapam',
    sanskrit: 'స్తంభ మండపం',
    desc: 'Grand pillared colonnade hall with 32 hand-carved stone columns, jewel-banded shafts, and ornate bracket capitals.',
    highlight: '32 Ornate Carved Pillars • Colonnaded Hall',
    icon: '🏛️',
    pos: [-2.6, 1.2, 0.4],
    cameraTarget: [-2.6, 1.2, 0.4],
    cameraPos: [-6.8, 2.8, 4.5],
  },
  {
    id: 'prakaram',
    name: 'Checkered Prakaram',
    shortName: 'Prakaram Courtyard',
    sanskrit: 'ప్రాకార ప్రాంగణం',
    desc: 'Polished black-and-white diamond checkered stone courtyard facilitating sacred Pradakshina (circumambulation).',
    highlight: 'Diamond Checkered Stone • Pradakshina Path',
    icon: '⬛',
    pos: [-1.8, 0.45, 1.4],
    cameraTarget: [-1.8, 0.45, 1.4],
    cameraPos: [-4.5, 3.2, 5.0],
  },
];

function createCheckeredFloorTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(null as any);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const tileSize = 64;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        const isDark = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        if (isDark) {
          const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          grad.addColorStop(0, '#15171a');
          grad.addColorStop(0.5, '#22252a');
          grad.addColorStop(1, '#111215');
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        } else {
          const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          grad.addColorStop(0, '#e5e3de');
          grad.addColorStop(0.5, '#f4f2ee');
          grad.addColorStop(1, '#dbd8d2');
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, tileSize, tileSize);
        }
        ctx.strokeStyle = '#2d2f33';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBlackGraniteTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(null as any);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#16181b';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#2b2e34';
    ctx.lineWidth = 1.5;
    for (let y = 32; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
      const offset = (y / 32) % 2 === 0 ? 0 : 32;
      for (let x = offset; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, y - 32);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
    for (let i = 0; i < 400; i++) {
      const px = Math.random() * 256;
      const py = Math.random() * 256;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

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

      // 1. Twilight sky background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0c0712');
      skyGrad.addColorStop(0.5, '#201018');
      skyGrad.addColorStop(0.85, '#3b1812');
      skyGrad.addColorStop(1, '#18120e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Golden aura glow behind Vimana
      const haloGrad = ctx.createRadialGradient(w * 0.58, h * 0.42, 10, w * 0.58, h * 0.42, w * 0.45);
      haloGrad.addColorStop(0, 'rgba(245, 186, 26, 0.35)');
      haloGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.15)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Ground / Checkered Prakaram Floor (Isometric angle)
      const groundY = h * 0.76;
      ctx.fillStyle = '#26292e';
      ctx.fillRect(0, groundY, w, h - groundY);

      // Checkered tiles
      const tileCols = 16;
      const tileRows = 6;
      const tW = w / tileCols;
      const tH = (h - groundY) / tileRows;
      for (let r = 0; r < tileRows; r++) {
        for (let c = 0; c < tileCols; c++) {
          const isDark = (r + c) % 2 === 0;
          ctx.fillStyle = isDark ? '#141619' : '#cfccc6';
          ctx.fillRect(c * tW, groundY + r * tH, tW, tH);
        }
      }

      // 4. Black Granite Garbhagriha (Sanctum)
      const sanctumX = w * 0.42;
      const sanctumW = w * 0.34;
      const sanctumH = h * 0.22;
      const sanctumY = groundY - sanctumH;

      ctx.fillStyle = '#181a1e';
      ctx.fillRect(sanctumX, sanctumY, sanctumW, sanctumH);
      ctx.strokeStyle = '#2b2e34';
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(sanctumX, sanctumY, sanctumW, sanctumH);

      // 5. Multi-tiered Golden Swarna Vimana
      const vimanaBaseY = sanctumY;
      const vimanaTiers = 5;
      const vimanaTotalH = h * 0.44;
      const vimanaX = sanctumX + sanctumW * 0.5;

      for (let i = 0; i < vimanaTiers; i++) {
        const tierRatio = 1 - i * 0.16;
        const tierW = sanctumW * 0.95 * tierRatio;
        const tierH = vimanaTotalH / (vimanaTiers + 1);
        const tierY = vimanaBaseY - (i + 1) * tierH;
        const tX = vimanaX - tierW / 2;

        const gGrad = ctx.createLinearGradient(tX, 0, tX + tierW, 0);
        gGrad.addColorStop(0, '#d97706');
        gGrad.addColorStop(0.3, '#f59e0b');
        gGrad.addColorStop(0.5, '#fef08a');
        gGrad.addColorStop(0.7, '#f59e0b');
        gGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = gGrad;
        ctx.fillRect(tX, tierY, tierW, tierH);

        // Tier cornice
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(tX - 4 * dpr, tierY, tierW + 8 * dpr, 3 * dpr);
      }

      // 6. Golden Dome (Shikhara) & Kalasam Spire
      const domeY = vimanaBaseY - vimanaTiers * (vimanaTotalH / (vimanaTiers + 1));
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(vimanaX, domeY, 22 * dpr, Math.PI, 0);
      ctx.fill();

      // Kalasam
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(vimanaX, domeY - 32 * dpr);
      ctx.lineTo(vimanaX - 6 * dpr, domeY - 14 * dpr);
      ctx.lineTo(vimanaX + 6 * dpr, domeY - 14 * dpr);
      ctx.closePath();
      ctx.fill();

      // 7. Pillared Mandapam Colonnades (Left Wing & Front)
      const mandapamLeftW = w * 0.46;
      const mandapamRoofY = sanctumY + sanctumH * 0.15;
      const mandapamRoofH = 14 * dpr;

      // Mandapam Pillars (Turquoise bands, purple rings, white base)
      const pCols = 6;
      for (let p = 0; p < pCols; p++) {
        const px = w * 0.04 + p * (mandapamLeftW / pCols);
        const py = mandapamRoofY + mandapamRoofH;
        const pH = groundY - py;

        // White base
        ctx.fillStyle = '#f5f5f4';
        ctx.fillRect(px - 6 * dpr, groundY - 14 * dpr, 12 * dpr, 14 * dpr);

        // Shaft (Ivory)
        ctx.fillStyle = '#e7e5e4';
        ctx.fillRect(px - 4 * dpr, py + 8 * dpr, 8 * dpr, pH - 22 * dpr);

        // Turquoise bands
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(px - 5 * dpr, py + pH * 0.4, 10 * dpr, 8 * dpr);
        ctx.fillRect(px - 5 * dpr, py + pH * 0.65, 10 * dpr, 8 * dpr);

        // Purple rings
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(px - 6 * dpr, py + pH * 0.35, 12 * dpr, 3 * dpr);
        ctx.fillRect(px - 6 * dpr, py + pH * 0.6, 12 * dpr, 3 * dpr);

        // Capital bracket
        ctx.fillStyle = '#d6c7b2';
        ctx.fillRect(px - 8 * dpr, py, 16 * dpr, 8 * dpr);
      }

      // Mandapam Flat Roof with Yellow Cornice & Orange Trim
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(w * 0.02, mandapamRoofY + 8 * dpr, mandapamLeftW + w * 0.04, 6 * dpr);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(w * 0.015, mandapamRoofY, mandapamLeftW + w * 0.05, 8 * dpr);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedHotspot]);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => onSelectHotspot(TEMPLE_HOTSPOTS[1])}
      className="w-full h-full block cursor-pointer"
      title="Click on the temple architecture to explore each sacred hotspot"
    />
  );
}

export default function TempleGopuram3D() {
  const { isVisible } = useGopuramExplorerVisibility();
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const { confirmAction, showAlert } = useConfirmAlert();
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(TEMPLE_HOTSPOTS[1]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webGlFailed, setWebGlFailed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // hide1: Flag to hide architectural details card & hotspot selection buttons for now
  const [hide1State] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hide1');
      if (stored !== null) return stored === 'true';
    }
    return true; // Default: hidden for now in the name of hide1
  });
  const hide1 = hide1State;

  // 360° Temple Rotation Controls State & Refs
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const rotateTempleRef = useRef<((deltaDeg: number) => void) | null>(null);
  const setTempleAngleRef = useRef<((deg: number) => void) | null>(null);
  const resetAngleRef = useRef<(() => void) | null>(null);

  const handleRotateDelta = (deltaDeg: number) => {
    setAutoRotate(false);
    rotateTempleRef.current?.(deltaDeg);
  };

  const handleSetAngle = (deg: number) => {
    setAutoRotate(false);
    setRotationDegrees(deg);
    setTempleAngleRef.current?.(deg);
  };

  // ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Trigger window resize when fullscreen changes to ensure Three.js adapts immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 60);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const autoRotateRef = useRef(true);
  autoRotateRef.current = autoRotate;

  const currentCamPos = useRef(new THREE.Vector3(-6.5, 4.8, 8.5));
  const targetCamPos = useRef(new THREE.Vector3(-6.5, 4.8, 8.5));
  const currentCamLook = useRef(new THREE.Vector3(-0.4, 2.2, 0));
  const targetCamLook = useRef(new THREE.Vector3(-0.4, 2.2, 0));

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
    targetCamPos.current.set(...spot.cameraPos);
    targetCamLook.current.set(...spot.cameraTarget);
    templeAudio.playFlowerChime(0.4);
  };

  const resetView = () => {
    if (resetAngleRef.current) {
      resetAngleRef.current();
    } else {
      targetCamPos.current.set(-6.5, 4.8, 8.5);
      targetCamLook.current.set(-0.4, 2.2, 0);
    }
  };

  useEffect(() => {
    if (!containerEl) return;
    const container = containerEl;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentCamLook.current);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn('WebGL init failed in TempleGopuram3D, activating 2D fallback:', err);
      setWebGlFailed(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setClearColor(0x140e0a, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
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

    // Warm Devotional Temple Sunlight & Sky Ambient
    const ambient = new THREE.AmbientLight(0xffecd6, 1.4);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfff3cc, 2.4);
    sunLight.position.set(8, 16, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    scene.add(sunLight);

    const goldPoint = new THREE.PointLight(0xffbe1a, 2.2, 14);
    goldPoint.position.set(0.3, 4.5, 2.0);
    scene.add(goldPoint);

    const fillLight = new THREE.DirectionalLight(0x7ca1d9, 0.8);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    // Temple Complex 3D Model Group
    const templeGroup = new THREE.Group();

    // 1. Procedural Textures & Materials
    const checkeredFloorTex = createCheckeredFloorTexture();
    const blackGraniteTex = createBlackGraniteTexture();

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5b700,
      metalness: 0.88,
      roughness: 0.22,
    });
    const goldDeepMat = new THREE.MeshStandardMaterial({
      color: 0xc89205,
      metalness: 0.82,
      roughness: 0.32,
    });
    const goldLightMat = new THREE.MeshStandardMaterial({
      color: 0xffe675,
      metalness: 0.92,
      roughness: 0.15,
    });
    const blackGraniteMat = new THREE.MeshStandardMaterial({
      color: 0x181a1e,
      roughness: 0.6,
      metalness: 0.25,
      map: blackGraniteTex,
    });
    const checkeredFloorMat = new THREE.MeshStandardMaterial({
      map: checkeredFloorTex,
      roughness: 0.45,
      metalness: 0.2,
    });
    const plinthGreyMat = new THREE.MeshStandardMaterial({
      color: 0x2d3036,
      roughness: 0.8,
      metalness: 0.15,
    });
    const corniceYellowMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.4,
    });
    const corniceOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.45,
      metalness: 0.25,
    });
    const roofSlabMat = new THREE.MeshStandardMaterial({
      color: 0x8a7d6d,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Pillar component materials
    const pillarWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf0eeea,
      roughness: 0.4,
      metalness: 0.1,
    });
    const pillarTurquoiseMat = new THREE.MeshStandardMaterial({
      color: 0x009688,
      roughness: 0.3,
      metalness: 0.35,
    });
    const pillarPurpleMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.35,
      metalness: 0.3,
    });
    const pillarCapitalMat = new THREE.MeshStandardMaterial({
      color: 0xc9b89f,
      roughness: 0.6,
      metalness: 0.15,
    });

    // 2. TEMPLE FOUNDATION & CHECKERED COURTYARD PLINTH (ADHISTHANA)
    const basePlinthGeo = new THREE.BoxGeometry(10.5, 0.45, 7.8);
    const basePlinth = new THREE.Mesh(basePlinthGeo, plinthGreyMat);
    basePlinth.position.set(-1.0, 0.225, 0);
    basePlinth.receiveShadow = true;
    templeGroup.add(basePlinth);

    // Left Mandapam Checkered Floor
    const leftFloorGeo = new THREE.BoxGeometry(4.8, 0.05, 5.2);
    const leftFloor = new THREE.Mesh(leftFloorGeo, checkeredFloorMat);
    leftFloor.position.set(-3.2, 0.475, 0.2);
    leftFloor.receiveShadow = true;
    templeGroup.add(leftFloor);

    // Front Mandapam Checkered Floor
    const frontFloorGeo = new THREE.BoxGeometry(3.6, 0.05, 2.6);
    const frontFloor = new THREE.Mesh(frontFloorGeo, checkeredFloorMat);
    frontFloor.position.set(0.8, 0.475, 2.2);
    frontFloor.receiveShadow = true;
    templeGroup.add(frontFloor);

    // 3. BLACK GRANITE GARBHAGRIHA (SANCTUM SANCTORUM)
    const sanctumCenter = new THREE.Vector3(0.6, 0, -0.2);

    const sanctumW = 2.6, sanctumH = 1.6, sanctumD = 2.6;
    const sanctumGeo = new THREE.BoxGeometry(sanctumW, sanctumH, sanctumD);
    const sanctumMesh = new THREE.Mesh(sanctumGeo, blackGraniteMat);
    sanctumMesh.position.set(sanctumCenter.x, 0.45 + sanctumH / 2, sanctumCenter.z);
    sanctumMesh.castShadow = true;
    sanctumMesh.receiveShadow = true;
    templeGroup.add(sanctumMesh);

    const sanctumBaseGeo = new THREE.BoxGeometry(sanctumW + 0.2, 0.18, sanctumD + 0.2);
    const sanctumBase = new THREE.Mesh(sanctumBaseGeo, blackGraniteMat);
    sanctumBase.position.set(sanctumCenter.x, 0.54, sanctumCenter.z);
    sanctumBase.castShadow = true;
    templeGroup.add(sanctumBase);

    [-1.1, 0, 1.1].forEach((px) => {
      [-1.32, 1.32].forEach((pz) => {
        const pilasterGeo = new THREE.BoxGeometry(0.16, sanctumH - 0.2, 0.08);
        const pilaster = new THREE.Mesh(pilasterGeo, blackGraniteMat);
        pilaster.position.set(sanctumCenter.x + px, 0.45 + sanctumH / 2, sanctumCenter.z + pz);
        templeGroup.add(pilaster);
      });
    });

    // 4. THE MAJESTIC SWARNA VIMANA (GOLDEN DRAVIDIAN SHIKHARA / GOPURAM)
    const vimanaBaseY = 0.45 + sanctumH;

    const eaveGeo = new THREE.BoxGeometry(sanctumW + 0.4, 0.16, sanctumD + 0.4);
    const eaveMesh = new THREE.Mesh(eaveGeo, goldMat);
    eaveMesh.position.set(sanctumCenter.x, vimanaBaseY + 0.08, sanctumCenter.z);
    eaveMesh.castShadow = true;
    templeGroup.add(eaveMesh);

    const vimanaTiers = [
      { w: 2.5, d: 2.5, h: 0.65 },
      { w: 2.1, d: 2.1, h: 0.58 },
      { w: 1.7, d: 1.7, h: 0.52 },
      { w: 1.3, d: 1.3, h: 0.46 },
      { w: 0.95, d: 0.95, h: 0.38 },
    ];

    let currentTierY = vimanaBaseY + 0.16;

    vimanaTiers.forEach((t, tierIdx) => {
      const tierGeo = new THREE.BoxGeometry(t.w, t.h, t.d);
      const tierMesh = new THREE.Mesh(tierGeo, goldMat);
      tierMesh.position.set(sanctumCenter.x, currentTierY + t.h / 2, sanctumCenter.z);
      tierMesh.castShadow = true;
      templeGroup.add(tierMesh);

      const tCorniceGeo = new THREE.BoxGeometry(t.w + 0.18, 0.10, t.d + 0.18);
      const tCornice = new THREE.Mesh(tCorniceGeo, goldLightMat);
      tCornice.position.set(sanctumCenter.x, currentTierY + t.h + 0.05, sanctumCenter.z);
      tCornice.castShadow = true;
      templeGroup.add(tCornice);

      const kSize = 0.28 - tierIdx * 0.03;
      const kOffsets = [
        [-t.w / 2 + kSize / 2, -t.d / 2 + kSize / 2],
        [t.w / 2 - kSize / 2, -t.d / 2 + kSize / 2],
        [-t.w / 2 + kSize / 2, t.d / 2 - kSize / 2],
        [t.w / 2 - kSize / 2, t.d / 2 - kSize / 2],
      ];
      kOffsets.forEach(([kx, kz]) => {
        const kGeo = new THREE.BoxGeometry(kSize, t.h * 0.85, kSize);
        const kMesh = new THREE.Mesh(kGeo, goldDeepMat);
        kMesh.position.set(sanctumCenter.x + kx, currentTierY + (t.h * 0.85) / 2, sanctumCenter.z + kz);
        kMesh.castShadow = true;
        templeGroup.add(kMesh);

        const kDomeGeo = new THREE.SphereGeometry(kSize * 0.55, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const kDome = new THREE.Mesh(kDomeGeo, goldLightMat);
        kDome.position.set(sanctumCenter.x + kx, currentTierY + t.h * 0.85, sanctumCenter.z + kz);
        templeGroup.add(kDome);
      });

      const salaW = t.w * 0.42;
      const salaGeo = new THREE.CylinderGeometry(salaW * 0.5, salaW * 0.5, 0.12, 12, 1, false, 0, Math.PI);
      const salaFront = new THREE.Mesh(salaGeo, goldDeepMat);
      salaFront.rotation.z = Math.PI / 2;
      salaFront.rotation.y = Math.PI / 2;
      salaFront.position.set(sanctumCenter.x, currentTierY + t.h * 0.75, sanctumCenter.z + t.d / 2 + 0.05);
      templeGroup.add(salaFront);

      const salaBack = salaFront.clone();
      salaBack.position.z = sanctumCenter.z - t.d / 2 - 0.05;
      templeGroup.add(salaBack);

      currentTierY += t.h + 0.10;
    });

    const grivaRadius = 0.48;
    const grivaH = 0.28;
    const grivaGeo = new THREE.CylinderGeometry(grivaRadius, grivaRadius * 1.05, grivaH, 16);
    const grivaMesh = new THREE.Mesh(grivaGeo, goldDeepMat);
    grivaMesh.position.set(sanctumCenter.x, currentTierY + grivaH / 2, sanctumCenter.z);
    templeGroup.add(grivaMesh);
    currentTierY += grivaH;

    const domeGeo = new THREE.SphereGeometry(0.58, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const domeMesh = new THREE.Mesh(domeGeo, goldMat);
    domeMesh.position.set(sanctumCenter.x, currentTierY + 0.1, sanctumCenter.z);
    domeMesh.scale.set(1.0, 1.25, 1.0);
    domeMesh.castShadow = true;
    templeGroup.add(domeMesh);
    currentTierY += 0.55;

    const lotusBaseGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.08, 16);
    const lotusBase = new THREE.Mesh(lotusBaseGeo, goldLightMat);
    lotusBase.position.set(sanctumCenter.x, currentTierY, sanctumCenter.z);
    templeGroup.add(lotusBase);

    const kalasaKumbhaGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const kalasaKumbha = new THREE.Mesh(kalasaKumbhaGeo, goldLightMat);
    kalasaKumbha.position.set(sanctumCenter.x, currentTierY + 0.14, sanctumCenter.z);
    kalasaKumbha.scale.set(1.0, 1.2, 1.0);
    kalasaKumbha.castShadow = true;
    templeGroup.add(kalasaKumbha);

    const stupiNeedleGeo = new THREE.ConeGeometry(0.06, 0.45, 16);
    const stupiNeedle = new THREE.Mesh(stupiNeedleGeo, goldLightMat);
    stupiNeedle.position.set(sanctumCenter.x, currentTierY + 0.38, sanctumCenter.z);
    stupiNeedle.castShadow = true;
    templeGroup.add(stupiNeedle);

    // 5. ORNATE DRAVIDIAN PILLARED MANDAPAMS (COLONNADE HALLS)
    function createOrnatePillar(): THREE.Group {
      const pGroup = new THREE.Group();
      const baseH = 0.28;
      const baseGeo = new THREE.BoxGeometry(0.24, baseH, 0.24);
      const baseMesh = new THREE.Mesh(baseGeo, pillarWhiteMat);
      baseMesh.position.y = baseH / 2;
      baseMesh.castShadow = true;
      pGroup.add(baseMesh);

      const panelGeo = new THREE.BoxGeometry(0.25, baseH * 0.5, 0.25);
      const panelMesh = new THREE.Mesh(panelGeo, pillarCapitalMat);
      panelMesh.position.y = baseH / 2;
      pGroup.add(panelMesh);

      const shaftH = 0.98;
      const shaftRadius = 0.075;
      const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftH, 14);
      const shaftMesh = new THREE.Mesh(shaftGeo, pillarWhiteMat);
      shaftMesh.position.y = baseH + shaftH / 2;
      shaftMesh.castShadow = true;
      pGroup.add(shaftMesh);

      const tBand1Geo = new THREE.CylinderGeometry(shaftRadius + 0.016, shaftRadius + 0.016, 0.22, 14);
      const tBand1 = new THREE.Mesh(tBand1Geo, pillarTurquoiseMat);
      tBand1.position.y = baseH + 0.25;
      pGroup.add(tBand1);

      const pRing1Geo = new THREE.CylinderGeometry(shaftRadius + 0.024, shaftRadius + 0.024, 0.05, 14);
      const pRing1 = new THREE.Mesh(pRing1Geo, pillarPurpleMat);
      pRing1.position.y = baseH + 0.12;
      pGroup.add(pRing1);

      const tBand2 = tBand1.clone();
      tBand2.position.y = baseH + 0.58;
      pGroup.add(tBand2);

      const pRing2 = pRing1.clone();
      pRing2.position.y = baseH + 0.72;
      pGroup.add(pRing2);

      const capH = 0.16;
      const capGeo = new THREE.BoxGeometry(0.32, capH, 0.32);
      const capMesh = new THREE.Mesh(capGeo, pillarCapitalMat);
      capMesh.position.y = baseH + shaftH + capH / 2;
      capMesh.castShadow = true;
      pGroup.add(capMesh);

      const capCrownGeo = new THREE.BoxGeometry(0.38, 0.06, 0.38);
      const capCrown = new THREE.Mesh(capCrownGeo, pillarCapitalMat);
      capCrown.position.y = baseH + shaftH + capH + 0.03;
      pGroup.add(capCrown);

      return pGroup;
    }

    const leftPillarXs = [-5.0, -4.2, -3.4, -2.6, -1.8];
    const leftPillarZs = [-1.8, -0.6, 0.6, 1.8];

    leftPillarXs.forEach((px) => {
      leftPillarZs.forEach((pz) => {
        const pillar = createOrnatePillar();
        pillar.position.set(px, 0.475, pz);
        templeGroup.add(pillar);
      });
    });

    leftPillarXs.forEach((px) => {
      const beamGeo = new THREE.BoxGeometry(0.20, 0.12, 3.8);
      const beam = new THREE.Mesh(beamGeo, pillarCapitalMat);
      beam.position.set(px, 2.0, 0);
      templeGroup.add(beam);
    });

    const leftRoofW = 3.8, leftRoofD = 4.4;
    const leftRoofGeo = new THREE.BoxGeometry(leftRoofW, 0.12, leftRoofD);
    const leftRoof = new THREE.Mesh(leftRoofGeo, roofSlabMat);
    leftRoof.position.set(-3.4, 2.08, 0);
    leftRoof.castShadow = true;
    templeGroup.add(leftRoof);

    const leftOrangeTrimGeo = new THREE.BoxGeometry(leftRoofW + 0.18, 0.06, leftRoofD + 0.18);
    const leftOrangeTrim = new THREE.Mesh(leftOrangeTrimGeo, corniceOrangeMat);
    leftOrangeTrim.position.set(-3.4, 2.15, 0);
    templeGroup.add(leftOrangeTrim);

    const leftYellowCorniceGeo = new THREE.BoxGeometry(leftRoofW + 0.28, 0.10, leftRoofD + 0.28);
    const leftYellowCornice = new THREE.Mesh(leftYellowCorniceGeo, corniceYellowMat);
    leftYellowCornice.position.set(-3.4, 2.22, 0);
    leftYellowCornice.castShadow = true;
    templeGroup.add(leftYellowCornice);

    const frontPillarXs = [-0.6, 0.6, 1.8];
    const frontPillarZs = [1.6, 2.6];

    frontPillarXs.forEach((px) => {
      frontPillarZs.forEach((pz) => {
        const pillar = createOrnatePillar();
        pillar.position.set(px, 0.475, pz);
        templeGroup.add(pillar);
      });
    });

    const frontRoofW = 3.2, frontRoofD = 2.4;
    const frontRoofGeo = new THREE.BoxGeometry(frontRoofW, 0.12, frontRoofD);
    const frontRoof = new THREE.Mesh(frontRoofGeo, roofSlabMat);
    frontRoof.position.set(0.6, 2.08, 2.1);
    frontRoof.castShadow = true;
    templeGroup.add(frontRoof);

    const frontOrangeTrimGeo = new THREE.BoxGeometry(frontRoofW + 0.18, 0.06, frontRoofD + 0.18);
    const frontOrangeTrim = new THREE.Mesh(frontOrangeTrimGeo, corniceOrangeMat);
    frontOrangeTrim.position.set(0.6, 2.15, 2.1);
    templeGroup.add(frontOrangeTrim);

    const frontYellowCorniceGeo = new THREE.BoxGeometry(frontRoofW + 0.28, 0.10, frontRoofD + 0.28);
    const frontYellowCornice = new THREE.Mesh(frontYellowCorniceGeo, corniceYellowMat);
    frontYellowCornice.position.set(0.6, 2.22, 2.1);
    frontYellowCornice.castShadow = true;
    templeGroup.add(frontYellowCornice);

    scene.add(templeGroup);

    // Floating Golden Aura Sparkles
    const pCount = 70;
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
      size: 0.10,
      transparent: true,
      opacity: 0.65,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    // 6. INTERACTIVE 360° ORBIT & TOUCH CONTROLS
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let prevTouchX = 0;
    let prevTouchY = 0;
    let sphericalTheta = -0.65;
    let sphericalPhi = 1.15;
    let cameraDistance = 11.5;
    let lastReportedDeg = 0;

    const updateAngleState = () => {
      const deg = Math.round((((sphericalTheta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI)) % 360;
      setRotationDegrees(deg);
    };

    resetAngleRef.current = () => {
      sphericalTheta = -0.65;
      sphericalPhi = 1.15;
      cameraDistance = 11.5;
      targetCamLook.current.set(-0.4, 2.2, 0);
      targetCamPos.current.set(-6.5, 4.8, 8.5);
      updateAngleState();
    };

    rotateTempleRef.current = (deltaDeg: number) => {
      const rad = (deltaDeg * Math.PI) / 180;
      sphericalTheta += rad;
      targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
      targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      updateAngleState();
    };

    setTempleAngleRef.current = (deg: number) => {
      sphericalTheta = (deg * Math.PI) / 180;
      targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
      targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      setRotationDegrees(deg);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // Handled by touch events
      if (e.button !== 0) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      try {
        container.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (!isDragging) return;
      if (autoRotateRef.current) setAutoRotate(false);
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.007;
      sphericalPhi = Math.max(0.18, Math.min(Math.PI / 2 - 0.02, sphericalPhi - deltaY * 0.007));

      targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
      targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      updateAngleState();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance = Math.max(5.0, Math.min(18.0, cameraDistance + e.deltaY * 0.008));
      targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
      targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    };

    // Mobile 1-Finger 360° Touch Drag & 2-Finger Pinch Zoom
    let initialPinchDist = 0;
    let initialPinchCamDist = cameraDistance;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialPinchCamDist = cameraDistance;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      // Must prevent default to stop mobile page from scrolling away while rotating temple
      if (e.cancelable) e.preventDefault();

      if (e.touches.length === 1 && isDragging) {
        if (autoRotateRef.current) setAutoRotate(false);
        const deltaX = e.touches[0].clientX - prevTouchX;
        const deltaY = e.touches[0].clientY - prevTouchY;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;

        // 360-degree horizontal rotation
        sphericalTheta -= deltaX * 0.009;
        // Vertical inclination tilt
        sphericalPhi = Math.max(0.18, Math.min(Math.PI / 2 - 0.02, sphericalPhi - deltaY * 0.009));

        targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
        targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
        targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
        updateAngleState();
      } else if (e.touches.length === 2 && initialPinchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        if (currentDist > 10) {
          const factor = initialPinchDist / currentDist;
          cameraDistance = Math.max(5.0, Math.min(18.0, initialPinchCamDist * factor));
          targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
          targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
          targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isDragging = false;
        initialPinchDist = 0;
      } else if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
        initialPinchDist = 0;
      }
    };

    const onTouchCancel = () => {
      isDragging = false;
      initialPinchDist = 0;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchCancel, { passive: true });

    targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
    targetCamPos.current.y = targetCamLook.current.y + cameraDistance * Math.cos(sphericalPhi);
    targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !isDragging) {
        sphericalTheta += 0.0028;
        targetCamPos.current.x = targetCamLook.current.x + cameraDistance * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
        targetCamPos.current.z = targetCamLook.current.z + cameraDistance * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
        const deg = Math.round((((sphericalTheta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));
        if (Math.abs(deg - lastReportedDeg) >= 3) {
          lastReportedDeg = deg;
          setRotationDegrees(deg);
        }
      }

      currentCamPos.current.lerp(targetCamPos.current, 0.15);
      currentCamLook.current.lerp(targetCamLook.current, 0.15);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentCamLook.current);

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

    // Immediate first render to ensure no black frame
    handleResize();
    renderer.render(scene, camera); // Initial sync paint
    animate();

    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => handleResize());
      ro.observe(container);
    }
    const timer = setTimeout(handleResize, 100);

    return () => {
      rotateTempleRef.current = null;
      setTempleAngleRef.current = null;
      resetAngleRef.current = null;
      clearTimeout(timer);
      if (ro) ro.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch (e) {}
    };
  }, [containerEl]);

  // Cardinal presets for quick 360° views
  const CARDINAL_VIEWS = [
    { label: 'Front', deg: 0 },
    { label: 'Right', deg: 90 },
    { label: 'Back', deg: 180 },
    { label: 'Left', deg: 270 },
  ];

  const renderRotationControls = (isDockInFullscreen = false) => (
    <div
      className={
        isDockInFullscreen
          ? 'w-full max-w-xl mx-auto flex flex-col items-center gap-1.5 pointer-events-auto'
          : 'absolute bottom-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-auto max-w-[98%] sm:max-w-none'
      }
    >
      <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-950/90 backdrop-blur-md px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-amber-400/40 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
        {/* Rotate -45° */}
        <button
          type="button"
          onClick={() => handleRotateDelta(-45)}
          className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-stone-700 hover:border-amber-400/60 active:scale-95 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
          title="Rotate Left 45°"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">-45°</span>
        </button>

        {/* 360° Rotation Slider */}
        <div className="flex items-center gap-1 shrink-0 px-1">
          <input
            type="range"
            min="0"
            max="360"
            value={rotationDegrees}
            onChange={(e) => handleSetAngle(Number(e.target.value))}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="w-16 sm:w-28 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            title="Drag to rotate temple 360°"
          />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 w-7 sm:w-8 text-right shrink-0">
            {rotationDegrees}°
          </span>
        </div>

        {/* Rotate +45° */}
        <button
          type="button"
          onClick={() => handleRotateDelta(45)}
          className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-stone-700 hover:border-amber-400/60 active:scale-95 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
          title="Rotate Right 45°"
        >
          <span className="text-[10px] hidden sm:inline">+45°</span>
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Cardinal Presets: Front / Right / Back / Left */}
        <div className="flex items-center gap-0.5 sm:gap-1 pl-1 border-l border-stone-800 shrink-0">
          {CARDINAL_VIEWS.map((cardinal) => {
            const isNear =
              Math.abs(rotationDegrees - cardinal.deg) < 22 ||
              (cardinal.deg === 0 && rotationDegrees > 338);
            return (
              <button
                key={cardinal.label}
                type="button"
                onClick={() => handleSetAngle(cardinal.deg)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] transition-all cursor-pointer ${
                  isNear
                    ? 'bg-amber-400/30 text-amber-200 border border-amber-400/70 font-bold shadow-sm'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
                title={`Rotate to ${cardinal.label} View (${cardinal.deg}°)`}
              >
                {cardinal.label}
              </button>
            );
          })}
        </div>

        {/* Quick 360° Auto-Orbit Toggle Button */}
        <button
          type="button"
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`p-1.5 rounded-xl border text-xs transition-all cursor-pointer shrink-0 ml-0.5 ${
            autoRotate
              ? 'bg-amber-400/25 border-amber-400 text-amber-300 shadow'
              : 'bg-stone-900/80 border-stone-700 text-stone-400 hover:text-stone-200'
          }`}
          title={autoRotate ? 'Pause 360° Auto-Orbit' : 'Start 360° Auto-Orbit'}
        >
          <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* Reset Camera View */}
        <button
          type="button"
          onClick={resetView}
          className="p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer shrink-0"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Devotional Drag Hint Badge */}
      {!isDockInFullscreen && (
        <div className="bg-stone-950/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-stone-800 text-[10px] text-stone-300 flex items-center gap-1.5 pointer-events-none shadow-md">
          <Eye className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Swipe 360° to view all angles • Pinch to zoom</span>
        </div>
      )}
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="relative bg-stone-900/90 rounded-3xl p-5 sm:p-7 border-2 border-devotional-gold/60 shadow-[0_20px_60px_rgba(212,175,55,0.25)] text-white space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-amber-400" /> DRAVIDIAN TEMPLE ARCHITECTURE
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
            3D Temple Gopuram & Mandapam Explorer
          </h2>
          <p className="text-stone-400 text-xs mt-0.5">
            Sri Vasavi Swarna Vimana, Krishna Shila Garbhagriha & Pillared Mandapams
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-3.5 py-1.5 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/20 to-devotional-saffron/20 hover:from-amber-500/30 hover:to-devotional-saffron/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Open 360° Fullscreen View on Mobile & Desktop"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>360° Fullscreen</span>
          </button>

          {/* Auto-Orbit Toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              autoRotate
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow'
                : 'bg-stone-950 border-stone-700 text-stone-300'
            }`}
            title="Toggle 360° Auto-Orbit"
          >
            <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{autoRotate ? '360° Orbit Active' : 'Manual Orbit'}</span>
            <span className="sm:hidden">{autoRotate ? 'Orbit On' : 'Orbit Off'}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetView}
            className="p-1.5 rounded-full border border-stone-700 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Reset to Front-Left Isometric View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className={hide1 ? 'w-full' : 'grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch'}>
        {/* 3D WebGL Canvas or 2D Resilient Canvas */}
        <div
          className={
            isFullscreen
              ? 'fixed inset-0 z-[99999] w-screen h-screen bg-stone-950 flex flex-col overflow-hidden select-none'
              : hide1
              ? 'w-full relative h-[420px] sm:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#180e0a] to-stone-950 border border-amber-400/40 shadow-inner group'
              : 'lg:col-span-7 relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#180e0a] to-stone-950 border border-amber-400/40 shadow-inner group'
          }
        >
          {/* Fullscreen Top HUD */}
          {isFullscreen && (
            <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-stone-950/95 via-stone-950/80 to-transparent flex items-center justify-between gap-2 backdrop-blur-sm pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div className="leading-tight">
                  <p className="font-serif font-bold text-amber-300 text-xs sm:text-sm">
                    Sri Vasavi Temple • 360° Explorer
                  </p>
                  <p className="text-[10px] text-stone-400 hidden sm:block">
                    {selectedHotspot.name} • {selectedHotspot.sanskrit}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setAutoRotate((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    autoRotate
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-stone-900/90 border-stone-700 text-stone-300'
                  }`}
                  title="Toggle 360° Auto-Orbit"
                >
                  <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span className="text-[11px]">{autoRotate ? '360° Orbit' : 'Manual'}</span>
                </button>

                <button
                  onClick={resetView}
                  className="p-1.5 rounded-full border border-stone-700 bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset Camera View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-3.5 py-1.5 rounded-full bg-devotional-maroon hover:bg-red-900 border border-amber-400/50 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                  title="Exit Fullscreen View"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          )}

          {webGlFailed ? (
            <TempleGopuram2DCanvas
              selectedHotspot={selectedHotspot}
              onSelectHotspot={selectHotspot}
            />
          ) : (
            <div
              ref={setContainerEl}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
              style={{ touchAction: 'none' }}
            />
          )}

          {/* Normal Mode Canvas Fullscreen Button */}
          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-3 right-3 bg-stone-950/80 hover:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
              title="Expand to Fullscreen (360° Mobile View)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">360° Fullscreen</span>
            </button>
          )}

          {/* Fullscreen Bottom Floating Dock */}
          {isFullscreen ? (
            <div className="absolute bottom-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent flex flex-col gap-2.5 backdrop-blur-sm pointer-events-auto">
              <div className="mx-auto bg-stone-900/90 border border-amber-500/30 px-3.5 py-1 rounded-full text-[10px] sm:text-xs text-amber-200/90 flex items-center gap-1.5 pointer-events-none shadow-md">
                <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Swipe in any direction for 360° view • Pinch with two fingers to zoom</span>
              </div>

              {/* 360° Interactive Rotation Controls */}
              {renderRotationControls(true)}

              {/* hide1: Hide quick hotspot switcher & sponsor banner in fullscreen while hide1 is active */}
              {!hide1 && (
                <>
                  {/* Hotspots Quick Switcher */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-4xl mx-auto w-full justify-start sm:justify-center">
                    {TEMPLE_HOTSPOTS.map((spot) => {
                      const isSelected = selectedHotspot.id === spot.id;
                      return (
                        <button
                          key={spot.id}
                          onClick={() => selectHotspot(spot)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                            isSelected
                              ? 'bg-gradient-to-r from-devotional-maroon to-devotional-saffron text-white border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)] scale-105'
                              : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-700'
                          }`}
                        >
                          <span>{spot.icon}</span>
                          <span>{spot.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Feature Floating Summary */}
                  <div className="max-w-2xl mx-auto w-full bg-stone-900/95 border border-amber-400/40 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-xl">
                    <div className="min-w-0">
                      <p className="text-xs font-serif font-bold text-white truncate">
                        {selectedHotspot.name} <span className="text-[10px] text-amber-400 font-normal">({selectedHotspot.sanskrit})</span>
                      </p>
                      <p className="text-[10px] text-stone-300 truncate max-w-sm sm:max-w-md">
                        {selectedHotspot.desc}
                      </p>
                    </div>
                    <button
                      onClick={handleSponsorSeva}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-500 text-stone-950 font-bold text-[11px] shrink-0 shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Sponsor Seva (₹2,501)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            renderRotationControls(false)
          )}
        </div>

        {/* hide1: Selected Architectural Feature (Uncluttered, Concise, Devotional) */}
        {!hide1 && (
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-950 via-stone-900/90 to-stone-950 p-5 sm:p-6 rounded-2xl border border-amber-400/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Header: Icon + Name + Native Script Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-amber-400/10 border border-amber-400/30">
                    {selectedHotspot.icon}
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white leading-tight">
                      {selectedHotspot.name}
                    </h3>
                    <p className="text-[11px] text-amber-400 font-serif font-semibold mt-0.5">
                      {selectedHotspot.sanskrit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Devotional Description */}
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed border-l-2 border-amber-400 pl-3">
                {selectedHotspot.desc}
              </p>

              {/* Key Highlight Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900/90 border border-amber-400/30 text-[11px] text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-devotional-saffron" />
                <span>{selectedHotspot.highlight}</span>
              </div>
            </div>

            {/* Clean Sponsor Seva CTA */}
            <button
              onClick={handleSponsorSeva}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-gold hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Landmark className="w-4 h-4 text-devotional-maroon" />
              <span>Sponsor {selectedHotspot.shortName} Seva (₹2,501)</span>
            </button>
          </div>
        )}
      </div>

      {/* hide1: Hotspots Selector Buttons */}
      {!hide1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {TEMPLE_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => selectHotspot(spot)}
                className={`p-3 rounded-xl text-left border transition-all space-y-1 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)] ring-1 ring-amber-400/60 scale-[1.02]'
                    : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center justify-between gap-1">
                  <span className="truncate">{spot.name}</span>
                  <span className="text-sm shrink-0">{spot.icon}</span>
                </div>
                <div className="text-[10px] text-amber-300/80 font-serif truncate">
                  {spot.sanskrit}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
