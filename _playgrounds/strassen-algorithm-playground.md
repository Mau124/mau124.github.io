---
layout: playgrounds
custom_js:
  - strassen-algo
---
<style>
  .matrix-wrapper {
    display: flex;
    align-items: flex-start; /* Aligns them at the top */
    justify-content: center;
    gap: 30px;
    margin-top: 30px;
  }

  .matrix-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 150px;
  }

  .matrix-section h3 {
    margin-bottom: 15px;
    height: 30px; 
  }

  .controls {
    margin-top: 15px;
    text-align: center;
    min-height: 50px;
  }

  .helper-text {
    font-size: 0.75rem;
    color: #666;
    display: block;
    margin-top: 4px;
  }

  .matrix-grid {
    display: grid;
    gap: 5px;
    padding: 10px 15px;
    border-left: 3px solid #333;
    border-right: 3px solid #333;
    border-radius: 10px;
    background: #f9f9f9;
  }

  .matrix-input {
    width: 45px;
    height: 35px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  .matrix-operator {
    font-size: 2.5rem;
    font-weight: bold;
    align-self: center; 
    margin-top: -20px; 
    color: #333;
    padding: 0 10px;
  }

  .calc-btn {
    margin: 20px 0;
    padding: 10px 25px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .gen-btn {
    margin: 20px 0;
    padding: 10px 25px;
    background: #1b9bdf;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .result-grid {
    border-color: #4CAF50;
    min-height: 40px;
  }

  .invalid-input {
    border: 2px solid #ff4d4d !important;
    background-color: #fff2f2;
    outline: none;
  }

  .error-text {
    color: #ff4d4d;
    font-size: 0.8rem;
    display: block;
    margin-top: 5px;
    height: 1rem; /* Prevents layout jumping */
    font-weight: bold;
  }

  .steps-section {
    margin-top: 30px;
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border: 1px solid #eee;
  }

  .steps-section h3 {
    margin-top: 0;
    color: #333;
    font-size: 1.2rem;
    border-bottom: 2px solid #4CAF50;
    display: inline-block;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  .steps-block {
    height: 250px; /* Fixed height for the scroll */
    overflow-y: auto;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #444;
    border: 1px inset #eee;
  }

  /* Custom Scrollbar for a Modern Look */
  .steps-block::-webkit-scrollbar {
    width: 8px;
  }

  .steps-block::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .steps-block::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }

  .steps-block::-webkit-scrollbar-thumb:hover {
    background: #4CAF50;
  }

  /* Style for individual step lines */
  .step-line {
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #eef0f2;
  }
  
  .step-highlight {
    color: #4CAF50;
    font-weight: bold;
  }
</style>

<div class="matrix-wrapper">
  <div class="matrix-section">
    <h3>Matrix A</h3>
    <div id="matrix-A-container" class="matrix-grid"></div>
    <div class="controls">
      <input type="number" id="rowsA" value="2" min="1" max="16" oninput="validatePowerOfTwo(this)"> x 
      <input type="number" id="colsA" value="2" min="1" max="16" disabled>
    </div>
    <span id="error-msg" class="error-text"></span>
  </div>

  <div class="matrix-operator">×</div>

  <div class="matrix-section">
    <h3>Matrix B</h3>
    <div id="matrix-B-container" class="matrix-grid"></div>
    <div class="controls">
      <input type="number" id="rowsB" value="2" min="1" max="16" disabled> x 
      <input type="number" id="colsB" value="2" min="1" max="16" disabled>
    </div>
  </div>
</div>

<div class="result-section">
  <button onclick="calculateProduct()" class="calc-btn">Multiply Using Strassen's Algorithm</button>
  <button onclick="updateGrids()" class="gen-btn">Generate Random Values</button>
  <h3>Result</h3>
  <div id="matrix-res-container" class="matrix-grid result-grid"></div>
</div>

<div class="steps-section">
  <h3>Steps</h3>
  <div id="status-log" class="steps-block"></div>
</div>

[Notes Regarding Strassen's Algorithm](/notes/algorithms/2026-03-01-strassen-algorithm/)