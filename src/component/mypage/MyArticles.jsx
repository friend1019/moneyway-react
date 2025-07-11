import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/mypage/MyArticles.css"; // 필요시 스타일 파일 추가
import LoadingSpinner from "../common/LoadingSpinner";

const MyArticles = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.get("/mypage/posts?page=0&size=10");
        setPosts(res.data.data.content);
      } catch (err) {
        console.error("내 글 목록 불러오기 실패:", err);
        alert("내가 작성한 글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <h2>내가 쓴 글</h2>
      {posts.length === 0 ? (
        <p>작성한 글이 없습니다.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.postId} className="post-item">
              <img src={post.thumbnailUrl} alt="썸네일" className="thumbnail" />
              <div className="info">
                <h3>{post.title}</h3>
                <p className="meta">
                  좋아요 {post.likeCount} · 댓글 {post.commentCount} · 스크랩{" "}
                  {post.scrapCount}
                </p>
                <p className="date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyArticles;
