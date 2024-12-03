import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input.split('\n').map(v => v.split(' ').map(v => parseInt(v)))

const part1 = (input) => {
    const getDistance = (x, y) => {
        const r = x - y

        return r < 0 ? r * -1 : r
    }
    const isDistanceValid = (x, y) => {
        const distance = getDistance(x,y)

        return distance >= 1 && distance <=3
    }

    const checkIsIncrease = (x, y) => {
        return x < y
    }

    const isSafe = (arr) => {
        if (!isDistanceValid(arr[0],arr[1])) {
            return false
        }
        const isRecordIncrease = checkIsIncrease(arr[0],arr[1])
        for (let i = 1; i < arr.length - 1; i++) {
            if (!isDistanceValid(arr[i],arr[i + 1])) {
                return false
            }
            const isCurrentIncrease = checkIsIncrease(arr[i],arr[i + 1])

            if (isCurrentIncrease !== isRecordIncrease) {
                return false
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

const part2 = (input) => {
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

const runPart1Tests = () => testRunner.runTests(part1, part1Tests)
const runPart2Tests = () => testRunner.runTests(part2, part2Tests)

export default {
    part1,
    part2,
    inputParser,
    parsedInput: inputParser(input),
    parsedExample: inputParser(example),
    runPart1Tests,
    runPart2Tests
}
