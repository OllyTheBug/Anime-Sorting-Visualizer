/* -------------------------------- Constants ------------------------------- */
let arrayMaxHeight = 500;

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
    bar.setAttribute('data-key', key);
    bar.style.height = height + 'px';
    bar.style.width = width + 'px';
    bar.style.backgroundColor = getColor(value);
    //bar.innerHTML = value;
    return bar;

}
/* ---------------------------- Get bar positions --------------------------- */
function getBarPositions() {
    let bars = document.getElementById('array-container').children;
    let positions = [];
    for (let i = 0; i < bars.length; i++) {
        positions.push(bars[i].getBoundingClientRect().x);
    }
    return { positions, bars };
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
        //bar with a data-key of i
        let ithBar = document.querySelector(`[data-key="${i}"]`);
        //move ithBar to the start of the array
        container.insertBefore(ithBar, bars.firstChild);
    }

    return moves;
}


/* -------------------------------------------------------------------------- */
/*                                 Animations                                 */
/* -------------------------------------------------------------------------- */

function animateBubbleSort(){
    moves = bubbleSort();
    //positions is an array holding the ith x-coordinate of each bar slot
    //bars is an array of bar elements
    let { positions, bars } = getBarPositions();
    animateMovesList(positions, bars, moves);
}


function animateMovesList(positions, bars, moves) {
    for (let i = 0; i < moves.length; i++) {
        switch (moves[i].type) {
            case 'swap':
                setTimeout(() => {
                    let bar1 = bars[moves[i].index1];
                    let bar2 = bars[moves[i].index2];
                    animateBarSwap(positions, bar1, bar2, i);
                }, i * 300);

                break;
        }
    }
}

const swapData = (bar1, bar2) => {
    //swap the bars' data-key attributes
    let bar1Key = bar1.getAttribute('data-key');
    let bar2Key = bar2.getAttribute('data-key');
    bar1.setAttribute('data-key', bar2Key);
    bar2.setAttribute('data-key', bar1Key);
}

/* ---------------- Add a position swap to the Anime timeline --------------- */
const animateBarSwap = (positions, bar1, bar2, i) => {
    //move bar1 to bar2's position
    let bar1Done = false;
    let bar2Done = false;
    anime({
        targets: bar1,
        left: positions[moves[i].index2],
        duration: 100,
        easing: 'easeInOutQuad',
        complete: () => {
            bar1Done = true;
        }
    });
    //move bar2 to bar1's position
    anime({
        targets: bar2,
        left: positions[moves[i].index1],
        duration: 100,
        easing: 'easeInOutQuad',
        complete: () => {
            bar2Done = true;
        }
    });
    //wait until both animations are done
    bar1.before(bar2);

}


/* -------------------------------------------------------------------------- */
/*                                  Main code                                 */
/* -------------------------------------------------------------------------- */











