import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input.split('\n').map(row => row.split(''))

const nodeToString = ([i,j]) => `${i},${j}`

const getAllComb = (arr) => {
    const result = []
    for (let j = 0; j < arr.length; j++) {
        for (let k = j + 1; k < arr.length; k++) {
            result.push([arr[j],arr[k]])
        }
    }

    return result
}

const isInRange = ([i, j], rows, columns) => i >= 0 && i < rows && j >= 0 && j < columns

const matrixToString = (mat) => {
    return mat.map(row => row.join('')).join('\n')
}

const addMarkers = (input, markers) => {
    const newMat = []
    for (let i = 0; i < input.length; i++) {
        const row = []
        for (let j = 0; j < input[i].length; j++) {
            const marker = markers[nodeToString([i,j])]
            // row.push(input[i][j] !== '.' ? input[i][j] : marker || input[i][j])
            row.push(marker || input[i][j])
        }

        newMat.push(row)
    }

    return newMat
}

const getMarkersCount = (input, markers) => {
    let counter = 0
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            const marker = markers[nodeToString([i,j])]
            // row.push(input[i][j] !== '.' ? input[i][j] : marker || input[i][j])
            if (marker || input[i][j] !== '.') {
                counter++
            }
        }
    }

    return counter
}

const part1 = (input, index = 0) => {
    const rows = input.length
    const columns = input[0].length

    const findUniqueSymbols = () => {
        const symbolsVisited = {}

        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input[i].length; j++) {
                if (input[i][j] !== '.') {
                    symbolsVisited[input[i][j]] = symbolsVisited[input[i][j]] || []
                    symbolsVisited[input[i][j]].push([i,j])
                }
            }
        }

        return symbolsVisited
    }

    const uniqueSymbols = findUniqueSymbols(input)

    const addNode = (node1, node2) => {
        return [node1[0] + node2[0], node1[1] + node2[1]]
    }
    const reduceNode = (node1, node2) => {
        return [node1[0] - node2[0], node1[1] - node2[1]]
    }
    const data = _.mapValues(uniqueSymbols, (value, i) => {
        const allComb = getAllComb(value)
        const distances = _.map(allComb, line => {
            const [node1, node2] = line

            return [node2[0] - node1[0], node2[1] - node1[1]]
        })

        const result = _.map(allComb, line => {
            const [node1, node2] = line

            const d = [node2[0] - node1[0], node2[1] - node1[1]]

            //return [reduceNode(node1, d), addNode(node2, d)]
            return [reduceNode(node1, d), addNode(addNode(node1, d),d)]
        })

        return {
            allComb,
            distances,
            result
        }
    })

    // let counter = 0
    const markers = {}
    _.forEach(data, ({result}) => {
        _.forEach(result, nodes => {
            nodes.forEach(node => {
                if (isInRange(node, rows, columns)) {
                    // counter++
                    markers[nodeToString(node)] = '#'
                }
            })
        })
    })

    return Object.keys(markers).length
}

const part2 = (input) => {
    const rows = input.length
    const columns = input[0].length

    const findUniqueSymbols = () => {
        const symbolsVisited = {}

        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input[i].length; j++) {
                if (input[i][j] !== '.') {
                    symbolsVisited[input[i][j]] = symbolsVisited[input[i][j]] || []
                    symbolsVisited[input[i][j]].push([i,j])
                }
            }
        }

        return symbolsVisited
    }

    const uniqueSymbols = findUniqueSymbols(input)

    const addNode = (node1, node2) => {
        return [node1[0] + node2[0], node1[1] + node2[1]]
    }
    const reduceNode = (node1, node2) => {
        return [node1[0] - node2[0], node1[1] - node2[1]]
    }
    const data = _.mapValues(uniqueSymbols, (value, i) => {
        const allComb = getAllComb(value)
        const distances = _.map(allComb, line => {
            const [node1, node2] = line

            return [node2[0] - node1[0], node2[1] - node1[1]]
        })

        const result = _.map(allComb, line => {
            const [node1, node2] = line

            const d = [node2[0] - node1[0], node2[1] - node1[1]]

            //return [reduceNode(node1, d), addNode(node2, d)]
            const arr = []
            let nodeA = reduceNode(node1, d)
            while (isInRange(nodeA, rows, columns)) {
                arr.push(nodeA)
                nodeA = reduceNode(nodeA, d)
            }

            let nodeB = addNode(node2, d)
            while (isInRange(nodeB, rows, columns)) {
                arr.push(nodeB)
                nodeB = addNode(nodeB, d)
            }
            return arr
        })

        return {
            allComb,
            distances,
            result
        }
    })

    // let counter = 0
    const markers = {}
    _.forEach(data, ({result}) => {
        _.forEach(result, nodes => {
            nodes.forEach(node => {
                if (isInRange(node, rows, columns)) {
                    // counter++
                    markers[nodeToString(node)] = '#'
                }
            })
        })
    })

    console.log(matrixToString(addMarkers(input, markers)))
    return getMarkersCount(input, markers)
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
