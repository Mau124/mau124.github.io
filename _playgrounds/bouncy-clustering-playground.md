---
layout: playgrounds
custom_js:
  - bouncy-clustering
---
<style>
/* 1. Use a wrapper to center the dashboard without touching 'body' */
.ksmp-playground-wrapper {
    display: flex;
    justify-content: center;
    padding: 40px 0;
    background-color: #f5f7fa; /* Only applies to this area */
    width: 100%;
}

/* 2. Nest all styles inside the container to prevent global leakage */
.dashboard-container {
    display: flex; 
    height: 800px;
    width: fit-content;
    background-color: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    font-family: 'Segoe UI', Roboto, sans-serif; /* Keep font localized */
}

/* All child elements are now scoped */
.dashboard-container .sidebar {
    width: 250px;
    background-color: #ffffff;
    padding: 30px 20px;
    border-right: 1px solid #e1e4e8;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.dashboard-container h2 {
    color: #2c3e50;
    font-size: 1.1rem !important; /* !important ensures blog styles don't override */
    margin: 0 0 20px 0 !important;
    border-bottom: 2px solid #3a7bd5;
    padding-bottom: 10px;
    text-transform: none;
}

.dashboard-container label { 
    font-size: 0.75rem; 
    font-weight: 600;
    margin-top: 20px; 
    color: #64748b;
    text-transform: uppercase;
    display: block;
}

.dashboard-container input, 
.dashboard-container select {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    color: #334155;
    padding: 10px;
    margin-top: 8px;
    border-radius: 6px;
    font-size: 0.9rem;
}

.dashboard-container button {
    margin-top: auto;
    padding: 14px;
    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
    border: none;
    color: white !important;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
}

.dashboard-container button:hover {
    filter: brightness(1.05);
}

.dashboard-container #canvas-container {
    background: #ffffff;
    width: 800px;  
    height: 800px;
    display: flex;
}
</style>

<div class="ksmp-playground-wrapper">
    <div class="dashboard-container">
        <div class="sidebar">
            <h2>Bouncy Clustering</h2>
            
            <label>Dataset Type</label>
            <select id="datasetSelect">
                <option value="Circles">Circles</option>
                <option value="Moons">Moons</option>
                <option value="Blobs">Blobs</option>
                <option value="Aniso">Anisotropic</option>
                <option value="Varied">Varied Variance</option>
                <option value="No Structure">No Structure</option>
            </select>

            <label>Number of samples</label>
            <input type="number" id="samplesInput" value="4000">

            <label>Number Particles</label>
            <input type="number" id="particlesInput" value="500">

            <label>Number of Walls</label>
            <input type="number" id="wallsInput" value="1000">

            <button id="runBtn">Reset & Run</button>
        </div>

        <div id="canvas-container"></div>
    </div>
</div>