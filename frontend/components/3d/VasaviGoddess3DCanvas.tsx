'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VasaviGoddess3DCanvasProps {
  className?: string;
}

export default function VasaviGoddess3DCanvas({
  className = 'w-full h-full min-h-[460px]',
}: VasaviGoddess3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera Setup (Fits the clean sacred Goddess image perfectly)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 2.4, 7.4);
    camera.lookAt(0, 2.4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Warm Devotional Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.4);
    scene.add(ambientLight);

    const goldSpotLight = new THREE.DirectionalLight(0xffd700, 2.2);
    goldSpotLight.position.set(3, 8, 5);
    scene.add(goldSpotLight);

    const softFillLight = new THREE.DirectionalLight(0xff8c00, 1.2);
    softFillLight.position.set(-4, 3, -2);
    scene.add(softFillLight);

    // Flickering Diya Flame Light
    const diyaLight = new THREE.PointLight(0xffaa00, 3.5, 12);
    diyaLight.position.set(0, 2.4, 1.5);
    scene.add(diyaLight);

    // 3. Goddess 3D Group (Tilts and moves with cursor)
    const goddessGroup = new THREE.Group();

    // Sacred Goddess Sri Vasavi Kanyaka Parameswari Frameless Image Mesh
    let goddessMesh: THREE.Mesh | null = null;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/vasavi_goddess_sacred.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);

      const goddessGeo = new THREE.PlaneGeometry(5.4, 5.4);
      const goddessMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      goddessMesh = new THREE.Mesh(goddessGeo, goddessMat);
      goddessMesh.position.set(0, 2.4, 0);
      goddessGroup.add(goddessMesh);
    });

    scene.add(goddessGroup);

    // 4. Floating Flower Petals Particle System
    const petalCount = 120;
    const petalsGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 9;
      petalPositions[i * 3 + 1] = Math.random() * 6.5;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }

    petalsGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

    const petalMaterial = new THREE.PointsMaterial({
      color: 0xe06d29,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
    });

    const petalSystem = new THREE.Points(petalsGeo, petalMaterial);
    scene.add(petalSystem);

    // 5. Cursor Interaction (Goddess moves smoothly with cursor)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetMouseX = (x / width - 0.5) * 0.4;
      targetMouseY = (y / height - 0.5) * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth Easing on Mouse Interaction
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Goddess Group Tilt & Position Shift on Cursor Movement
      goddessGroup.rotation.y = mouseX;
      goddessGroup.rotation.x = mouseY;

      if (goddessMesh) {
        goddessMesh.position.x = mouseX * 0.3;
        goddessMesh.position.y = 2.4 - mouseY * 0.2;
      }

      // Diya Light Flicker
      diyaLight.intensity = 3.2 + Math.sin(Date.now() * 0.009) * 0.6 + Math.cos(Date.now() * 0.017) * 0.3;

      // Falling Petals Particle Animation
      const positions = petalSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < petalCount; i++) {
        positions[i * 3 + 1] -= 0.008;
        positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.002;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 6.5;
        }
      }
      petalSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
