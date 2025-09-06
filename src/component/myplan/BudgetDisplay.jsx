import React from 'react';
import '../../css/myplan/BudgetDisplay.css';

const BudgetDisplay = ({
  usedBudget,
  totalBudget,
  isEditMode,
  isEditingBudget,
  onBudgetClick,
  onBudgetChange,
  onBudgetBlur,
  onBudgetKeyDown,
  budgetInput,
}) => {
  const isOverBudget = totalBudget > 0 && usedBudget > totalBudget;
  const overAmount = usedBudget - totalBudget;
  const progressPercent = totalBudget > 0 ? Math.min(100, (usedBudget / totalBudget) * 100) : 0;
  
  // 말풍선 위치 계산 (프로그레스 바 끝점에 위치)
  const bubblePosition = Math.min(96, Math.max(4, progressPercent)); // 4%~96% 사이로 제한

  return (
    <div className='plan-budget-right'>
      {/* 사용 예산 말풍선 */}
      <div className="budget-bubble-container">
        <div 
          className={`budget-bubble ${isOverBudget ? 'over-budget' : ''}`}
          style={{ left: `${bubblePosition}%` }}
        >
          ₩{usedBudget.toLocaleString()}
          <div className="bubble-arrow"></div>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className={`budget-progress-bar ${isOverBudget ? 'over' : ''}`}>
        <div
          className={`budget-progress-fill ${isOverBudget ? 'over' : ''}`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* 예산 정보 */}
      <div className='total-budget'>
        <span>예산</span>
        {isEditMode && isEditingBudget ? (
          <input
            type="number"
            value={budgetInput}
            onChange={onBudgetChange}
            onBlur={onBudgetBlur}
            onKeyDown={onBudgetKeyDown}
            className="budget-input"
            autoFocus
          />
        ) : (
          <span
            onClick={isEditMode ? onBudgetClick : undefined}
            className={isEditMode ? 'budget-amount-clickable' : ''}
          >
            ₩{totalBudget.toLocaleString()}
          </span>
        )}
      </div>

      {/* 초과 시 경고 메시지 */}
      {isOverBudget && (
        <div className="budget-over-alert">
          ⚠️ ₩{overAmount.toLocaleString()} 초과되었습니다.
        </div>
      )}
    </div>
  );
};

export default BudgetDisplay;