function addLog(message) {
  const logEl = document.getElementById('status-log');

  logEl.innerHTML = `<div>${message}</div>` + logEl.innerHTML;
}

function strassenAlgo(matrixA, matrixB, n) {
    addLog("Enter to matrix multiplication with matrices of size: " + n);
    if(n <= 2) {
        let x1 = (matrixA[0][0] + matrixA[1][1]) * (matrixB[0][0] + matrixB[1][1]);
        let x2 = (matrixA[1][0] + matrixA[1][1]) * matrixB[0][0];
        let x3 = matrixA[0][0] * (matrixB[0][1] - matrixB[1][1]);
        let x4 = matrixA[1][1] * (matrixB[1][0] - matrixB[0][0]);
        let x5 = (matrixA[0][0] + matrixA[0][1]) * matrixB[1][1];
        let x6 = (matrixA[1][0] - matrixA[0][0]) * (matrixB[0][0] + matrixB[0][1]);
        let x7 = (matrixA[0][1] - matrixA[1][1]) * (matrixB[1][0] + matrixB[1][1]);

        let C = [];
        C[0] = [];
        C[1] = [];

        C[0][0] = x1 + x4 - x5 + x7;
        C[0][1] = x3 + x5;
        C[1][0] = x2 + x4;
        C[1][1] = x1 - x2 + x3 + x6;

        addLog('X1: ' + x1);
        addLog('X2: ' + x2);
        addLog('X3: ' + x3);
        addLog('X4: ' + x4);
        addLog('X5: ' + x5);
        addLog('X6: ' + x6);
        addLog('X7: ' + x7);

        addLog("C11: " + C[0][0]);
        addLog("C12: " + C[0][1]);
        addLog("C21: " + C[1][0]);
        addLog("C22: " + C[1][1]);

        addLog("Matrix C: " + C);

        return C;
    } else {
        let middle = n/2;
                    
        let matrixA11 = matrixA.slice(0, middle).map(row => row.slice(0, middle));
        let matrixA12 = matrixA.slice(0, middle).map(row => row.slice(middle, n));
        let matrixA21 = matrixA.slice(middle, n).map(row => row.slice(0, middle));
        let matrixA22 = matrixA.slice(middle, n).map(row => row.slice(middle, n));

        let matrixB11 = matrixB.slice(0, middle).map(row => row.slice(0, middle));
        let matrixB12 = matrixB.slice(0, middle).map(row => row.slice(middle, n));
        let matrixB21 = matrixB.slice(middle, n).map(row => row.slice(0, middle));
        let matrixB22 = matrixB.slice(middle, n).map(row => row.slice(middle, n));

        addLog("C11 = A11*B11 + A12*B21");
        let matrixC11 = sumMatrices(strassenAlgo(matrixA11, matrixB11, middle), strassenAlgo(matrixA12, matrixB21, middle), middle);
        addLog("Matrix C11: " + matrixC11);

        addLog("C12 = A11*B12 + A12*B22");
        let matrixC12 = sumMatrices(strassenAlgo(matrixA11, matrixB12, middle), strassenAlgo(matrixA12, matrixB22, middle), middle);
        addLog("Matrix C12: " + matrixC12);

        addLog("C21 = A21*B11 + A22*B21");
        let matrixC21 = sumMatrices(strassenAlgo(matrixA21, matrixB11, middle), strassenAlgo(matrixA22, matrixB21, middle), middle);
        addLog("Matrix C21: " + matrixC21);

        addLog("C22 = A21*B12 + A22*B22");
        let matrixC22 = sumMatrices(strassenAlgo(matrixA21, matrixB12, middle), strassenAlgo(matrixA22, matrixB22, middle), middle);
        addLog("Matrix C22: " + matrixC22);

        matrixJoined = joinMatrices(matrixC11, matrixC12, matrixC21, matrixC22, middle);

        addLog("C: " + matrixJoined);

        return matrixJoined;
    }
}

function sumMatrices(matrixA, matrixB, n) {
    let result = [];

    for(let i=0; i<n; ++i) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
    }

    return result;
}

function joinMatrices(matrixC11, matrixC12, matrixC21, matrixC22, n) {
    let result = [];
    for(let i=0; i<n; ++i) {
        result[i] = matrixC11[i].concat(matrixC12[i]);
    }
  
    for(let i=0; i<n; ++i) {
        result[n+i] = matrixC21[i].concat(matrixC22[i]);
    }
  
    return result;
}

function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

function validatePowerOfTwo(input) {
    const maxVal = 8;
    const minVal = 2;
    const val = parseInt(input.value);
    const errorSpan = document.getElementById('error-msg');
    const calcBtn = document.querySelector('.calc-btn');

    if (val > maxVal) {
        input.classList.add('invalid-input');
        errorSpan.innerText = `Max size is ${maxVal}`;
        calcBtn.disabled = true;
        return;
    }

    if(val < minVal) {
        input.classList.add('invalid-input');
        errorSpan.innerText = `Min size is ${minVal}`;
        calcBtn.disabled = true;
        return;
    }

    if (!isPowerOfTwo(val)) {
        input.classList.add('invalid-input');
        errorSpan.innerText = "Value must be a power of 2 (2, 4, 8, 16...)";
    
        calcBtn.disabled = true;
        calcBtn.style.opacity = "0.5";
    } else {
        input.classList.remove('invalid-input');
        errorSpan.innerText = "";
    
        calcBtn.disabled = false;
        calcBtn.style.opacity = "1";
    
        updateGrids();
    }
}

function updateGrids() {
    // Clean logs
    const statusLog = document.getElementById('status-log');
    statusLog.innerHTML = '';

    const rA = document.getElementById('rowsA').value;
  
    document.getElementById('rowsB').value = rA;
    document.getElementById('colsA').value = rA;
    document.getElementById('colsB').value = rA;

    renderGrid('matrix-A-container', rA, rA, 'input-A');
    renderGrid('matrix-B-container', rA, rA, 'input-B');
}

function renderGrid(containerId, r, c, className) {
    const container = document.getElementById(containerId);
    container.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
    container.innerHTML = '';

    for (let i = 0; i < r * c; i++) {
        let input = document.createElement('input');
        input.type = 'number';
        input.className = `matrix-input ${className}`;
        input.value = Math.floor(Math.random() * 10);
        container.appendChild(input);
    }
}

function calculateProduct() {
    // Clean logs
    const statusLog = document.getElementById('status-log');
    statusLog.innerHTML = '';

    rA = parseInt(document.getElementById('rowsA').value);
  
    valsA = Array.from(document.querySelectorAll('.input-A')).map(i => Number(i.value));
    valsB = Array.from(document.querySelectorAll('.input-B')).map(i => Number(i.value));

    let matA = [], matB = [];
    for(let i=0; i<rA; i++) matA.push(valsA.slice(i*rA, (i+1)*rA));
    for(let i=0; i<rA; i++) matB.push(valsB.slice(i*rA, (i+1)*rA));

    let result = strassenAlgo(matA, matB, rA);

    const resContainer = document.getElementById('matrix-res-container');
    resContainer.style.gridTemplateColumns = `repeat(${rA}, 1fr)`;
    resContainer.innerHTML = result.flat().map(v => `<div class="matrix-input" style="line-height:35px; border:none;">${v}</div>`).join('');
}

// Initialize on load
updateGrids();