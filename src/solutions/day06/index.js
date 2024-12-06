import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input.split('\n').map(v => [...v])

const findSrc = (mat) => {
    for (let i =0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            if (mat[i][j] === '^') {
                return [i,j]
            }
        }
    }
}

const isInRange = ([i, j], rows, columns) => i >= 0 && i < rows && j >= 0 && j < columns

const goTop = (node) => {
    return [node[0] - 1, node[1]]
}

const goRight = (node) => {
    return [node[0], node[1] + 1]
}

const goBottom = (node) => {
    return [node[0] + 1, node[1]]
}

const goLeft = (node) => {
    return [node[0], node[1] - 1]
}

const nextOnDirection = (node, direction) => {
    switch (direction) {
        case 0:
            return goTop(node)
        case 1:
            return goRight(node)
        case 2:
            return goBottom(node)
        case 3:
            return goLeft(node)
    }
}

const nodeToString = ([i,j]) => `${i},${j}`

const part1 = (input) => {
    const rows = input.length
    const columns = input[0].length
    let current = findSrc(input)
    // 0 - 0, 1 - 90, 2 - 180, 3 - 270

    let direction = 0
    const visited = {}

    const isBlocked = (node, direction, rows, columns) => {
        const nextNode = nextOnDirection(node, direction)

        return isInRange(nextNode, rows, columns) && input[nextNode[0]][nextNode[1]] === '#'
    }

    while (isInRange(current, rows, columns)) {
        visited[nodeToString(current)] = true
        while(isBlocked(current, direction, rows, columns)) {
            direction = direction === 3 ? 0 : direction + 1
        }

        current = nextOnDirection(current, direction)
    }
    return Object.keys(visited).length
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
