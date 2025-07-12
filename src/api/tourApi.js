import api from "./axios.js";

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

export const getCategoryFromCat1 = (cat1) => {
  const mapping = {
    A01: "ATTRACTION",
    A02: "ATTRACTION",
    A03: "ACTIVITY",
    A04: "SHOPPING",
    A05: "RESTAURANT",
    B02: "ACCOMMODATION",
  };
  return mapping[cat1] || null;
};

export const mapTourPlace = (item) => {
  const lat = Number(item.mapy);
  const lng = Number(item.mapx);
  if (!isValidJejuCoordinate(lat, lng)) return null;

  return {
    contentId: item.contentid,
    title: item.title,
    category: getCategoryFromCat1(item.cat1),
    address: item.addr1,
    rating: null,
    imageUrls: item.firstimage ? [item.firstimage] : [],
    latitude: lat,
    longitude: lng,
    phone: item.tel || "",
    overview: item.overview || "",
    useTime: item.useTime || null,
    sigungucode: item.sigungucode || null,
    price: item.price2 ? Number(item.price2) : 0,
    infotext: item.infotext || null,
    tag: null,
  };
};

// 전체 관광지
export const getAllTourPlaces = async () => {
  try {
    const { data } = await api.get("/tour/places");
    return data.map(mapTourPlace).filter(Boolean);
  } catch (err) {
    console.error("❌ 전체 관광지 가져오기 실패:", err);
    return [];
  }
};

// ID로 상세 조회
export const getTourPlaceById = async (contentId) => {
  try {
    const { data } = await api.get(`/tour/places/${contentId}`);
    return mapTourPlace(data) || null;
  } catch (err) {
    console.error(`❌ 관광지(${contentId}) 상세 실패:`, err);
    return null;
  }
};

// 단일 카테고리 조회
export const getTourPlacesByCategory = async (cat1) => {
  try {
    const { data } = await api.get(`/tour/places?cat1=${cat1}`);
    return data.map(mapTourPlace).filter(Boolean);
  } catch (err) {
    console.error(`❌ 카테고리(${cat1}) 조회 실패:`, err);
    return [];
  }
};

// 복수 카테고리 조회
export const getTourPlacesByCat1Array = async (cat1Array) => {
  try {
    const all = await Promise.all(cat1Array.map(getTourPlacesByCategory));
    return all.flat();
  } catch (err) {
    console.error(`❌ 복수 카테고리(${cat1Array}) 실패:`, err);
    return [];
  }
};

// 키워드 검색
export const searchTourPlaces = async (keyword) => {
  try {
    const { data } = await api.get(
      `/search?keyword=${encodeURIComponent(keyword)}`
    );
    return Array.isArray(data) ? data.map(mapTourPlace).filter(Boolean) : [];
  } catch (err) {
    console.error(`❌ 키워드(${keyword}) 검색 실패:`, err);
    return [];
  }
};
