import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

import "../../css/main/Main.css";
import mainIcons from "../../images/main/mainIcons.svg";
import TogetherSection from "./TogetherSection";
import MainSlider from "./MainSlider";
import mainIcons2 from "../../images/main/mainIcons2.png";
import cartIcon from "../../images/main/cartIcon.svg";
import RotatingTextWave from "./RotatingTextWave";

export default function StickyTest() {
  useEffect(() => {
    // ✅ Lenis 초기화
    const lenis = new Lenis({
      duration: 1.5, // 묵직한 느낌
      easing: (t) => 1 - Math.pow(2, -10 * t), // easeOutExpo 느낌
      smoothWheel: true,
      smoothTouch: true,
    });

    // ✅ RAF 루프 실행
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <HeroSection />
      <PanelSection />
      <TogetherSection />
      <ThirdPanel />
      <MainSlider />
    </main>
  );
}

function HeroSection() {
  const pinRef = useRef(null);

  useEffect(() => {
    const pin = pinRef.current;
    const panel = document.querySelector(".test-panel"); // 첫 패널

    if (!pin || !panel) return;

    const update = () => {
      // 패널의 top(Y)과 핀의 '화면 중앙 기준 bottom' 계산
      const panelTop = panel.getBoundingClientRect().top;
      const pinRect = pin.getBoundingClientRect();
      // pin 은 fixed + top:50vh + translateY(-50%) 이라서 화면 중앙이 pin의 수직 중심
      const pinBottomY = window.innerHeight * 0.5 + pinRect.height * 0.5;

      // 패널 top이 pin bottom을 지나면(= 완전히 덮음) 숨김
      const fullyCovered = panelTop <= pinBottomY - 400; // 여유 4px
      pin.classList.toggle("is-hidden", fullyCovered);
    };

    const onScroll = () => requestAnimationFrame(update);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="test-hero">
      <div ref={pinRef} className="test-hero__pin">
        <h1>제주도 여행, 아직도 어렵게 하세요?</h1>
        <p>돈 걱정 없이, 돈 쓰러가는 제주여행!</p>
        <ScrollDown />
      </div>
      <div className="test-hero__spacer" />
    </section>
  );
}

/* ScrollDown 컴포넌트 */
function ScrollDown() {
  return (
    <div className="scroll-down">
      <span className="scroll-text">Scroll</span>
      <span className="scroll-icon">↓</span>
    </div>
  );
}

function PanelSection() {
  return (
    <section className="test-panel">
      <div className="title-strip">
        {/* ✅ 여기 교체: 회전 + 웨이브 */}
        <p className="title-eyebrow">
          <RotatingTextWave
            phrases={[
              "내 계획이 시작되는 곳,",
              "내 여행이 실현되는 곳,",
              "내 추억이 기록되는 곳,",
            ]}
            interval={2000} // 문구당 2초 유지
            height={64} // 한 줄 높이(px) — title-eyebrow에 맞추어 조절
            align="center" // 'left' | 'center' | 'right'
            amplitude={10} // 웨이브 높이(px)
            charDelay={0.035} // 파도 속도(글자당 지연)
          />
        </p>

        <h2 className="title-main">MONEYWAY</h2>
        <ul className="emoji-row">
          <li>🌴</li>
          <li>💰</li>
          <li>🚌</li>
          <li>💰</li>
          <li>🌴</li>
        </ul>
      </div>

      <div className="panel-grid">
        <div className="panel-left">
          <p className="panel-eyebrow">당신을 위한 JEJU</p>
          <h2 className="panel-title">
            머니웨이에서 찾으세요, <br />
            당신에게 딱 맞는 맞춤 여행 플랜
          </h2>
          <p className="panel-sub">
            가고 싶은 맛집, 명소, 숙소를 둘러보세요. <br />
            마음에 들면 나의 여행카트에 <b>쏙!</b>
          </p>
          <div className="panel-cta">
            <img
              className="panel-cart-icon"
              src={cartIcon}
              alt=""
              aria-hidden="true"
            />
            <a href="/search" className="panel-btn">
              <span className="panel-btn__text">카트 채우러 가기</span>
              <span className="panel-btn__arrow" aria-hidden="true">
                ›
              </span>
            </a>
          </div>
        </div>

        <div className="panel-right">
          <div className="icon-stage">
            <img src={mainIcons} alt="여행 아이콘 모음" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ThirdPanel() {
  return (
    <section className="third-panel-container">
      <img src={mainIcons2} alt="여행 아이콘 모음" />
    </section>
  );
}
