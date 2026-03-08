"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeartScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { clientWidth, clientHeight } = container;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, clientWidth / clientHeight, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    container.appendChild(renderer.domElement);

    // Glow background
    const glow = new THREE.PointLight(0x00f5ff, 2, 40);
    glow.position.set(5, 5, 5);
    scene.add(glow);
    scene.add(new THREE.AmbientLight(0x222244, 0.6));

    // Stylized "heart": two tori + sphere blend to feel organic
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ff3b7f"),
      metalness: 0.4,
      roughness: 0.25,
      emissive: new THREE.Color("#0a0f1f"),
      emissiveIntensity: 0.5
    });

    const torusLeft = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.35, 32, 100), material);
    torusLeft.position.set(-0.7, 0.4, 0);
    torusLeft.rotation.set(0.8, 0.2, 0.6);

    const torusRight = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.35, 32, 100), material);
    torusRight.position.set(0.7, 0.4, 0);
    torusRight.rotation.set(0.8, -0.2, -0.6);

    const core = new THREE.Mesh(new THREE.SphereGeometry(1.3, 64, 64), material);
    core.position.set(0, -0.2, 0);

    const group = new THREE.Group();
    group.add(torusLeft, torusRight, core);
    scene.add(group);

    const pulse = new THREE.PointLight(0xff3b7f, 3, 20);
    pulse.position.set(0, 0, 2);
    scene.add(pulse);

    let t = 0;
    const animate = () => {
      t += 0.02;
      group.rotation.y += 0.004;
      group.rotation.x = Math.sin(t * 0.5) * 0.12;
      const scale = 1 + Math.sin(t) * 0.05;
      group.scale.setScalar(scale);
      pulse.intensity = 2 + Math.abs(Math.sin(t * 1.5)) * 1.5;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="relative h-[420px] w-full" />;
}
