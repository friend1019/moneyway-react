import api from "./axios.js";
import noImage from "../images/planning/noImage.svg";

// 유효한 제주도 좌표인지 확인
export const isValidJejuCoordinate = (lat, lng) => {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= 33.0 &&
    lat <= 34.0 &&
    lng >= 126.0 &&
    lng <= 127.0
  );
};

// 명세서에 맞는 카테고리 매핑
export const getCategoryFromName = (name) => {
  const mapping = {
    식당: "RESTAURANT",
    카페: "CAFE",
    숙소: "ACCOMMODATION",
    관광지: "TOURIST_ATTRACTION",
    "액티비티/체험": "ACTIVITY",
    쇼핑: "SHOPPING",
  };
  return mapping[name] || "ETC";
};

// 공통 응답 → 프론트에서 사용할 형식으로 변환
export const mapPlace = (item) => {
  const lat = Number(item.latitude);
  const lng = Number(item.longitude);

  // if (!isValidJejuCoordinate(lat, lng)) return null;

  return {
    placeId: item.placeId,
    title: item.title,
    category: getCategoryFromName(item.categoryName),
    categoryName: item.categoryName,
    address: item.address,
    priceInfo: item.priceInfo,
    imageUrls:
      item.imageUrls?.length > 0
        ? item.imageUrls
        : item.thumbnailUrl
        ? [item.thumbnailUrl]
        : [noImage],
    latitude: lat,
    longitude: lng,
    description: item.description || "",
    menu: item.menu || "",
  };
};

// ✅ 1. 카테고리별 조회 (with page)
export const getPlacesByCategory = async (category) => {
  try {
    const { data } = await api.get(`/places`, {
      params: {
        category,
        size: 500, // ✅ 여기를 꼭 명시
      },
    });
    return Array.isArray(data.content)
      ? data.content.map(mapPlace).filter(Boolean)
      : [];
  } catch (err) {
    console.error(`❌ 카테고리(${category}) 조회 실패:`, err);
    return [];
  }
};

// ✅ 2. 단건 조회
export const getPlaceById = async (placeId) => {
  try {
    const { data } = await api.get(`/places/${placeId}`);
    return mapPlace(data) || null;
  } catch (err) {
    console.error(`❌ 장소(${placeId}) 상세 조회 실패:`, err);
    return null;
  }
};

// ✅ 3. 키워드 검색 (with page)
export const searchPlacesByKeyword = async (keyword, page = 1) => {
  try {
    const { data } = await api.get(`/places/search`, {
      params: { keyword, page },
    });
    return Array.isArray(data.content)
      ? data.content.map(mapPlace).filter(Boolean)
      : [];
  } catch (err) {
    console.error(`❌ 키워드(${keyword}) 검색 실패:`, err);
    return [];
  }
};
