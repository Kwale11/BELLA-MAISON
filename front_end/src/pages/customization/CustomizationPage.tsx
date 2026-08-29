import { useMemo, useState } from "react";

import CustomizationSummary from "./components/CustomizationSummary";
import EngravingSection from "./components/EngravingSection";
import RingSizeSection from "./components/RingSizeSection";
import VisualOptionSection from "./components/VisualOptionSection";

import {
    basePrice,
    finishOptions,
    getAvailableColors,
    materialOptions,
    shapeOptions,
    sizeOptions,
    widthOptions,
} from "./data/customizationOptions";

import type {
    CustomizationOption,
    CustomizationSelections,
    MaterialId,
} from "./types/customization";

import "./CustomizationPage.css";
import RingPreview3D from "./components/ring-3d/RingPreview3D";

const initialSelections: CustomizationSelections = {
    shape: "",
    material: "",
    color: "",
    width: "",
    finish: "",
    size: "",
    engraving: "",
};

function findOption(
    options: CustomizationOption[],
    selectedId: string,
) {
    return options.find(
        (option) => option.id === selectedId,
    );
}

export default function CustomizationPage() {
    const [selections, setSelections] =
        useState<CustomizationSelections>(
            initialSelections,
        );

    const availableColors = useMemo(
        () => getAvailableColors(selections.material),
        [selections.material],
    );

    const selectedOptions = useMemo(
        () => [
            findOption(shapeOptions, selections.shape),
            findOption(
                materialOptions,
                selections.material,
            ),
            findOption(
                availableColors,
                selections.color,
            ),
            findOption(widthOptions, selections.width),
            findOption(finishOptions, selections.finish),
        ],
        [availableColors, selections],
    );

    const totalPrice = useMemo(
        () =>
            basePrice +
            selectedOptions.reduce(
                (total, option) =>
                    total + (option?.priceDelta ?? 0),
                0,
            ),
        [selectedOptions],
    );

    const completedCount = [
        selections.shape,
        selections.material,
        selections.color,
        selections.width,
        selections.finish,
        selections.size,
    ].filter(Boolean).length;

    const isComplete = completedCount === 6;

    const updateSelection = (
        key: keyof CustomizationSelections,
        value: string,
    ) => {
        setSelections((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const handleMaterialChange = (
        material: string,
    ) => {
        setSelections((previous) => ({
            ...previous,
            material: material as MaterialId,
            color: "",
        }));
    };

    const summaryItems = [
        {
            label: "모양",
            value:
                findOption(
                    shapeOptions,
                    selections.shape,
                )?.label ?? "",
        },
        {
            label: "소재",
            value:
                findOption(
                    materialOptions,
                    selections.material,
                )?.label ?? "",
        },
        {
            label: "색상",
            value:
                findOption(
                    availableColors,
                    selections.color,
                )?.label ?? "",
        },
        {
            label: "넓이",
            value:
                findOption(
                    widthOptions,
                    selections.width,
                )?.label ?? "",
        },
        {
            label: "표면",
            value:
                findOption(
                    finishOptions,
                    selections.finish,
                )?.label ?? "",
        },
        {
            label: "사이즈",
            value: selections.size
                ? `${selections.size}호`
                : "",
        },
        {
            label: "각인",
            value: selections.engraving || "없음",
        },
    ];

    return (
        <main className="customization-page">
            <header className="customization-page__hero">
                <p>BELLA MAISON CUSTOM MADE</p>

                <h1>
                    두 사람만의 반지를
                    <br />
                    완성해보세요.
                </h1>

                <span>
                    이미지로 디자인을 비교하고 원하는 옵션을
                    순서대로 선택할 수 있습니다.
                </span>
            </header>

            <div className="customization-page__layout">
                <div className="customization-page__content">
                    <RingPreview3D
                        selections={selections}
                    />

                    <VisualOptionSection
                        step={1}
                        title="반지 모양"
                        description="전체적인 밴드 형태를 선택해주세요."
                        options={shapeOptions}
                        selectedId={selections.shape}
                        onSelect={(value) => {
                            updateSelection("shape", value);
                        }}
                    />

                    <VisualOptionSection
                        step={2}
                        title="소재"
                        description="착용감과 색감, 가격을 결정하는 소재입니다."
                        options={materialOptions}
                        selectedId={selections.material}
                        onSelect={handleMaterialChange}
                    />

                    <VisualOptionSection
                        step={3}
                        title="색상"
                        description="선택한 소재에서 제작 가능한 색상입니다."
                        options={availableColors}
                        selectedId={selections.color}
                        disabled={!selections.material}
                        onSelect={(value) => {
                            updateSelection("color", value);
                        }}
                    />

                    <VisualOptionSection
                        step={4}
                        title="밴드 넓이"
                        description="손 위에서 느껴지는 반지의 존재감을 선택해주세요."
                        options={widthOptions}
                        selectedId={selections.width}
                        onSelect={(value) => {
                            updateSelection("width", value);
                        }}
                    />

                    <VisualOptionSection
                        step={5}
                        title="표면 질감"
                        description="빛이 반사되는 방식과 표면의 결을 선택해주세요."
                        options={finishOptions}
                        selectedId={selections.finish}
                        onSelect={(value) => {
                            updateSelection("finish", value);
                        }}
                    />

                    <RingSizeSection
                        value={selections.size}
                        options={sizeOptions}
                        onChange={(value) => {
                            updateSelection("size", value);
                        }}
                    />

                    <EngravingSection
                        value={selections.engraving}
                        onChange={(value) => {
                            updateSelection(
                                "engraving",
                                value,
                            );
                        }}
                    />
                </div>

                <CustomizationSummary
                    items={summaryItems}
                    completedCount={completedCount}
                    totalSteps={6}
                    totalPrice={totalPrice}
                    isComplete={isComplete}
                />
            </div>
        </main>
    );
}