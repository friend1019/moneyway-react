import React, { useState } from 'react';
import '../../css/myplan/TimeSelectionModal.css';

const TimeSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  category,
  step = 'start' // 'start' 또는 'end'
}) => {
  const [selectedTime, setSelectedTime] = useState('14:00'); // 기본값 오후 2:00

  if (!isOpen) return null;

  // 시간 옵션들 (30분 단위)
  const timeOptions = [];
  for (let h = 8; h < 23; h++) {
    timeOptions.push(`${String(h).padStart(2, '0')}:00`);
    timeOptions.push(`${String(h).padStart(2, '0')}:30`);
  }

  const handleConfirm = () => {
    onConfirm(selectedTime);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const title = step === 'start' ? '시작 시간을 선택해주세요' : '종료 시간을 선택해주세요';
  const subtitle = step === 'start' 
    ? '입력된 시간에 맞춰 일정이 시간표에 추가됩니다'
    : '입력된 시간에 맞춰 일정의 시간표에 추가됩니다';

  return (
    <div className="time-modal-overlay" onClick={handleBackdropClick}>
      <div className="time-modal-container">
        <div className="time-modal-header">
          <div className="activity-badge">
            <span className="activity-icon">🌿</span>
            <span className="activity-text">액티비티</span>
            <span className="activity-category">[{category}]</span>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="time-modal-content">
          <h2 className="time-modal-title">{title}</h2>
          <p className="time-modal-subtitle">{subtitle}</p>
          
          <div className="time-selection-area">
            <div className="time-options">
              {timeOptions.map(time => (
                <button
                  key={time}
                  className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {step === 'start' ? '시작' : '종료'} {time}
                </button>
              ))}
            </div>
          </div>
          
          <button className="confirm-button" onClick={handleConfirm}>
            {step === 'start' ? '다음' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelectionModal;