import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input.split('')

const part1 = (input) => {
    const getP1 = (arr) => {
        const result = []

        let isFile = true
        let filesCounter = -1
        for (let i = 0; i < arr.length; i++) {
            const repeat = parseInt(arr[i])

            if (isFile) {
                filesCounter++
            }
            const cToAdd = isFile ? `${filesCounter}` : '.'
            for (let j = 0; j < repeat; j++) {
                result.push(cToAdd)
            }
            isFile = !isFile
        }

        return result
    }

    const toLeftMost = (arr) => {
        const result = [...arr]
        let indexToMoveFromRight = arr.length - 1

        let i = 0
        while (i < indexToMoveFromRight) {
            if (result[i] === '.') {
                result[i] = result[indexToMoveFromRight]
                result[indexToMoveFromRight] = '.'

                while (result[indexToMoveFromRight] === '.') {
                    indexToMoveFromRight--
                }
            }
            i++
        }

        return result
    }

    const getChecksum = (arr) => {
        let i = 0
        let checksum = 0
        while (arr[i] !== '.') {
            checksum += parseInt(arr[i]) * i

            i++
        }

        return checksum
    }

    return getChecksum(toLeftMost(getP1(input)))
}

const part2 = (input) => {
    return _.identity(input)
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
