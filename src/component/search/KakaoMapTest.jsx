// KakaoMapTest.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Header from '../Header';
import '../../css/search/KakaoMapTest.css';
import PlaceListView from './PlaceListView';
import PlaceDetailView from './PlaceDetailView';
import SearchPlaceBox from './SearchPlaceBox';
import FilterModal from './FilterModal';
import CategorySelector from './CategorySelector';
import SearchInput from './SearchInput';
import { fetchJejuPlacesByCategory } from '../../api/visitJejuApi';

const CATEGORY_MAP = {
  식당: 'RESTAURANT',
  카페: 'RESTAURANT',
  관광지: 'ATTRACTION',
  액티비티: 'ACTIVITY',
  숙소: 'ACCOMMODATION',
};

const KakaoMapTest = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [category, setCategory] = useState('식당');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ category: '', subcategory: '' });
  const selectedInfoWindowRef = useRef(null);

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

  useEffect(() => {
    async function loadPlaces() {
      try {
        const categoryCode = CATEGORY_MAP[category];
        const items = await fetchJejuPlacesByCategory(categoryCode);
        const mapped = items
          .filter(i => i.latitude && i.longitude && !isNaN(Number(i.latitude)) && !isNaN(Number(i.longitude)))
          .map(i => ({
            contentId: i.contentId,
            title: i.title,
            category,
            address: i.address,
            rating: i.rating,
            imageUrls: i.imageUrls,
            latitude: Number(i.latitude),
            longitude: Number(i.longitude),
            phone: i.phone,
            overview: i.overview || i.introduction,
            tag: i.tag,
          }));

        const filtered = selectedFilters.subcategory
          ? mapped.filter(p => (p.tag || '').includes(selectedFilters.subcategory))
          : mapped;

        setPlaces(filtered);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    }
    loadPlaces();
  }, [category, selectedFilters]);

  const handlePlaceSelect = useCallback((place, marker = null) => {
    setSelectedPlace(place);
    if (!map || !place.latitude || !place.longitude) return;
    const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
    map.panTo(position);
    if (selectedInfoWindowRef.current) {
      selectedInfoWindowRef.current.close();
      selectedInfoWindowRef.current.setMap(null);
    }
    const targetMarker = marker || markers.find(m => m._placeId === place.contentId);
    if (!targetMarker) return;
    const infoHtml = `
      <div style="padding:8px; background:white; border:2px solid #2d6cff; border-radius:8px; min-width:150px;">
        ${place.imageUrls[0] ? `<img src="${place.imageUrls[0]}" alt="${place.title}" style="width:100%; height:80px; object-fit:cover; border-radius:4px;" />` : ''}
        <div style="margin-top:6px; font-size:14px; font-weight:bold; color:#2d6cff;">${place.title}</div>
      </div>
    `;
    const newInfoWindow = new window.kakao.maps.InfoWindow({
      content: infoHtml,
      disableAutoPan: true,
    });
    newInfoWindow.open(map, targetMarker);
    selectedInfoWindowRef.current = newInfoWindow;
  }, [map, markers]);

  useEffect(() => {
    if (!map || places.length === 0) return;
    markers.forEach(marker => marker.setMap(null));
    if (selectedInfoWindowRef.current) {
      selectedInfoWindowRef.current.close();
      selectedInfoWindowRef.current.setMap(null);
      selectedInfoWindowRef.current = null;
    }
    const newMarkers = places.map(place => {
      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      const marker = new window.kakao.maps.Marker({ position, map });
      const hoverInfoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:8px; background:white; border:1px solid #ccc; border-radius:8px; min-width:150px;">
            ${place.imageUrls[0] ? `<img src="${place.imageUrls[0]}" alt="${place.title}" style="width:100%; height:80px; object-fit:cover; border-radius:4px;" />` : ''}
            <div style="margin-top:6px; font-size:14px; font-weight:bold;">${place.title}</div>
          </div>
        `,
        disableAutoPan: true,
      });
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        if (!selectedPlace || selectedPlace.contentId !== place.contentId) {
          hoverInfoWindow.open(map, marker);
        }
      });
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        hoverInfoWindow.close();
      });
      window.kakao.maps.event.addListener(marker, 'click', () => {
        handlePlaceSelect(place, marker);
      });
      marker._placeId = place.contentId;
      return marker;
    });
    setMarkers(newMarkers);
    const bounds = new window.kakao.maps.LatLngBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
    map.setBounds(bounds);
  }, [places, map, markers, selectedPlace, handlePlaceSelect]);

  return (
    <>
      <div className="map-header">
        <Header />
      </div>
      <div className="map-container">
        <div className={`category-container ${selectedPlace ? 'detail-mode' : ''}`}>
          {selectedPlace ? (
            <PlaceDetailView place={selectedPlace} onBack={() => setSelectedPlace(null)} />
          ) : (
            <>
              <h1>
                <span className="highlight-blue">일정</span>을 추가하고<br />
                나만의 <span className="highlight-blue">계획</span>을 짜세요
              </h1>
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onFilterClick={() => setShowFilter(true)}
              />
              {searchTerm && (
                <SearchPlaceBox keyword={searchTerm} onSelect={handlePlaceSelect} />
              )}
              <CategorySelector
                category={category}
                setCategory={setCategory}
                categories={Object.keys(CATEGORY_MAP)}
              />
              <hr className="category-divider" />
              <div key={category} className="list-wrapper fade-in">
                <PlaceListView places={places} onSelect={place => handlePlaceSelect(place)} />
              </div>
            </>
          )}
        </div>
        <div className="map-canvas" ref={mapRef} />
      </div>

      {showFilter && (
        <FilterModal
          selected={selectedFilters}
          setSelected={setSelectedFilters}
          onApply={() => setShowFilter(false)}
          onClose={() => setShowFilter(false)}
        />
      )}
    </>
  );
};

export default KakaoMapTest;
