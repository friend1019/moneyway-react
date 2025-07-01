const BASE_URL = 'https://api.visitjeju.net/vsjApi/contents/searchList';
const API_KEY = process.env.REACT_APP_JEJU_API_KEY;

/**
 * 공통 fetch 헬퍼
 */
async function fetchJejuData(params = {}) {
  const query = new URLSearchParams({
    apiKey: API_KEY,
    locale: 'kr',
    page: 1,
    pageSize: 10,
    ...params,
  });

  const res = await fetch(`${BASE_URL}?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json;
}

/**
 * 카테고리별 장소 목록 조회
 * @param {string} category - 예: 'restaurant', 'activity'
 */
const CATEGORY_MAP = {
  restaurant: 'c4',
  cafe: 'c4',      // VisitJeju 기준 카페도 음식점
  activity: 'c5',
  attraction: 'c1',
  hotel: 'c3',
  shopping: 'c2',
};

export async function fetchJejuPlacesByCategory(category) {
  const mappedCategory = CATEGORY_MAP[category.toLowerCase()];
  if (!mappedCategory) {
    console.warn(`Unknown category: ${category}`);
    return [];
  }

  const json = await fetchJejuData({ category: mappedCategory });

  return (json.items || []).map(item => ({
    contentId: item.contentsid,
    title: item.title,
    address: item.address || item.roadaddress,
    imageUrls: item.repPhoto?.photoid?.imgpath ? [item.repPhoto.photoid.imgpath] : [],
    latitude: item.latitude,
    longitude: item.longitude,
    rating: Math.round(Math.random() * 5), // 임시 평점
    tag: item.tag || item.alltag || '',
    overview: item.introduction || '',
    phone: item.phoneno || '',
  }));
}
