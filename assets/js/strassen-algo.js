let matrixA, matrixB, matrixC;
let cols = 4;
let rows = 4;

const cellSize = 50;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('canvas-container');
    randomizeMatrices();
    noLoop();
}

function addLog(message) {
  const logEl = document.getElementById('status-log');
  
  // Add new log at the top
  logEl.innerHTML = `<div>${message}</div>` + logEl.innerHTML;
}

function handleMatrixReset() {
  console.log("Button handleMatrixReset pressed");
  randomizeMatrices(); 
}

function runAlgorithm() {
    console.log("Button handleNextStep pressed");
    addLog("Starting algorithm");
    console.log("Starting algorithm");
    matrixC = strassenAlgo(matrixA, matrixB, 4);
    addLog("Final matrix: " + matrixC);
    redraw();
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

function randomizeMatrices() {
//   matrixA = createMatrix(cols, rows);
//   matrixB = createMatrix(cols, rows);
    matrixA = [[2, 4, 3, 4], [2, 4, 5, 1], [6, 5, 3, 3], [3, 5, 8, 2]];
    matrixB = [[1, 2, 7, 4], [3, 5, 6, 4], [4, 2, 6, 2], [4, 5, 3, 2]];
    redraw();
}

function createMatrix(c, r) {
  let arr = new Array(c);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(r);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = floor(random(0, 100));
    }
  }
  return arr;
}

function draw() {
    background(255);
  
    // Draw Matrix A at (50, 50)
    drawMatrix(matrixA, 50, 50, "Matrix A");
  
    // Draw Matrix B at (350, 50)
    drawMatrix(matrixB, 350, 50, "Matrix B");

    // Draw Result Matrix
    drawMatrix(matrixC, 200, 300, "Matrix C");
}

function drawMatrix(matrix, xOffset, yOffset, label) {
  push();
  translate(xOffset, yOffset);
  
  // Label
  fill(0);
  textAlign(CENTER);
  text(label, (cols * cellSize) / 2, -10);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = i * cellSize;
      let y = j * cellSize;
      
      // Cell Background
      stroke(200);
      fill(255);
      rect(x, y, cellSize, cellSize);
      
      // The Number
      fill(50);
      noStroke();
      textAlign(CENTER, CENTER);
      text(matrix[j][i], x + cellSize/2, y + cellSize/2);
    }
  }
  pop();
}