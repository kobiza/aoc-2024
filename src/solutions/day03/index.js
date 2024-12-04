import _ from 'lodash'
import input from './input'
import example from './example'
import {part1Tests, part2Tests} from './testsData'
import testRunner from "../../utils/testRunner";

const inputParser = (input) => input

const part1 = (input) => {
    var re = /(mul\([\d]{1,3},[\d]{1,3}\))/g;
    var s = input;
    var a = [...s.matchAll(re)]

    // console.log(a.map(v => v[0]))

    return _.sum(a.map(v => v[0]).map(v => v.slice(4,-1).split(',').map(n => parseInt(n))).map(([x,y]) => x * y))
}

const part2 = (input) => {
    const splitToGroups = (str) => {
        var re = /(don't\(\))|(do\(\))/g
        var a = [...str.matchAll(re)]

        let startIndex = 0
        let flag = true

        const ranges = []
        while (a.length > 0) {
            const next = a.shift()

            const nextFlag = next[0] === 'do()'

            if (nextFlag !== flag) {
                ranges.push({flag, start: startIndex, end: next.index})
                startIndex = next.index
                flag = nextFlag
            }
        }

        ranges.push({flag, start: startIndex, end: str.length})

        return ranges
    }

    const parts = splitToGroups(input)
    const relevantParts = parts.filter(v => v.flag)
    const strings = relevantParts.map(v => input.slice(v.start, v.end))
    const results = strings.map(s => part1(s))

    return _.sum(results)
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
