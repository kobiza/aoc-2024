import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input.split('\n').map(v => [...v])


const goTop = (node, rows, columns) => {
    return [node[0] - 1, node[1]]
}

const goTopRight = (node, rows, columns) => {
    return [node[0] - 1, node[1] + 1]
}

const goRight = (node, rows, columns) => {
    return [node[0], node[1] + 1]
}

const goBottomRight = (node, rows, columns) => {
    return [node[0] + 1, node[1] + 1]
}

const goBottom = (node, rows, columns) => {
    return [node[0] + 1, node[1]]
}

const goBottomLeft = (node, rows, columns) => {
    return [node[0] + 1, node[1] - 1]
}

const goLeft = (node, rows, columns) => {
    return [node[0], node[1] - 1]
}

const goTopLeft = (node, rows, columns) => {
    return [node[0] - 1, node[1] - 1]
}

const isInRange = ([i, j], rows, columns) => i >= 0 && i < rows && j >= 0 && j < columns

const getNeighbours = (node, rows, columns) => {
    return [
        {direction: 'goTop', node: goTop(node, rows, columns)},
        {direction: 'goTopRight', node: goTopRight(node, rows, columns)},
        {direction: 'goRight', node: goRight(node, rows, columns)},
        {direction: 'goBottomRight', node: goBottomRight(node, rows, columns)},
        {direction: 'goBottom', node: goBottom(node, rows, columns)},
        {direction: 'goBottomLeft', node: goBottomLeft(node, rows, columns)},
        {direction: 'goLeft', node: goLeft(node, rows, columns)},
        {direction: 'goTopLeft', node: goTopLeft(node, rows, columns)},
    ].filter(({node}) => {
        return isInRange(node, rows, columns)
    })
}


const getNextNodeInDirection = (nodeWithDir, rows, columns) => {
    switch (nodeWithDir.direction) {
        case 'goTop':
            return {direction: 'goTop', node: goTop(nodeWithDir.node, rows, columns)}
        case 'goTopRight':
            return {direction: 'goTopRight', node: goTopRight(nodeWithDir.node, rows, columns)}
        case 'goRight':
            return {direction: 'goRight', node: goRight(nodeWithDir.node, rows, columns)}
        case 'goBottomRight':
            return {direction: 'goBottomRight', node: goBottomRight(nodeWithDir.node, rows, columns)}
        case 'goBottom':
            return {direction: 'goBottom', node: goBottom(nodeWithDir.node, rows, columns)}
        case 'goBottomLeft':
            return {direction: 'goBottomLeft', node: goBottomLeft(nodeWithDir.node, rows, columns)}
        case 'goLeft':
            return {direction: 'goLeft', node: goLeft(nodeWithDir.node, rows, columns)}
        case 'goTopLeft':
            return {direction: 'goTopLeft', node: goTopLeft(nodeWithDir.node, rows, columns)}
    }
}

const isSameNode = (src, dst) => src[0] === dst[0] && src[1] === dst[1]

const part1 = (input) => {
    const findStr = 'XMAS'
    const rows = input.length
    const columns = input[0].length
    const rootsToCheck = []
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            const isRoot = input[i][j] === findStr[0]

            if (isRoot) {
                rootsToCheck.push([i, j])
            }
        }
    }

    const countRec = (nodeWithDir, subStr) => {
        console.log('check', nodeWithDir.node, nodeWithDir.direction, input[nodeWithDir.node[0]][nodeWithDir.node[1]], subStr.join(''))
        // if (subStr.length === 0) {
        //     return 1
        // }

        const {node} = nodeWithDir

        if (input[node[0]][node[1]] === subStr[0]) {
            if (subStr.length === 1) {
                console.log('Yes!!!')
                return 1
            }
            const nextNodeWithDir = getNextNodeInDirection(nodeWithDir, rows, columns)

            if (!isInRange(nextNodeWithDir.node, rows, columns)) {
                return 0
            }
            return countRec(nextNodeWithDir, subStr.slice(1))
        } else {
            return 0
        }
    }

    const strArr = [...findStr].slice(1)
    return _.sum(rootsToCheck.map(node => {
        console.log('root', node)
        const nodesWithDirection = getNeighbours(node, rows, columns)
        return _.sum(nodesWithDirection.map(nodeWithDir => countRec(nodeWithDir, strArr)))
    }))
}

const getStr = (input, node1, node2, rows, columns) => {
    if (!isInRange(node1, rows, columns) || !isInRange(node2, rows, columns)) {
        return ''
    }

    return `${input[node1[0]][node1[1]]}A${input[node2[0]][node2[1]]}`
}

const isMasOrSam = (str) => str === 'SAM' || str === 'MAS'

const part2 = (input) => {
    const rows = input.length
    const columns = input[0].length
    const rootsToCheck = []
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            const isRoot = input[i][j] === 'A'

            if (isRoot) {
                rootsToCheck.push([i, j])
            }
        }
    }

    return _.sum(rootsToCheck.map(node => {
        const tl = goTopLeft(node, rows, columns)
        const br = goBottomRight(node, rows, columns)
        const tr = goTopRight(node, rows, columns)
        const bl = goBottomLeft(node, rows, columns)
        const first = getStr(input, tl, br, rows, columns)
        const second = getStr(input, tr, bl, rows, columns)

        if (isMasOrSam(first) && isMasOrSam(second)) {
            return 1
        }
        return 0
    }))
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
