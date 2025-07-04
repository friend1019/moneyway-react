import api from './axios.js';

// ✅ 제주도 내 좌표 범위 확인 함수
const isValidJejuCoordinate = (lat, lng) => {
    return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= 33.0 && lat <= 34.0 &&
        lng >= 126.0 && lng <= 127.0
    );
};

// ✅ cat1 값을 category 이름으로 변환
const getCategoryFromCat1 = (cat1) => {
    if (cat1 === 'A01' || cat1 === 'A02') return 'ATTRACTION';
    if (cat1 === 'A03') return 'ACTIVITY';
    if (cat1 === 'A04') return 'SHOPPING';
    if (cat1 === 'A05') return 'RESTAURANT';
    if (cat1 === 'B02') return 'ACCOMMODATION';
    return null;
};

// ✅ 공통: 관광지 1개 객체를 프론트에서 사용할 형태로 가공
const mapTourPlace = (i) => {
    const lat = Number(i.mapy);
    const lng = Number(i.mapx);
    if (!isValidJejuCoordinate(lat, lng)) return null;

    return {
        contentId: i.contentid,
        title: i.title,
        category: getCategoryFromCat1(i.cat1),
        address: i.addr1,
        rating: null, // 추후 추가 가능
        imageUrls: i.firstimage ? [i.firstimage] : [],
        latitude: lat,
        longitude: lng,
        phone: i.tel,
        overview: i.overview,
        useTime: i.useTime,
        sigungucode: i.sigungucode,
        tag: null, // 필터용 태그 등 필요시 사용
    };
};

// ✅ 전체 관광지 가져오기
export const getAllTourPlaces = async () => {
    try {
        const response = await api.get('/tour/places');
        const items = response.data;

        return items.map(mapTourPlace).filter(Boolean);
    } catch (error) {
        console.error('제주 관광지 가져오기 실패:', error);
        return [];
    }
};

// ✅ 관광지 상세 정보 (ID 기반)
export const getTourPlaceById = async (contentId) => {
    try {
        const response = await api.get(`/tour/places/${contentId}`);
        return response.data;
    } catch (error) {
        console.error(`관광지(${contentId}) 상세 정보 불러오기 실패:`, error);
        return null;
    }
};

// ✅ 단일 카테고리(cat1)로 관광지 필터링 (가공 포함)
export const getTourPlacesByCategory = async (cat1) => {
    try {
        const response = await api.get(`/tour/places?cat1=${cat1}`);
        const items = response.data;
        return items.map(mapTourPlace).filter(Boolean);
    } catch (error) {
        console.error(`카테고리(${cat1})로 관광지 필터 실패:`, error);
        return [];
    }
};

// ✅ 여러 cat1 값을 받아 병렬 호출 후 결과 합치기
export const getTourPlacesByCat1Array = async (cat1Array) => {
    try {
        const results = await Promise.all(
            cat1Array.map(cat1 => getTourPlacesByCategory(cat1))
        );
        return results.flat();
    } catch (error) {
        console.error(`다중 카테고리(${cat1Array}) 불러오기 실패:`, error);
        return [];
    }
};

// ✅ 키워드 검색 (가공 포함)
export const searchTourPlaces = async (keyword) => {
    try {
        const response = await api.get(`/tour/places/search?keyword=${encodeURIComponent(keyword)}`);
        const items = response.data;
        return items.map(mapTourPlace).filter(Boolean);
    } catch (error) {
        console.error('관광지 검색 실패:', error);
        return [];
    }
};
