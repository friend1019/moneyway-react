import React, { useEffect, useRef } from "react";
import Header from "./Header";
import "../css/KakaoMapTest.css";
import Filter from "../images/planning/filter.svg";
import SearchIcon from "../images/planning/search.svg";

const KakaoMap = () => {
    const mapRef = useRef(null); // 지도를 표시할 div 참조

    useEffect(() => {
        // 카카오 지도 API가 로딩되어 있는지 확인 후 실행
        if (!window.kakao) {
            console.error("카카오 지도 API가 로딩되지 않았습니다.");
            return;
        }

        // 스크립트에서 kakao.maps를 로드한다
        window.kakao.maps.load(() => {
            const container = mapRef.current; // 지도 담을 DOM
            const options = {
                center: new window.kakao.maps.LatLng(33.4839982207, 126.4895708953),
                level: 8, // 확대 레벨
            };

            // 지도 생성
            const map = new window.kakao.maps.Map(container, options);

            // 마커 표시
            const markerPosition = new window.kakao.maps.LatLng(33.4839982207, 126.4895708953);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
            });
            marker.setMap(map);
        });
    }, []);

    return (
        <>
            <div className="map-header">
                <Header />
            </div>
            <div className="map-container">
                <div className="category-container">
                    <h1>
                        <span className="highlight-blue">일정</span>을 추가하고<br />
                        나만의 <span className="highlight-blue">계획</span>을 짜세요
                    </h1>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="장소, 액티비티 등을 검색하세요"
                            aria-label="검색창"
                        />

                        <button
                            type="button"
                            className="search-button"
                            aria-label="검색"
                        >
                            <img src={SearchIcon} alt="검색" className="search-icon" />
                        </button>

                        <button className="filter-btn">
                            <img src={Filter} alt="필터" style={{ width: "5rem", height: "5rem" }} />
                        </button>
                    </div>

                    <p style={{ fontSize: "1.6rem", marginTop: "3rem", color: "#7F7F7F" }}>무엇을 찾고 계시나요?</p>

                    <div className="category-buttons">
                        {["식당", "카페", "관광지", "액티비티"].map((cat) => (
                            <button key={cat} className="category-btn">{cat}</button>
                        ))}
                    </div>

                    <div className="popular-search">
                        <h2>인기 검색어</h2>
                        <ul>
                            <li><strong>굴</strong></li>
                            <li><strong>해변</strong></li>
                            <li><strong>노을</strong></li>
                            <li><strong>해변</strong></li>
                        </ul>
                    </div>

                </div>
                <div className="map-container"
                    ref={mapRef}
                    style={{ width: "100%", height: "87.5rem" }} // 지도 크기 지정 필수
                />
            </div>
        </>

    );
};

export default KakaoMap;
