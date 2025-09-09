import React, { useEffect, useState } from "react";
import "../../css/main/MainSlider.css";
import forthPanelSvg from "../../images/main/ForthPanel.png";
// ✅ 프로젝트 axios 인스턴스 경로에 맞춰 수정
import api from "../../api/axios.js";

export default function MainSlider() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get("/posts", { params: { page: 0, size: 60 } });
        const list = Array.isArray(res.data?.content)
          ? res.data.content
          : Array.isArray(res.data)
          ? res.data
          : [];

        const rankedTop3 = list
          .map((p) => ({
            ...p,
            _score: (p.likeCount ?? 0) * 2 + (p.scrapCount ?? 0),
          }))
          .sort((a, b) => b._score - a._score)
          .slice(0, 3) // ✅ 항상 3개만
          .map((p, idx) => ({
            id: p.postId ?? p.id ?? idx,
            title: p.title ?? "제목 없음",
            image: p.imageUrls?.[0] || p.thumbnailUrl || null,
            author:
              p.writerInfo?.nickname ||
              p.authorName ||
              p.nickname ||
              "커뮤니티",
          }));

        if (alive) setItems(rankedTop3);
      } catch (e) {
        console.error("추천 게시글 로드 실패:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="main-slider">
      {/* 좌측 고정 블럭 */}
      <div className="ms-left">
        <p className="ms-eyebrow">커뮤니티 Pick</p>
        <h3 className="ms-heading">
          지금 가장 <span className="ms-hot">‘HOT’</span>한 제주는?
        </h3>
        <div className="ms-illustration">
          <img src={forthPanelSvg} alt="말풍선 일러스트" loading="lazy" />
        </div>
      </div>

      {/* 우측 3칸 그리드 (정적) */}
      <div className="ms-right">
        <div className="ms-grid" role="list" aria-busy={loading ? "true" : "false"}>
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && items.length === 0 && (
            <>
              <EmptyCard />
              <EmptyCard />
              <EmptyCard />
            </>
          )}

          {!loading &&
            items.length > 0 &&
            items.map((it) => <ArticleCard key={it.id} item={it} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Presentational ---------- */
function ArticleCard({ item }) {
  const handleClick = () => {
    // 상세 페이지 경로 규칙에 맞춰 수정
    window.location.href = `/posts/${item.id}`;
  };

  return (
    <article className="ms-card" role="listitem" onClick={handleClick}>
      <div className="ms-card-media">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <div className="ms-card-fallback" aria-hidden />
        )}
        <div className="ms-card-gradient" />
      </div>

      <div className="ms-card-top">
        <div className="ms-avatar" aria-hidden />
        <span className="ms-author">{item.author}</span>
      </div>

      <h4 className="ms-card-title">{item.title}</h4>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="ms-card is-skeleton">
      <div className="ms-card-media">
        <div className="ms-skel media" />
      </div>
      <div className="ms-card-top">
        <div className="ms-skel avatar" />
        <div className="ms-skel name" />
      </div>
      <div className="ms-skel title" />
    </div>
  );
}

function EmptyCard() {
  return (
    <div className="ms-card is-empty">
      <div className="ms-empty">추천 게시글이 아직 없어요 🙏</div>
    </div>
  );
}
