'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { templeAudio } from '@/lib/templeAudio';
import { Flame, BellRing, Flower2, Volume2, VolumeX, Eye } from 'lucide-react';

interface InteractiveDarshanSanctum3DProps {
  className?: string;
  onCoinDrop?: () => void;
}

export type DarshanTimeOfDay = 'suprabhatam' | 'madhyahna' | 'sandhya' | 'maha_aarti';

// --- Photorealistic Procedural Flower & Sacred Aura Texture Generators ---

function createRosePetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.save();
    ctx.translate(64, 64);
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.bezierCurveTo(-44, 36, -50, -16, -24, -40);
    ctx.bezierCurveTo(-12, -52, -4, -36, 0, -32);
    ctx.bezierCurveTo(4, -36, 12, -52, 24, -40);
    ctx.bezierCurveTo(50, -16, 44, 36, 0, 50);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-8, -10, 4, 0, 5, 52);
    grad.addColorStop(0, '#ff1744');
    grad.addColorStop(0.35, '#d50000');
    grad.addColorStop(0.75, '#880e4f');
    grad.addColorStop(1, '#4a0018');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 170, 190, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(90, 0, 20, 0.3)';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 48);
      ctx.quadraticCurveTo(i * 12, 10, i * 18, -20);
      ctx.stroke();
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createYellowMarigoldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    const cx = 64, cy = 64;
    const drawRuffledLayer = (radius: number, count: number, petalLen: number, color: string) => {
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.ellipse(px, py, petalLen, petalLen * 0.65, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    drawRuffledLayer(36, 18, 15, '#f57f17');
    drawRuffledLayer(26, 16, 13, '#fbc02d');
    drawRuffledLayer(16, 14, 11, '#ffeb3b');
    drawRuffledLayer(7, 10, 8, '#ff9800');

    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12);
    grad.addColorStop(0, '#bf360c');
    grad.addColorStop(0.65, '#e65100');
    grad.addColorStop(1, '#f57f17');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createOrangeMarigoldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    const cx = 64, cy = 64;
    const drawRuffledLayer = (radius: number, count: number, petalLen: number, color: string) => {
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.ellipse(px, py, petalLen, petalLen * 0.65, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    drawRuffledLayer(36, 18, 15, '#d84315');
    drawRuffledLayer(26, 16, 13, '#ff5722');
    drawRuffledLayer(16, 14, 11, '#ff9100');
    drawRuffledLayer(7, 10, 8, '#ffab40');

    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 10);
    grad.addColorStop(0, '#7f0000');
    grad.addColorStop(1, '#d84315');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWhiteJasmineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    const cx = 64, cy = 64;
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-14, -20, -18, -46, 0, -52);
      ctx.bezierCurveTo(18, -46, 14, -20, 0, 0);
      const pGrad = ctx.createLinearGradient(0, 0, 0, -52);
      pGrad.addColorStop(0, '#fffde7');
      pGrad.addColorStop(0.3, '#ffffff');
      pGrad.addColorStop(0.85, '#f5f5f5');
      pGrad.addColorStop(1, '#e8eaf6');
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(210, 215, 230, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
    const cGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 8);
    cGrad.addColorStop(0, '#ffca28');
    cGrad.addColorStop(0.65, '#ffa000');
    cGrad.addColorStop(1, 'rgba(255, 160, 0, 0)');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPinkLotusPetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.save();
    ctx.translate(64, 64);
    ctx.beginPath();
    ctx.moveTo(0, 52);
    ctx.bezierCurveTo(-38, 30, -32, -22, 0, -54);
    ctx.bezierCurveTo(32, -22, 38, 30, 0, 52);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 52, 0, -54);
    grad.addColorStop(0, '#fff8e1');
    grad.addColorStop(0.3, '#f48fb1');
    grad.addColorStop(0.7, '#ec407a');
    grad.addColorStop(1, '#c2185b');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(194, 24, 91, 0.22)';
    ctx.lineWidth = 0.8;
    for (const offset of [-16, -8, 8, 16]) {
      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.quadraticCurveTo(offset * 0.9, 0, 0, -52);
      ctx.stroke();
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGoldenHaloTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 128, cy = 128;
    const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, 124);
    grad.addColorStop(0, 'rgba(255, 250, 210, 0.95)');
    grad.addColorStop(0.25, 'rgba(255, 215, 64, 0.85)');
    grad.addColorStop(0.55, 'rgba(255, 152, 0, 0.45)');
    grad.addColorStop(0.85, 'rgba(255, 110, 0, 0.15)');
    grad.addColorStop(1, 'rgba(255, 80, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(255, 235, 140, 0.65)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 36; r++) {
      const angle = (Math.PI * 2 * r) / 36;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 32, cy + Math.sin(angle) * 32);
      ctx.lineTo(cx + Math.cos(angle) * 118, cy + Math.sin(angle) * 118);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// --- Photorealistic Camphor & Diya Flame Texture Generators ---

function createRealisticCamphorFlameTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 512);
    const cx = 128;
    const baseY = 480;
    const tipY = 32;

    const drawFlameCurve = (wScale: number, bY: number, tY: number, asym = 0) => {
      ctx.beginPath();
      ctx.moveTo(cx, bY);
      ctx.bezierCurveTo(
        cx - 75 * wScale + asym * 0.4,
        bY - 60,
        cx - 95 * wScale + asym * 0.8,
        bY - 240,
        cx - 20 * wScale + asym,
        tY + 70
      );
      ctx.quadraticCurveTo(cx - 5 + asym, tY + 20, cx, tY);
      ctx.quadraticCurveTo(cx + 5 + asym, tY + 20, cx + 20 * wScale + asym, tY + 70);
      ctx.bezierCurveTo(
        cx + 95 * wScale + asym * 0.8,
        bY - 240,
        cx + 75 * wScale + asym * 0.4,
        bY - 60,
        cx,
        bY
      );
      ctx.closePath();
    };

    // Layer 1: Outer glowing saffron & crimson corona
    drawFlameCurve(1.0, baseY, tipY);
    const outerGrad = ctx.createLinearGradient(cx, baseY, cx, tipY);
    outerGrad.addColorStop(0, 'rgba(40, 90, 255, 0.95)');     // Camphor blue foot
    outerGrad.addColorStop(0.12, 'rgba(100, 160, 255, 0.85)');
    outerGrad.addColorStop(0.25, 'rgba(255, 170, 0, 0.92)');   // Golden plasma
    outerGrad.addColorStop(0.60, 'rgba(255, 95, 0, 0.85)');    // Saffron fire
    outerGrad.addColorStop(0.85, 'rgba(235, 40, 0, 0.50)');    // Crimson plume
    outerGrad.addColorStop(1.0, 'rgba(200, 20, 0, 0)');
    ctx.fillStyle = outerGrad;
    ctx.fill();

    // Layer 2: Mid-body radiant golden fire plume
    drawFlameCurve(0.72, baseY - 12, tipY + 45, 4);
    const midGrad = ctx.createLinearGradient(cx, baseY - 12, cx, tipY + 45);
    midGrad.addColorStop(0, 'rgba(130, 200, 255, 0.9)');
    midGrad.addColorStop(0.15, 'rgba(255, 240, 120, 0.95)');
    midGrad.addColorStop(0.50, 'rgba(255, 195, 20, 0.98)');
    midGrad.addColorStop(0.82, 'rgba(255, 120, 0, 0.7)');
    midGrad.addColorStop(1.0, 'rgba(255, 70, 0, 0)');
    ctx.fillStyle = midGrad;
    ctx.fill();

    // Layer 3: Blinding white-hot thermal core
    drawFlameCurve(0.42, baseY - 30, tipY + 110, -2);
    const coreGrad = ctx.createLinearGradient(cx, baseY - 30, cx, tipY + 110);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    coreGrad.addColorStop(0.55, 'rgba(255, 255, 220, 0.98)');
    coreGrad.addColorStop(0.85, 'rgba(255, 230, 140, 0.7)');
    coreGrad.addColorStop(1.0, 'rgba(255, 200, 80, 0)');
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // Layer 4: Pure Camphor Blue Root Bulb (characteristic blue base)
    const blueGrad = ctx.createRadialGradient(cx, baseY - 18, 4, cx, baseY - 10, 48);
    blueGrad.addColorStop(0, 'rgba(30, 110, 255, 0.95)');
    blueGrad.addColorStop(0.45, 'rgba(15, 60, 230, 0.75)');
    blueGrad.addColorStop(0.80, 'rgba(10, 30, 180, 0.35)');
    blueGrad.addColorStop(1.0, 'rgba(5, 15, 120, 0)');
    ctx.fillStyle = blueGrad;
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 15, 48, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRealisticDiyaFlameTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 256);
    const cx = 64;
    const baseY = 240;
    const tipY = 20;

    ctx.beginPath();
    ctx.moveTo(cx, baseY);
    ctx.bezierCurveTo(cx - 36, baseY - 30, cx - 42, baseY - 110, cx - 8, tipY + 30);
    ctx.quadraticCurveTo(cx - 2, tipY + 8, cx, tipY);
    ctx.quadraticCurveTo(cx + 2, tipY + 8, cx + 8, tipY + 30);
    ctx.bezierCurveTo(cx + 42, baseY - 110, cx + 36, baseY - 30, cx, baseY);
    ctx.closePath();

    const grad = ctx.createLinearGradient(cx, baseY, cx, tipY);
    grad.addColorStop(0, 'rgba(30, 60, 220, 0.85)');     // subtle blue root
    grad.addColorStop(0.15, 'rgba(255, 240, 140, 0.98)'); // intense golden heart
    grad.addColorStop(0.45, 'rgba(255, 180, 10, 0.95)');
    grad.addColorStop(0.80, 'rgba(255, 80, 0, 0.7)');
    grad.addColorStop(1.0, 'rgba(210, 20, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // White hot core
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 38, 9, 22, 0, 0, Math.PI * 2);
    const coreGrad = ctx.createRadialGradient(cx, baseY - 38, 2, cx, baseY - 38, 22);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    coreGrad.addColorStop(0.45, 'rgba(255, 250, 180, 0.85)');
    coreGrad.addColorStop(1.0, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = coreGrad;
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createFlameHaloTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 128, cy = 128;
    const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, 126);
    grad.addColorStop(0, 'rgba(255, 245, 190, 0.90)');
    grad.addColorStop(0.22, 'rgba(255, 180, 40, 0.60)');
    grad.addColorStop(0.50, 'rgba(255, 110, 10, 0.25)');
    grad.addColorStop(0.80, 'rgba(220, 50, 0, 0.08)');
    grad.addColorStop(1.0, 'rgba(180, 20, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// --- Procedural Hand-Engraved Temple Brass Thali Textures ---

function createTempleThaliTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 256, cy = 256;

    // 1. Base Antique Temple Brass Disc with radial metallic sheen
    const baseGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 254);
    baseGrad.addColorStop(0, '#f9e088');   // radiant bright gold center
    baseGrad.addColorStop(0.28, '#d4af37'); // rich metallic gold
    baseGrad.addColorStop(0.55, '#c59b27'); // antique brass
    baseGrad.addColorStop(0.82, '#a07818'); // deeper shaded brass
    baseGrad.addColorStop(0.96, '#734e0a'); // outer rim shadow
    baseGrad.addColorStop(1.0, '#4a3206');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 254, 0, Math.PI * 2);
    ctx.fill();

    // Radial brushed metal shimmer lines
    ctx.save();
    ctx.translate(cx, cy);
    for (let a = 0; a < 144; a++) {
      const angle = (Math.PI * 2 / 144) * a;
      const alpha = 0.03 + (a % 2 === 0 ? 0.05 : 0.015);
      ctx.strokeStyle = a % 3 === 0 ? `rgba(255, 240, 180, ${alpha})` : `rgba(60, 40, 5, ${alpha * 0.8})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
      ctx.lineTo(Math.cos(angle) * 250, Math.sin(angle) * 250);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Concentric Fine Engraved Temple Grooves
    const ringRadii = [42, 70, 95, 125, 160, 195, 225, 246];
    ringRadii.forEach((r, idx) => {
      ctx.strokeStyle = 'rgba(70, 45, 8, 0.45)';
      ctx.lineWidth = idx % 2 === 0 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 245, 190, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1.2, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 3. Sacred Ashtadal Kamala (8-Petaled Sacred Lotus Mandala)
    ctx.save();
    ctx.translate(cx, cy);
    const petalCount = 8;
    for (let p = 0; p < petalCount; p++) {
      const pAngle = (Math.PI * 2 / petalCount) * p;
      ctx.save();
      ctx.rotate(pAngle);

      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.bezierCurveTo(-22, 50, -28, 100, 0, 125);
      ctx.bezierCurveTo(28, 100, 22, 50, 0, 24);
      ctx.closePath();

      const pGrad = ctx.createLinearGradient(0, 24, 0, 125);
      pGrad.addColorStop(0, 'rgba(255, 235, 150, 0.4)');
      pGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.35)');
      pGrad.addColorStop(0.9, 'rgba(140, 95, 15, 0.45)');
      pGrad.addColorStop(1, 'rgba(80, 50, 5, 0.55)');
      ctx.fillStyle = pGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 240, 170, 0.7)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(90, 55, 10, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(0, 118);
      ctx.stroke();

      ctx.restore();
    }

    // Outer 16-Petal secondary delicate lotus rim
    for (let p = 0; p < 16; p++) {
      const pAngle = (Math.PI * 2 / 16) * p;
      ctx.save();
      ctx.rotate(pAngle);
      ctx.beginPath();
      ctx.moveTo(0, 132);
      ctx.quadraticCurveTo(-15, 160, 0, 188);
      ctx.quadraticCurveTo(15, 160, 0, 132);
      ctx.strokeStyle = 'rgba(255, 230, 140, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    // Outer Sacred Beaded Garland Border (64 engraved golden pearls)
    for (let b = 0; b < 64; b++) {
      const bAngle = (Math.PI * 2 / 64) * b;
      const bx = Math.cos(bAngle) * 236;
      const by = Math.sin(bAngle) * 236;
      ctx.beginPath();
      ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = b % 2 === 0 ? '#ffea9f' : '#d4af37';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 50, 8, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Auspicious Central Bindu (Altar Mount Circle)
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 32);
    centerGrad.addColorStop(0, '#fff4b8');
    centerGrad.addColorStop(0.6, '#d4af37');
    centerGrad.addColorStop(1, '#8b6508');
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let s = 0; s < 8; s++) {
      const sAngle = (Math.PI * 2 / 8) * s;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sAngle) * 6, Math.sin(sAngle) * 6);
      ctx.lineTo(Math.cos(sAngle) * 26, Math.sin(sAngle) * 26);
      ctx.strokeStyle = 'rgba(255, 240, 160, 0.75)';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTempleThaliRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 512, 512);

    const cx = 256, cy = 256;
    ctx.save();
    ctx.translate(cx, cy);

    const ringRadii = [42, 70, 95, 125, 160, 195, 225, 246];
    ringRadii.forEach((r) => {
      ctx.strokeStyle = '#909090';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    for (let p = 0; p < 8; p++) {
      const pAngle = (Math.PI * 2 / 8) * p;
      ctx.save();
      ctx.rotate(pAngle);
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.bezierCurveTo(-22, 50, -28, 100, 0, 125);
      ctx.bezierCurveTo(28, 100, 22, 50, 0, 24);
      ctx.strokeStyle = '#a0a0a0';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

interface FlowerParticleData {
  sprite: THREE.Sprite;
  material: THREE.SpriteMaterial;
  active: boolean;
  x: number;
  y: number;
  z: number;
  vy: number;
  swaySpeed: number;
  swayAmp: number;
  swayOffset: number;
  rotSpeed: number;
}

function getTimePresetForNow(): DarshanTimeOfDay {
  const hour = new Date().getHours();
  // Morning: 05:00 - 11:59 (5 AM to 12 PM)
  if (hour >= 5 && hour < 12) return 'suprabhatam';
  // Afternoon: 12:00 - 16:59 (12 PM to 5 PM)
  if (hour >= 12 && hour < 17) return 'madhyahna';
  // Evening & Night Sanctum: 17:00 - 04:59 (5 PM to 5 AM)
  return 'sandhya';
}

export default function InteractiveDarshanSanctum3D({
  className = 'w-full h-[540px]',
}: InteractiveDarshanSanctum3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<DarshanTimeOfDay>(() => getTimePresetForNow());
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isAartiActive, setIsAartiActive] = useState(false);
  const [aartiSecondsLeft, setAartiSecondsLeft] = useState(0);
  const [isAartiFacingDevotee, setIsAartiFacingDevotee] = useState(false);
  const [isFlowerShowerActive, setIsFlowerShowerActive] = useState(false);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [isIncenseActive, setIsIncenseActive] = useState(true);
  const isIncenseActiveRef = useRef(true);
  isIncenseActiveRef.current = isIncenseActive;
  const handleRingBellRef = useRef<(() => void) | null>(null);

  // References to dynamic 3D elements for callbacks
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bellMeshRef = useRef<THREE.Group | null>(null);
  const bellClapperRef = useRef<THREE.Group | null>(null);
  const soundWaveRef = useRef<THREE.Mesh | null>(null);
  const bellSwingRef = useRef({
    swinging: false,
    angle: 0,
    speed: 0,
    soundWaveScale: 1,
    soundWaveOpacity: 0,
  });

  const aartiFlameRef = useRef<THREE.PointLight | null>(null);
  const aartiFlameMeshRef = useRef<THREE.Group | null>(null);
  const aartiGroupRef = useRef<THREE.Group | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const mainSpotLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const hangingLeftLightRef = useRef<THREE.PointLight | null>(null);
  const hangingRightLightRef = useRef<THREE.PointLight | null>(null);
  const haloMeshRef = useRef<THREE.Mesh | null>(null);

  // Pushparchana references
  const triggerFlowerShowerRef = useRef<(() => void) | null>(null);
  const isFlowerShowerActiveRef = useRef(false);
  const flowerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Aarti references (strictly 11 seconds facing Goddess, followed by 4 seconds facing devotees)
  const isAartiActiveRef = useRef(false);
  const aartiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAartiFacingDevoteeRef = useRef(false);
  const devoteeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Bell Ring (no notification popups)
  const handleRingBell = useCallback(() => {
    setIsBellRinging(true);
    bellSwingRef.current.swinging = true;
    bellSwingRef.current.speed = 0.38;
    bellSwingRef.current.soundWaveScale = 1.0;
    bellSwingRef.current.soundWaveOpacity = 0.9;

    if (!isAudioMuted) {
      templeAudio.playTempleBell(0.85);
    }
    setTimeout(() => {
      setIsBellRinging(false);
    }, 2200);
  }, [isAudioMuted]);
  handleRingBellRef.current = handleRingBell;

  // Trigger Flower Shower (Pushparchana - 30 seconds minimum, toggleable, no notification popups)
  const handleFlowerShower = useCallback(() => {
    if (isFlowerShowerActiveRef.current) {
      // If clicked while active, cancel immediately
      if (flowerIntervalRef.current) clearInterval(flowerIntervalRef.current);
      flowerIntervalRef.current = null;
      isFlowerShowerActiveRef.current = false;
      setIsFlowerShowerActive(false);
      return;
    }

    isFlowerShowerActiveRef.current = true;
    setIsFlowerShowerActive(true);

    if (triggerFlowerShowerRef.current) {
      triggerFlowerShowerRef.current();
    }
    if (!isAudioMuted) {
      templeAudio.playFlowerChime(0.6);
    }

    let remaining = 30;
    if (flowerIntervalRef.current) clearInterval(flowerIntervalRef.current);

    flowerIntervalRef.current = setInterval(() => {
      remaining -= 1;

      if (remaining > 0) {
        if (remaining % 5 === 0 && !isAudioMuted) {
          templeAudio.playFlowerChime(0.45);
        }
      } else {
        if (flowerIntervalRef.current) clearInterval(flowerIntervalRef.current);
        flowerIntervalRef.current = null;
        isFlowerShowerActiveRef.current = false;
        setIsFlowerShowerActive(false);
      }
    }, 1000);
  }, [isAudioMuted]);

  // Trigger Mangala Aarti (11s facing Goddess only, then 4s facing devotees for blessings)
  const handleOfferAarti = useCallback(() => {
    if (isAartiActiveRef.current || isAartiFacingDevoteeRef.current) {
      // If clicked while active, cancel immediately
      if (aartiIntervalRef.current) clearInterval(aartiIntervalRef.current);
      aartiIntervalRef.current = null;
      if (devoteeTimerRef.current) clearTimeout(devoteeTimerRef.current);
      devoteeTimerRef.current = null;
      isAartiActiveRef.current = false;
      setIsAartiActive(false);
      isAartiFacingDevoteeRef.current = false;
      setIsAartiFacingDevotee(false);
      setAartiSecondsLeft(0);
      applyLighting(timeOfDay);
      if (aartiGroupRef.current) {
        aartiGroupRef.current.position.set(0, 0.72, 1.0);
        aartiGroupRef.current.rotation.set(0.14, 0, 0);
      }
      if (aartiFlameRef.current) aartiFlameRef.current.intensity = 0.75;
      return;
    }

    isAartiActiveRef.current = true;
    setIsAartiActive(true);
    isAartiFacingDevoteeRef.current = false;
    setIsAartiFacingDevotee(false);
    setAartiSecondsLeft(11);
    applyLighting('maha_aarti');

    if (!isAudioMuted) {
      templeAudio.playShankhaSound(0.5);
      setTimeout(() => templeAudio.playTempleBell(0.6), 800);
    }

    let remaining = 11;
    if (aartiIntervalRef.current) clearInterval(aartiIntervalRef.current);

    aartiIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setAartiSecondsLeft(remaining);

      if (remaining <= 0) {
        if (aartiIntervalRef.current) clearInterval(aartiIntervalRef.current);
        aartiIntervalRef.current = null;
        isAartiActiveRef.current = false;
        setIsAartiActive(false);
        setAartiSecondsLeft(0);

        // After completion of 11s, face devotees for strictly 4 seconds (Aarti Darshanam)
        isAartiFacingDevoteeRef.current = true;
        setIsAartiFacingDevotee(true);

        if (!isAudioMuted) {
          templeAudio.playTempleBell(0.65);
        }

        if (devoteeTimerRef.current) clearTimeout(devoteeTimerRef.current);
        devoteeTimerRef.current = setTimeout(() => {
          isAartiFacingDevoteeRef.current = false;
          setIsAartiFacingDevotee(false);
          // After 4 seconds facing us, turn off Aarti and restore time-of-day lighting
          applyLighting(timeOfDay);
          if (aartiGroupRef.current) {
            aartiGroupRef.current.position.set(0, 0.72, 1.0);
            aartiGroupRef.current.rotation.set(0.14, 0, 0);
          }
          if (aartiFlameRef.current) aartiFlameRef.current.intensity = 0.75;
        }, 4000);
      }
    }, 1000);
  }, [isAudioMuted, timeOfDay]);

  // Toggle Drone / Sacred Sound
  const toggleSound = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    templeAudio.toggleDrone(!nextMuted, 0.12);
  };

  // Apply Sanctum Lighting Preset to Three.js lights
  const applyLighting = (preset: DarshanTimeOfDay) => {
    if (!ambientLightRef.current || !mainSpotLightRef.current || !rimLightRef.current) return;

    if (preset === 'suprabhatam') {
      ambientLightRef.current.color.setHex(0xfff0dd);
      ambientLightRef.current.intensity = 1.4;
      mainSpotLightRef.current.color.setHex(0xffc56e);
      mainSpotLightRef.current.intensity = 2.4;
      rimLightRef.current.color.setHex(0xff9933);
      if (hangingLeftLightRef.current) hangingLeftLightRef.current.color.setHex(0xffbe5c);
      if (hangingRightLightRef.current) hangingRightLightRef.current.color.setHex(0xffbe5c);
    } else if (preset === 'madhyahna') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.8;
      mainSpotLightRef.current.color.setHex(0xfff3d1);
      mainSpotLightRef.current.intensity = 3.0;
      rimLightRef.current.color.setHex(0xffd700);
      if (hangingLeftLightRef.current) hangingLeftLightRef.current.color.setHex(0xffd580);
      if (hangingRightLightRef.current) hangingRightLightRef.current.color.setHex(0xffd580);
    } else if (preset === 'sandhya') {
      ambientLightRef.current.color.setHex(0x5c2b16);
      ambientLightRef.current.intensity = 1.1;
      mainSpotLightRef.current.color.setHex(0xffaa33);
      mainSpotLightRef.current.intensity = 2.0;
      rimLightRef.current.color.setHex(0xd4af37);
      if (hangingLeftLightRef.current) hangingLeftLightRef.current.color.setHex(0xff8800);
      if (hangingRightLightRef.current) hangingRightLightRef.current.color.setHex(0xff8800);
    } else if (preset === 'maha_aarti') {
      ambientLightRef.current.color.setHex(0x8a1c14);
      ambientLightRef.current.intensity = 1.5;
      mainSpotLightRef.current.color.setHex(0xff6600);
      mainSpotLightRef.current.intensity = 3.5;
      rimLightRef.current.color.setHex(0xffcc00);
      if (hangingLeftLightRef.current) hangingLeftLightRef.current.color.setHex(0xff5500);
      if (hangingRightLightRef.current) hangingRightLightRef.current.color.setHex(0xff5500);
    }
  };

  // Fully Automatic Time-of-Day Transition (Morning, Afternoon, Evening/Night)
  useEffect(() => {
    const checkAutoTime = () => {
      const currentSlot = getTimePresetForNow();
      if (currentSlot !== timeOfDay) {
        setTimeOfDay(currentSlot);
        if (!isAartiActiveRef.current) {
          applyLighting(currentSlot);
        }
      }
    };
    checkAutoTime();
    const interval = setInterval(checkAutoTime, 15000); // Automatically updates every 15 seconds
    return () => clearInterval(interval);
  }, [timeOfDay]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0504);
    scene.fog = new THREE.FogExp2(0x120705, 0.015);

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

    // Apply active time of day lighting preset immediately
    applyLighting(timeOfDay);

    // 3. Sanctum Architecture Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
    });
    const polishedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe5a93c,
      metalness: 0.92,
      roughness: 0.28,
    });
    const darkBrassMat = new THREE.MeshStandardMaterial({
      color: 0xb57c1e,
      metalness: 0.85,
      roughness: 0.35,
    });
    const silkCrimsonMat = new THREE.MeshStandardMaterial({
      color: 0x990000,
      roughness: 0.8,
      metalness: 0.1,
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

    // 4. Sanctum Mandapam Arch & Pillars (Prabhavali Mandapam)
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

      const baseBox = new THREE.BoxGeometry(0.6, 0.25, 0.6);
      const baseMesh = new THREE.Mesh(baseBox, carvedWoodMat);
      baseMesh.position.set(x, 0.12, -0.1);
      mandapamGroup.add(baseMesh);

      const topBox = new THREE.BoxGeometry(0.6, 0.25, 0.6);
      const topMesh = new THREE.Mesh(topBox, carvedWoodMat);
      topMesh.position.set(x, 4.5, -0.1);
      mandapamGroup.add(topMesh);
    });

    // Outer Carved Temple Pillars beside the inner golden pillars
    [-4.3, 4.3].forEach((x) => {
      const outerPillarGeo = new THREE.CylinderGeometry(0.24, 0.28, 5.2, 16);
      const outerPillarMesh = new THREE.Mesh(outerPillarGeo, darkBrassMat);
      outerPillarMesh.position.set(x, 2.6, -0.5);
      mandapamGroup.add(outerPillarMesh);

      // Decorative gold rings on outer pillars
      [1.4, 2.6, 3.8].forEach((ry) => {
        const ringGeo = new THREE.TorusGeometry(0.28, 0.035, 12, 24);
        const ringMesh = new THREE.Mesh(ringGeo, polishedGoldMat);
        ringMesh.position.set(x, ry, -0.5);
        ringMesh.rotation.x = Math.PI / 2;
        mandapamGroup.add(ringMesh);
      });

      const baseBox = new THREE.BoxGeometry(0.75, 0.3, 0.75);
      const baseMesh = new THREE.Mesh(baseBox, carvedWoodMat);
      baseMesh.position.set(x, 0.15, -0.5);
      mandapamGroup.add(baseMesh);

      const topBox = new THREE.BoxGeometry(0.75, 0.3, 0.75);
      const topMesh = new THREE.Mesh(topBox, carvedWoodMat);
      topMesh.position.set(x, 5.05, -0.5);
      mandapamGroup.add(topMesh);
    });

    // Hanging Brass Temple Deepams (Oil Lamps) beside the pillars
    const hangingLampGroup = new THREE.Group();
    [-3.25, 3.25].forEach((lx) => {
      // Brass Hanging Chains
      for (let i = 0; i < 9; i++) {
        const cGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 16);
        const cMesh = new THREE.Mesh(cGeo, i % 2 === 0 ? brassMat : polishedGoldMat);
        cMesh.position.set(lx, 4.85 - i * 0.16, 0.05);
        if (i % 2 !== 0) cMesh.rotation.y = Math.PI / 2;
        hangingLampGroup.add(cMesh);
      }

      // Brass Lamp Bowl
      const bowlGeo = new THREE.CylinderGeometry(0.24, 0.08, 0.14, 16);
      const bowlMesh = new THREE.Mesh(bowlGeo, polishedGoldMat);
      bowlMesh.position.set(lx, 3.4, 0.05);
      hangingLampGroup.add(bowlMesh);

      // Lower decorative brass drop
      const dropGeo = new THREE.ConeGeometry(0.08, 0.16, 12);
      const dropMesh = new THREE.Mesh(dropGeo, brassMat);
      dropMesh.position.set(lx, 3.26, 0.05);
      dropMesh.rotation.x = Math.PI;
      hangingLampGroup.add(dropMesh);

      // 5 glowing golden lamp flames around the bowl
      for (let f = 0; f < 5; f++) {
        const fAngle = (Math.PI * 2 / 5) * f;
        const flameGeo = new THREE.ConeGeometry(0.04, 0.12, 8);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const fMesh = new THREE.Mesh(flameGeo, flameMat);
        fMesh.position.set(lx + Math.cos(fAngle) * 0.18, 3.52, 0.05 + Math.sin(fAngle) * 0.18);
        hangingLampGroup.add(fMesh);
      }

      // Warm point light for the lamp
      const lampLight = new THREE.PointLight(0xff9922, 1.5, 6.0);
      lampLight.position.set(lx, 3.55, 0.25);
      hangingLampGroup.add(lampLight);
      if (lx < 0) hangingLeftLightRef.current = lampLight;
      else hangingRightLightRef.current = lampLight;
    });
    scene.add(hangingLampGroup);

    // 5. Sanctum Pedestal (Peetham)
    const peethamGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.7, 32);
    const peethamMesh = new THREE.Mesh(peethamGeo, silverMat);
    peethamMesh.position.set(0, 0.35, 0);
    mandapamGroup.add(peethamMesh);

    scene.add(mandapamGroup);

    // 5.5. Sanctum Garbha Griha Temple Backdrop Wall & Polished Granite Floor
    const textureLoader = new THREE.TextureLoader();

    const backdropGeo = new THREE.PlaneGeometry(18.0, 10.5);
    textureLoader.load('/images/temple_sanctum_backdrop.jpg', (backdropTex) => {
      backdropTex.colorSpace = THREE.SRGBColorSpace;
      backdropTex.minFilter = THREE.LinearFilter;
      backdropTex.magFilter = THREE.LinearFilter;
      const backdropMat = new THREE.MeshStandardMaterial({
        map: backdropTex,
        roughness: 0.82,
        metalness: 0.12,
      });
      const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
      backdropMesh.position.set(0, 3.0, -1.6);
      scene.add(backdropMesh);
    });

    const floorGeo = new THREE.PlaneGeometry(22, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x140c09,
      roughness: 0.38,
      metalness: 0.3,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 1.2);
    scene.add(floorMesh);

    // 6. Sacred Sri Vasavi Matha Murti Image Plane with Glowing Aura
    const murtiGroup = new THREE.Group();

    // Radiant Golden Halo Disk (Prabhavali Chakra) behind crown
    const haloTex = createGoldenHaloTexture();
    const haloGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 3.65, -0.04);
    murtiGroup.add(haloMesh);
    haloMeshRef.current = haloMesh;

    // Murti Plane with High-Res Cropped Transparent Deity
    textureLoader.load('/images/vasavi_darshan_murti_cropped.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      // Cropped aspect ratio: 284 / 585 ≈ 0.48547. Height = 3.8, Width = 1.845
      const murtiGeo = new THREE.PlaneGeometry(1.85, 3.8);
      const murtiMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
      });
      const murtiMesh = new THREE.Mesh(murtiGeo, murtiMat);
      // Pedestal top is at y = 0.70; Murti height 3.8 centered at y = 2.60 places feet on pedestal
      murtiMesh.position.set(0, 2.6, 0.05);
      murtiGroup.add(murtiMesh);
    });
    scene.add(murtiGroup);

    // 7. Upscaled Vedic Brass Temple Ghanta (Bell with Interlocking Links & Sacred Tassel)
    const bellPivotGroup = new THREE.Group();
    bellPivotGroup.position.set(-1.85, 4.35, 1.15); // Mounted to ceiling top-left

    // A. Ceiling Mount Plate & Anchor Hook
    const anchorPlateGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
    const anchorPlateMesh = new THREE.Mesh(anchorPlateGeo, brassMat);
    anchorPlateMesh.position.set(0, 0, 0);
    bellPivotGroup.add(anchorPlateMesh);

    const anchorLoopGeo = new THREE.TorusGeometry(0.08, 0.022, 12, 24);
    const anchorLoopMesh = new THREE.Mesh(anchorLoopGeo, darkBrassMat);
    anchorLoopMesh.position.set(0, -0.06, 0);
    bellPivotGroup.add(anchorLoopMesh);

    // B. Hanging Bell Swivel Body Group (Swings on ring)
    const bellSwingBody = new THREE.Group();
    bellSwingBody.position.set(0, -0.08, 0);

    // 6 Interlocking Heavy Brass Chain Links
    const chainLinkCount = 6;
    for (let c = 0; c < chainLinkCount; c++) {
      const linkGeo = new THREE.TorusGeometry(0.07, 0.02, 12, 24);
      const linkMesh = new THREE.Mesh(linkGeo, c % 2 === 0 ? brassMat : polishedGoldMat);
      linkMesh.position.set(0, -(c * 0.11 + 0.06), 0);
      if (c % 2 === 1) {
        linkMesh.rotation.y = Math.PI / 2;
      }
      bellSwingBody.add(linkMesh);
    }

    // C. Sacred Kalasha Crown Finial (Temple Spire / Kumbha)
    const finialGroup = new THREE.Group();
    finialGroup.position.set(0, -0.74, 0);

    // Pointed Spire
    const spireGeo = new THREE.ConeGeometry(0.038, 0.14, 16);
    const spireMesh = new THREE.Mesh(spireGeo, polishedGoldMat);
    spireMesh.position.set(0, 0.07, 0);
    finialGroup.add(spireMesh);

    // Kalasha Pot
    const kalashaGeo = new THREE.SphereGeometry(0.085, 20, 20);
    const kalashaMesh = new THREE.Mesh(kalashaGeo, goldMat);
    kalashaMesh.position.set(0, -0.04, 0);
    finialGroup.add(kalashaMesh);

    // Stepped Lotus Collar
    const collarGeo = new THREE.CylinderGeometry(0.12, 0.06, 0.06, 24);
    const collarMesh = new THREE.Mesh(collarGeo, darkBrassMat);
    collarMesh.position.set(0, -0.11, 0);
    finialGroup.add(collarMesh);
    bellSwingBody.add(finialGroup);

    // D. Contoured Acoustic Bell Body
    const bellBodyGroup = new THREE.Group();
    bellBodyGroup.position.set(0, -0.9, 0);

    // Upper Hemispherical Brass Shoulder
    const shoulderGeo = new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, brassMat);
    shoulderMesh.position.set(0, -0.06, 0);
    bellBodyGroup.add(shoulderMesh);

    // Upper Filigree Band Ring
    const upperFiligreeGeo = new THREE.TorusGeometry(0.245, 0.022, 16, 32);
    const upperFiligreeMesh = new THREE.Mesh(upperFiligreeGeo, polishedGoldMat);
    upperFiligreeMesh.rotation.x = Math.PI / 2;
    upperFiligreeMesh.position.set(0, -0.1, 0);
    bellBodyGroup.add(upperFiligreeMesh);

    // Contoured Waist
    const waistGeo = new THREE.CylinderGeometry(0.24, 0.31, 0.32, 32);
    const waistMesh = new THREE.Mesh(waistGeo, brassMat);
    waistMesh.position.set(0, -0.27, 0);
    bellBodyGroup.add(waistMesh);

    // Middle Filigree Band Ring
    const midFiligreeGeo = new THREE.TorusGeometry(0.305, 0.024, 16, 32);
    const midFiligreeMesh = new THREE.Mesh(midFiligreeGeo, polishedGoldMat);
    midFiligreeMesh.rotation.x = Math.PI / 2;
    midFiligreeMesh.position.set(0, -0.42, 0);
    bellBodyGroup.add(midFiligreeMesh);

    // Resonant Acoustic Flare
    const flareGeo = new THREE.CylinderGeometry(0.31, 0.48, 0.28, 32);
    const flareMesh = new THREE.Mesh(flareGeo, brassMat);
    flareMesh.position.set(0, -0.56, 0);
    bellBodyGroup.add(flareMesh);

    // Thick Heavy Acoustic Rim Lip
    const rimLipGeo = new THREE.TorusGeometry(0.48, 0.048, 16, 40);
    const rimLipMesh = new THREE.Mesh(rimLipGeo, polishedGoldMat);
    rimLipMesh.rotation.x = Math.PI / 2;
    rimLipMesh.position.set(0, -0.7, 0);
    bellBodyGroup.add(rimLipMesh);

    // Inside Hollow Bell Shadow Cup
    const insideHollowGeo = new THREE.ConeGeometry(0.44, 0.65, 24, 1, true);
    const insideHollowMat = new THREE.MeshBasicMaterial({ color: 0x221305, side: THREE.BackSide });
    const insideHollowMesh = new THREE.Mesh(insideHollowGeo, insideHollowMat);
    insideHollowMesh.position.set(0, -0.38, 0);
    bellBodyGroup.add(insideHollowMesh);

    bellSwingBody.add(bellBodyGroup);

    // E. Internal Clapper & Sacred Crimson Silk Tassel Rope
    const clapperGroup = new THREE.Group();
    clapperGroup.position.set(0, -0.9, 0);

    // Clapper Rod
    const clapperRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 12);
    const clapperRodMesh = new THREE.Mesh(clapperRodGeo, darkBrassMat);
    clapperRodMesh.position.set(0, -0.4, 0);
    clapperGroup.add(clapperRodMesh);

    // Heavy Golden Clapper Ball
    const clapperBallGeo = new THREE.SphereGeometry(0.11, 24, 24);
    const clapperBallMesh = new THREE.Mesh(clapperBallGeo, polishedGoldMat);
    clapperBallMesh.position.set(0, -0.72, 0);
    clapperGroup.add(clapperBallMesh);

    // Sacred Crimson Silk Rope
    const ropeGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.35, 12);
    const ropeMesh = new THREE.Mesh(ropeGeo, silkCrimsonMat);
    ropeMesh.position.set(0, -0.92, 0);
    clapperGroup.add(ropeMesh);

    // Golden Rope Knot
    const knotGeo = new THREE.TorusGeometry(0.028, 0.01, 8, 16);
    const knotMesh = new THREE.Mesh(knotGeo, polishedGoldMat);
    knotMesh.rotation.x = Math.PI / 2;
    knotMesh.position.set(0, -1.09, 0);
    clapperGroup.add(knotMesh);

    // Silk Tassel Fringes
    const tasselGeo = new THREE.ConeGeometry(0.05, 0.16, 16);
    const tasselMesh = new THREE.Mesh(tasselGeo, silkCrimsonMat);
    tasselMesh.position.set(0, -1.19, 0);
    clapperGroup.add(tasselMesh);

    bellSwingBody.add(clapperGroup);
    bellClapperRef.current = clapperGroup;

    bellPivotGroup.add(bellSwingBody);
    scene.add(bellPivotGroup);
    bellMeshRef.current = bellPivotGroup;

    // F. Golden Sonic Vibration Wave Ring (Nada Bindu Ripple on Strike)
    const soundWaveGeo = new THREE.TorusGeometry(0.55, 0.02, 12, 32);
    const soundWaveMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const soundWaveMesh = new THREE.Mesh(soundWaveGeo, soundWaveMat);
    soundWaveMesh.rotation.x = Math.PI / 2;
    soundWaveMesh.position.set(-1.85, 2.75, 1.15);
    scene.add(soundWaveMesh);
    soundWaveRef.current = soundWaveMesh;

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

      const flameGeo = new THREE.ConeGeometry(0.04, 0.14, 8);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(dx, dy + 0.11, dz);
      diyasGroup.add(flame);
    });
    scene.add(diyasGroup);

    // 9. Royal Temple Pancha-Aarti Thali (High-Detail Sacred Altar Masterpiece)
    const aartiGroup = new THREE.Group();

    // Dedicated procedural textures for royal thali & flames
    const templeThaliTex = createTempleThaliTexture();
    const templeThaliRoughnessTex = createTempleThaliRoughnessTexture();
    const camphorFlameTex = createRealisticCamphorFlameTexture();
    const diyaFlameTex = createRealisticDiyaFlameTexture();
    const flameHaloTex = createFlameHaloTexture();

    // Dedicated materials for the royal thali
    const silverKatoriMat = new THREE.MeshStandardMaterial({ color: 0xf0f2f5, metalness: 0.95, roughness: 0.15 });
    const kumkumPowderMat = new THREE.MeshStandardMaterial({ color: 0xb80010, roughness: 0.92, metalness: 0.05 });
    const chandanPasteMat = new THREE.MeshStandardMaterial({ color: 0xe6b800, roughness: 0.88, metalness: 0.05 });
    const camphorCrystalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.08, transparent: true, opacity: 0.96 });
    const cottonWickMat = new THREE.MeshStandardMaterial({ color: 0x2b2522, roughness: 0.95 });

    // A. Ornate Multi-Tier Pedestal Base (Peetam)
    const thaliBaseFootGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.018, 32);
    const thaliBaseFoot = new THREE.Mesh(thaliBaseFootGeo, darkBrassMat);
    thaliBaseFoot.position.y = -0.012;
    aartiGroup.add(thaliBaseFoot);

    const thaliBaseNeckGeo = new THREE.CylinderGeometry(0.23, 0.25, 0.016, 32);
    const thaliBaseNeck = new THREE.Mesh(thaliBaseNeckGeo, brassMat);
    thaliBaseNeck.position.y = 0.002;
    aartiGroup.add(thaliBaseNeck);

    const thaliBaseBeadGeo = new THREE.TorusGeometry(0.24, 0.010, 12, 32);
    const thaliBaseBead = new THREE.Mesh(thaliBaseBeadGeo, polishedGoldMat);
    thaliBaseBead.rotation.x = Math.PI / 2;
    thaliBaseBead.position.y = 0.01;
    aartiGroup.add(thaliBaseBead);

    // B. Main Golden Thali Tray Body (Deep Beveled Altar Plate with Ashtadal Mandala)
    const thaliPlateGeo = new THREE.CylinderGeometry(0.40, 0.36, 0.026, 36);
    const thaliPlate = new THREE.Mesh(thaliPlateGeo, polishedGoldMat);
    thaliPlate.position.y = 0.018;
    aartiGroup.add(thaliPlate);

    // Hand-engraved Ashtadal Kamala sacred lotus mandala & brushed brass plate surface
    const thaliTopMat = new THREE.MeshStandardMaterial({
      map: templeThaliTex,
      roughnessMap: templeThaliRoughnessTex,
      metalness: 0.88,
      roughness: 0.28,
    });
    const thaliTopGeo = new THREE.CircleGeometry(0.395, 48);
    const thaliTopMesh = new THREE.Mesh(thaliTopGeo, thaliTopMat);
    thaliTopMesh.rotation.x = -Math.PI / 2;
    thaliTopMesh.position.y = 0.0315;
    aartiGroup.add(thaliTopMesh);

    // Heavy Cast Temple Brass Outer Rim
    const thaliRimGeo = new THREE.TorusGeometry(0.395, 0.022, 16, 48);
    const thaliRim = new THREE.Mesh(thaliRimGeo, goldMat);
    thaliRim.rotation.x = Math.PI / 2;
    thaliRim.position.y = 0.032;
    aartiGroup.add(thaliRim);

    // Scalloped Pearl Beading along the Outer Rim (24 golden pearls)
    for (let b = 0; b < 24; b++) {
      const bAngle = (Math.PI * 2 / 24) * b;
      const bx = Math.cos(bAngle) * 0.40;
      const bz = Math.sin(bAngle) * 0.40;
      const beadGeo = new THREE.SphereGeometry(0.013, 8, 8);
      const beadMesh = new THREE.Mesh(beadGeo, polishedGoldMat);
      beadMesh.position.set(bx, 0.034, bz);
      aartiGroup.add(beadMesh);
    }

    // Engraved Concentric Sacred Rings
    const outerRingGeo = new THREE.TorusGeometry(0.31, 0.007, 12, 36);
    const outerRing = new THREE.Mesh(outerRingGeo, brassMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.031;
    aartiGroup.add(outerRing);

    const midRingGeo = new THREE.TorusGeometry(0.19, 0.007, 12, 36);
    const midRing = new THREE.Mesh(midRingGeo, darkBrassMat);
    midRing.rotation.x = Math.PI / 2;
    midRing.position.y = 0.031;
    aartiGroup.add(midRing);

    // C. Sculpted Sacred Mayura (Peacock) Temple Brass Handle
    const handleBridgeGeo = new THREE.BoxGeometry(0.06, 0.025, 0.08);
    const handleBridge = new THREE.Mesh(handleBridgeGeo, darkBrassMat);
    handleBridge.position.set(0, 0.022, 0.43);
    aartiGroup.add(handleBridge);

    const handleShaftGeo = new THREE.CylinderGeometry(0.019, 0.024, 0.32, 16);
    const handleShaft = new THREE.Mesh(handleShaftGeo, brassMat);
    handleShaft.position.set(0, 0.02, 0.57);
    handleShaft.rotation.x = 0.40;
    aartiGroup.add(handleShaft);

    // Grip rings on handle
    [0.48, 0.54, 0.60, 0.66].forEach((hz) => {
      const gRingGeo = new THREE.TorusGeometry(0.025, 0.007, 10, 16);
      const gRing = new THREE.Mesh(gRingGeo, polishedGoldMat);
      gRing.position.set(0, 0.02 + (hz - 0.57) * -0.4, hz);
      gRing.rotation.x = 0.40;
      aartiGroup.add(gRing);
    });

    // Sculpted Mayura (Peacock) Finial at Handle Tip
    const mayuraBodyGeo = new THREE.SphereGeometry(0.036, 16, 16);
    const mayuraBody = new THREE.Mesh(mayuraBodyGeo, polishedGoldMat);
    mayuraBody.position.set(0, -0.05, 0.72);
    mayuraBody.scale.set(0.85, 1.25, 1.0);
    aartiGroup.add(mayuraBody);

    const mayuraNeckGeo = new THREE.CylinderGeometry(0.014, 0.02, 0.06, 12);
    const mayuraNeck = new THREE.Mesh(mayuraNeckGeo, goldMat);
    mayuraNeck.position.set(0, -0.01, 0.74);
    mayuraNeck.rotation.x = -0.3;
    aartiGroup.add(mayuraNeck);

    const mayuraHeadGeo = new THREE.SphereGeometry(0.022, 12, 12);
    const mayuraHead = new THREE.Mesh(mayuraHeadGeo, polishedGoldMat);
    mayuraHead.position.set(0, 0.02, 0.75);
    aartiGroup.add(mayuraHead);

    // Peacock Crest (3 golden beads)
    [-0.008, 0, 0.008].forEach((cx) => {
      const crestGeo = new THREE.SphereGeometry(0.006, 6, 6);
      const crestMesh = new THREE.Mesh(crestGeo, polishedGoldMat);
      crestMesh.position.set(cx, 0.042, 0.755);
      aartiGroup.add(crestMesh);
    });

    // D. Central Raised Lotus Chalice for Camphor (Karpoora Mandira Patra)
    const chaliceBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.025, 24);
    const chaliceBase = new THREE.Mesh(chaliceBaseGeo, darkBrassMat);
    chaliceBase.position.set(0, 0.038, 0);
    aartiGroup.add(chaliceBase);

    const chaliceStemGeo = new THREE.CylinderGeometry(0.065, 0.08, 0.035, 16);
    const chaliceStem = new THREE.Mesh(chaliceStemGeo, polishedGoldMat);
    chaliceStem.position.set(0, 0.065, 0);
    aartiGroup.add(chaliceStem);

    const chaliceCupGeo = new THREE.CylinderGeometry(0.13, 0.08, 0.08, 24);
    const chaliceCup = new THREE.Mesh(chaliceCupGeo, brassMat);
    chaliceCup.position.set(0, 0.11, 0);
    aartiGroup.add(chaliceCup);

    const chaliceLipGeo = new THREE.TorusGeometry(0.128, 0.013, 12, 24);
    const chaliceLip = new THREE.Mesh(chaliceLipGeo, polishedGoldMat);
    chaliceLip.rotation.x = Math.PI / 2;
    chaliceLip.position.y = 0.15;
    aartiGroup.add(chaliceLip);

    // Chunky Pure White Crystalline Camphor Blocks
    const camphorCubes = [
      [-0.035, 0.135, 0.025],
      [0.035, 0.135, -0.015],
      [0, 0.14, -0.035],
      [0, 0.145, 0.03],
    ];
    camphorCubes.forEach(([cx, cy, cz]) => {
      const cGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
      const cMesh = new THREE.Mesh(cGeo, camphorCrystalMat);
      cMesh.position.set(cx, cy, cz);
      cMesh.rotation.set(0.3, Math.random() * Math.PI, 0.2);
      aartiGroup.add(cMesh);
    });

    // E. Five Lotus Petal Diya Lamps (Pancha Deepam Arc)
    const panchaDiyaAngles = [-0.95, -0.48, 0, 0.48, 0.95];
    const panchaDiyaFlameQuads: THREE.Mesh[] = [];

    panchaDiyaAngles.forEach((angle) => {
      const pdx = Math.sin(angle) * 0.26;
      const pdz = -Math.cos(angle) * 0.26; // placed along front arc facing deity

      // Lotus petal diya bowl
      const pBowlGeo = new THREE.CylinderGeometry(0.042, 0.022, 0.032, 12);
      const pBowl = new THREE.Mesh(pBowlGeo, brassMat);
      pBowl.position.set(pdx, 0.045, pdz);
      aartiGroup.add(pBowl);

      const pLipGeo = new THREE.TorusGeometry(0.040, 0.007, 8, 12);
      const pLip = new THREE.Mesh(pLipGeo, polishedGoldMat);
      pLip.rotation.x = Math.PI / 2;
      pLip.position.set(pdx, 0.061, pdz);
      aartiGroup.add(pLip);

      // Black cotton wick tip
      const pWickGeo = new THREE.CylinderGeometry(0.005, 0.006, 0.018, 6);
      const pWick = new THREE.Mesh(pWickGeo, cottonWickMat);
      pWick.position.set(pdx, 0.068, pdz);
      aartiGroup.add(pWick);

      // Incandescent glowing cotton wick ember
      const emberGeo = new THREE.SphereGeometry(0.006, 6, 6);
      const emberMat = new THREE.MeshBasicMaterial({ color: 0xff3a00 });
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(pdx, 0.076, pdz);
      aartiGroup.add(ember);

      // Photorealistic dual crossed-quad additive ghee flame
      const diyaQuadGeo = new THREE.PlaneGeometry(0.054, 0.096);
      diyaQuadGeo.translate(0, 0.048, 0); // anchor at base
      const diyaQuadMat = new THREE.MeshBasicMaterial({
        map: diyaFlameTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const dMesh1 = new THREE.Mesh(diyaQuadGeo, diyaQuadMat);
      dMesh1.position.set(pdx, 0.074, pdz);
      dMesh1.rotation.y = angle;
      aartiGroup.add(dMesh1);
      panchaDiyaFlameQuads.push(dMesh1);

      const dMesh2 = new THREE.Mesh(diyaQuadGeo, diyaQuadMat);
      dMesh2.position.set(pdx, 0.074, pdz);
      dMesh2.rotation.y = angle + Math.PI / 2;
      aartiGroup.add(dMesh2);
      panchaDiyaFlameQuads.push(dMesh2);
    });

    // F. Sacred Pooja Dravyas: Kumkum & Chandan Katoris
    // Left Katori: Sacred Crimson Kumkum (Sindhoor)
    const kumkumBowlGeo = new THREE.CylinderGeometry(0.045, 0.025, 0.03, 14);
    const kumkumBowl = new THREE.Mesh(kumkumBowlGeo, silverKatoriMat);
    kumkumBowl.position.set(-0.20, 0.042, 0.12);
    aartiGroup.add(kumkumBowl);

    const kumkumMoundGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const kumkumMound = new THREE.Mesh(kumkumMoundGeo, kumkumPowderMat);
    kumkumMound.position.set(-0.20, 0.055, 0.12);
    kumkumMound.scale.set(1.0, 0.6, 1.0);
    aartiGroup.add(kumkumMound);

    // Right Katori: Fragrant Golden Chandanam (Turmeric / Sandalwood)
    const chandanBowlGeo = new THREE.CylinderGeometry(0.045, 0.025, 0.03, 14);
    const chandanBowl = new THREE.Mesh(chandanBowlGeo, silverKatoriMat);
    chandanBowl.position.set(0.20, 0.042, 0.12);
    aartiGroup.add(chandanBowl);

    const chandanMoundGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const chandanMound = new THREE.Mesh(chandanMoundGeo, chandanPasteMat);
    chandanMound.position.set(0.20, 0.055, 0.12);
    chandanMound.scale.set(1.0, 0.6, 1.0);
    aartiGroup.add(chandanMound);

    const chandanTilakGeo = new THREE.SphereGeometry(0.009, 8, 8);
    const chandanTilak = new THREE.Mesh(chandanTilakGeo, kumkumPowderMat);
    chandanTilak.position.set(0.20, 0.078, 0.12);
    aartiGroup.add(chandanTilak);

    // Miniature Temple Brass Pooja Hand Bell (Ghanti) on Left Side
    const ghantiBodyGeo = new THREE.ConeGeometry(0.026, 0.052, 12);
    const ghantiBody = new THREE.Mesh(ghantiBodyGeo, brassMat);
    ghantiBody.position.set(-0.24, 0.052, -0.04);
    aartiGroup.add(ghantiBody);

    const ghantiHandleGeo = new THREE.CylinderGeometry(0.005, 0.007, 0.045, 8);
    const ghantiHandle = new THREE.Mesh(ghantiHandleGeo, polishedGoldMat);
    ghantiHandle.position.set(-0.24, 0.09, -0.04);
    aartiGroup.add(ghantiHandle);

    const ghantiFinialGeo = new THREE.SphereGeometry(0.010, 8, 8);
    const ghantiFinial = new THREE.Mesh(ghantiFinialGeo, polishedGoldMat);
    ghantiFinial.position.set(-0.24, 0.115, -0.04);
    aartiGroup.add(ghantiFinial);

    // Scattered Mantra-Akshata Grains (golden blessed rice grains)
    const akshataMat = new THREE.MeshStandardMaterial({ color: 0xf5d061, roughness: 0.5 });
    for (let g = 0; g < 16; g++) {
      const gx = (Math.random() - 0.5) * 0.45;
      const gz = (Math.random() - 0.5) * 0.35;
      const grainGeo = new THREE.BoxGeometry(0.008, 0.005, 0.016);
      const grainMesh = new THREE.Mesh(grainGeo, akshataMat);
      grainMesh.position.set(gx, 0.032, gz);
      grainMesh.rotation.y = Math.random() * Math.PI;
      aartiGroup.add(grainMesh);
    }

    // Fresh Fragrant Garland of Floral Petals (Rose, Marigold, Jasmine)
    const petalColors = [
      0xd50000, 0xffbb00, 0xff6600, 0xf5f5f5, 0xd50000,
      0xffbb00, 0xff6600, 0xf5f5f5, 0xd50000, 0xffbb00,
    ];
    for (let p = 0; p < 10; p++) {
      const pAngle = (Math.PI * 2 / 10) * p;
      const px = Math.cos(pAngle) * 0.33;
      const pz = Math.sin(pAngle) * 0.33;
      const petalGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.007, 8);
      const petalMat = new THREE.MeshStandardMaterial({ color: petalColors[p], roughness: 0.55 });
      const petalMesh = new THREE.Mesh(petalGeo, petalMat);
      petalMesh.position.set(px, 0.033, pz);
      petalMesh.rotation.y = pAngle;
      petalMesh.scale.set(1.4, 1.0, 0.75);
      aartiGroup.add(petalMesh);
    }

    // G. Magnificent Photorealistic Central Camphor Flame (Karpoora Jyoti)
    const aartiFlameGroup = new THREE.Group();

    // 1. Pure Camphor Blue Root Foot Mantle
    const blueRootGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const blueRootMat = new THREE.MeshBasicMaterial({
      color: 0x1e66ff,
      transparent: true,
      opacity: 0.85,
    });
    const blueRootMesh = new THREE.Mesh(blueRootGeo, blueRootMat);
    blueRootMesh.position.set(0, 0.155, 0);
    blueRootMesh.scale.set(1.15, 0.45, 1.15);
    aartiFlameGroup.add(blueRootMesh);

    // 2. Multi-Plane Crossed Additive Plasma Flames (3 planes at 0, 60, 120 deg)
    const flamePlaneGeo = new THREE.PlaneGeometry(0.24, 0.44);
    flamePlaneGeo.translate(0, 0.22, 0); // anchor at base
    const camphorFlameMat = new THREE.MeshBasicMaterial({
      map: camphorFlameTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const flameMesh1 = new THREE.Mesh(flamePlaneGeo, camphorFlameMat);
    flameMesh1.position.set(0, 0.15, 0);
    aartiFlameGroup.add(flameMesh1);

    const flameMesh2 = new THREE.Mesh(flamePlaneGeo, camphorFlameMat);
    flameMesh2.position.set(0, 0.15, 0);
    flameMesh2.rotation.y = Math.PI / 3;
    aartiFlameGroup.add(flameMesh2);

    const flameMesh3 = new THREE.Mesh(flamePlaneGeo, camphorFlameMat);
    flameMesh3.position.set(0, 0.15, 0);
    flameMesh3.rotation.y = (Math.PI * 2) / 3;
    aartiFlameGroup.add(flameMesh3);

    // 3. Inner Blinding White-Hot Thermal Core (2 crossed quads at 30 and 90 deg)
    const coreFlameGeo = new THREE.PlaneGeometry(0.14, 0.30);
    coreFlameGeo.translate(0, 0.15, 0);
    const coreFlameMat = new THREE.MeshBasicMaterial({
      map: camphorFlameTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const coreMesh1 = new THREE.Mesh(coreFlameGeo, coreFlameMat);
    coreMesh1.position.set(0, 0.15, 0);
    coreMesh1.rotation.y = Math.PI / 6;
    aartiFlameGroup.add(coreMesh1);

    const coreMesh2 = new THREE.Mesh(coreFlameGeo, coreFlameMat);
    coreMesh2.position.set(0, 0.15, 0);
    coreMesh2.rotation.y = Math.PI / 2;
    aartiFlameGroup.add(coreMesh2);

    // 4. Optical Atmospheric Bloom Halo Sprite (Luminous Amber-Gold Radiance)
    const flameHaloMat = new THREE.SpriteMaterial({
      map: flameHaloTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.70,
    });
    const flameHaloSprite = new THREE.Sprite(flameHaloMat);
    flameHaloSprite.position.set(0, 0.35, 0);
    flameHaloSprite.scale.set(0.72, 0.72, 1.0);
    aartiFlameGroup.add(flameHaloSprite);

    // 5. Floating Incandescent Camphor Fire Spark Particles (Embers)
    const sparkCount = 18;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];
    for (let s = 0; s < sparkCount; s++) {
      sparkPositions[s * 3] = (Math.random() - 0.5) * 0.08;
      sparkPositions[s * 3 + 1] = 0.22 + Math.random() * 0.30;
      sparkPositions[s * 3 + 2] = (Math.random() - 0.5) * 0.08;
      sparkVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: 0.15 + Math.random() * 0.22,
        z: (Math.random() - 0.5) * 0.02,
        life: Math.random(),
        maxLife: 1.0 + Math.random() * 0.8,
      });
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffbb33,
      size: 0.016,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    aartiFlameGroup.add(sparkPoints);

    // High-radiance warm camphor point light
    const aartiPointLight = new THREE.PointLight(0xff8811, 0.85, 4.8);
    aartiPointLight.position.set(0, 0.35, 0);
    aartiFlameGroup.add(aartiPointLight);
    aartiFlameRef.current = aartiPointLight;
    aartiFlameMeshRef.current = aartiFlameGroup;
    aartiGroup.add(aartiFlameGroup);

    // Initial placement: resting directly on the Peetham in front of the Goddess
    aartiGroup.position.set(0, 0.72, 1.0);
    aartiGroup.rotation.set(0.14, 0, 0);
    aartiGroup.visible = true;
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

    // 11. Photorealistic Multi-Flower Pushparchana System (30 Seconds Continuous Flow)
    const flowerTextures = [
      createRosePetalTexture(),
      createYellowMarigoldTexture(),
      createOrangeMarigoldTexture(),
      createWhiteJasmineTexture(),
      createPinkLotusPetalTexture(),
    ];

    const flowerCount = 220;
    const flowerGroup = new THREE.Group();
    const flowerParticles: FlowerParticleData[] = [];

    for (let i = 0; i < flowerCount; i++) {
      // Pick random flower texture: 30% roses, 25% yellow marigolds, 25% orange marigolds, 10% jasmines, 10% lotus
      const r = Math.random();
      let texIndex = 0;
      if (r < 0.3) texIndex = 0; // Rose
      else if (r < 0.55) texIndex = 1; // Yellow Marigold
      else if (r < 0.8) texIndex = 2; // Orange Marigold
      else if (r < 0.9) texIndex = 3; // Jasmine
      else texIndex = 4; // Lotus Petal

      const material = new THREE.SpriteMaterial({
        map: flowerTextures[texIndex],
        transparent: true,
        opacity: 0.98,
        rotation: Math.random() * Math.PI * 2,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(material);
      const scale = 0.38 + Math.random() * 0.22;
      sprite.scale.set(scale, scale, 1);
      sprite.visible = false;
      flowerGroup.add(sprite);

      flowerParticles.push({
        sprite,
        material,
        active: false,
        x: (Math.random() - 0.5) * 4.6,
        y: 4.8 + Math.random() * 3.0,
        z: -0.4 + Math.random() * 2.8,
        vy: 0.022 + Math.random() * 0.026,
        swaySpeed: 1.8 + Math.random() * 2.4,
        swayAmp: 0.008 + Math.random() * 0.014,
        swayOffset: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.045,
      });
    }
    scene.add(flowerGroup);

    // Flower Shower Trigger Hook: Instantly fills sanctum with falling flowers
    triggerFlowerShowerRef.current = () => {
      flowerParticles.forEach((f, idx) => {
        f.active = true;
        f.sprite.visible = true;
        f.x = (Math.random() - 0.5) * 4.6;
        f.z = -0.4 + Math.random() * 2.8;
        // Instantly visible cascade: first 90 flowers are distributed immediately within camera view
        if (idx < 90) {
          f.y = 1.0 + Math.random() * 3.8;
        } else {
          // The remaining 130 flowers stream continuously from above
          f.y = 4.8 + ((idx - 90) / (flowerCount - 90)) * 4.0;
        }
        f.sprite.position.set(f.x, f.y, f.z);
      });
    };

    // 12. Interactive Mouse Tracking & Direct 3D Bell Raycasting
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

    const raycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      clickMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      clickMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(clickMouse, camera);

      // Raycast click directly on 3D bell to ring
      if (bellPivotGroup) {
        const intersects = raycaster.intersectObjects(bellPivotGroup.children, true);
        if (intersects.length > 0) {
          handleRingBellRef.current?.();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleCanvasClick);

    // 13. High-Performance Animation Loop (60 FPS)
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

      // Slowly rotate Divine Aura behind Sri Vasavi Devi
      if (haloMeshRef.current) {
        haloMeshRef.current.rotation.z += 0.003;
      }

      // Flickering hanging temple lamps beside pillars
      if (hangingLeftLightRef.current) {
        hangingLeftLightRef.current.intensity = 1.4 + Math.sin(clock * 7.5) * 0.2 + Math.cos(clock * 13.2) * 0.12;
      }
      if (hangingRightLightRef.current) {
        hangingRightLightRef.current.intensity = 1.4 + Math.cos(clock * 6.8) * 0.2 + Math.sin(clock * 11.7) * 0.12;
      }

      // Bell physics swinging with harmonic dampening & clapper counter-swing
      if (bellMeshRef.current) {
        if (bellSwingRef.current.swinging) {
          bellSwingRef.current.angle = Math.sin(clock * 11) * bellSwingRef.current.speed;
          bellSwingBody.rotation.z = bellSwingRef.current.angle;
          if (bellClapperRef.current) {
            bellClapperRef.current.rotation.z = -bellSwingRef.current.angle * 0.6;
          }
          bellSwingRef.current.speed *= 0.98;
          if (bellSwingRef.current.speed < 0.005) {
            bellSwingRef.current.swinging = false;
            bellSwingBody.rotation.z = 0;
            if (bellClapperRef.current) bellClapperRef.current.rotation.z = 0;
          }
        }

        // Acoustic Sonic Wave Ripple Animation
        if (soundWaveRef.current && soundWaveMat) {
          if (bellSwingRef.current.soundWaveOpacity > 0.01) {
            bellSwingRef.current.soundWaveScale += 0.05;
            bellSwingRef.current.soundWaveOpacity *= 0.94;
            soundWaveRef.current.scale.set(
              bellSwingRef.current.soundWaveScale,
              bellSwingRef.current.soundWaveScale,
              bellSwingRef.current.soundWaveScale
            );
            soundWaveMat.opacity = bellSwingRef.current.soundWaveOpacity;
          } else {
            soundWaveMat.opacity = 0;
          }
        }
      }

      // Floating Camphor Spark Particles Animation (Delicate incandescent embers)
      if (sparkGeo) {
        const sPosArr = sparkGeo.attributes.position.array as Float32Array;
        for (let s = 0; s < sparkCount; s++) {
          const v = sparkVelocities[s];
          v.life += 0.016;
          sPosArr[s * 3] += v.x + Math.sin(clock * 8 + s) * 0.001;
          sPosArr[s * 3 + 1] += v.y * 0.016;
          sPosArr[s * 3 + 2] += v.z + Math.cos(clock * 8 + s) * 0.001;
          if (v.life > v.maxLife || sPosArr[s * 3 + 1] > 0.65) {
            v.life = 0;
            sPosArr[s * 3] = (Math.random() - 0.5) * 0.06;
            sPosArr[s * 3 + 1] = 0.22;
            sPosArr[s * 3 + 2] = (Math.random() - 0.5) * 0.06;
          }
        }
        sparkGeo.attributes.position.needsUpdate = true;
      }

      // Pancha-Diya Ghee Flames natural micro-flicker
      panchaDiyaFlameQuads.forEach((dQuad, dIdx) => {
        const dFlicker = 1.0 + Math.sin(clock * 13 + dIdx * 1.5) * 0.12 + Math.cos(clock * 21 + dIdx) * 0.06;
        dQuad.scale.set(dFlicker, dFlicker * 1.15, dFlicker);
      });

      // Aarti motion:
      // 1. During 11s active Aarti: faces ONLY the Goddess, moving from feet to crown in a sacred vertical circuit
      // 2. For 4s after completion: faces US (the devotees) directly for Aarti Darshanam & blessings
      // 3. Idle: rests gracefully in the empty space in front of the Goddess
      if (aartiGroupRef.current) {
        if (isAartiActiveRef.current) {
          aartiGroupRef.current.visible = true;

          // Sacred vertical Aarti circulation (from lotus feet at bottom up to sacred crown at top and back)
          const aartiSpeed = 1.75;
          const aartiPhase = clock * aartiSpeed;

          // Vertical elevation: ascends from lotus feet (y = 0.85) up to sacred crown (y = 3.35)
          const yCenter = 2.1;
          const yAmp = 1.25;
          aartiGroupRef.current.position.y = yCenter - Math.cos(aartiPhase) * yAmp;

          // Horizontal sway: sweeping clockwise across Sri Vasavi Matha
          aartiGroupRef.current.position.x = Math.sin(aartiPhase) * 0.95;

          // Depth: stays gracefully in front of the deity
          aartiGroupRef.current.position.z = 1.15 + (1 - Math.cos(aartiPhase)) * 0.10;

          // Orientation: FACES ONLY THE GODDESS (towards -Z)
          // Front of thali and flame face Sri Vasavi Matha; handle points towards devotee
          aartiGroupRef.current.rotation.y = Math.sin(aartiPhase) * 0.15; // subtle sacred oscillation, never facing away from Her
          aartiGroupRef.current.rotation.x = -0.18 + Math.cos(aartiPhase) * 0.10; // tilted towards the Goddess
          aartiGroupRef.current.rotation.z = -Math.sin(aartiPhase) * 0.08;

          // Radiant flaming camphor illumination & multi-harmonic plasma turbulence
          if (aartiFlameRef.current) {
            aartiFlameRef.current.intensity = 4.8 + Math.sin(clock * 18) * 1.6 + Math.cos(clock * 31) * 0.8;
          }
          if (aartiFlameMeshRef.current) {
            const flutterX = 1.35 + Math.sin(clock * 16) * 0.14 + Math.cos(clock * 29) * 0.08;
            const flutterY = 1.50 + Math.cos(clock * 14) * 0.22 + Math.sin(clock * 25) * 0.12;
            const flutterZ = 1.35 + Math.sin(clock * 19 + 1.2) * 0.14;
            aartiFlameMeshRef.current.scale.set(flutterX, flutterY, flutterZ);
            aartiFlameMeshRef.current.rotation.z = Math.sin(clock * 12) * 0.06;
          }
          if (flameHaloSprite) {
            flameHaloSprite.scale.set(
              0.76 + Math.sin(clock * 14) * 0.14,
              0.76 + Math.sin(clock * 14) * 0.14,
              1.0
            );
          }
        } else if (isAartiFacingDevoteeRef.current) {
          // After 11s completion: FACES US FOR 4 SECONDS (Aarti Darshanam / Sacred Blessing)
          aartiGroupRef.current.visible = true;

          // Present the Aarti Thali forward towards the devotees / camera
          aartiGroupRef.current.position.x = Math.sin(clock * 1.4) * 0.06;
          aartiGroupRef.current.position.y = 1.12 + Math.sin(clock * 2.2) * 0.03;
          aartiGroupRef.current.position.z = 1.55;

          // Turned 180 degrees to face US directly!
          aartiGroupRef.current.rotation.y = Math.PI;
          aartiGroupRef.current.rotation.x = 0.28; // tilted invitingly towards the devotee
          aartiGroupRef.current.rotation.z = Math.sin(clock * 1.4) * 0.03;

          if (aartiFlameRef.current) {
            aartiFlameRef.current.intensity = 3.8 + Math.sin(clock * 12) * 1.0;
          }
          if (aartiFlameMeshRef.current) {
            const flutterX = 1.18 + Math.sin(clock * 12) * 0.08;
            const flutterY = 1.28 + Math.cos(clock * 11) * 0.14;
            aartiFlameMeshRef.current.scale.set(flutterX, flutterY, flutterX);
            aartiFlameMeshRef.current.rotation.z = Math.sin(clock * 8) * 0.04;
          }
          if (flameHaloSprite) {
            flameHaloSprite.scale.set(
              0.66 + Math.sin(clock * 8) * 0.08,
              0.66 + Math.sin(clock * 8) * 0.08,
              1.0
            );
          }
        } else {
          // Resting peacefully in the empty space in front of the Goddess
          aartiGroupRef.current.visible = true;
          aartiGroupRef.current.position.set(0, 0.72, 1.0);
          aartiGroupRef.current.rotation.set(0.14, 0, 0);
          if (aartiFlameRef.current) {
            aartiFlameRef.current.intensity = 0.75 + Math.sin(clock * 4) * 0.12;
          }
          if (aartiFlameMeshRef.current) {
            const flutterX = 0.72 + Math.sin(clock * 4) * 0.03;
            const flutterY = 0.78 + Math.cos(clock * 5) * 0.04;
            aartiFlameMeshRef.current.scale.set(flutterX, flutterY, flutterX);
            aartiFlameMeshRef.current.rotation.z = 0;
          }
          if (flameHaloSprite) {
            flameHaloSprite.scale.set(
              0.48 + Math.sin(clock * 3) * 0.04,
              0.48 + Math.sin(clock * 3) * 0.04,
              1.0
            );
          }
        }
      }

      // Diya flicker lighting
      if (rimLightRef.current) {
        rimLightRef.current.intensity = 3.0 + Math.sin(clock * 6) * 0.5 + Math.cos(clock * 14) * 0.3;
      }

      // Incense smoke particles rising
      if (isIncenseActiveRef.current) {
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

      // Real Flower Pushparchana Falling Physics & 30-Second Continuous Cascade
      flowerParticles.forEach((f) => {
        if (!f.active) return;
        f.y -= f.vy;
        f.x += Math.sin(clock * f.swaySpeed + f.swayOffset) * f.swayAmp;
        f.z += Math.cos(clock * f.swaySpeed + f.swayOffset) * (f.swayAmp * 0.65);
        f.material.rotation += f.rotSpeed;
        f.sprite.position.set(f.x, f.y, f.z);

        // Floor / Pedestal collision
        if (f.y < 0.45) {
          if (isFlowerShowerActiveRef.current) {
            // Continually respawn at celestial top during the 30-second Seva!
            f.y = 4.8 + Math.random() * 2.6;
            f.x = (Math.random() - 0.5) * 4.6;
            f.z = -0.4 + Math.random() * 2.8;
          } else {
            // Seva completed: let existing flowers rest and fade out
            f.active = false;
            f.sprite.visible = false;
          }
        }
      });

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
      container.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationId);
      templeAudio.toggleDrone(false);
      if (flowerIntervalRef.current) {
        clearInterval(flowerIntervalRef.current);
      }
      if (aartiIntervalRef.current) {
        clearInterval(aartiIntervalRef.current);
      }
      if (devoteeTimerRef.current) {
        clearTimeout(devoteeTimerRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch (e) {
        // ignore context cleanup errors
      }
    };
  }, []);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-950 via-[#260f0d] to-stone-950 border-2 border-devotional-gold/60 shadow-[0_20px_70px_rgba(212,175,55,0.35)] ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Sacred Warm Camphor Radiance Vignette during Aarti & Devotee Blessing */}
      {(isAartiActive || isAartiFacingDevotee) && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(245,158,11,0.12)_72%,rgba(180,83,9,0.32)_100%)] transition-opacity duration-1000" />
      )}

      {/* Top Left: Darshan Status Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>3D LIVE SANCTUM</span>
        </div>
      </div>



      {/* Top Right: Audio Toggle */}
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

      {/* Bottom Interactive Seva Actions Toolbar */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-center sm:justify-between gap-3 bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-devotional-gold/40 shadow-2xl">
        <div className="flex items-center gap-2 text-stone-300 text-xs font-serif hidden md:flex">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Click 3D Bell or move view to experience Sri Vasavi Sanctum</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Seva Action 1: Ring Bell */}
          <button
            onClick={handleRingBell}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isBellRinging
                ? 'bg-amber-400 text-stone-950 scale-105 shadow-gold ring-2 ring-amber-300'
                : 'bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-400/40 hover:border-amber-400'
            }`}
            title="Ring Sacred Temple Ghanta"
          >
            <BellRing className={`w-4 h-4 text-amber-400 ${isBellRinging ? 'animate-bounce' : ''}`} />
            <span>Ring Ghanta</span>
          </button>

          {/* Seva Action 2: Real Flower Pushparchana */}
          <button
            onClick={handleFlowerShower}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isFlowerShowerActive
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white shadow-lg ring-2 ring-amber-300 scale-105 animate-pulse'
                : 'bg-stone-900/90 hover:bg-stone-800 text-orange-300 border border-orange-400/40 hover:border-orange-400'
            }`}
            title="Pushparchana"
          >
            <Flower2 className={`w-4 h-4 text-orange-400 ${isFlowerShowerActive ? 'animate-spin' : ''}`} />
            <span>Pushparchana</span>
          </button>

          {/* Seva Action 3: Mangala Aarti */}
          <button
            onClick={handleOfferAarti}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isAartiActive || isAartiFacingDevotee
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 text-stone-950 font-extrabold shadow-[0_0_24px_rgba(251,191,36,0.9)] ring-2 ring-amber-300 scale-105'
                : 'bg-gradient-to-r from-[#6b1410] via-[#a33213] to-[#d97706] text-amber-100 border border-amber-400/50 hover:border-amber-300 shadow-[0_4px_16px_rgba(217,119,6,0.3)] hover:brightness-110'
            }`}
            title="Aarti"
          >
            <Flame className={`w-4 h-4 ${isAartiActive || isAartiFacingDevotee ? 'animate-bounce text-red-700 fill-amber-300' : 'text-amber-300 animate-pulse'}`} />
            <span>Aarti</span>
          </button>
        </div>
      </div>
    </div>
  );
}
