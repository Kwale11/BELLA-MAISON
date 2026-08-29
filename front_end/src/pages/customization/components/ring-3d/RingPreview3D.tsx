import { Canvas } from "@react-three/fiber";
import {
    Environment,
    OrbitControls,
} from "@react-three/drei";

import type {
    CustomizationSelections,
} from "../../types/customization";

import {
    getMetalColor,
    getRingSizeScale,
} from "./ringRendering";

interface RingPreview3DProps {
    selections: CustomizationSelections;
}

export default function RingPreview3D({
                                          selections,
                                      }: RingPreview3DProps) {
    const color = getMetalColor(selections);
    const scale = getRingSizeScale(
        selections.size,
    );

    return (
        <div
            style={{
                width: "100%",
                height: "500px",
            }}
        >
            <Canvas
                camera={{
                    position: [0, 0, 5],
                    fov: 40,
                }}
            >
                <ambientLight intensity={1.5} />

                <directionalLight
                    position={[4, 4, 5]}
                    intensity={3}
                />

                <mesh scale={scale}>
                    <torusGeometry
                        args={[1.3, 0.28, 64, 128]}
                    />

                    <meshPhysicalMaterial
                        color={color}
                        metalness={1}
                        roughness={0.15}
                    />
                </mesh>

                <Environment preset="studio" />

                <OrbitControls />
            </Canvas>
        </div>
    );
}