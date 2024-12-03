var inputFromString = (str) => {
    return str.split('\n').map(v => v.split(' ').map(v => parseInt(v)))
}

var aoc24d2p2 = (strInput) => {
    const input = inputFromString(strInput)
    const getDiStance = (x, y) => {
        const r = x - y

        return r < 0 ? r * -1 : r
    }
    const isDistanceValid = (x, y) => {
        const distance = getDiStance(x, y)

        return distance >= 1 && distance <= 3
    }

    const checkIsIncrease = (x, y) => {
        return x < y
    }

    const omitInIndex = (arr, index) => [...arr.slice(0, index), ...arr.slice(index + 1)]


    const isSafe = (arr, lastCheck = false) => {
        if (!isDistanceValid(arr[0], arr[1])) {
            if (lastCheck) {
                return false
            } else {
                return isSafe(omitInIndex(arr, 0), true) || isSafe(omitInIndex(arr, 1), true)
            }
        }
        const isRecordIncrease = checkIsIncrease(arr[0], arr[1])
        for (let i = 1; i < arr.length - 1; i++) {
            if (!isDistanceValid(arr[i], arr[i + 1])) {
                if (lastCheck) {
                    return false
                } else {
                    return isSafe(omitInIndex(arr, i), true) || isSafe(omitInIndex(arr, i + 1), true) || isSafe(omitInIndex(arr, 0), true)
                }

            }
            const isCurrentIncrease = checkIsIncrease(arr[i], arr[i + 1])

            if (isCurrentIncrease !== isRecordIncrease) {
                if (lastCheck) {
                    return false
                } else {
                    return isSafe(omitInIndex(arr, i), true) || isSafe(omitInIndex(arr, i + 1), true) || isSafe(omitInIndex(arr, 0), true)
                }
            }
        }

        return true
    }

    let counter = 0
    for (let j = 0; j < input.length; j++) {
        if (isSafe(input[j])) {
            counter++
        }
    }

    return counter
}
