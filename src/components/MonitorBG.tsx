import {Canvas, useFrame, useThree} from "@react-three/fiber";
import GameBoy from "./GameBoy.tsx";
import {CameraShake, ContactShadows, Float, Html} from "@react-three/drei";
import * as THREE from "three";
import {DoubleSide} from "three";
import {useState} from "react";

const CAM_DISTANCE = 5;

export default function MonitorBG() {
    return <div style={{position: "absolute", inset: 0}}>
        <Canvas eventPrefix="client" shadows dpr={[1, 2]} style={{width: '100%', height: '100%'}} camera={[0, 0, CAM_DISTANCE, {fov: 50}] as any}>
            <ambientLight color={"#dadacf"} intensity={1.2}/>
            <Float rotationIntensity={1.5} floatIntensity={1.5} speed={3}>
                <GameBoy position={[-1, -1, 0]} rotation={[.2, 0, 0]} scale={.25}/>
                <Html occlude={"raycast"} transform castShadow receiveShadow scale={.25} position={[1, 0, 0]} rotation={[.2, 0, 0]}
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
    const [vec] = useState(() => new THREE.Vector3());
    const {camera, pointer} = useThree();
    useFrame(() => camera.position.lerp(vec.set(pointer.x * CAM_DISTANCE / 10, pointer.y * CAM_DISTANCE / 10, CAM_DISTANCE), 0.05))
    return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4}/>
}

const Card = () => {
    return <div className={"flex flex-col items-center relative rounded-[8px] bg-bright w-[300px] overflow-hidden"}>
        <div className={"w-full h-[120px] bg-[url(/images/anvy.png)] bg-cover bg-top"}/>
        <div className={"bg-[url(/images/anvy_profile.png)] bg-cover bg-center " +
            "rounded-full " +
            "absolute w-[80px] h-[80px] left-[12px] top-[80px]"}/>
        <QuickLinks/>
        <div className={"flex flex-col pt-[56px] px-[12px] pb-[16px] bg-bright w-full gap-[16px]"}>
            <div className={"flex flex-col gap-1"}>
                <span className={"text-xl"}>Chamchi</span>
                <span className={"text-sm text-gray-900"}>Jiwon Choi ∙ 🇰🇷 ∙ He/Him</span>
            </div>
            <span className={"text-lg"}>Working as web dev / Game dev hobbyist</span>
            <div className={"flex flex-row flex-wrap gap-1.5"}>
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

    return <div className={`rounded-md bg-center bg-size-[16px] bg-no-repeat w-5 h-5 cursor-pointer hover:bg-gray-400 `}
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