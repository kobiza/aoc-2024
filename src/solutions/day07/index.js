import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input.split('\n').filter(v => v).map(row => {
    const [left, right] = row.split(': ')
    const arr = right.split(' ').map(v => parseInt(v))

    return {
        result: parseInt(left),
        arr
    }
})

const part1 = (input) => {
    const applyOperator = (x, y, operator) => {
        switch (operator) {
            case '+':
                return x + y;
            case '*':
                return x * y
        }
    }

    const getFirstItem = (operator) => {
        switch (operator) {
            case '+':
                return 0;
            case '*':
                return 1
        }
    }

    const operators = ['+', '*']

    const testRow = (dst, arr) => {
        const recTest = (dst, arr, prevValue, operator) => {
            const nextItem = arr[0]
            const newValue = applyOperator(prevValue, nextItem, operator)

            if (newValue > dst) {
                return false
            }

            const restItemsToCheck = arr.slice(1)

            if (restItemsToCheck.length === 0) {
                return newValue === dst
            }

            return _.some(operators, nexOperator => {
                return recTest(dst, restItemsToCheck, newValue, nexOperator)
            })
        }

        return _.some(operators, nexOperator => {
            return recTest(dst, arr, getFirstItem(nexOperator), nexOperator)
        })
    }

    return _.sum(input.filter(row => {
        return testRow(row.result, row.arr)
    }).map(v => v.result))
}

const part2 = (input) => {
    const applyOperator = (x, y, operator) => {
        switch (operator) {
            case '+':
                return x + y;
            case '*':
                return x * y
            case '||':
                return parseInt(`${x}${y}`)
        }
    }

    const getFirstItem = (operator) => {
        switch (operator) {
            case '+':
                return 0;
            case '*':
                return 1
        }
    }


    const startOperators = ['+', '*']
    const operators = ['+', '*', '||']

    const testRow = (dst, arr) => {
        const recTest = (dst, arr, prevValue, operator) => {
            const nextItem = arr[0]
            const newValue = applyOperator(prevValue, nextItem, operator)

            if (newValue > dst) {
                return false
            }

            const restItemsToCheck = arr.slice(1)

            if (restItemsToCheck.length === 0) {
                return newValue === dst
            }

            return _.some(operators, nexOperator => {
                return recTest(dst, restItemsToCheck, newValue, nexOperator)
            })
        }

        return _.some(startOperators, nexOperator => {
            return recTest(dst, arr, getFirstItem(nexOperator), nexOperator)
        })
    }

    return _.sum(input.filter(row => {
        return testRow(row.result, row.arr)
    }).map(v => v.result))
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
