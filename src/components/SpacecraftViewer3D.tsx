import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { Artifact, BlueprintHotspot } from '../data/artifacts';
import { buildSpacecraft3D, type BuiltSpacecraft3D } from '../three/buildSpacecraft3D';
import {
  createContactShadowTexture,
  createPlanetaryGroundTexture,
} from '../three/proceduralTextures';
import { TRANSLATIONS, type Language } from '../data/translations';

interface SpacecraftViewer3DProps {
  lang: Language;
  artifact: Artifact;
  activeHotspotId: string;
  onSelectHotspot: (hotspot: BlueprintHotspot) => void;
}

type CameraPresetId = 'hero' | 'front' | 'top' | 'detail';

interface ProjectedPin {
  id: string;
  number: string;
  title: string;
  x: number;
  y: number;
  visible: boolean;
}

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  hero: { label: 'Genel Açı', pos: [4.2, 2.55, 4.4], target: [0, 0.95, 0] },
  front: { label: 'Ön Görünüm', pos: [0.1, 1.55, 5.2], target: [0, 1.0, 0] },
  top: { label: 'Kuş Bakışı', pos: [0.2, 5.6, 1.8], target: [0, 0.6, 0] },
  detail: { label: 'Yakın Detay', pos: [2.35, 1.65, 2.55], target: [0, 1.05, 0] },
};

// Reusable module-scope scratch objects to keep render loop allocation-free
const _projVec = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const SpacecraftViewer3D: React.FC<SpacecraftViewer3DProps> = ({
  lang,
  artifact,
  activeHotspotId,
  onSelectHotspot,
}) => {
  const t = TRANSLATIONS[lang];
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [explodePercent, setExplodePercent] = useState(0);
  const [dustYearMode, setDustYearMode] = useState<'early' | 'present'>('present');
  const [activePreset, setActivePreset] = useState<CameraPresetId>('hero');
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [pins, setPins] = useState<ProjectedPin[]>([]);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Mutable refs read by the persistent WebGL lifecycle without tearing down the canvas
  const stateRef = useRef({
    explodeTarget: 0,
    explodeCurrent: 0,
    autoOrbit: true,
    cameraTransitionActive: false,
    camTargetPos: new THREE.Vector3(...CAMERA_PRESETS.hero.pos),
    camTargetLook: new THREE.Vector3(...CAMERA_PRESETS.hero.target),
    artifact,
    dustAmount: 0.75,
  });

  stateRef.current.explodeTarget = explodePercent / 100;
  stateRef.current.autoOrbit = autoOrbit;
  stateRef.current.artifact = artifact;
  stateRef.current.dustAmount = dustYearMode === 'present' ? 0.78 : 0.08;

  const sceneApiRef = useRef<{
    rebuildCraft: () => void;
    requestRender: () => void;
    applyPreset: (preset: CameraPresetId) => void;
    focusHotspot: (hotspotId: string) => void;
  } | null>(null);

  const activeHotspot =
    artifact.hotspots.find((h) => h.id === activeHotspotId) ?? artifact.hotspots[0];

  // Keyboard 'H' shortcut for collapsing/expanding the bottom dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Initialize Three.js WebGL stage once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const bgMoon = new THREE.Color('#080a0e');
    const bgMars = new THREE.Color('#130b08');
    scene.background = bgMoon.clone();
    scene.fog = new THREE.FogExp2('#080a0e', 0.042);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(...CAMERA_PRESETS.hero.pos);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.9;
    controls.maxDistance = 9.5;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.target.set(...CAMERA_PRESETS.hero.target);

    // 3-Point Warm/Cool Studio + Celestial Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xdce6f5, 0x3b2a20, 0.55);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.35);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    const d = 4.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9bb8e8, 0.85);
    rimLight.position.set(-5, 4, -6);
    scene.add(rimLight);

    // Subtle procedural starfield
    const starPositions = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      const theta = ((i * 2.39996) % (Math.PI * 2));
      const phi = Math.acos(0.15 + ((i * 0.618) % 0.84));
      const r = 38 + (i % 7) * 2;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe7e2d8,
      size: 0.14,
      transparent: true,
      opacity: 0.65,
      fog: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Planetary Regolith Terrain Disk + Contact Shadow Plane
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    let groundTex = createPlanetaryGroundTexture('moon', maxAnisotropy);
    const groundGeo = new THREE.CircleGeometry(24, 64);
    groundGeo.rotateX(-Math.PI / 2);
    // Gentle terrain relief outside central landing pad
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const dist = Math.hypot(vx, vz);
      if (dist > 2.8) {
        const relief =
          (Math.sin(vx * 0.65) * Math.cos(vz * 0.55) * 0.18 +
            Math.sin(dist * 0.9) * 0.08) *
          Math.min(1, (dist - 2.8) / 4);
        posAttr.setY(i, relief);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.94,
      metalness: 0.04,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const contactShadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(5.8, 5.8);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.52,
    });
    const contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.position.y = 0.012;
    scene.add(contactShadowMesh);

    // Instanced Planetary Rocks around perimeter
    const rockGeo = new THREE.DodecahedronGeometry(0.16, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0.05,
    });
    const rockCount = 42;
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    const dummy = new THREE.Object3D();
    const rockColor = new THREE.Color();
    for (let i = 0; i < rockCount; i++) {
      const angle = (i * 2.39996) % (Math.PI * 2);
      const radius = 3.1 + ((i * 1.73) % 7.5);
      const s = 0.45 + ((i * 13) % 100) / 85;
      dummy.position.set(Math.cos(angle) * radius, 0.05 * s, Math.sin(angle) * radius);
      dummy.rotation.set(i * 0.7, i * 1.1, i * 0.4);
      dummy.scale.set(s * 1.25, s * 0.7, s);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
      rockColor.setHex(0x6c6e73);
      rocks.setColorAt(i, rockColor);
    }
    rocks.instanceMatrix.needsUpdate = true;
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
    rocks.computeBoundingSphere();
    scene.add(rocks);

    // Current Spacecraft Container
    let currentCraft: BuiltSpacecraft3D | null = null;
    const disposeCraft = () => {
      if (!currentCraft) return;
      scene.remove(currentCraft.root);
      currentCraft.disposables.geometries.forEach((g) => g.dispose());
      currentCraft.disposables.materials.forEach((m) => m.dispose());
      currentCraft.disposables.textures.forEach((t) => t.dispose());
      currentCraft = null;
    };

    const rebuildCraft = () => {
      disposeCraft();
      const { artifact: currArt, dustAmount } = stateRef.current;
      const isMars = currArt.body === 'mars';

      // Update sky, fog, ground & rocks for Moon vs Mars
      const targetBg = isMars ? bgMars : bgMoon;
      (scene.background as THREE.Color).copy(targetBg);
      (scene.fog as THREE.FogExp2).color.copy(targetBg);
      hemiLight.groundColor.setHex(isMars ? 0x5c2b1a : 0x2f3136);
      keyLight.color.setHex(isMars ? 0xffe0c4 : 0xf4f6fa);

      groundTex.dispose();
      groundTex = createPlanetaryGroundTexture(currArt.body, maxAnisotropy);
      groundMat.map = groundTex;
      groundMat.needsUpdate = true;

      for (let i = 0; i < rockCount; i++) {
        const shade = 0.78 + ((i * 17) % 40) / 100;
        if (isMars) rockColor.setRGB(0.55 * shade, 0.27 * shade, 0.16 * shade);
        else rockColor.setRGB(0.42 * shade, 0.43 * shade, 0.45 * shade);
        rocks.setColorAt(i, rockColor);
      }
      if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;

      currentCraft = buildSpacecraft3D(currArt.modelKey, dustAmount, maxAnisotropy);
      scene.add(currentCraft.root);
      requestRender();
    };

    // Frame pacing & coalesced on-demand rendering
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    const updateProjectedPins = () => {
      if (!currentCraft) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      const nextPins: ProjectedPin[] = stateRef.current.artifact.hotspots.map((hs) => {
        const anchor = currentCraft!.hotspotAnchors.get(hs.id);
        if (!anchor) {
          return { id: hs.id, number: hs.number, title: hs.title, x: 0, y: 0, visible: false };
        }
        _projVec.copy(anchor);
        // Apply current exploded offset approximation if attached to root
        _projVec.y += stateRef.current.explodeCurrent * 0.28;
        _projVec.project(camera);
        const visible = _projVec.z < 1 && _projVec.z > -1;
        return {
          id: hs.id,
          number: hs.number,
          title: hs.title,
          x: ((_projVec.x + 1) / 2) * w,
          y: ((-_projVec.y + 1) / 2) * h,
          visible,
        };
      });
      setPins(nextPins);
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const stepAndRender = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      let needsAnotherFrame = false;
      const st = stateRef.current;

      // Exploded view damping
      if (Math.abs(st.explodeCurrent - st.explodeTarget) > 0.002 && currentCraft) {
        st.explodeCurrent = THREE.MathUtils.damp(
          st.explodeCurrent,
          st.explodeTarget,
          8,
          dt
        );
        currentCraft.explodableParts.forEach((part) => {
          const base = part.userData.basePosition as THREE.Vector3;
          const off = part.userData.explodeOffset as THREE.Vector3;
          part.position.copy(base).addScaledVector(off, st.explodeCurrent);
        });
        needsAnotherFrame = true;
      } else if (currentCraft && st.explodeCurrent !== st.explodeTarget) {
        st.explodeCurrent = st.explodeTarget;
        currentCraft.explodableParts.forEach((part) => {
          const base = part.userData.basePosition as THREE.Vector3;
          const off = part.userData.explodeOffset as THREE.Vector3;
          part.position.copy(base).addScaledVector(off, st.explodeCurrent);
        });
      }

      // Camera preset damping
      if (st.cameraTransitionActive) {
        _targetPos.copy(st.camTargetPos);
        _targetLook.copy(st.camTargetLook);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 7, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 7, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, 7, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 7, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 7, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 7, dt);

        if (
          camera.position.distanceTo(_targetPos) < 0.025 &&
          controls.target.distanceTo(_targetLook) < 0.025
        ) {
          camera.position.copy(_targetPos);
          controls.target.copy(_targetLook);
          st.cameraTransitionActive = false;
        } else {
          needsAnotherFrame = true;
        }
      }

      // Gentle auto-orbit on GPU
      if (st.autoOrbit && !isSoftwareGl && !st.cameraTransitionActive) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.65;
        needsAnotherFrame = true;
      } else {
        controls.autoRotate = false;
      }

      const controlsChanged = controls.update();
      if (controlsChanged) needsAnotherFrame = true;

      renderer.render(scene, camera);
      updateProjectedPins();

      const finish = () => {
        renderBusy = false;
        if (renderDirty || needsAnotherFrame) {
          requestRender();
        }
      };

      if (isSoftwareGl) afterDraw(finish);
      else finish();
    };

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        stepAndRender(now);
      });
    }

    const onControlsStart = () => {
      stateRef.current.cameraTransitionActive = false;
      setAutoOrbit(false);
    };
    const onControlsChange = () => requestRender();
    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('change', onControlsChange);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    const onContextRestored = () => {
      rebuildCraft();
      requestRender();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
          requestRender();
        }
      }
    });
    resizeObserver.observe(container);

    sceneApiRef.current = {
      rebuildCraft,
      requestRender,
      applyPreset: (presetId: CameraPresetId) => {
        const preset = CAMERA_PRESETS[presetId];
        stateRef.current.camTargetPos.set(...preset.pos);
        stateRef.current.camTargetLook.set(...preset.target);
        stateRef.current.cameraTransitionActive = true;
        requestRender();
      },
      focusHotspot: (hotspotId: string) => {
        if (!currentCraft) return;
        const anchor = currentCraft.hotspotAnchors.get(hotspotId);
        if (!anchor) return;
        stateRef.current.camTargetLook.copy(anchor);
        const offsetDir = anchor
          .clone()
          .setY(0)
          .normalize();
        if (offsetDir.lengthSq() < 0.01) offsetDir.set(0.7, 0, 0.7).normalize();
        stateRef.current.camTargetPos
          .copy(anchor)
          .addScaledVector(offsetDir, 2.55)
          .add(new THREE.Vector3(0.5, 0.85, 0.6));
        stateRef.current.cameraTransitionActive = true;
        setAutoOrbit(false);
        requestRender();
      },
    };

    rebuildCraft();
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      disposeCraft();
      groundGeo.dispose();
      groundMat.dispose();
      groundTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      contactShadowTex.dispose();
      rockGeo.dispose();
      rockMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  // Rebuild craft whenever selected artifact or weathering state changes
  useEffect(() => {
    sceneApiRef.current?.rebuildCraft();
  }, [artifact.id, dustYearMode]);

  // Trigger render when explode slider updates
  useEffect(() => {
    sceneApiRef.current?.requestRender();
  }, [explodePercent, autoOrbit]);

  const handlePresetClick = (presetId: CameraPresetId) => {
    setActivePreset(presetId);
    sceneApiRef.current?.applyPreset(presetId);
  };

  const handleHotspotPinClick = (hs: BlueprintHotspot) => {
    onSelectHotspot(hs);
    sceneApiRef.current?.focusHotspot(hs.id);
  };

  return (
    <div className="border border-white/10 bg-[#0D1015] rounded-lg overflow-hidden">
      {/* Main Unobstructed 3D Viewport */}
      <div className="relative aspect-[16/10] w-full bg-[#080A0E] overflow-hidden select-none">
        {!webglUnavailable ? (
          <>
            {/* Dedicated Empty WebGL Mount Container */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Projected 3D Hotspot Pins */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {pins.map((pin) => {
                if (!pin.visible) return null;
                const isSelected = pin.id === activeHotspot.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      const found = artifact.hotspots.find((h) => h.id === pin.id);
                      if (found) handleHotspotPinClick(found);
                    }}
                    style={{
                      transform: `translate3d(${pin.x}px, ${pin.y}px, 0) translate(-50%, -50%)`,
                    }}
                    aria-label={`${pin.number}. ${pin.title}`}
                    className={`pointer-events-auto absolute top-0 left-0 w-7 h-7 rounded-full font-mono text-[11px] font-semibold tabular-nums flex items-center justify-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#D97736] text-[#090B0E] ring-4 ring-[#D97736]/30 z-20'
                        : 'bg-[#12161E]/90 text-[#F3F0E8] border border-white/35 hover:border-[#D97736] hover:text-[#E28A47] z-10'
                    }`}
                  >
                    {pin.number}
                  </button>
                );
              })}
            </div>

            {/* Minimal Top-Left Spec Label (Unobtrusive) */}
            <div className="pointer-events-none absolute top-4 left-5 flex items-center gap-2.5 text-[11px] font-mono text-[#D6D1C7] bg-[#090B0E]/85 px-3 py-1.5 rounded border border-white/10">
              <span>{artifact.accessionId}</span>
              <span aria-hidden="true">·</span>
              <span>{t.viewer3d.sceneTag}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#9B978E]">{t.viewer3d.dragHint}</span>
            </div>

            {/* Unified Collapsible Bottom Control Dock (Zero Left/Right Side Occlusion) */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-4 w-[min(880px,94%)] z-20 transition-transform duration-300 ease-out ${
                dockCollapsed ? 'translate-y-[calc(100%-1.5rem)]' : 'translate-y-0'
              }`}
            >
              {/* Collapse / Expand Toggle Handle */}
              <div className="flex justify-center mb-1.5">
                <button
                  type="button"
                  onClick={() => setDockCollapsed((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-md bg-[#11151C]/95 border border-b-0 border-white/15 text-[11px] font-medium text-[#D6D1C7] hover:text-[#F3F0E8] cursor-pointer"
                >
                  {dockCollapsed ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>{t.viewer3d.showControls}</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>{t.viewer3d.hideControls}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Solid / High-Opacity Control Bar (No backdrop-blur over WebGL) */}
              <div className="bg-[#11151C]/95 border border-white/15 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                {/* Camera Angle Presets */}
                <div className="flex items-center gap-1 p-1 bg-[#090B0E] rounded-md border border-white/10">
                  {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((pid) => (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => handlePresetClick(pid)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activePreset === pid
                          ? 'bg-[#D97736] text-[#090B0E]'
                          : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
                      }`}
                    >
                      {t.viewer3d.presets[pid]}
                    </button>
                  ))}
                </div>

                {/* Exploded-View Assembly Slider */}
                <div className="flex items-center gap-3 min-w-[190px] flex-1 max-w-[240px]">
                  <label
                    htmlFor="explode-3d-slider"
                    className="text-xs text-[#C7C2B8] whitespace-nowrap shrink-0"
                  >
                    {t.viewer3d.explodeLabel}
                  </label>
                  <input
                    id="explode-3d-slider"
                    type="range"
                    min={0}
                    max={100}
                    value={explodePercent}
                    onChange={(e) => setExplodePercent(Number(e.target.value))}
                    className="w-full accent-[#D97736] cursor-pointer"
                  />
                  <span className="text-xs font-mono tabular-nums text-[#E28A47] w-9 text-right">
                    {explodePercent}%
                  </span>
                </div>

                {/* Dust Era & Auto-Orbit Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-1 bg-[#090B0E] rounded-md border border-white/10">
                    <button
                      type="button"
                      onClick={() => setDustYearMode('early')}
                      className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        dustYearMode === 'early'
                          ? 'bg-white/15 text-[#F3F0E8]'
                          : 'text-[#9B978E] hover:text-[#F3F0E8]'
                      }`}
                    >
                      {artifact.launchYear}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDustYearMode('present')}
                      className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        dustYearMode === 'present'
                          ? 'bg-white/15 text-[#F3F0E8]'
                          : 'text-[#9B978E] hover:text-[#F3F0E8]'
                      }`}
                    >
                      {t.viewer3d.dustyLabel}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAutoOrbit((prev) => !prev)}
                    className={`px-2.5 py-1.5 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      autoOrbit
                        ? 'border-[#D97736] text-[#E28A47] bg-[#D97736]/10'
                        : 'border-white/10 text-[#9B978E] hover:text-[#F3F0E8]'
                    }`}
                  >
                    {t.viewer3d.autoOrbit}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExplodePercent(0);
                      setAutoOrbit(true);
                      handlePresetClick('hero');
                    }}
                    aria-label={t.viewer3d.resetAria}
                    title={t.viewer3d.resetTitle}
                    className="p-1.5 rounded border border-white/10 text-[#B5B0A6] hover:text-[#F3F0E8] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Graceful Styled Fallback if WebGL is unavailable */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#12161E] to-[#080A0D]">
            <p className="font-serif text-2xl text-[#F3F0E8]">{artifact.name}</p>
            <p className="text-sm text-[#B5B0A6] mt-2 max-w-md">
              {t.viewer3d.webglFallback}
            </p>
          </div>
        )}
      </div>

      {/* Selected Hotspot Narrative Detail Strip (Shared Language with 2D Blueprint) */}
      <div className="p-5 border-t border-white/10 bg-[#12161E]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D97736] text-[#090B0E] font-mono text-xs font-semibold tabular-nums">
              {activeHotspot.number}
            </span>
            <h4 className="text-base font-semibold text-[#F3F0E8]">
              {activeHotspot.title}
            </h4>
          </div>
          <span className="text-xs font-mono text-[#9B978E]">
            {activeHotspot.partCode} · {activeHotspot.spec}
          </span>
        </div>
        <p className="text-sm text-[#D6D1C7] leading-relaxed">{activeHotspot.story}</p>

        {/* Quick Hotspot Focus Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-white/10">
          {artifact.hotspots.map((h) => {
            const active = h.id === activeHotspot.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => handleHotspotPinClick(h)}
                className={`px-3 py-1.5 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[#D97736] bg-[#D97736]/15 text-[#F3F0E8]'
                    : 'border-white/10 text-[#9B978E] hover:text-[#F3F0E8] hover:border-white/25'
                }`}
              >
                <span className="font-mono tabular-nums mr-1.5">{h.number}.</span>
                {h.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
