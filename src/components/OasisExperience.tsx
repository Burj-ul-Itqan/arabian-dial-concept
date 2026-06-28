"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  Float,
  Html,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import {
  Menu,
  Search,
  ShoppingBag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { products, Product, GALLERY_PRICE_RANGE } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

/* ──────────────────────────────────────────────────────────────
   SHARED LAYOUT CONSTANTS
   The watch X positions and the camera config are derived from the
   same source so the camera always frames the correct watch.
   ────────────────────────────────────────────────────────────── */

const WATCH_GAP = 2.7;
const WATCH_X = [-WATCH_GAP, 0, WATCH_GAP]; // LEFT, CENTER, RIGHT
const WATCH_Y = 0.55; // resting height above the pedestal

type ViewState =
  | "STAGE"
  | "FOCUS_WATCH_LEFT"
  | "FOCUS_WATCH_CENTER"
  | "FOCUS_WATCH_RIGHT";

const FOCUS_VIEWS: ViewState[] = [
  "FOCUS_WATCH_LEFT",
  "FOCUS_WATCH_CENTER",
  "FOCUS_WATCH_RIGHT",
];

const viewToIndex = (v: ViewState): number =>
  v === "FOCUS_WATCH_LEFT" ? 0 : v === "FOCUS_WATCH_RIGHT" ? 2 : 1;

interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

/* ──────────────────────────────────────────────────────────────
   INTRO SEQUENCE — "macro to gallery" pull-back.
   The camera initialises in an extreme close-up of the center watch
   and eases back to the resting STAGE pose over ~2.5s on load.
   Keeping INTRO end == CAMERA_VIEWS.STAGE guarantees a seamless
   handoff (no micro-jitter when the rig hands control back).
   ────────────────────────────────────────────────────────────── */
const INTRO_START: CameraView = {
  position: [0, 0.5, 2], // extreme macro close-up on the dial
  target: [0, 0.5, 0], // staring straight at the center watch face
};
const INTRO_DURATION = 2.5;
const INTRO_EASE = "expo.inOut";
/** Fire the UI reveal at ~62% of the tween, as the camera decelerates. */
const INTRO_REVEAL_AT = INTRO_DURATION * 0.62;

/* XYZ coordinates for camera position + lookAt target per state. */
const CAMERA_VIEWS: Record<ViewState, CameraView> = {
  STAGE: {
    position: [0, 2.5, 8],
    target: [0, 0, 0],
  },
  FOCUS_WATCH_LEFT: {
    position: [WATCH_X[0], 1.0, 3.9],
    target: [WATCH_X[0], WATCH_Y, 0],
  },
  FOCUS_WATCH_CENTER: {
    position: [WATCH_X[1], 1.0, 3.9],
    target: [WATCH_X[1], WATCH_Y, 0],
  },
  FOCUS_WATCH_RIGHT: {
    position: [WATCH_X[2], 1.0, 3.9],
    target: [WATCH_X[2], WATCH_Y, 0],
  },
};

/* ──────────────────────────────────────────────────────────────
   CAMERA RIG — cinematic transitions driven by `currentView`.
   Animates BOTH camera.position and a separate lookAt target via GSAP.
   ────────────────────────────────────────────────────────────── */

function CameraRig({
  currentView,
  setAnimating,
  onReveal,
}: {
  currentView: ViewState;
  setAnimating: (b: boolean) => void;
  onReveal: () => void;
}) {
  const { camera } = useThree();
  // Target starts on the watch dial so the very first lookAt frames the macro shot.
  const target = useRef(new THREE.Vector3(...INTRO_START.target));
  const tl = useRef<gsap.core.Timeline | null>(null);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const prevView = useRef<ViewState>("STAGE");
  // Blocks user-driven view transitions until the opening sequence finishes.
  const introDone = useRef(false);

  // Keep the camera aimed at the (animating) target on every frame.
  useFrame(() => {
    camera.lookAt(target.current);
    camera.updateMatrixWorld();
  });

  /* ── INTRO: macro close-up → gallery pull-back (runs once on mount) ── */
  useEffect(() => {
    const stage = CAMERA_VIEWS.STAGE;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Skip the cinematic move — snap straight to the resting stage pose.
      camera.position.set(...stage.position);
      target.current.set(...stage.target);
      introDone.current = true;
      onReveal();
      setAnimating(false);
      return;
    }

    setAnimating(true); // lock interaction during the opening shot

    const t = gsap.timeline({
      onComplete: () => {
        introDone.current = true;
        setAnimating(false);
      },
    });

    // Dolly the camera backward + upward and pan the lookAt target to the
    // pedestal center — both tweened concurrently for one fluid motion.
    t.to(
      camera.position,
      {
        x: stage.position[0],
        y: stage.position[1],
        z: stage.position[2],
        duration: INTRO_DURATION,
        ease: INTRO_EASE,
      },
      0
    );
    t.to(
      target.current,
      {
        x: stage.target[0],
        y: stage.target[1],
        z: stage.target[2],
        duration: INTRO_DURATION,
        ease: INTRO_EASE,
      },
      0
    );

    // Reveal the HTML UI as the camera eases into its deceleration.
    t.call(onReveal, undefined, INTRO_REVEAL_AT);

    introTl.current = t;

    return () => {
      t.kill();
    };
    // Mount-only: the intro must never re-fire on prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── USER-DRIVEN VIEW TRANSITIONS (suppressed until intro completes) ── */
  useEffect(() => {
    // Don't compete with the opening pull-back; the intro lands on STAGE itself.
    if (!introDone.current) {
      prevView.current = currentView;
      return;
    }

    const dest = CAMERA_VIEWS[currentView];

    const wasFocus = FOCUS_VIEWS.includes(prevView.current);
    const isFocus = FOCUS_VIEWS.includes(currentView);
    // Lateral glide between two focused watches → quicker, flatter ease.
    const isLateralPan = wasFocus && isFocus;
    const duration = isLateralPan ? 1.4 : 1.8;
    const ease = isLateralPan ? "power3.inOut" : "expo.inOut";

    tl.current?.kill();
    const t = gsap.timeline({
      onStart: () => setAnimating(true),
      onComplete: () => setAnimating(false),
    });

    t.to(
      camera.position,
      {
        x: dest.position[0],
        y: dest.position[1],
        z: dest.position[2],
        duration,
        ease,
      },
      0
    );
    t.to(
      target.current,
      {
        x: dest.target[0],
        y: dest.target[1],
        z: dest.target[2],
        duration,
        ease,
      },
      0
    );

    tl.current = t;
    prevView.current = currentView;

    return () => {
      t.kill();
    };
  }, [currentView, camera, setAnimating]);

  return null;
}

/* ──────────────────────────────────────────────────────────────
   WATCH MODEL — composed primitives, structured so the inner
   <group> can be swapped for a useGLTF() scene later.
   ────────────────────────────────────────────────────────────── */

interface WatchModelProps {
  product: Product;
  position: [number, number, number];
  focused: boolean;
  dimmed: boolean;
  onSelect: () => void;
}

function WatchModel({
  product,
  position,
  focused,
  dimmed,
  onSelect,
}: WatchModelProps) {
  const root = useRef<THREE.Group>(null);
  const caseRef = useRef<THREE.Mesh>(null);
  const strapMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const [hovered, setHovered] = useState(false);

  const dialMap = useTexture(product.dialTexture);
  useEffect(() => {
    dialMap.colorSpace = THREE.SRGBColorSpace;
    dialMap.center.set(0.5, 0.5);
    dialMap.needsUpdate = true;
  }, [dialMap]);

  const caseColor = useMemo(
    () => new THREE.Color(product.caseColor),
    [product.caseColor]
  );
  const strapColor = useMemo(
    () => new THREE.Color(product.strapColor),
    [product.strapColor]
  );
  const dialTint = useMemo(
    () => new THREE.Color(product.dialColor),
    [product.dialColor]
  );

  // Smoothly fade opacity for dimmed (non-focused) watches.
  useFrame(() => {
    if (!root.current) return;
    const targetOpacity = dimmed ? 0.12 : 1;
    root.current.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (mat && "opacity" in mat) {
        mat.transparent = true;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
      }
    });
  });

  // Strap is built from many small links so it reads as a bracelet/strap.
  const links = useMemo(() => Array.from({ length: 8 }), []);

  return (
    <group
      ref={root}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      scale={focused ? 1.0 : hovered ? 1.04 : 1.0}
    >
      {/* ── Swap target: replace this group with <primitive object={gltf.scene}/> ── */}
      <group rotation={[Math.PI / 2.4, 0, 0]}>
        {/* Case body */}
        <mesh ref={caseRef} castShadow receiveShadow>
          <cylinderGeometry args={[1.0, 1.0, 0.34, 64]} />
          <meshStandardMaterial
            color={caseColor}
            roughness={0.16}
            metalness={0.95}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Fluted bezel ring */}
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.97, 0.07, 24, 80]} />
          <meshStandardMaterial
            color={caseColor}
            roughness={0.12}
            metalness={1}
            envMapIntensity={1.6}
          />
        </mesh>

        {/* Dial face (real photograph) */}
        <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 64]} />
          <meshStandardMaterial
            map={dialMap}
            color={dialTint}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Domed sapphire crystal */}
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.92, 0.92, 0.02, 64]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            roughness={0.01}
            metalness={0.05}
            transmission={0.95}
            thickness={0.02}
            ior={1.52}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* Crown */}
        <mesh position={[1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 24]} />
          <meshStandardMaterial
            color={caseColor}
            roughness={0.15}
            metalness={1}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Strap — segmented links, both directions */}
        {links.map((_, i) => {
          const dir = i < 4 ? 1 : -1;
          const idx = i < 4 ? i : i - 4;
          
          // Smooth curve forming a loop under/behind the watch case
          const angle = idx * 0.45;
          const R = 0.6; // radius of the loop
          const z = dir * (0.95 + R * Math.sin(angle));
          const y = -0.02 - R * (1 - Math.cos(angle));
          const rotX = dir * angle;

          return (
            <mesh
              key={i}
              position={[0, y, z]}
              rotation={[rotX, 0, 0]}
              castShadow
            >
              <boxGeometry args={[0.78, 0.16, 0.38]} />
              <meshStandardMaterial
                ref={(m) => {
                  if (m) strapMatRefs.current[i] = m;
                }}
                color={strapColor}
                roughness={0.78}
                metalness={0.12}
                envMapIntensity={0.6}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   HOTSPOTS — anchored labels with leader lines (focus view only).
   ────────────────────────────────────────────────────────────── */

interface Hotspot {
  id: string;
  anchor: [number, number, number];
  label: string;
  sub: string;
  side: "left" | "right";
}

function Hotspots({ product, visible }: { product: Product; visible: boolean }) {
  const spots: Hotspot[] = useMemo(
    () => [
      {
        id: "crystal",
        anchor: [0.45, 0.55, 0.35],
        label: "Sapphire Crystal",
        sub: "Scratch-resistant",
        side: "right",
      },
      {
        id: "dial",
        anchor: [0, 0.4, 0],
        label: product.variant,
        sub: "Arabic day-date dial",
        side: "left",
      },
      {
        id: "caliber",
        anchor: [-0.55, 0.1, 0.2],
        label: "Crescendo Caliber",
        sub: "Miyota automatic",
        side: "left",
      },
      {
        id: "strap",
        anchor: [0, -0.1, 1.4],
        label: product.strapLabel,
        sub: "Hand-finished",
        side: "right",
      },
    ],
    [product]
  );

  if (!visible) return null;

  return (
    <>
      {spots.map((s, i) => (
        <Html
          key={s.id}
          position={s.anchor}
          center
          distanceFactor={8}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`hotspot ${s.side === "left" ? "hotspot--left" : "hotspot--right"}`}
            style={{ animationDelay: `${0.6 + i * 0.12}s` }}
          >
            <span className="hotspot__dot" />
            <span className="hotspot__line" />
            <span className="hotspot__label">
              <span className="hotspot__title">{s.label}</span>
              <span className="hotspot__sub">{s.sub}</span>
            </span>
          </div>
        </Html>
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   PEDESTAL — charcoal stone slab with geometric gold inlays.
   ────────────────────────────────────────────────────────────── */

function Pedestal() {
  return (
    <group position={[0, -0.62, 0]}>
      {/* Stone slab */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[10, 0.5, 4.4]} />
        <meshStandardMaterial color="#15161a" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Top inlay plate */}
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[9.4, 0.08, 3.9]} />
        <meshStandardMaterial color="#1c1d22" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Gold inlay borders */}
      {[1.78, -1.78].map((z) => (
        <mesh key={z} position={[0, 0.11, z]}>
          <boxGeometry args={[9.2, 0.02, 0.04]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={1}
          />
        </mesh>
      ))}
      {/* Gold rings under each watch */}
      {WATCH_X.map((x) => (
        <mesh key={x} position={[x, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.02, 64]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   ATMOSPHERE — slow drifting warm smoke/fog particles.
   ────────────────────────────────────────────────────────────── */

function Atmosphere() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 60;

  // Stable buffers via lazy state initialisers (readable during render).
  const [positions] = useState(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = -1 + Math.random() * 5;
      pos[i * 3 + 2] = -2.5 - Math.random() * 2;
    }
    return pos;
  });
  const [wobble] = useState(() => {
    const wob = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) wob[i] = Math.random() * Math.PI * 2;
    return wob;
  });
  const [tex] = useState(() =>
    new THREE.TextureLoader().load(
      "data:image/svg+xml;utf8," +
        encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><defs><radialGradient id='g' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='white' stop-opacity='0.9'/><stop offset='100%' stop-color='white' stop-opacity='0'/></radialGradient></defs><circle cx='32' cy='32' r='32' fill='url(%23g)'/></svg>"
        )
    )
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      wobble[i] += delta * 0.4;
      arr[i * 3 + 1] += delta * 0.18;
      arr[i * 3] += Math.sin(wobble[i] + i) * delta * 0.12;
      if (arr[i * 3 + 1] > 4.5) {
        arr[i * 3 + 1] = -1;
        arr[i * 3] = (Math.random() - 0.5) * 12;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        color="#caa46a"
        size={2.6}
        transparent
        opacity={0.06}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCENE — lighting rig + environment + content.
   ────────────────────────────────────────────────────────────── */

function Scene({
  currentView,
  setAnimating,
  isAnimating,
  setView,
  onReveal,
}: {
  currentView: ViewState;
  setAnimating: (b: boolean) => void;
  isAnimating: boolean;
  setView: (v: ViewState) => void;
  onReveal: () => void;
}) {
  const focusedIndex = FOCUS_VIEWS.includes(currentView)
    ? viewToIndex(currentView)
    : -1;
  const isFocus = focusedIndex !== -1;

  return (
    <>
      {/* Inline HDR-style rig (no external CDN dependency) */}
      <Environment resolution={256}>
        <Lightformer
          intensity={2.2}
          color="#ffe7c2"
          position={[0, 4, 2]}
          scale={[10, 6, 1]}
          form="rect"
        />
        <Lightformer
          intensity={1.4}
          color="#d4af37"
          position={[-5, 2, -3]}
          scale={[6, 6, 1]}
          form="circle"
        />
        <Lightformer
          intensity={1.1}
          color="#7fa8d4"
          position={[5, 1, -4]}
          scale={[6, 6, 1]}
          form="circle"
        />
        <Lightformer
          intensity={0.8}
          color="#ffffff"
          position={[0, -3, 2]}
          scale={[10, 4, 1]}
          form="rect"
        />
      </Environment>

      <ambientLight intensity={0.18} />
      <spotLight
        position={[0, 8, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={28}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-6, 4, 2]}
        intensity={1.6}
        color="#d4af37"
      />
      <directionalLight position={[6, 3, 3]} intensity={1.0} color="#aaccff" />

      <Pedestal />

      {products.map((p, i) => {
        const isThisFocused = isFocus && focusedIndex === i;
        return (
          <Float
            key={p.id}
            speed={isFocus ? 0 : 1.4}
            rotationIntensity={isFocus ? 0 : 0.25}
            floatIntensity={isFocus ? 0 : 0.6}
            floatingRange={[-0.05, 0.12]}
          >
            <group position={[WATCH_X[i], WATCH_Y, 0]}>
              <WatchModel
                product={p}
                position={[0, 0, 0]}
                focused={isThisFocused}
                dimmed={isFocus && !isThisFocused}
                onSelect={() => setView(FOCUS_VIEWS[i])}
              />
              {isThisFocused && (
                <Hotspots product={p} visible={!isAnimating} />
              )}
            </group>
          </Float>
        );
      })}

      <Atmosphere />

      <ContactShadows
        position={[0, -0.48, 0]}
        opacity={0.55}
        scale={14}
        blur={2.6}
        far={4}
        color="#000000"
      />

      <CameraRig
        currentView={currentView}
        setAnimating={setAnimating}
        onReveal={onReveal}
      />

      {/* Drag-to-rotate only while focused and not mid-transition.
          Strict clamps keep the cinematic framing intact. */}
      <OrbitControls
        enabled={isFocus && !isAnimating}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        target={CAMERA_VIEWS[currentView].target}
        minAzimuthAngle={-Math.PI / 7}
        maxAzimuthAngle={Math.PI / 7}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.95}
      />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   CHECKOUT DRAWER — glassmorphism bottom-sheet over the canvas.
   ────────────────────────────────────────────────────────────── */

function CheckoutDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const { items, updateQuantity, subtotal, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!sheet.current) return;
    gsap.to(sheet.current, {
      yPercent: open ? 0 : 110,
      duration: 0.6,
      ease: open ? "expo.out" : "power3.in",
    });
  }, [open]);

  const close = () => {
    setConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      clearCart();
      close();
    }, 1800);
  };

  return (
    <>
      {/* Scrim */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        ref={sheet}
        className="fixed bottom-0 left-1/2 z-[70] w-full max-w-[480px] -translate-x-1/2 translate-y-[110%]"
      >
        <div className="m-3 rounded-[28px] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
          {/* Grab handle */}
          <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/25" />

          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl font-light tracking-wide text-ivory">
              Checkout
            </h3>
            <button
              onClick={close}
              aria-label="Close checkout"
              className="rounded-full bg-white/10 p-2 text-mist transition hover:bg-white/20 hover:text-ivory"
            >
              <X size={18} />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-mist/70">
              Your atelier selection is empty.
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.variant}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg font-light text-ivory">
                        {item.product.variant}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/70">
                        {item.product.collection}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="rounded-full border border-white/15 p-1.5 text-mist transition hover:text-ivory"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center text-sm tabular-nums text-ivory">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="rounded-full border border-white/15 p-1.5 text-mist transition hover:text-ivory"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-baseline justify-between border-t border-white/10 pt-5">
                <span className="text-[11px] uppercase tracking-[0.25em] text-mist/60">
                  Total
                </span>
                <span className="font-serif text-2xl font-light tabular-nums text-ivory">
                  ₹{(subtotal * 62.4).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={confirmed}
                className="mt-5 w-full rounded-2xl bg-gradient-to-b from-[#1a1b1f] to-[#0c0d10] py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-champagne ring-1 ring-champagne/30 transition hover:ring-champagne/60 disabled:opacity-70"
              >
                {confirmed ? "Confirmed ✓" : "Confirm & Pay"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN EXPERIENCE
   ────────────────────────────────────────────────────────────── */

export default function OasisExperience() {
  const [view, setView] = useState<ViewState>("STAGE");
  const [isAnimating, setAnimating] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { addItem, itemCount } = useCart();

  const isFocus = FOCUS_VIEWS.includes(view);
  const focusedIndex = isFocus ? viewToIndex(view) : 1;
  const focusedProduct = products[focusedIndex];

  /* ── INTRO UI REVEAL ──────────────────────────────────────────
     The STAGE overlays start hidden and are staggered in by the
     CameraRig's intro timeline (via the revealUI callback) right as
     the camera decelerates into the gallery composition. GSAP owns
     these elements' opacity/transform so they don't flash on load. */
  const navRef = useRef<HTMLElement>(null);
  const introItemsRef = useRef<HTMLElement[]>([]);
  const setIntroItem = (el: HTMLElement | null, i: number) => {
    if (el) introItemsRef.current[i] = el;
  };

  // Hide intro UI before first paint (no flash, no jump).
  useLayoutEffect(() => {
    const targets = [navRef.current, ...introItemsRef.current].filter(
      Boolean
    ) as HTMLElement[];
    gsap.set(targets, { opacity: 0, y: 20 });
  }, []);

  // Called by CameraRig at ~62% of the pull-back tween.
  const revealUI = () => {
    const targets = [navRef.current, ...introItemsRef.current].filter(
      Boolean
    ) as HTMLElement[];
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
    });
  };

  const goNext = () =>
    setView(FOCUS_VIEWS[(focusedIndex + 1) % products.length]);
  const goPrev = () =>
    setView(
      FOCUS_VIEWS[(focusedIndex - 1 + products.length) % products.length]
    );

  const handleAdd = () => {
    addItem(focusedProduct);
    setCheckoutOpen(true);
  };

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-obsidian select-none"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 25%, #1a1610 0%, #0c0b0d 55%, #060608 100%)",
      }}
    >
      {/* ── 3D CANVAS ── */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          fov: 38,
          near: 0.1,
          far: 100,
          // Initialise at the macro close-up so the first painted frame is
          // already the intro start pose — prevents a visual jump.
          position: INTRO_START.position,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        className="absolute inset-0"
      >
        <fog attach="fog" args={["#0a0a0c", 8, 22]} />
        <Suspense fallback={null}>
          <Scene
            currentView={view}
            setAnimating={setAnimating}
            isAnimating={isAnimating}
            setView={setView}
            onReveal={revealUI}
          />
        </Suspense>
      </Canvas>

      {/* ── TOP NAV ── */}
      <header
        ref={navRef}
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-7 transition-transform duration-700 ${
          isFocus ? "-translate-y-16" : ""
        }`}
      >
        <button
          className="pointer-events-auto rounded-full p-2 text-ivory/80 transition hover:text-champagne"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
        <span className="font-arabic text-3xl font-bold tracking-wide text-champagne">
          العروة
        </span>
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            className="rounded-full p-2 text-ivory/80 transition hover:text-champagne"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setCheckoutOpen(true)}
            className="relative rounded-full p-2 text-ivory/80 transition hover:text-champagne"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0 -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] font-bold text-obsidian">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── BACK BUTTON (focus) ── */}
      <button
        onClick={() => setView("STAGE")}
        className={`absolute left-6 top-7 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[12px] uppercase tracking-[0.15em] text-ivory backdrop-blur-md transition-all duration-500 hover:border-champagne/40 hover:text-champagne ${
          isFocus
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* ── GALLERY OVERLAY (STAGE) ── */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-14 transition-all duration-700 ${
          isFocus
            ? "translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <span
          ref={(el) => setIntroItem(el, 0)}
          className="mb-3 text-[10px] uppercase tracking-[0.4em] text-champagne/80"
        >
          Yawm &amp; Tareekh Collection
        </span>
        <h1
          ref={(el) => setIntroItem(el, 1)}
          className="font-serif text-4xl font-light tracking-[0.04em] text-ivory"
        >
          Oasis of Precision
        </h1>
        <p
          ref={(el) => setIntroItem(el, 2)}
          className="mt-3 text-sm tracking-[0.15em] text-mist/70"
        >
          {GALLERY_PRICE_RANGE}
        </p>
        <p
          ref={(el) => setIntroItem(el, 3)}
          className="mt-6 text-[11px] uppercase tracking-[0.3em] text-mist/40"
        >
          Tap a timepiece to explore
        </p>
      </div>

      {/* ── FOCUS OVERLAY ── */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-12 transition-all duration-700 ${
          isFocus
            ? "translate-y-0 opacity-100 delay-300"
            : "translate-y-8 opacity-0"
        }`}
      >
        {/* Variant switcher */}
        <div className="pointer-events-auto mb-6 flex items-center gap-6">
          <button
            onClick={goPrev}
            aria-label="Previous timepiece"
            className="rounded-full border border-white/10 p-2.5 text-ivory/70 transition hover:border-champagne/40 hover:text-champagne"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-[180px] text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-champagne/70">
              {focusedProduct.collection}
            </p>
            <h2 className="mt-1 font-serif text-3xl font-light text-ivory">
              {focusedProduct.variant}
            </h2>
            <p className="mt-1 text-sm tabular-nums text-mist/70">
              {focusedProduct.priceLabel}
            </p>
          </div>
          <button
            onClick={goNext}
            aria-label="Next timepiece"
            className="rounded-full border border-white/10 p-2.5 text-ivory/70 transition hover:border-champagne/40 hover:text-champagne"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="pointer-events-auto rounded-full bg-gradient-to-b from-champagne-light to-champagne px-12 py-4 text-[12px] font-bold uppercase tracking-[0.25em] text-obsidian shadow-[0_8px_30px_rgba(197,168,128,0.35)] transition hover:shadow-[0_8px_40px_rgba(197,168,128,0.55)]"
        >
          Add to Cart
        </button>
      </div>

      {/* ── CHECKOUT ── */}
      <CheckoutDrawer
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
