/* -------------------------------- Constants ------------------------------- */
const arrayMaxHeight = 500;
let animationDuration = 200;
let arraySize = 15;
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
const createBarArray = () => {
    let length = arraySize;
    let container = getOuterContainer();
    let arr = generateRandomArray(length, 0, arrayMaxHeight);
    const len = arr.length;
    container.innerHTML = '';
    //width = container's width / length
    let width = (container.offsetWidth / len) - 1;
    for (let i = 0; i < len; i++) {
        let bar = createBar(arr[i], i, width, arr[i]);
        //set bar's left to i * width (only if using absolute positioning)
        //bar.style.left = i * width + 600 + 'px';
        container.appendChild(bar);
    }
}
/* ---------------- Create array bar element to append to DOM --------------- */
const createBar = (value, key, width, height) => {
    let bar = document.createElement('div');
    bar.classList.add('bar');
    bar.setAttribute('original-pos', key);
    bar.style.height = height + 'px';
    //bar.style.width = width + 'px';
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
const getOuterContainer = () => {
    container = document.getElementById('outer-container');
    return container;
}

function getBarPosInContainer(index, container) {
    let bars = container.children;

    return bars[index].getBoundingClientRect().x;
}


/* ---------- Move bars back to their original positions in the DOM --------- */
function resetBars() {
    container = getOuterContainer();
    bars = container.children;
    for (let i = 0; i < bars.length; i++) {
        //bar with a original-pos of i
        let ithBar = document.querySelector(`[original-pos="${i}"]`);
        //move ithBar to the start of the array
        container.insertBefore(ithBar, bars.firstChild);
    }
}

function swapBarsInDom(index1, index2) {
    container = getOuterContainer();
    bars = container.children;
    let bar1 = bars[index1];
    let bar2 = bars[index2];
    bar2NextSibling = bar2.nextSibling;
    //insert bar2 before bar1
    container.insertBefore(bar2, bar1);
    //insert bar1 before bar2's next sibling
    container.insertBefore(bar1, bar2NextSibling);
}


/*
* @param {HTMLCollcetion} bars - the array of bars to be split
* @param {number} index - where the array should be split
*/
const splitArrayContainer = (bars, index) => {
    //create two HTML div elements to hold the two halves of the array
    let left = document.createElement('div');
    let right = document.createElement('div');
    //add array-container class to the two new div elements
    left.classList.add('array-container', 'card');
    right.classList.add('array-container', 'card');
    //get height and width
    let barWidth = bars[0].offsetWidth;
    let maxHeight = 0;
    //move the first half of the array to the left div
    for (let i = 0; i < index; i++) {
        console.log(i)

        if (bars[i].offsetHeight > maxHeight) {
            maxHeight = bars[i].offsetHeight;
        }
        left.appendChild(bars[i]);
    }
    //move the second half of the array to the right div
    for (let i = index; i < bars.length; i++) {
        if (bars[i].offsetHeight > maxHeight) {
            maxHeight = bars[i].offsetHeight;
        }
        right.appendChild(bars[i]);
    }
    //set the width of each div based on the number of bars in the array
    let totalBars = bars.length;
    let leftWidth = (left.offsetWidth / totalBars) * barWidth - 1;
    let rightWidth = (right.offsetWidth / totalBars) * barWidth - 1;

    console.log("hmm");
    //get the parent node
    let parent = bars[0].parentNode;
    parent.innerHTML = '';
    //add the bars to #array-container
    left.style.width = `50%`;
    left.style.height = `${maxHeight}px`;
    right.style.width = `50%`;
    right.style.height = `${maxHeight}px`;
    parent.appendChild(left);
    parent.appendChild(right);

}

/* -------------------------------------------------------------------------- */
/*                             Sorting algorithms                             */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Bubble sort ------------------------------ */
const bubbleSort = () => {
    let container = getOuterContainer();
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
    resetBars();

    return moves;
}

/* ----------------------------- Insertion Sort ----------------------------- */

/*
*   For each element, swap the element backwards in the array until it is in the correct position
*   Insertion sort worst case is O(n^2)
*   Insertion sort average case is O(n^2)
*   Insertion sort best case is O(n)   
*/
const insertionSort = () => {
    let container = getOuterContainer();
    let bars = container.children;
    let len = bars.length;
    let moves = [];
    //iterate over each element in the array
    for (let i = 0; i < len; i++) {
        //j is the index of the bar to be inserted
        let j = i;
        //while j is greater than 0 and the bar to the left is greater than the bar to the right
        while (j > 0 && bars[j - 1].offsetHeight > bars[j].offsetHeight) {
            moves.push({ 'type': 'swap', 'index1': j - 1, 'index2': j });
            swapBarsInDom(j - 1, j);
            j--;
        }
    }
    //move the bars to their original positions
    resetBars();
    return moves;
}

/* ----------------------------- Selection sort ----------------------------- */
/*
*   Find the smallest element in an array and swap it with the leftmost element
*   Selection sort worst case: O(n^2)
*   Selection sort average case: O(n^2)
*   Selection sort best case: O(n^2)
*   Container is the div holding the bars
*   @return {array} - an array of moves required to sort the array
*/
const selectionSort = () => {
    let container = getOuterContainer();
    let bars = container.children;
    let len = bars.length;
    let moves = [];
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
    resetBars();
    return moves;

}

/* -------------------------------- QuickSort ------------------------------- */
/*
*   Divide the array into two parts, one with smaller elements and one with larger elements
*   Recursively sort the two parts
*   Quick sort worst case: O(n^2)
*   Quick sort average case: O(n log n)
*   Quick sort best case: O(n log n)
*   @param {HTMLCollection} - the bars in the array
*   @return {array} - an array of moves required to sort the array
*/
let moves = [];
const executeQuickSort = () => {
    let container = getOuterContainer();
    let bars = container.children;
    let len = bars.length;
    //bars to array to simplify the code.
    let barsArray = Array.from(bars).map(bar => bar.offsetHeight);
    //recursively sort the array
    array = quickSort(barsArray, 0, len - 1);
    //move the bars to their original positions
    console.log(array)
    resetBars();
    return moves;
}

/*
*   @param {array} - the array to be sorted
*   @return {array} - an array of moves required to sort the array
*/

const quickSort = (array, low, high) => {
    //if low isn't defined, set it to 0
    if (low < high) {
        let pivot = partition(array, low, high);
        quickSort(array, low, pivot - 1);
        quickSort(array, pivot + 1, high);
    }

    return array;


}
const partition = (array, low, high) => {
    //define the last element as the pivot
    let pivot = array[high];
    //define the index of the smaller element, initialized to the low index - 1
    let i = (low - 1);
    //iterate over the array from the low index to the high index
    for (let j = low; j <= high; j++) {
        //if the j'th element is smaller than the pivot
        if (array[j] < pivot) {
            //increment the index of the smaller element
            i++;
            //swap the j'th element with the smaller element
            swapInArray(array, i, j);
            //add a move to the array of moves
            if (i !== j) {
                moves.push({ 'type': 'swap', 'index1': i, 'index2': j });
            }
        }

    }
    //swap the last element with the smaller element
    swapInArray(array, i + 1, high);
    //add a move to the array of moves
    if (i + 1 !== high) {
        moves.push({ 'type': 'swap', 'index1': i + 1, 'index2': high });
    }
    return (i + 1);
}

const swapInArray = (array, index1, index2) => {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

/* -------------------------------- Heap sort ------------------------------- */

const executeHeapSort = () => {
    let container = getOuterContainer();
    let bars = container.children;
    let len = bars.length;
    //bars to array to simplify the code.
    let barsArray = Array.from(bars).map(bar => bar.offsetHeight);
    //recursively sort the array
    array = heapSort(barsArray, 0);
    //move the bars to their original positions
    resetBars();
    return moves;
}

const heapSort = (array, offset) => {
    //if array is length 1, return it
    if (array.length <= 1) {
        return array;
    }
    //create a heap
    heapify(array);
    //sort the array in-place
    //create markers i and j
    i = array.length - 1;
    j = 0;
    //while i is greater than 0
    while (i > 0) {
        //swap the first element with the last element
        moves.push({ 'type': 'swap', 'index1': 0, 'index2': i });
        swapInArray(0, i);
        //decrement i
        i--;
        //heapify the array
        heapify(array);
    }
    return moves;
}

const heapify = (array, index) => {
    //create markers i and j
    i = index;
    j = 2 * i + 1;
    //while j is less than the length of the array
    while (j < array.length) {
        //if j + 1 is less than the length of the array and the element at j is less than the element at j + 1
        if (j + 1 < array.length && array[j] < array[j + 1]) {
            //increment j
            j++;
        }
        //if the element at i is less than the element at j
        if (array[i] < array[j]) {
            //swap the element at i with the element at j
            moves.push({ 'type': 'swap', 'index1': i, 'index2': j });
            swapInArray(i, j);
            //set i to j
            i = j;
            //set j to 2 * i + 1
            j = 2 * i + 1;
        } else {
            //break out of the loop
            break;
        }
    }
}


/* ------------------------------- Merge Sort ------------------------------- */

const executeMergeSort = () => {
    let container = getOuterContainer();
    let bars = container.children;
    let len = bars.length;
    //bars to array to simplify the code.
    let barsArray = Array.from(bars).map(bar => bar.offsetHeight);
    //recursively sort the array
    array = mergeSort(barsArray);
    return moves;
}

/*
*   Recursively splits the array into two halves, then merges them back together in sorted order
*   Time Complexity: O(n log n)
*   Space Complexity: O(n)
*   @param {HTMLCollection} bars - the bars to be sorted
*   @returns {HTMLCollection} - the sorted bars
*/
const mergeSort = (array) => {
    //if the array is length 1, return it
    if (array.length <= 1) {
        return array;
    }
    //split the array into two halves
    let left = array.slice(0, Math.floor(array.length / 2));
    let right = array.slice(Math.floor(array.length / 2));
    //add a move to the array of moves
    moves.push({ 'type': 'split'});
    //recursively sort the two halves
    left = mergeSort(left);
    right = mergeSort(right);
    //merge the two halves back together in sorted order
    return merge(left, right);

}

/* -------------------------- Merge sort utilities -------------------------- */

/*
*   Merge two sorted arrays into one sorted array
*   @param {HTMLCollection} left - the left array
*   @param {HTMLCollection} right - the right array
*   @return {HTMLCollection} - the merged array
*/
const merge = (left, right) => {

}

const splitDOMchildrenAtIndex = (bars, index) => {
    let left = [];
    let right = [];
    let length = bars.length;
    for (let i = 0; i < bars.length; i++) {
        if (i < index) {
            left.push(bars[i]);
        } else {
            right.push(bars[i]);
        }
    }

    //move left bars left and right bars right
    return [left, right];

}

/* -------------------------------------------------------------------------- */
/*                                  Controls                                  */
/* -------------------------------------------------------------------------- */
const setSortButtonClickListeners = () => {
    let sortButtons = document.getElementsByClassName('sortbutton');
    for (let i = 0; i < sortButtons.length; i++) {
        sortButtons[i].addEventListener('click', handleSortButton);
    }
}

const lockAllSortButtons = () => {
    let sortButtons = document.getElementsByClassName('sortbutton');
    for (let i = 0; i < sortButtons.length; i++) {
        sortButtons[i].disabled = true;
        //disable click event listener
        sortButtons[i].removeEventListener('click', handleSortButton);
    }
}

const unlockAllSortButtons = () => {
    let sortButtons = document.getElementsByClassName('sortbutton');
    for (let i = 0; i < sortButtons.length; i++) {
        sortButtons[i].disabled = false;
    }
    setSortButtonClickListeners();

}

function handleSortButton(event) {
    //lock all sort buttons
    lockAllSortButtons();
    //call animateSort, pasing the id of the button that was clicked
    animateSort(event.target.id);
}
/* -------------------------------------------------------------------------- */
/*                                 Animations                                 */
/* -------------------------------------------------------------------------- */



function animateSort(type) {
    moves = [];
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
        case 'quick':
            moves = executeQuickSort();
            break;
        case 'merge':
            moves = executeMergeSort();
            break;
        case 'heap':
            moves = executeHeapSort();
            break;
        default:
            console.log('No sort type selected');
    }
    //append a 'done' move to the end of the moves array
    moves.push({ 'type': 'done' });
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
                }, i * 1.5 * animationDuration);
                break;
            case 'done':
                setTimeout(() => {
                    unlockAllSortButtons();
                }
                    , i * 1.5 * animationDuration);
        }
    }
    return true;
}

/* ------------ Swap two bars in the array-container and animate ------------ */
const animateBarSwap = (index1, index2) => {
    //move bar1 to bar2's position
    let container = getOuterContainer();
    let bars = container.children;
    //the positions array contains the x-values of each bar slot on the rendered page via getBoundingClientRect
    let bar1 = bars[index1];
    let bar2 = bars[index2];
    let bar1pos = getBarPosInContainer(index1, container);
    let bar2pos = getBarPosInContainer(index2, container);

    //They are now swapped in the DOM, but the position is absolute so we need to swap their x values

    //move bar1 to bar2's position
    anime({
        targets: bar1,
        //translatex
        translateX: [0, bar2pos - bar1pos],
        duration: animationDuration,
        easing: 'easeInOutQuad',
        complete: () => {
            bar1.style.transform = 'translateX(0)';
        }
    });
    // move bar2 to bar1's position
    anime({
        targets: bar2,
        translateX: [0, bar1pos - bar2pos],
        duration: animationDuration,
        easing: 'easeInOutQuad',
        complete: () => {
            bar2.style.transform = 'translateX(0)';
            swapBarsInDom(index1, index2)
        }

    });
    //swap the bars in the array and remove translation



    //remove translation from style




}


/* -------------------------------------------------------------------------- */
/*                                  Main code                                 */
/* -------------------------------------------------------------------------- */
//main function
const main = () => {
    createBarArray(15);
    let bars = getOuterContainer().children;
    splitArrayContainer(bars, 4);

    setSortButtonClickListeners();
    var sizeSlider = document.getElementById("size-slider");
    sizeSlider.oninput = function () {
        arraySize = parseInt(this.value);
        createBarArray(this.value);
    }
    var speedSlider = document.getElementById("speed-slider");
    speedSlider.oninput = function () {
        animationDuration = 300 - parseInt(this.value);
    }
}
document.addEventListener('DOMContentLoaded', main);




