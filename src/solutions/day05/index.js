import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => {
    const [rulesStr,groupsStr] = input.split('\n\n')

    const rulesAsc = rulesStr.split('\n').reduce((acc, v) => {
        const [p1,p2] = v.split('|')
        acc[p1] = acc[p1] || {}
        acc[p1][p2] = true

        return acc
    }, {})

    const rulesDesc = rulesStr.split('\n').reduce((acc, v) => {
        const [p1,p2] = v.split('|')
        acc[p2] = acc[p2] || {}
        acc[p2][p1] = true

        return acc
    }, {})
    const groups = groupsStr.split('\n').filter(v => !!v).map(v => v.split(','))

    return {
        rulesAsc,
        rulesDesc,
        groups
    }
}

const middle = (arr) => {
    const index = Math.ceil(arr.length / 2) - 1

    return arr[index]
}

const part1 = (input) => {
    const {
        rulesAsc,
        rulesDesc,
        groups
    } = input

    const canBeBefore = (before, after) => {
        return !_.get(rulesAsc, [after, before], false)
    }

    const isValidOrder = (arr) => {
        const visited = {}

        const allVisitedValid = (value) => {
            return _.every(visited, (v, vKey) => {
                return canBeBefore(vKey, value)
            })
        }

        for (let i = 0; i < arr.length; i++) {
            if (!allVisitedValid(arr[i])) {
                return false
            }

            visited[arr[i]] = true
        }

        return true
    }

    let result = 0
    _.forEach(groups, (group, index) => {
        const isValid = isValidOrder(group)

        if (isValid) {
            console.log('add', index, parseInt(middle(group)))
            result += parseInt(middle(group))
        }
    })

    return result
}

const take = (arr, i) => {
    const v = arr[i]
    const newArr = [...arr.slice(0,i), ...arr.slice(i + 1)]
    return {v, newArr}
}
const push = (arr, value, index) => {
    const a = arr.slice(0,index)
    const b = arr.slice(index)
    return [...a, value, ...b]
}
const moveIndexToIndex = (arr, i, j) => {
    const {v, newArr} = take(arr, j)
    return push(newArr, v, i)
}

const part2 = (input) => {
    const {
        rulesAsc,
        rulesDesc,
        groups
    } = input

    const canBeBefore = (before, after) => {
        return !_.get(rulesAsc, [after, before], false)
    }

    const isValidOrder = (arr) => {
        const visited = {}

        const allVisitedValid = (value) => {
            return _.every(visited, (v, vKey) => {
                return canBeBefore(vKey, value)
            })
        }

        for (let i = 0; i < arr.length; i++) {
            if (!allVisitedValid(arr[i])) {
                return false
            }

            visited[arr[i]] = true
        }

        return true
    }

    const invalidGroups = _.filter(groups, (group, index) => {
        return !isValidOrder(group)
    })


    const fixGroup = (arr) => {
        const visited = {}
        const visitedIndex = {}

        for (let i = 0; i < arr.length; i++) {
            const afterValue = arr[i]
            const beforeValueSorted = rulesAsc[afterValue]
            const invalidIndexes = _.mapValues(beforeValueSorted, (v, key) => visitedIndex[key])

            if (_.some(invalidIndexes, v => !_.isUndefined(v))) {
                const indexToSwap = _.min(_.values(invalidIndexes).filter(v => !_.isUndefined(v)))

                const newArr = moveIndexToIndex(arr, indexToSwap, i)
                return fixGroup(newArr)
            }

            visited[arr[i]] = true
            visitedIndex[arr[i]] = i
        }

        return arr
    }

    const fixed = invalidGroups.map((group) => {
        return fixGroup(group)
    })

    let result = 0
    _.forEach(fixed, (group, index) => {
        result += parseInt(middle(group))
    })

    return result

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
