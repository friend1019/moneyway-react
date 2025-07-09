import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../../css/main/BudgetSlider.css';

const BudgetSlider = ({ budget, setBudget }) => {

  const formatNumber = (num) => {
    if (isNaN(num) || num === null) return '0';
    return num.toLocaleString('ko-KR');
  };

  const handleInputChange = (e, index) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    let numValue = Number(cleanedValue);

    const MAX_BUDGET = 5000000;
    if (numValue > MAX_BUDGET) {
      numValue = MAX_BUDGET;
    }
    
    if (isNaN(numValue)) {
      return;
    }

    const newBudget = [...budget];
    newBudget[index] = numValue;
    
    if (index === 0 && newBudget[0] > newBudget[1]) {
      newBudget[1] = newBudget[0];
    }

    if (index === 1 && newBudget[1] < newBudget[0]) {
      newBudget[0] = newBudget[1];
    }

    setBudget(newBudget);
  };

  return (
    <div className="budget-container">
      <div className="budget-values">
        ₩ {formatNumber(budget[0])} ~ {formatNumber(budget[1])}
      </div>

      <Slider
        range
        min={0}
        max={5000000}
        step={10000}
        value={budget}
        onChange={(newBudget) => setBudget(newBudget)}
        trackStyle={[{ backgroundColor: '#2176ff' }]}
        handleStyle={[
          { borderColor: '#2176ff', backgroundColor: 'white', borderWidth: 2 },
          { borderColor: '#2176ff', backgroundColor: 'white', borderWidth: 2 }
        ]}
        railStyle={{ backgroundColor: '#e9e9e9' }}
      />
      <div className="budget-inputs">
        <div className="budget-input-wrapper">
          <label>최소 금액</label>
          <input
            type="text"
            inputMode="decimal"
            className="budget-input"
            value={formatNumber(budget[0])}
            onChange={(e) => handleInputChange(e, 0)}
          />
        </div>
        <span className="budget-dash">-</span>
        <div className="budget-input-wrapper">
          <label>최대 금액</label>
          <input
            type="text"
            inputMode="decimal"
            className="budget-input"
            value={formatNumber(budget[1])}
            onChange={(e) => handleInputChange(e, 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetSlider;