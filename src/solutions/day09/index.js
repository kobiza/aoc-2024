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

    const getInfoForLeftMost = (arr) => {
        const result = {
            spaces: [],
            files: []
        }

        let chunkStartIndex = 0
        let prevFileId = arr[0]
        let chunkSize = 1
        for (let i = 1; i < arr.length; i++) {
            const currFileId = arr[i]

            if (currFileId !== prevFileId) {
                const isFile = prevFileId !== '.'
                const start = chunkStartIndex
                const end = i - 1
                if (isFile) {
                    result.files.push({
                        range: {start, end},
                        id: prevFileId,
                        chunkSize: end - start + 1
                    })
                } else {
                    result.spaces.push({
                        range: {start, end},
                        id: prevFileId,
                        chunkSize: end - start + 1
                    })
                }

                chunkSize = 1
                chunkStartIndex = i
                prevFileId = currFileId
            }
        }

        const start = chunkStartIndex
        const end = arr.length - 1
        result.files.push({
            range: {start, end},
            id: prevFileId,
            chunkSize: end - start + 1
        })

        return result
    }

    const findSlot = (spacesArr, fileChunkSize, fileStartIndex) => {
        for (let i = 0; i < spacesArr.length; i++) {
            const currSpaceSlot = spacesArr[i]
            const {chunkSize, range} = currSpaceSlot

            if (range.start > fileStartIndex) {
                // only spaces left to file are relevant
                return -1
            }

            if (fileChunkSize <= chunkSize) {
                return i
            }
        }

        return -1
    }

    const toLeftMost = (arr) => {
        const {files, spaces} = getInfoForLeftMost(arr)
        for (let i = files.length - 1; i >= 0; i--) {
            const currFile = files[i]
            const {range: fileRange, id: fileId, chunkSize: fileChunkSize} = currFile
            const spaceSlotIndex = findSlot(spaces, fileChunkSize, fileRange.start)

            if (spaceSlotIndex !== -1) {
                const spaceSlot = spaces[spaceSlotIndex]
                const {range: spaceRange, chunkSize: spaceChunkSize} = spaceSlot

                currFile.range = {
                    start: spaceRange.start,
                    end: spaceRange.start + fileChunkSize - 1,
                }

                spaceSlot.range = {
                    start: spaceRange.start + fileChunkSize,
                    end: spaceRange.end
                }
                spaceSlot.chunkSize = spaceSlot.chunkSize - fileChunkSize
            }
        }

        const result = [...arr].map(v => '.')
        files.forEach(({range, id}) => {
            for (let i = range.start; i <= range.end; i++) {
                result[i] = {
                    fileId: id,
                }
            }
        })
        spaces.forEach(({range}) => {
            for (let i = range.start; i <= range.end; i++) {
                result[i] = '.'
            }
        })

        return result
    }

    const getChecksum = (arr) => {
        let checksum = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '.') {
                checksum += parseInt(arr[i].fileId) * i
            }
        }


        return checksum
    }

    return getChecksum(toLeftMost(getP1(input)))
    // return {
    //     p1Arr: getP1(input),
    //     leftMostArr: toLeftMost(getP1(input))
    // }
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
