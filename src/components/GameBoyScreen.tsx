import {Html} from "@react-three/drei";
import {DoubleSide} from "three";
import {useStore} from "@nanostores/react";
import {$currentIndex} from "../stores/gameboy.ts";
import {works} from "../data/works.ts";
import {SquareArrowOutUpRight, Gamepad2, Pointer} from "lucide-react"

export default function GameBoyScreen() {

    return <Html occlude={"raycast"} transform castShadow receiveShadow scale={.85} position={[0, 8.05, .75]}
                 material={<meshStandardMaterial side={DoubleSide}/>}>
        <Thumbnail/>
    </Html>
}

export const Thumbnail = () => {

    const currentIndex = useStore($currentIndex);
    const work = works[currentIndex];

    return <div className={"w-50 h-50 bg-black bg-center bg-cover relative"}
                style={{
                    backgroundImage: `url(${work.imageUrl})`,
                }}
    >
        <div className="absolute inset-0 flex flex-col justify-between items-center p-2 text-bright text-2xl text-shadow-lg opacity-100 hover:opacity-0 transition-all">
            <div className={"flex flex-row justify-center items-center gap-1"}>
                <Pointer size={24}/>
                Hover Me
                <Pointer size={24}/>
            </div>
            <div className="flex self-end gap-1 py-1 px-2 rounded text-sm bg-black/80">
                <Gamepad2 size={18}/> A/B Navigate
            </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-bright text-xl gap-1 cursor-pointer bg-black/80 transition-all opacity-0 hover:opacity-100"
             onClick={() => window.open(work.url)}
        >
            <div className={"flex flex-row items-center gap-1"}>{work.title} <SquareArrowOutUpRight size={18}/></div>
            <span className={"text-sm whitespace-pre-wrap text-center px-2"}>{work.description}</span>
        </div>
    </div>
}