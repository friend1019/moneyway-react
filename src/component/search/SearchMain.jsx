// ✅ SearchMain.jsx - 페이지네이션 적용 버전

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import "../../css/search/SearchMain.css";
import "../../css/search/list-wrapper-scroll.css";
import PlaceListView from "./PlaceListView";
import InfiniteScrollSentinel from "./InfiniteScrollSentinel";
import PlaceDetailView from "./PlaceDetailView";
import SearchPlaceBox from "./SearchPlaceBox";
import CategorySelector from "./CategorySelector";
import SearchInput from "./SearchInput";
import { getPlacesByCategory, searchPlacesByKeyword, isValidJejuCoordinate } from "../../api/tourApi";

const CATEGORY_MAP = {
  관광지: "TOURIST_ATTRACTION",
  액티비티: "ACTIVITY",
  식당: "RESTAURANT",
  카페: "CAFE",
  쇼핑: "SHOPPING",
  숙소: "ACCOMMODATION",
};

const SearchMain = () => {
  const mapRef = useRef(null);
  const clustererRef = useRef(null);
  const overlayRef = useRef(null);

  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultCategory = queryParams.get("category") || "숙소";
  const [category, setCategory] = useState(defaultCategory);

  const handlePlaceSelect = useCallback((place, showDetail = false) => {
    if (showDetail) {
      setSelectedPlace(place);
      return;
    }

    if (!map || !place.latitude || !place.longitude) return;

    const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
    map.setLevel(4);
    map.panTo(position);

    if (overlayRef.current) overlayRef.current.setMap(null);

    const content = document.createElement("div");
    content.className = "custom-overlay-card";
    content.innerHTML = `
      <div style="background:white; border-radius:8px; border:2px solid #2d6cff; padding:10px; width:180px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
        ${
          place.imageUrls?.[0]
            ? `<img src="${place.imageUrls[0]}" style="width:100%; height:80px; object-fit:cover; border-radius:4px;" />`
            : ""
        }
        <div style="margin-top:6px; font-size:14px; font-weight:bold; color:#2d6cff;">${place.title}</div>
        <button id="detail-btn" style="margin-top:8px; width:100%; background:#2d6cff; color:white; border:none; border-radius:4px; padding:6px 0; cursor:pointer;">
          자세히 보기
        </button>
      </div>
    `;

    const overlay = new window.kakao.maps.CustomOverlay({ position, content, yAnchor: 1 });
    overlay.setMap(map);
    overlayRef.current = overlay;

    setTimeout(() => {
      const btn = document.getElementById("detail-btn");
      if (btn) {
        btn.onclick = () => {
          setSelectedPlace(place);
          overlay.setMap(null);
        };
      }
    }, 0);
  }, [map]);

  const handleBack = () => {
    setSelectedPlace(null);
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }
  };

  useEffect(() => {
    if (!window.kakao) return;
    window.kakao.maps.load(() => {
      const mapInstance = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(33.3839982207, 126.5895708953),
        level: 9,
      });
      setMap(mapInstance);
    });
  }, []);

  const loadPlaces = useCallback(async (currentPage = 1) => {
    try {
      const categoryCode = CATEGORY_MAP[category];
      let data = await getPlacesByCategory(categoryCode, currentPage);
      if (category === "카페") {
        data = data.filter(
          (p) =>
            (p.title && p.title.includes("카페")) ||
            (p.description && p.description.includes("카페")) ||
            (p.menu && p.menu.includes("카페"))
        );
      }
      setPlaces((prev) => currentPage === 1 ? data : [...prev, ...data]);
      setHasMore(data.length >= 20);
    } catch (err) {
      console.error("카테고리별 관광지 로딩 실패:", err);
    }
  }, [category]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPlaces([]);
    loadPlaces(1);
  }, [category, loadPlaces]);

  useEffect(() => {
    if (!map || places.length === 0) return;

    if (clustererRef.current) clustererRef.current.clear();

    const newMarkers = places
      .filter((p) => isValidJejuCoordinate(p.latitude, p.longitude))
      .map((place) => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        const marker = new window.kakao.maps.Marker({ position });
        marker._placeData = place;
        window.kakao.maps.event.addListener(marker, "click", () => {
          handlePlaceSelect(place);
        });
        return marker;
      });

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      markers: newMarkers,
      gridSize: 60,
      averageCenter: true,
      minLevel: 7,
    });

    clustererRef.current = clusterer;

    const bounds = new window.kakao.maps.LatLngBounds();
    newMarkers.forEach((m) => bounds.extend(m.getPosition()));
    map.setBounds(bounds);
  }, [map, places, handlePlaceSelect]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const fetchSearch = async () => {
      const results = await searchPlacesByKeyword(searchTerm);
      setSearchResults(results);
    };

    fetchSearch();
  }, [searchTerm]);

  return (
    <>
      <div className="map-header">
        <Header />
      </div>
      <div className="map-container">
        <div className={`category-container ${selectedPlace ? "detail-mode" : ""}`}>
          {selectedPlace ? (
            <PlaceDetailView place={selectedPlace} onBack={handleBack} />
          ) : (
            <>
              <h1>
                <span className="highlight-blue">일정</span>을 추가하고
                <br />
                나만의 <span className="highlight-blue">계획</span>을 짜세요
              </h1>
              <div className="search-container">
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {searchTerm && (
                  <SearchPlaceBox
                    results={searchResults}
                    onSelect={(place) => handlePlaceSelect(place, true)}
                  />
                )}
              </div>
              <CategorySelector
                category={category}
                setCategory={setCategory}
                categories={Object.keys(CATEGORY_MAP)}
              />
              <hr className="category-divider" />
              <div key={category} className="list-wrapper fade-in">
                <PlaceListView
                  places={places}
                  onSelect={(place) => handlePlaceSelect(place, true)}
                />
                <InfiniteScrollSentinel
                  onIntersect={() => {
                    if (hasMore) {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      loadPlaces(nextPage);
                    }
                  }}
                  loading={false}
                  hasMore={hasMore}
                />
              </div>
            </>
          )}
        </div>
        <div className="map-canvas" ref={mapRef} />
      </div>
    </>
  );
};

export default SearchMain;
