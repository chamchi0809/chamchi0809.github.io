import { Canvas, useFrame, useThree } from "@react-three/fiber";
import GameBoy from "./GameBoy.tsx";
import {
    CameraShake,
    ContactShadows,
    Float,
    Html,
    Text3D,
    useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { DoubleSide } from "three";
import { memo, Suspense, useMemo, useRef, useState } from "react";
import type { GroupProps } from "@react-three/fiber";

const CAM_DISTANCE = 5;

const SPHERE_R = 0.3;
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";
// Label/icon offsets were tuned at r = 0.45; scale them with the radius.
const FACE_SCALE = SPHERE_R / 0.45;

// Column hugging the card's right edge (card spans x 0.06..1.94, centre y 0.6).
const COLUMN_X = 1.94 + 0.11 + SPHERE_R;
// Centred on the card's y 0.6, one radius + 0.15 clearance apart.
const LINKS = [
    { url: "/pixi-GI", label: "pixi-GI", color: "#7b10b0", y: 1.0 },
    { url: "/three-rc-25d", label: "three-rc-25d", color: "#cf0e22", y: 0.2 },
];

// ponytail: 3-step DataTexture is the whole toon ramp — no gradient png to ship
const TOON_RAMP = (() => {
    const tex = new THREE.DataTexture(
        new Uint8Array([90, 160, 220, 255]),
        4,
        1,
        THREE.RedFormat,
    );
    tex.minFilter = tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
})();

export default function IndexCanvas() {
    const [zoomed, setZoomed] = useState(false);

    return (
        <div className={"absolute inset-0 z-50"}>
            <Canvas
                className={"animate-fadeIn"}
                resize={{ debounce: 0 }}
                eventPrefix={"client"}
                shadows
                dpr={[1, 2]}
                style={{ width: "100%", height: "100%" }}
                camera={[0, 0, CAM_DISTANCE, { fov: 50 }] as any}
                onPointerMissed={() => setZoomed(false)}
            >
                <Float
                    rotationIntensity={zoomed ? 0 : 1.5}
                    floatIntensity={zoomed ? 0 : 1.5}
                    speed={3}
                >
                    <Suspense fallback={<Loader />}>
                        <AnimatedGameBoy
                            zoomed={zoomed}
                            onZoom={() => setZoomed(true)}
                        />
                        <Html
                            occlude={"raycast"}
                            transform
                            castShadow
                            receiveShadow
                            scale={0.25}
                            position={[1, 0.6, 0]}
                            rotation={[0.2, 0, 0]}
                            material={
                                <meshStandardMaterial
                                    side={DoubleSide}
                                    opacity={0.1}
                                />
                            }
                        >
                            <Card />
                        </Html>
                    </Suspense>
                    {/* own Suspense: the font must not block the GameBoy Loader */}
                    <Suspense fallback={null}>
                        {LINKS.map((l) => (
                            <LinkSphere key={l.url} {...l} />
                        ))}
                    </Suspense>
                </Float>
                <ambientLight color={"#dadacf"} intensity={1.2} />
                {/* ponytail: toon bands need one hard light, tune intensity here */}
                <directionalLight position={[3, 4, 5]} intensity={2.5} />
                <ContactShadows
                    position={[0, -1.2, 0]}
                    opacity={1}
                    scale={10}
                    blur={2}
                    far={10}
                    resolution={256}
                    color="#000000"
                />
                <Rig />
            </Canvas>
        </div>
    );
}

const LinkSphere = ({
    url,
    label,
    color,
    y,
}: (typeof LINKS)[number]) => {
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null!);

    // ponytail: only the hover pop is animated — the drift comes from the
    // parent <Float>, which the GameBoy and card already share.
    useFrame(() => {
        const g = groupRef.current;
        if (!g) return;
        g.scale.setScalar(
            THREE.MathUtils.lerp(g.scale.x, hovered ? 1.12 : 1, 0.12),
        );
    });

    return (
        <group
            ref={groupRef}
            position={[COLUMN_X, y, 0]}
            onClick={(e) => {
                e.stopPropagation();
                window.location.href = url;
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
        >
            <mesh castShadow>
                <sphereGeometry args={[SPHERE_R, 48, 48]} />
                <meshToonMaterial color={color} gradientMap={TOON_RAMP} />
            </mesh>
            {/* 양각: shallow relief in the body colour, read via the edge outline */}
            <group position={[0, 0, SPHERE_R - 0.01]} scale={FACE_SCALE}>
                <Text3D
                    ref={centerAndOutline}
                    font={FONT_URL}
                    size={0.075}
                    height={0.04}
                    curveSegments={4}
                    bevelEnabled
                    bevelThickness={0.005}
                    bevelSize={0.004}
                    bevelSegments={2}
                    position={[0, -0.08, 0]}
                >
                    {label}
                    <meshToonMaterial color={color} gradientMap={TOON_RAMP} />
                </Text3D>
                <LinkArrow color={color} position={[0, 0.07, 0]} />
            </group>
        </group>
    );
};

// ponytail: EdgesGeometry lines, not a postprocessing Outline pass — 1px hairline
// and no EffectComposer. Swap to postprocessing Outline if you need thick strokes.
const OUTLINE_MAT = new THREE.LineBasicMaterial({ color: "#2c2c2c" });
const outline = (mesh: THREE.Mesh | null) => {
    if (!mesh?.geometry) return;
    mesh.add(
        new THREE.LineSegments(
            new THREE.EdgesGeometry(mesh.geometry, 30),
            OUTLINE_MAT,
        ),
    );
};

/** Centers a Text3D geometry and outlines it, once on mount. */
const centerAndOutline = (mesh: THREE.Mesh | null) => {
    if (!mesh?.geometry) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!;
    mesh.geometry.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
    outline(mesh);
};

/** Extruded "↗" — 3 boxes beat shipping an SVG + SVGLoader. */
const LinkArrow = ({ color, ...props }: GroupProps & { color: string }) => (
    <group {...props}>
        <mesh ref={outline} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.15, 0.022, 0.04]} />
            <meshToonMaterial color={color} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh ref={outline} position={[0.034, 0.053, 0]}>
            <boxGeometry args={[0.066, 0.022, 0.04]} />
            <meshToonMaterial color={color} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh ref={outline} position={[0.056, 0.031, 0]}>
            <boxGeometry args={[0.022, 0.066, 0.04]} />
            <meshToonMaterial color={color} gradientMap={TOON_RAMP} />
        </mesh>
    </group>
);

const AnimatedGameBoy = ({
    zoomed,
    onZoom,
}: {
    zoomed: boolean;
    onZoom: () => void;
}) => {
    const groupRef = useRef<THREE.Group>(null!);
    const targets = useMemo(
        () => ({
            zoomed: {
                pos: new THREE.Vector3(0, -1.4, 1),
                rot: new THREE.Euler(0, 0, 0),
                scale: 0.3,
            },
            default: {
                pos: new THREE.Vector3(-1, -0.7, -0.5),
                rot: new THREE.Euler(0.2, 0, 0),
                scale: 0.25,
            },
        }),
        [],
    );

    useFrame(() => {
        if (!groupRef.current) return;
        const t = zoomed ? targets.zoomed : targets.default;
        groupRef.current.position.lerp(t.pos, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            t.rot.x,
            0.1,
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            t.rot.y,
            0.1,
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            t.rot.z,
            0.1,
        );
        const s = THREE.MathUtils.lerp(groupRef.current.scale.x, t.scale, 0.1);
        groupRef.current.scale.set(s, s, s);
    });

    return (
        <group
            ref={groupRef}
            position={[-1, -0.7, -0.5]}
            rotation={[0.2, 0, 0]}
            scale={0.25}
            onClick={(e) => {
                e.stopPropagation();
                if (!zoomed) onZoom();
            }}
        >
            <GameBoy />
        </group>
    );
};

const Rig = () => {
    const [vec] = useState(() => new THREE.Vector3());
    const { camera, pointer } = useThree();
    useFrame(() =>
        camera.position.lerp(
            vec.set(
                (pointer.x * CAM_DISTANCE) / 10,
                (pointer.y * CAM_DISTANCE) / 10,
                CAM_DISTANCE,
            ),
            0.05,
        ),
    );
    return <></>;
    // <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4}/>
};

const Card = memo(() => {
    return (
        <div
            className={
                "flex flex-col items-center relative rounded-[8px] bg-bright w-[300px] overflow-hidden"
            }
        >
            <div
                className={
                    "w-full h-[120px] bg-[url(/images/anvy.png)] bg-cover bg-top"
                }
            />
            <div
                className={
                    "bg-[url(/images/anvy_profile.png)] bg-cover bg-center " +
                    "rounded-full " +
                    "absolute w-[80px] h-[80px] left-[12px] top-[80px]"
                }
            />
            <QuickLinks />
            <div
                className={
                    "flex flex-col pt-[56px] px-[12px] pb-[16px] bg-bright w-full gap-[16px]"
                }
            >
                <div className={"flex flex-col gap-1"}>
                    <span className={"text-xl"}>Chamchi</span>
                    <span className={"text-sm text-gray-900"}>
                        Jiwon Choi ∙ 🇰🇷 ∙ He/Him
                    </span>
                </div>
                <span className={"text-md leading-5 text-gray-900"}>
                    Working as web dev / Game dev hobbyist
                </span>
                <div className={"flex flex-row flex-wrap gap-1.5"}>
                    <Tag icon={"/images/react.svg"} text={"React"} />
                    <Tag icon={"/images/webgl.svg"} text={"WebGL"} />
                    <Tag icon={"/images/typescript.svg"} text={"TS"} />
                    <Tag icon={"/images/unity.svg"} text={"Unity"} />
                </div>
            </div>
        </div>
    );
});

const QuickLinks = () => {
    return (
        <div
            style={{
                position: "absolute",
                right: 8,
                top: 128,
                background: "#cccccc99",
                border: "2px solid #ccc",
                padding: "4px",
                borderRadius: 8,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
            }}
        >
            <QuickLink
                link={"https://github.com/chamchi0809"}
                icon={"/images/github.svg"}
            />
            <QuickLink
                link={"https://seoshi1234.itch.io/"}
                icon={"/images/itchio.svg"}
            />
        </div>
    );
};

const QuickLink = ({ link, icon }: { link: string; icon: string }) => {
    return (
        <div
            className={`rounded-md bg-center bg-size-[16px] bg-no-repeat w-5 h-5 cursor-pointer hover:bg-gray-400 `}
            onClick={() => window.open(link, "_blank")}
            style={{ backgroundImage: `url('${icon}')` }}
        />
    );
};

const Tag = ({ icon, text }: { icon: string; text: string }) => {
    return (
        <div
            className={
                "text-gray-900 text-md py-1 px-2 border-1 rounded-full border-gray-500/50 bg-gray-400/20 flex flex-row items-center justify-center gap-1"
            }
        >
            <img src={icon} alt="" width={16} />
            {text}
        </div>
    );
};

function Loader() {
    const { progress } = useProgress();
    return (
        <Html occlude={"raycast"} transform center scale={0.25}>
            <div className="mx-auto w-[500px] h-[200px] bg-gray-950 rounded-xl overflow-hidden drop-shadow-xl">
                <div className="bg-[#333] flex items-center p-[5px] text-whitec relative">
                    <div className="flex absolute left-3">
                        <span className="h-3.5 w-3.5 bg-[#ff5b50] rounded-xl mr-2"></span>
                        <span className="h-3.5 w-3.5 bg-[#fbbc33] rounded-xl mr-2"></span>
                        <span className="h-3.5 w-3.5 bg-[#21c940] rounded-xl"></span>
                    </div>
                    <div className="flex-1 text-center text-white">status</div>
                </div>
                <div className="text-bright text-3xl font-bold flex flex-col items-center justify-center h-[150px]">
                    <div>
                        <span className="mr-2">{progress}% loaded</span>
                        <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">
                            .
                        </span>
                        <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">
                            .
                        </span>
                        <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">
                            .
                        </span>
                    </div>
                </div>
            </div>
        </Html>
    );
}
