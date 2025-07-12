import React from 'react';
import PlaceCard from './PlaceCard';
import '../../css/search/PlaceListView.css';

const PlaceListView = ({ places, onSelect }) => (
  <div className="place-list">
    {places.map((place, idx) => (
      <PlaceCard key={idx} {...place} onClick={() => onSelect(place)} />
    ))}
  </div>
);
export default PlaceListView;
