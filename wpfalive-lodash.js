/**
 * https://lodash.com/docs/4.17.5
 */

const wpfalive = {}

wpfalive.chunk = function(array, size=1) {
    const result = []
    for(let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

