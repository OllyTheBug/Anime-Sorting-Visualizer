function insertionSort(array){
    //iterate over each element in the array
    for (let i = 1; i < array.length; i++) {
        //bar 1 is the i'th bar
        let bar1 = array[i];
        let bar2 = array[i - 1];
        if (bar1 < bar2) {
            array[i] = bar2;
            array[i - 1] = bar1;
        }
        
    }
}