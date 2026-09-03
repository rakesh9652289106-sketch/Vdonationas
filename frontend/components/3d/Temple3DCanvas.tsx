'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Temple3DCanvasProps {
  interactive?: boolean;
  className?: string;
}

export default function Temple3DCanvas({
  interactive = true,
  className = 'w-full h-full min-h-[350px]',
}: Temple3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // Lights (Cinematic Warm Golden Lighting)
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffb84d, 1.8);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x6b1d2f, 1.2);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Glowing Diya Point Light
    const diyaLight = new THREE.PointLight(0xff8c00, 2, 8);
    diyaLight.position.set(0, 0.8, 2);
    scene.add(diyaLight);

    // 3D Temple Group
    const templeGroup = new THREE.Group();

    // Stone Material
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.7,
      metalness: 0.1,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
    });

    const maroonMaterial = new THREE.MeshStandardMaterial({
      color: 0x6b1d2f,
      roughness: 0.5,
    });

    // 1. Plinth / Base Platform
    const baseGeo = new THREE.BoxGeometry(6, 0.4, 6);
    const baseMesh = new THREE.Mesh(baseGeo, stoneMaterial);
    baseMesh.position.y = 0.2;
    baseMesh.receiveShadow = true;
    templeGroup.add(baseMesh);

    // 2. Base Steps
    const stepGeo = new THREE.BoxGeometry(4.5, 0.3, 4.5);
    const stepMesh = new THREE.Mesh(stepGeo, stoneMaterial);
    stepMesh.position.y = 0.55;
    stepMesh.receiveShadow = true;
    templeGroup.add(stepMesh);

    // 3. Main Sanctum (Garbhagriha)
    const sanctumGeo = new THREE.BoxGeometry(3, 2, 3);
    const sanctumMesh = new THREE.Mesh(sanctumGeo, maroonMaterial);
    sanctumMesh.position.y = 1.7;
    sanctumMesh.castShadow = true;
    templeGroup.add(sanctumMesh);

    // 4. Carved Pillars (4 Corner Pillars)
    const pillarGeo = new THREE.CylinderGeometry(0.15, 0.2, 2, 12);
    const pillarPositions = [
      [-1.4, 1.7, 1.4],
      [1.4, 1.7, 1.4],
      [-1.4, 1.7, -1.4],
      [1.4, 1.7, -1.4],
    ];

    pillarPositions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeo, goldMaterial);
      pillar.position.set(x, y, z);
      pillar.castShadow = true;
      templeGroup.add(pillar);
    });

    // 5. Gopuram / Shikhara Tower (Layered Pyramids)
    for (let i = 0; i < 4; i++) {
      const layerWidth = 3.2 - i * 0.6;
      const layerHeight = 0.6;
      const layerGeo = new THREE.BoxGeometry(layerWidth, layerHeight, layerWidth);
      const layerMesh = new THREE.Mesh(
        layerGeo,
        i % 2 === 0 ? stoneMaterial : goldMaterial
      );
      layerMesh.position.y = 2.7 + i * 0.55;
      layerMesh.castShadow = true;
      templeGroup.add(layerMesh);
    }

    // 6. Kalasam (Golden Crown Peak)
    const kalasamGeo = new THREE.ConeGeometry(0.3, 0.9, 16);
    const kalasamMesh = new THREE.Mesh(kalasamGeo, goldMaterial);
    kalasamMesh.position.y = 5.2;
    kalasamMesh.castShadow = true;
    templeGroup.add(kalasamMesh);

    // 7. Floating Petals / Particles System
    const particleCount = 60;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = Math.random() * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe06d29,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particlesGeo, particleMaterial);
    scene.add(particleSystem);

    scene.add(templeGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / width - 0.5) * 2;
      mouseY = (y / height - 0.5) * 2;
      targetRotationY = mouseX * 0.4;
      targetRotationX = mouseY * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth Gentle Idle & Mouse Tilt
      templeGroup.rotation.y += (targetRotationY - templeGroup.rotation.y) * 0.05 + 0.003;
      templeGroup.rotation.x += (targetRotationX - templeGroup.rotation.x) * 0.05;

      // Diya Flicker Effect
      diyaLight.intensity = 1.8 + Math.sin(Date.now() * 0.008) * 0.4;

      // Animate Particles Floating Down
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= 0.01;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 6;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return <div ref={mountRef} className={className} />;
}
