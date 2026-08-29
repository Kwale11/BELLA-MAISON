interface SummaryItem {
    label: string;
    value: string;
}

interface CustomizationSummaryProps {
    items: SummaryItem[];
    completedCount: number;
    totalSteps: number;
    totalPrice: number;
    isComplete: boolean;
}

const priceFormatter = new Intl.NumberFormat("ko-KR");

export default function CustomizationSummary({
                                                 items,
                                                 completedCount,
                                                 totalSteps,
                                                 totalPrice,
                                                 isComplete,
                                             }: CustomizationSummaryProps) {
    const progress =
        (completedCount / totalSteps) * 100;

    return (
        <aside className="customization-summary">
            <div className="customization-summary__progress">
                <div>
                    <span>Customization</span>

                    <strong>
                        {completedCount}/{totalSteps}
                    </strong>
                </div>

                <div
                    className="customization-summary__progress-track"
                    aria-label={`선택 진행률 ${Math.round(progress)}%`}
                >
                    <span
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <h2>나의 반지</h2>

            <dl>
                {items.map((item) => (
                    <div key={item.label}>
                        <dt>{item.label}</dt>
                        <dd>{item.value || "선택 전"}</dd>
                    </div>
                ))}
            </dl>

            <div className="customization-summary__price">
                <span>예상 가격</span>

                <strong>
                    {priceFormatter.format(totalPrice)}원
                </strong>

                <p>
                    선택 옵션 및 최종 제작 사양에 따라 가격이
                    변경될 수 있습니다.
                </p>
            </div>

            <button
                type="button"
                disabled={!isComplete}
            >
                {isComplete
                    ? "커스터마이징 완료"
                    : "필수 옵션을 선택해주세요"}
            </button>

            <p className="customization-summary__consultation">
                최종 제작 가능 여부는 상담 후 확정됩니다.
            </p>
        </aside>
    );
}