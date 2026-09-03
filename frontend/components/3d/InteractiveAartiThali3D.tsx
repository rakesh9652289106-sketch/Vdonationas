'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { Flame, Sparkles, RotateCw, Hand } from 'lucide-react';

interface InteractiveAartiThali3DProps {
  className?: string;
  onAartiCompleted?: () => void;
}

export default function InteractiveAartiThali3D({
  className = 'w-full h-[380px]',
  onAartiCompleted,
}: InteractiveAartiThali3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCircling, setIsCircling] = useState(false);
  const [aartiCount, setAartiCount] = useState(0);

  const handleStartCircling = () => {
    setIsCircling((prev) => !prev);
    templeAudio.playTempleBell(0.6);
    if (!isCircling) {
      setAartiCount((c) => c + 1);
      if (onAartiCompleted) onAartiCompleted();
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Warm Devotional Lighting
    const ambient = new THREE.AmbientLight(0xfff0dd, 1.2);
    scene.add(ambient);

    const flameLight = new THREE.PointLight(0xff7700, 4, 10);
    flameLight.position.set(0, 1.2, 0);
    scene.add(flameLight);

    const topLight = new THREE.DirectionalLight(0xffd700, 2.0);
    topLight.position.set(2, 6, 3);
    scene.add(topLight);

    // Main Thali Group
    const thaliGroup = new THREE.Group();

    // 1. Brass/Gold Plate
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xdfa134,
      metalness: 0.88,
      roughness: 0.22,
    });
    const plateGeo = new THREE.CylinderGeometry(2.2, 2.0, 0.12, 48);
    const plateMesh = new THREE.Mesh(plateGeo, brassMat);
    thaliGroup.add(plateMesh);

    // Rim of Plate
    const rimGeo = new THREE.TorusGeometry(2.2, 0.08, 16, 48);
    const rimMesh = new THREE.Mesh(rimGeo, brassMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.06;
    thaliGroup.add(rimMesh);

    // 2. Central Camphor Diya (Karpoora Deepam)
    const diyaBaseGeo = new THREE.CylinderGeometry(0.5, 0.3, 0.4, 24);
    const diyaBase = new THREE.Mesh(diyaBaseGeo, brassMat);
    diyaBase.position.y = 0.25;
    thaliGroup.add(diyaBase);

    // Camphor Flame
    const flameGeo = new THREE.ConeGeometry(0.16, 0.6, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 0.75;
    thaliGroup.add(flameMesh);

    // 3. Kumkum & Haldi Bowls
    const kumkumBowlGeo = new THREE.CylinderGeometry(0.35, 0.2, 0.2, 20);
    const kumkumMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.9 });
    const kumkumBowl = new THREE.Mesh(kumkumBowlGeo, kumkumMat);
    kumkumBowl.position.set(-1.1, 0.15, -0.6);
    thaliGroup.add(kumkumBowl);

    const haldiMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.9 });
    const haldiBowl = new THREE.Mesh(kumkumBowlGeo, haldiMat);
    haldiBowl.position.set(1.1, 0.15, -0.6);
    thaliGroup.add(haldiBowl);

    // 4. Fresh Flower Garlands on Thali
    const flowerColors = [0xff4500, 0xffd700, 0xff1493, 0xffffff];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = 1.6;
      const fGeo = new THREE.SphereGeometry(0.14, 12, 12);
      const fMat = new THREE.MeshStandardMaterial({
        color: flowerColors[i % flowerColors.length],
        roughness: 0.6,
      });
      const flower = new THREE.Mesh(fGeo, fMat);
      flower.position.set(Math.cos(angle) * r, 0.12, Math.sin(angle) * r);
      thaliGroup.add(flower);
    }

    scene.add(thaliGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / width - 0.5) * 1.5;
      targetY = ((e.clientY - rect.top) / height - 0.5) * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.03;

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Flame scale & intensity flicker
      flameMesh.scale.set(
        1 + Math.sin(clock * 10) * 0.1,
        1 + Math.cos(clock * 14) * 0.2,
        1 + Math.sin(clock * 8) * 0.1
      );
      flameLight.intensity = 3.5 + Math.sin(clock * 12) * 1.0;

      // Aarti motion
      if (isCircling) {
        thaliGroup.position.x = Math.sin(clock * 2) * 0.8;
        thaliGroup.position.y = Math.cos(clock * 2) * 0.4;
        thaliGroup.rotation.y = clock * 2;
        thaliGroup.rotation.z = Math.sin(clock * 2) * 0.15;
      } else {
        thaliGroup.position.set(0, 0, 0);
        thaliGroup.rotation.y += (mouseX - thaliGroup.rotation.y) * 0.05 + 0.005;
        thaliGroup.rotation.x = mouseY * 0.4;
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isCircling]);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-devotional-gold/60 p-4 ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> 3D KARPOORA AARTI THALI
        </span>
      </div>

      <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between bg-stone-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-800 text-xs">
        <div className="flex items-center gap-1.5 text-stone-300 font-serif">
          <Hand className="w-4 h-4 text-amber-400" />
          <span>Move mouse to tilt • Aarti Sevas Performed: <strong className="text-amber-300">{aartiCount}</strong></span>
        </div>

        <button
          onClick={handleStartCircling}
          className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow ${
            isCircling
              ? 'bg-amber-400 text-stone-950 font-bold shadow-gold'
              : 'bg-gradient-to-r from-devotional-maroon to-devotional-saffron text-white hover:brightness-110'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isCircling ? 'animate-spin' : ''}`} />
          {isCircling ? 'Stop Aarti' : 'Circle Aarti Thali'}
        </button>
      </div>
    </div>
  );
}
