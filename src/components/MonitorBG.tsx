import {Canvas, useThree} from "@react-three/fiber";
import {Radio} from "./Radio.tsx";
import {CameraShake, ContactShadows, Html} from "@react-three/drei";
import {useState} from "react";
import * as THREE from "three";
import {DoubleSide} from "three";

const CAM_DISTANCE = 5;

export default function MonitorBG() {
    return <div style={{position: "absolute", inset: 0}}>
        <Canvas shadows dpr={[1, 2]} style={{width: '100%', height: '100%'}} camera={[0, 0, CAM_DISTANCE, {fov: 50}] as any}>
            <directionalLight castShadow intensity={4} shadow-mapSize={2048} position={[0, 0, 0]} rotation={[-1, 0, 0]}/>
            <ambientLight intensity={1.5}/>
            <Radio position={[0, -1, 0]} scale={2}/>
            <Html transform occlude castShadow receiveShadow scale={.2} position={[2, -.5, 0]} rotation={[.2,0,0]} material={<meshStandardMaterial side={DoubleSide} opacity={.1}/>}>
                <Card/>
            </Html>
            <ContactShadows position={[0, -1.2, 0]} opacity={1} scale={10} blur={3} far={10} resolution={256} color="#000000"/>
            <Rig/>
            <fog attach="fog" args={['lightpink', 0, 90]}/>
        </Canvas>
    </div>
}

const Rig = () => {
    const [vec] = useState(() => new THREE.Vector3())
    const {camera, mouse} = useThree()
    // useFrame(() => camera.position.lerp(vec.set(mouse.x * CAM_DISTANCE / 10, CAM_DISTANCE / 10, CAM_DISTANCE), 0.05))
    return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4}/>
}

const Card = () => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        borderRadius: 20,
        background:"white"
    }}>
        <h2 style={{margin: 0, marginBottom:12}}>Hello! I'm chamchi.</h2>
        <h3 style={{margin: 0}}>I develop websites and games.</h3>
        <h3 style={{margin: 0}}>I like to code with Typescript, React</h3>
    </div>
}