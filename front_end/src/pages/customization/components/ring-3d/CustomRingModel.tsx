import {
    useEffect,
    useMemo,
} from "react";

import {
    Center,
    useGLTF,
    useTexture,
} from "@react-three/drei";

import * as THREE from "three";

import type { CustomizationSelections } from "../../types/customization";

import {
    getFinishProfile,
    getFinishTextureUrls,
    getMetalColor,
    getRingModelUrl,
    getRingSizeScale,
} from "./ringRendering";

interface CustomRingModelProps {
    selections: CustomizationSelections;
}

function isDiamondMesh(mesh: THREE.Mesh) {
    const originalMaterialName =
        Array.isArray(mesh.material)
            ? mesh.material
                .map((material) => material.name)
                .join(" ")
            : mesh.material?.name ?? "";

    const searchableName = [
        mesh.name,
        originalMaterialName,
        mesh.userData.materialRole ?? "",
    ]
        .join(" ")
        .toLowerCase();

    return (
        searchableName.includes("diamond") ||
        searchableName.includes("stone") ||
        searchableName.includes("gem")
    );
}

export default function CustomRingModel({
                                            selections,
                                        }: CustomRingModelProps) {
    const modelUrl =
        getRingModelUrl(selections);

    const { scene } = useGLTF(modelUrl);

    const finishProfile =
        getFinishProfile(selections.finish);

    const textureUrls =
        getFinishTextureUrls(selections.finish);

    const {
        normalMap,
        roughnessMap,
    } = useTexture(textureUrls);

    useEffect(() => {
        const textures = [
            normalMap,
            roughnessMap,
        ];

        textures.forEach((texture) => {
            texture.wrapS =
                THREE.RepeatWrapping;

            texture.wrapT =
                THREE.RepeatWrapping;

            texture.repeat.set(4, 1);
            texture.anisotropy = 8;
            texture.colorSpace =
                THREE.NoColorSpace;

            texture.needsUpdate = true;
        });
    }, [normalMap, roughnessMap]);

    const metalMaterial = useMemo(() => {
        const material =
            new THREE.MeshPhysicalMaterial({
                name: "BellaMaisonMetal",

                color: new THREE.Color(
                    getMetalColor(selections),
                ),

                metalness: 1,
                roughness:
                finishProfile.roughness,

                normalMap,
                roughnessMap,

                normalScale: new THREE.Vector2(
                    finishProfile.normalScale,
                    finishProfile.normalScale,
                ),

                envMapIntensity: 1.7,
            });

        material.anisotropy =
            finishProfile.anisotropy;

        material.anisotropyRotation =
            Math.PI / 2;

        return material;
    }, [
        finishProfile,
        normalMap,
        roughnessMap,
        selections,
    ]);

    const diamondMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                name: "BellaMaisonDiamond",

                color: new THREE.Color(
                    "#ffffff",
                ),

                metalness: 0,
                roughness: 0.015,

                transmission: 1,
                opacity: 1,
                thickness: 0.35,

                /*
                 * Three.js MeshPhysicalMaterial의
                 * 공식 최대 IOR 값입니다.
                 */
                ior: 2.333,

                dispersion: 0.09,

                attenuationColor:
                    new THREE.Color("#ffffff"),

                attenuationDistance: 8,

                envMapIntensity: 2.4,
            }),
        [],
    );

    const preparedScene = useMemo(() => {
        const clonedScene =
            scene.clone(true);

        clonedScene.traverse((child) => {
            if (
                !(
                    child instanceof
                    THREE.Mesh
                )
            ) {
                return;
            }

            child.castShadow = true;
            child.receiveShadow = true;

            child.material = isDiamondMesh(
                child,
            )
                ? diamondMaterial
                : metalMaterial;
        });

        return clonedScene;
    }, [
        scene,
        metalMaterial,
        diamondMaterial,
    ]);

    useEffect(
        () => () => {
            metalMaterial.dispose();
            diamondMaterial.dispose();
        },
        [
            metalMaterial,
            diamondMaterial,
        ],
    );

    const sizeScale =
        getRingSizeScale(selections.size);

    return (
        <Center>
            <group
                scale={[
                    sizeScale,
                    sizeScale,
                    sizeScale,
                ]}
            >
                <primitive
                    object={preparedScene}
                    dispose={null}
                />
            </group>
        </Center>
    );
}