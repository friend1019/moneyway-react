import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/community/PostDetail.css";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentAlt,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

// 날짜 배열 → "YYYY.MM.DD HH:mm" 포맷
const formatDateTime = (arr) => {
  if (!Array.isArray(arr) || arr.length < 6) return "";
  const [year, month, day, hour, minute] = arr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}.${pad(month)}.${pad(day)} ${pad(hour)}:${pad(minute)}`;
};

const PostListForm = ({ sort = "LATEST", filter = "ALL" }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // ✅ 챌린지 필터 파라미터 제거
        const params = { sort };

        const res = await api.get("/posts", { params });
        const parsedPosts = (res.data?.content || []).map((p) => ({
          ...p,
          isLiked: p.liked,
          isScrapped: p.scrapped,
          isMine: p.mine,
          // ✅ isChallenge 매핑 삭제
        }));

        setPosts(parsedPosts);
      } catch (err) {
        console.error("게시글 목록 조회 실패:", err);
        toast.error("게시글 목록을 불러오지 못했습니다.");
      }
    };

    fetchPosts();
  }, [sort, filter]); // filter prop은 그대로 두되, 챌린지 분기는 사용 안 함

  const handleToggleLike = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/posts/${postId}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.postId === postId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error("좋아요 실패:", err);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  const handleToggleScrap = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/posts/${postId}/scrap`);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.postId === postId
            ? {
                ...p,
                isScrapped: !p.isScrapped,
                scrapCount: p.isScrapped ? p.scrapCount - 1 : p.scrapCount + 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error("스크랩 실패:", err);
      toast.error("스크랩 처리에 실패했습니다.");
    }
  };

  return (
    <div className="post-detail-container-all">
      {posts.map((post) => (
        <Link
          to={`/posts/${post.postId}`}
          key={post.postId}
          className="post-detail-container post-list-card"
        >
          <div className="post-header">
            <div className="writer-info">
              <img src={post.writerInfo.profileImageUrl} alt="profile" />
              <div className="writer-meta">
                <div className="writer-line">
                  <span className="nickname">{post.writerInfo.nickname}</span>
                  <span className="created-at">
                    {formatDateTime(post.createdAt)}
                  </span>
                  {/* ✅ 챌린지 배지 완전 제거 */}
                </div>
              </div>
            </div>

            {post.totalCost != null && post.totalCost > 0 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
              >
                <span className="budget-label">여행 예산</span>
                <div className="budget">
                  ₩ {post.totalCost.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <h1 className="post-title">{post.title}</h1>

          <div className="post-content">{post.content}</div>

          <div className="post-images">
            {post.thumbnailUrl && <img src={post.thumbnailUrl} alt="썸네일" />}
          </div>

          <div className="post-actions">
            <button
              type="button"
              className="icon-group"
              onClick={(e) => handleToggleLike(e, post.postId)}
            >
              {post.isLiked ? (
                <FaHeart className="icon liked" />
              ) : (
                <FaRegHeart className="icon" />
              )}
              {post.likeCount}
            </button>
            <button
              type="button"
              className="icon-group"
              style={{ cursor: "default" }}
            >
              <FaRegCommentAlt className="icon" />
              {post.commentCount}
            </button>

            <button
              type="button"
              className="icon-group"
              onClick={(e) => handleToggleScrap(e, post.postId)}
            >
              {post.isScrapped ? (
                <FaBookmark className="icon scrapped" />
              ) : (
                <FaRegBookmark className="icon" />
              )}
              {post.scrapCount}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostListForm;
