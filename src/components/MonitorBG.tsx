import {Canvas, useThree} from "@react-three/fiber";
import Videogame from "./Videogame.tsx";
import {CameraShake, ContactShadows, Float, Html} from "@react-three/drei";
import {useState} from "react";
import * as THREE from "three";
import {DoubleSide} from "three";

const CAM_DISTANCE = 5;

export default function MonitorBG() {
    return <div style={{position: "absolute", inset: 0}}>
        <Canvas shadows dpr={[1, 2]} style={{width: '100%', height: '100%'}} camera={[0, 0, CAM_DISTANCE, {fov: 50}] as any}>
            <directionalLight castShadow intensity={4} shadow-mapSize={2048} position={[0, 0, 0]} rotation={[-1, 0, 0]}/>
            <ambientLight intensity={1.2}/>
            <Float rotationIntensity={1} speed={3}>
                <Videogame position={[-.8, -1, 0]} rotation={[.2, 0, 0]} scale={.2}/>
                <Html occlude={"raycast"} transform castShadow receiveShadow scale={.2} position={[.8, 0, 0]} rotation={[.2, 0, 0]}
                      material={<meshStandardMaterial side={DoubleSide} opacity={.1}/>}>
                    <Card/>
                </Html>
            </Float>
            <ContactShadows position={[0, -1.2, 0]} opacity={1} scale={10} blur={1} far={10} resolution={256} color="#000000"/>
            <Rig/>
            <fog attach="fog" args={['lightpink', 0, 90]}/>
        </Canvas>
    </div>
}

const Rig = () => {
    const [vec] = useState(() => new THREE.Vector3())
    const {camera, pointer} = useThree()
    // useFrame(() => camera.position.lerp(vec.set(pointer.x * CAM_DISTANCE / 10, CAM_DISTANCE / 10, CAM_DISTANCE), 0.05))
    return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4}/>
}

const Card = () => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 8,
        background: "white",
        overflow: "hidden",
        width: 300,
        position: "relative",
    }}>
        <div style={{width: "100%", height: 120, backgroundImage: "url('/images/belle.png')", backgroundSize: "cover", backgroundPosition: "right 50% bottom 92%"}}/>
        <div style={{backgroundImage: "url('/images/bangboo.png')", backgroundSize: "cover", backgroundPosition: "center", position: "absolute", borderRadius: "50%", width: 80, height: 80, left: 12, top: 80}}/>
        <QuickLinks/>
        <div style={{display: "flex", flexDirection: "column", padding: "56px 12px 16px 12px", background: "#ededed", width: "100%", gap: 16}}>
            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                <span style={{fontSize: 22}}>Chamchi</span>
                <span style={{fontSize: 14, color: "#333"}}>Jiwon Choi ∙ He/Him</span>
            </div>
            <span style={{fontSize: 16}}>I do web frontend / gamedev</span>
            <div style={{display: "flex", flexDirection: "row", gap: 6, flexWrap: "wrap"}}>
                <Tag icon={"/images/unity.svg"} text={"Unity"}/>
                <Tag icon={"/images/react.svg"} text={"React"}/>
                <Tag icon={"/images/typescript.svg"} text={"TS"}/>
                <Tag icon={"/images/webgl.svg"} text={"WebGL"}/>
            </div>
        </div>
    </div>
}

const QuickLinks = () => {
    return <div style={{
        position: "absolute", right: 8, top: 128,
        background: "#cccccc99", border: "2px solid #ccc", padding: "4px", borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", gap: 4
    }}>
        <QuickLink link={"https://github.com/chamchi0809"} icon={"/images/github.svg"}/>
        <QuickLink link={"https://seoshi1234.itch.io/"} icon={"/images/itchio.svg"}/>
    </div>
}

const QuickLink = (
    {
        link,
        icon,
    }: {
        link: string;
        icon: string;
    }) => {

    return <div className={`rounded-md bg-center bg-cover w-5 h-5 cursor-pointer hover:bg-gray-400 `}
                onClick={() => window.open(link, "_blank")}
                style={{backgroundImage: `url('${icon}')`}}/>
}

const Tag = (
    {
        icon,
        text,
    }: {
        icon: string;
        text: string;
    }) => {
    return <div style={{fontSize: 16, background: "#cccccc99", border: "2px solid #ccc", padding: "4px 8px", borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
        <img src={icon} alt="" width={16}/>
        {text}
    </div>
}