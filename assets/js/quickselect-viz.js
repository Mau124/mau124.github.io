// --- Configuration & State ---
const initialArray = [15, 3, 9, 12, 5, 20, 8, 2];
const targetK = 3; 

let state = {
    arr: [...initialArray],
    left: 0,
    right: initialArray.length - 1,
    pivotIdx: null,
    i: 0, 
    j: 0,
    phase: 'START', // START, COMPARING, SWAPPING, SWAP_PIVOT, NEXT_RANGE, DONE
    log: ["Press 'Next Step' to start partitioning."]
};

function updateLog(msg) {
    state.log.unshift(msg); // Add to top
    if (state.log.length > 5) state.log.pop();
}

function render() {
    const container = document.getElementById('array-display');
    const logContainer = document.getElementById('status-text');
    if (!container) return;

    // Render Bars
    container.innerHTML = state.arr.map((val, idx) => {
        let color = "#3498db"; // Default Blue
        let border = "none";
        let opacity = "1";

        // Dim elements outside current search range
        if (idx < state.left || idx > state.right) {
            color = "#e0e0e0";
            opacity = "0.5";
        }
        
        // Highlight logic
        if (idx === state.pivotIdx) color = "#f1c40f"; // Pivot (Yellow)
        if (state.phase === 'COMPARING' && idx === state.j) {
            border = "3px solid #e74c3c"; // Current being checked (Red Border)
        }
        if (state.phase === 'SWAPPING' && (idx === state.i || idx === state.j)) {
            color = "#2ecc71"; // Swapping elements (Green)
        }
        if (state.phase === 'DONE' && idx === targetK - 1) {
            color = "#9b59b6"; // The found element (Purple)
        }

        return `
            <div style="
                height: ${val * 5 + 20}px; 
                width: 35px; 
                background: ${color}; 
                opacity: ${opacity};
                border: ${border};
                transition: all 0.3s ease;
                display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
                color: white; font-weight: bold; border-radius: 4px 4px 0 0; font-size: 14px;
            ">
                <span style="margin-bottom: 5px;">${val}</span>
            </div>`;
    }).join('');

    // Render Log
    logContainer.innerHTML = state.log.map((m, i) => 
        `<div style="opacity: ${1 - i*0.2}">${m}</div>`
    ).join('');
}

function step() {
    const pivotVal = state.arr[state.right];

    switch(state.phase) {
        case 'START':
            state.pivotIdx = state.right;
            state.i = state.left;
            state.j = state.left;
            state.phase = 'COMPARING';
            updateLog(`Partitioning [${state.left} to ${state.right}]. Pivot is ${pivotVal}.`);
            break;

        case 'COMPARING':
            if (state.j < state.right) {
                if (state.arr[state.j] < pivotVal) {
                    state.phase = 'SWAPPING';
                    updateLog(`${state.arr[state.j]} < ${pivotVal}. Prepare to swap.`);
                } else {
                    updateLog(`${state.arr[state.j]} >= ${pivotVal}. Moving on.`);
                    state.j++;
                }
            } else {
                state.phase = 'SWAP_PIVOT';
                updateLog(`Reached end. Swap pivot into place.`);
            }
            break;

        case 'SWAPPING':
            [state.arr[state.i], state.arr[state.j]] = [state.arr[state.j], state.arr[state.i]];
            state.i++;
            state.j++;
            state.phase = 'COMPARING';
            updateLog(`Swapped! Boundary 'i' moved to ${state.i}.`);
            break;

        case 'SWAP_PIVOT':
            [state.arr[state.i], state.arr[state.right]] = [state.arr[state.right], state.arr[state.i]];
            const pPos = state.i;
            state.pivotIdx = pPos;
            
            if (pPos === targetK - 1) {
                state.phase = 'DONE';
                updateLog(`FOUND IT! ${state.arr[pPos]} is the ${targetK}rd smallest.`);
            } else {
                state.phase = 'NEXT_RANGE';
                updateLog(`Pivot at ${pPos}. We need index ${targetK-1}.`);
            }
            break;

        case 'NEXT_RANGE':
            if (state.pivotIdx < targetK - 1) {
                state.left = state.pivotIdx + 1;
            } else {
                state.right = state.pivotIdx - 1;
            }
            state.phase = 'START';
            step(); // Auto-trigger the start of the next range
            break;
    }
    render();
}

function reset() {
    state = {
        arr: [...initialArray],
        left: 0, right: initialArray.length - 1,
        pivotIdx: null, i: 0, j: 0,
        phase: 'START',
        log: ["Reset. Press 'Next Step' to begin."]
    };
    render();
}

window.onload = render;