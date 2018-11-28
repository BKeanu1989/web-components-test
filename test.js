let array = [0,1,2,3];

function indexEvaluator(array, curIndex, nextIndex) {
    let nextValue;
	let max = array.length;
    let min = 0;

    if (curIndex !== max && curIndex !== min) {
        nextValue = curIndex + nextIndex;
        return nextValue;
    }

    if (curIndex === min) {
        switch(nextIndex) {
            case 1:
                nextValue = curIndex + nextIndex;
                break;
            }
        if (nextIndex == -1) {
            nextValue = max;
        }
        return nextValue;
    }

    if (curIndex === max) {
        switch(nextIndex) {
            case -1:
                nextValue = curIndex + nextIndex;
                break;
        }

        if (nextIndex == 1) {
            nextValue = min;
        }
        return nextValue;
    }
}

console.log(indexEvaluator(array, 5, +1));


