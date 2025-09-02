// src/component/common/AppLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export default function AppLayout() {
  const location = useLocation();

  const updateHeaderHeight = React.useCallback(() => {
    // ✅ 헤더 컴포넌트의 루트 엘리먼트(.header)를 직접 측정
    const el = document.querySelector(".header");
    const h = el ? el.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  }, []);

  React.useLayoutEffect(() => {
    updateHeaderHeight();

    // 반응형/리사이즈 대응
    let ro;
    const el = document.querySelector(".header");
    if (window.ResizeObserver && el) {
      ro = new ResizeObserver(updateHeaderHeight);
      ro.observe(el);
    }
    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      if (ro) ro.disconnect();
    };
  }, [updateHeaderHeight]);

  // 라우트 이동 시 스크롤 상단 (선택)
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* ✅ 헤더는 고정(fixed) 그대로 사용 */}
      <Header />

      {/* ✅ 페이지 내용만 전환 + 헤더 높이만큼 padding-top 부여 */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            willChange: "opacity, transform",
            paddingTop: "var(--header-h, 10rem)", // 초기값 10rem fallback
            minHeight: "calc(100vh - var(--header-h, 10rem))",
          }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </>
  );
}
