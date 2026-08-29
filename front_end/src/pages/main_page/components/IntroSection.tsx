import SectionLink from "./SectionLink";

import "./css/IntroSection.css";

export default function IntroSection() {
    return (
        <section className="intro-section">
            <div className="intro-section__content">
                <p className="intro-section__eyebrow">
                    Bella Maison
                </p>

                <h2>
                    Premium handcrafted
                    <br />
                    wedding jewelry
                </h2>

                <p className="intro-section__description">
                    시간이 지나도 변하지 않는 아름다움과
                    <br />
                    두 사람만의 이야기를 담은 웨딩 주얼리를 선보입니다.
                </p>

                <SectionLink href="/about">
                    Read more
                </SectionLink>
            </div>
        </section>
    );
}