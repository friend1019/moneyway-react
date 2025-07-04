import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../../css/main/Slider.css';
import LeftArrowIcon from '../../images/main/left-arrow.svg';
import RightArrowIcon from '../../images/main/right-arrow.svg';

const ANIMATION_DURATION = 300; 

const HorizontalSlider = ({ children }) => {
  const scrollRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const animatingRef = useRef(false);

  const cardsArray = React.Children.toArray(children.props.children);
  const totalCards = cardsArray.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const BAR_WIDTH = containerWidth / totalCards;

  useEffect(() => {
    if (
      !listRef.current ||
      !listRef.current.children ||
      !listRef.current.children[0]
    ) return;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [totalCards]);

  const animateTo = useCallback((targetPosition) => {
    if (!scrollRef.current || animatingRef.current) return;
    animatingRef.current = true;

    const el = scrollRef.current;
    let start = el.scrollLeft;
    let startTime = null;

    function animStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / ANIMATION_DURATION, 1);
      const easeOutQuad = p => p * (2 - p);

      el.scrollLeft = start + (targetPosition - start) * easeOutQuad(progress);

      if (progress < 1) {
        requestAnimationFrame(animStep);
      } else {
        animatingRef.current = false;
      }
    }
    requestAnimationFrame(animStep);
  }, []);

  useEffect(() => {
    if (
      !listRef.current ||
      !listRef.current.children ||
      !listRef.current.children[0] ||
      !scrollRef.current
    ) return;
    const cardW = listRef.current.children[0].offsetWidth;
    const targetPosition = cardW * currentIndex;
    animateTo(targetPosition);
  }, [currentIndex, totalCards, animateTo]);

  const handleArrowClick = (direction) => {
    if (animatingRef.current) return;
    if (direction === 'left') {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    } else {
      setCurrentIndex(prev => Math.min(prev + 1, totalCards - 1));
    }
  };

  return (
    <div className="horizontal-slider-root">
      <div
        className="scroll-wrapper"
        ref={scrollRef}
        style={{ overflowX: 'hidden', scrollBehavior: 'auto' }}
      >
        <div className={children.props.className} ref={listRef}>
          {cardsArray}
        </div>
      </div>
      <div className="controls-container">
        <button
          className="arrow-button left"
          onClick={() => handleArrowClick('left')}
          disabled={currentIndex === 0}
        >
          <img src={LeftArrowIcon} alt="왼쪽" />
        </button>
        <div
          className="progress-bar-container"
          ref={containerRef}
          style={{ width: '30vw' }}
        >
          <div
            className="progress-bar-fill"
            style={{
              width: BAR_WIDTH,
              left: totalCards <= 1
              ? 0
              : `${(currentIndex / (totalCards - 1)) * (containerWidth - BAR_WIDTH)}px`,
              transition: `left ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />
        </div>
        <button
          className="arrow-button right"
          onClick={() => handleArrowClick('right')}
          disabled={currentIndex === totalCards - 1}
        >
          <img src={RightArrowIcon} alt="오른쪽" />
        </button>
      </div>
    </div>
  );
};

export default HorizontalSlider;
