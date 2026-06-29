import { useEffect, useRef } from "react";

/**
 * Peacock-blue particle field for the login hero — a decorative WebGL layer
 * rendered behind the panel content.
 *
 * Performance / a11y guardrails (see the webgl-threejs skill):
 *  - three.js is dynamically imported so it is code-split out of the main bundle
 *    and only loads on the login page (after first paint; the CSS gradient is
 *    the poster).
 *  - devicePixelRatio is clamped; particle count is tiered for low-end devices.
 *  - prefers-reduced-motion → render a single static frame (no animation loop).
 *  - No WebGL / lost context → the canvas stays transparent and the gradient
 *    background shows through (graceful fallback).
 *  - Everything is disposed and every listener removed on unmount.
 *  - The loop pauses when the tab is hidden.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let teardown: (() => void) | null = null;

    void import("three").then((THREE) => {
      if (disposed || !canvasRef.current) return;
      const parent = canvas.parentElement ?? canvas;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
      } catch {
        return; // no WebGL — gradient background remains as the fallback
      }

      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const lowTier =
        (nav.deviceMemory ?? 8) <= 4 ||
        (navigator.hardwareConcurrency ?? 8) <= 4 ||
        nav.connection?.saveData === true ||
        isMobile;
      const COUNT = lowTier ? 1400 : 2600;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(parent.clientWidth, parent.clientHeight, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        parent.clientWidth / parent.clientHeight,
        0.1,
        100,
      );
      camera.position.z = 14;

      // Particle field (Points + BufferGeometry — never individual meshes).
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 34;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: new THREE.Color("#2bc8c6"), // peacock cyan
        size: 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Subtle pointer parallax target (eased toward in the loop).
      const target = { x: 0, y: 0 };
      function onPointerMove(e: PointerEvent) {
        const r = parent.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }
      parent.addEventListener("pointermove", onPointerMove);

      function resize() {
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(parent);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let raf = 0;
      let running = false;

      function renderFrame(t: number) {
        points.rotation.y = t * 0.00004;
        points.rotation.x = Math.sin(t * 0.00002) * 0.12;
        // ease camera toward the pointer for a gentle parallax
        camera.position.x += (target.x * 1.6 - camera.position.x) * 0.04;
        camera.position.y += (-target.y * 1.0 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }

      function loop(t: number) {
        renderFrame(t);
        raf = requestAnimationFrame(loop);
      }
      function start() {
        if (running || reduceMotion.matches) return;
        running = true;
        raf = requestAnimationFrame(loop);
      }
      function stop() {
        running = false;
        cancelAnimationFrame(raf);
      }

      function onVisibility() {
        if (document.hidden) stop();
        else start();
      }
      document.addEventListener("visibilitychange", onVisibility);
      reduceMotion.addEventListener("change", onVisibility);

      if (reduceMotion.matches) {
        renderFrame(0); // single static frame
      } else {
        start();
      }

      teardown = () => {
        stop();
        document.removeEventListener("visibilitychange", onVisibility);
        reduceMotion.removeEventListener("change", onVisibility);
        parent.removeEventListener("pointermove", onPointerMove);
        resizeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
