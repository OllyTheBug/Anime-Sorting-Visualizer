/* -------------------------------- Constants ------------------------------- */
const arrayMaxHeight = 500;
const animationDuration = 250;
/* -------------------------------------------------------------------------- */
/*                             Building the Array                             */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Generate array ----------------------------- */
const generateRandomArray = (length, min, max) => {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
}
/* ----------------- fill #array-container with random bars ----------------- */
const createBarArray = (length) => {
    let container = document.getElementById('array-container');
    let arr = generateRandomArray(length, 0, arrayMaxHeight);
    const len = arr.length;
    container.innerHTML = '';
    //width = container's width / length
    let width = (container.offsetWidth / len) - 10;
    for (let i = 0; i < len; i++) {
        let bar = createBar(arr[i], i, width, arr[i]);
        //set bar's left to i * width
        bar.style.left = i * width + 600 + 'px';
        container.appendChild(bar);
    }
}
/* ---------------- Create array bar element to append to DOM --------------- */
const createBar = (value, key, width, height) => {
    let bar = document.createElement('div');
    bar.classList.add('bar');
    bar.setAttribute('original-pos', key);
    bar.style.height = height + 'px';
    bar.style.width = width + 'px';
    bar.style.backgroundColor = getColor(value);
    //bar.innerHTML = value;
    return bar;

}
/* ----- Get color based on a value, with red for high and blue for low ----- */
const getColor = (value) => {
    //blue is higher for lower values
    const blue = Math.floor(255 - (value / 2));
    const green = 0;
    //red is higher for higher values 
    const red = Math.floor(255 - (255 / value));
    return `rgb(${red}, ${green}, ${blue})`;
}

/* -------------------------------------------------------------------------- */
/*                              Bar array helpers                             */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Get bar positions --------------------------- */
function getBarPositions() {
    let bars = document.getElementById('array-container').children;
    let positions = [];
    for (let i = 0; i < bars.length; i++) {
        positions.push(bars[i].getBoundingClientRect().x);
    }
    return positions;
}
/* ---------- Move bars back to their original positions in the DOM --------- */
function resetBars(bars, container) {
    for (let i = 0; i < bars.length; i++) {
        //bar with a original-pos of i
        let ithBar = document.querySelector(`[original-pos="${i}"]`);
        //move ithBar to the start of the array
        container.insertBefore(ithBar, bars.firstChild);
    }
}


/* -------------------------------------------------------------------------- */
/*                             Sorting algorithms                             */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Bubble sort ------------------------------ */
const bubbleSort = () => {
    let container = document.getElementById('array-container');
    let bars = container.children;
    let len = bars.length;
    let moves = [];
    //for each element in the array
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < len - 1; i++) {
            //bar 1 is the i'th bar
            let bar1 = bars[i];
            let bar2 = bars[i + 1];
            if (bar1.offsetHeight > bar2.offsetHeight) {
                moves.push({ 'type': 'swap', 'index1': i, 'index2': i + 1 });
                bar1.before(bar2);

                swapped = true;
            }
        }
    } while (swapped);
    //move the bars to their original positions
    for (let i = 0; i < bars.length; i++) {
        //bar with a original-pos of i
        let ithBar = document.querySelector(`[original-pos="${i}"]`);
        //move ithBar to the start of the array
        container.insertBefore(ithBar, bars.firstChild);
    }

    return moves;
}

/* ----------------------------- Insertion Sort ----------------------------- */
const insertionSort = () => {
    let container = document.getElementById('array-container');
    let bars = container.children;
    let len = bars.length;
    let moves = [];
    //iterate over each element in the array
    for (let i = 0; i < len; i++) {
        for (let j = i; j > 0; j--) {
            //bar 1 is the j'th bar
            let bar1 = bars[j];
            let bar2 = bars[j - 1];
            if (bar1.offsetHeight < bar2.offsetHeight) {
                moves.push({ 'type': 'swap', 'index1': j, 'index2': j - 1 });
                bar1.before(bar2);
            }
        }



    }
    //move the bars to their original positions
    for (let i = 0; i < bars.length; i++) {
        //bar with a original-pos of i
        let ithBar = document.querySelector(`[original-pos="${i}"]`);
        //move ithBar to the start of the array
        container.insertBefore(ithBar, bars.firstChild);
    }
    return moves;
}

/* ----------------------------- Selection sort ----------------------------- */
const selectionSort = () => {
    let container = document.getElementById('array-container');
    let bars = container.children;
    let len = bars.length;
    let moves = [];
    //iterate over each element in the array
    for (let i = 0; i < len; i++) {
        let min = i;
        for (let j = i + 1; j < len; j++) {
            //if the j'th bar is smaller than the min
            if (bars[j].offsetHeight < bars[min].offsetHeight) {
                min = j;
            }
        }
        //if the min is not the i'th bar
        if (min !== i) {
            moves.push({ 'type': 'swap', 'index1': i, 'index2': min });
            swapBarsInDom(i, min);
        }
        //move the bars to their original positions
    }
    resetBars(bars, container);
    return moves;

}



/* -------------------------------------------------------------------------- */
/*                                 Animations                                 */
/* -------------------------------------------------------------------------- */

function animateSort(type) {
    switch (type) {
        case 'bubble':
            moves = bubbleSort();
            break;
        case 'insertion':
            moves = insertionSort();
            break;
        case 'selection':
            moves = selectionSort();
            break;
        default:
            console.log('No sort type selected');
    }

    animateMovesList(moves);
}

function animateMovesList(moves) {
    for (let i = 0; i < moves.length; i++) {
        switch (moves[i].type) {
            case 'swap':
                setTimeout(() => {
                    let index1 = moves[i].index1;
                    let index2 = moves[i].index2;
                    animateBarSwap(index1, index2);
                }, i * 2 * animationDuration);
                break;
        }
    }
}

/* ------------ Swap two bars in the array-container and animate ------------ */
const animateBarSwap = (index1, index2) => {
    //move bar1 to bar2's position
    let container = document.getElementById('array-container');
    let bars = container.children;
    //the positions array contains the x-values of each bar slot on the rendered page via getBoundingClientRect
    let positions = getBarPositions();
    let bar1 = bars[index1];
    let bar2 = bars[index2];
    bar1pos = positions[index1];
    bar2pos = positions[index2];
    swapBarsInDom(index1, index2);
    //They are now swapped in the DOM, but the position is absolute so we need to swap their x values

    //move bar1 to bar2's position
    anime({
        targets: bar1,
        left: bar2pos,
        duration: animationDuration,
        easing: 'easeInOutQuad',
    });
    //move bar2 to bar1's position
    anime({
        targets: bar2,
        left: bar1pos,
        duration: animationDuration,
        easing: 'easeInOutQuad',
    });



}


/* -------------------------------------------------------------------------- */
/*                                  Main code                                 */
/* -------------------------------------------------------------------------- */

createBarArray(15);









function swapBarsInDom(index1, index2) {
    container = document.getElementById('array-container');
    bars = container.children;
    let bar1 = bars[index1];
    let bar2 = bars[index2];
    bar2NextSibling = bar2.nextSibling;
    //insert bar2 before bar1
    container.insertBefore(bar2, bar1);
    //insert bar1 before bar2's next sibling
    container.insertBefore(bar1, bar2NextSibling);
}
