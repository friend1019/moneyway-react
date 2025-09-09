import React, { useEffect, useRef, useState, useCallback } from "react";
import "../../css/main/Main.css";            // ✅ 먼저
import "../../css/main/TogetherSection.css"; // ✅ 나중 (우선순위 높임)
import PlanIcon from "../../images/main/planIcon.svg";

const STEPS = [
  {
    n: 1,
    label: "STEP 1",
    title: "예산을 입력하세요",
    desc: "여행에 쓰일 예산을 입력해주세요. 당신을 위한 여행의 첫 걸음이 됩니다.",
    previewAria: "예산 입력 화면 미리보기",
  },
  {
    n: 2,
    label: "STEP 2",
    title: "여행 기간을 입력하세요",
    desc: "얼마 동안 여행하시나요? 추천 장소로 플랜을 구성해 드립니다.",
    previewAria: "여행 기간 선택 화면 미리보기",
  },
  {
    n: 3,
    label: "STEP 3",
    title: "곧 플랜이 완성됩니다!",
    desc: "나의 여행에 이름을 붙여주세요. 플랜을 저장하고 쉽게 관리할 수 있어요.",
    previewAria: "여행 플랜 요약 화면 미리보기",
  },
];

const CYCLE_MS = 1500; // 자동 순환 간격(ms)

function TogetherSection() {
  const [active, setActive] = useState(1);   // 현재 포커스 단계(1→2→3)
  const [reached, setReached] = useState(1); // 누적 강조 마지막 단계
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ✅ 1 → 2 → 3 → (모두 강조됨) → 1로 초기화 → 반복
  const nextStep = useCallback(() => {
    setActive((prev) => {
      if (prev === 3) {
        // 리셋: 1만 강조 상태로
        setReached(1);
        return 1;
      }
      const next = prev + 1;
      setReached((r) => Math.max(r, next)); // 누적 갱신
      return next;
    });
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(nextStep, CYCLE_MS);
  }, [clearTimer, nextStep]);

  useEffect(() => {
    if (!paused) startTimer();
    return () => clearTimer();
  }, [paused, startTimer, clearTimer]);

  // 클릭 시: 해당 단계로 이동 + 누적 갱신
  const handleSelect = (n) => {
    setActive(n);
    // 사용자가 1을 눌렀다면 명확히 초기화, 그 외는 누적 유지
    setReached((r) => (n === 1 ? 1 : Math.max(r, n)));
    clearTimer();
    timerRef.current = setTimeout(() => startTimer(), 600);
  };

  const onKeyActivate = (e, n) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(n);
    }
  };

  return (
    <section
      className="together"
      aria-label="우리가 함께 만드는 여행"
      onMouseLeave={() => setPaused(false)}
    >
      <div className="together__inner">
        {/* 왼쪽 */}
        <aside className="together__left">
          <p className="eyebrow">내 손안의 여행 편집샵</p>
          <h2 className="title">가장 아름다운 제주를 만날 시간</h2>

          <p className="lede">
            돌담길, 귤밭, 바다 내음을 가득한 골목까지.
            <br />
            제주다운 여행을 돈 걱정 없이 즐기고 싶으신가요?
          </p>

          <ol className="steps steps--cards" aria-label="단계">
            {STEPS.map((s) => {
              const isCurrent = active === s.n;   // 현재 포커스
              const isOn = s.n <= reached;        // 누적 강조(채워짐)
              const stateClass = isCurrent ? "is-current" : isOn ? "is-on" : ""; // 기본=테두리만

              return (
                <StepCard
                  key={s.n}
                  n={s.n}
                  label={s.label}
                  title={s.title}
                  desc={s.desc}
                  isOn={isOn}
                  isCurrent={isCurrent}
                  stateClass={stateClass}
                  ariaCurrent={isCurrent ? "step" : undefined}
                  onClick={() => handleSelect(s.n)}
                  onKeyDown={(e) => onKeyActivate(e, s.n)}
                />
              );
            })}
          </ol>
        </aside>

        {/* 오른쪽 프리뷰(현재 단계만 표시) */}
        <div className="together__right" aria-live="polite">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className={active === s.n ? "ph is-show" : "ph"}
              role="img"
              aria-label={s.previewAria}
              aria-hidden={active !== s.n}
            />
          ))}

          {/* CTA (아이콘 + 버튼) */}
          <div className="ph-cta">
            <img className="panel-cart-icon" src={PlanIcon} alt="" aria-hidden="true" />
            <a href="/aiplan" className="panel-btn">
              <span className="panel-btn__text">플랜 만들러 가기</span>
              <span className="panel-btn__arrow" aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  label,
  title,
  desc,
  isOn,         // 누적 강조(채워짐)
  isCurrent,    // 현재 포커스
  stateClass,
  ariaCurrent,
  onClick,
  onKeyDown,
}) {
  const descId = `together-desc-${n}`;
  const expanded = isOn; // 누적 강조된 카드들은 모두 펼침
  return (
    <li
      className={`together-step ${stateClass}`}
      data-step={n}
      aria-current={ariaCurrent}
    >
      {/* 불릿/도트 */}
      <span className="together-bullet" aria-hidden>{n}</span>
      <span className="together-dot" aria-hidden />

      {/* 기본: 테두리만(고정 크기). is-on/is-current: 채워지고 내용 표시 */}
      <div
        className="together-card together-card--action"
        role="button"
        tabIndex={0}
        aria-label={`${label}: ${title} 선택`}
        aria-expanded={expanded}
        aria-controls={descId}
        data-active={expanded ? "true" : "false"}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <span className="together-label">{label}</span>

        <div className="together-card__title" aria-hidden={!expanded}>
          {title}
        </div>
        <div id={descId} className="together-card__desc" aria-hidden={!expanded}>
          {desc}
        </div>
      </div>
    </li>
  );
}

export default TogetherSection;
