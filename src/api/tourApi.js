const API_BASE = '/tour';
// 발급받은 서비스키 (URL 인코딩된 상태로 저장)
const SERVICE_KEY = process.env.REACT_APP_TOUR_API_KEY;
const MOBILE_APP = 'MyTourApp';
const MOBILE_OS = 'ETC';

/**
 * 공통 fetch 헬퍼
 */
async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    console.log('TourAPI raw response:', text);

    // XML 에러 응답 여부 확인
    if (text.trim().startsWith('<')) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const authMsg = xml.querySelector('returnAuthMsg')?.textContent;
        const errTag = xml.querySelector('errMsg')?.textContent;
        const errMsg = authMsg || errTag || 'UNKNOWN_ERROR';
        const reason = xml.querySelector('returnReasonCode')?.textContent || '';
        throw new Error(`TourAPI Error: ${errMsg}${reason ? ` (code ${reason})` : ''}`);
    }

    return JSON.parse(text);
}

/**
 * 지역기반 관광정보 목록 조회 (KorService2 areaBasedList1)
 */
export async function fetchPlacesByCategory(contentTypeId, page = 1, numOfRows = 10) {
    const url = `${API_BASE}/areaBasedList1?serviceKey=${SERVICE_KEY}` +
        `&MobileApp=${encodeURIComponent(MOBILE_APP)}` +
        `&MobileOS=${MOBILE_OS}` +
        `&arrange=A&listYN=Y&contentTypeId=${contentTypeId}` +
        `&_type=json&pageNo=${page}&numOfRows=${numOfRows}`;
    const json = await fetchJson(url);
    return json.response?.body?.items?.item || [];
}

/**
 * 상세 관광정보 조회 (KorService2 detailCommon1)
 */
export async function fetchPlaceDetail(contentId) {
    const url = `${API_BASE}/detailCommon1?serviceKey=${SERVICE_KEY}` +
        `&MobileApp=${encodeURIComponent(MOBILE_APP)}` +
        `&MobileOS=${MOBILE_OS}` +
        `&contentId=${contentId}&defaultYN=Y&addrinfoYN=Y&overviewYN=Y` +
        `&_type=json&pageNo=1&numOfRows=1`;
    const json = await fetchJson(url);
    return json.response?.body?.items?.item?.[0] || {};
}
