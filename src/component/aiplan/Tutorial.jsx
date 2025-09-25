import React, { useState, useEffect } from 'react';
import '../../css/aiplan/Tutorial.css'; 

import tutorial1 from '../../images/tutorial/tutorial1.svg';
import tutorial2 from '../../images/tutorial/tutorial2.svg';
import tutorial3 from '../../images/tutorial/tutorial3.svg';
import tutorial4 from '../../images/tutorial/tutorial4.svg';
import tutorial5 from '../../images/tutorial/tutorial5.svg';
import tutorial6 from '../../images/tutorial/tutorial6.svg';
import tutorial7 from '../../images/tutorial/tutorial7.svg';
import tutorial8 from '../../images/tutorial/tutorial8.svg';

const tutorialImages = [tutorial1, tutorial2, tutorial3, tutorial4, tutorial5, tutorial6, tutorial7, tutorial8];

const Tutorial = () => { 
    const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTutorialIndex(prevIndex => (prevIndex + 1) % tutorialImages.length);
        }, 3000);

    
        return () => clearInterval(interval);
    }, []); 

    return (
        <div className="tutorial-container">
            <p>계획 생성중...<br/>Tip: 머니웨이 튜토리얼을 확인하세요</p>

            <div className="tutorial-image-wrapper">
                <img
                    src={tutorialImages[currentTutorialIndex]}
                    alt={`튜토리얼 ${currentTutorialIndex + 1}`}
                    className="tutorial-image"
                />
            </div>

            <div className="pagination-dots">
                {tutorialImages.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentTutorialIndex ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tutorial;