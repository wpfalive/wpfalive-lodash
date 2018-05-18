/**
 * https://lodash.com/docs/4.17.5
 */

const wpfalive = {}

wpfalive.chunk = function (array, size=1) {
    const result = []
    for(let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

/**
 * Creates an array with all falsey values removed. The values false, null, 0, "", undefined, and NaN are falsey
 */
wpfalive.compact = function(array) {
    return array.filter(item => !!item)
}

wpfalive.concat = function(array, ...vals) {
    return Array.prototype.concat.apply(array, vals)
}

/**
 * Similar to same-value equality, but considered +0 and -0 equal.
 * same-value equality认为+0和-0相等
 * [difference description]
 * _.difference([2, 1], [2, 3]) => [1]
 * difference([2, 1, 3], [2, 3], [3, 4]) => [1]
 */
wpfalive.difference = function(array, ...vals) {
    const result = []
    // 合并vals中所有array
    const totalAry = vals.reduce((a, b) => {
        return a = a.concat(b)
    })

    // 对合并的数组去重
    const mergedAry = [...new Set(totalAry)]
    
    return array.filter(it => {
        return !mergedAry.includes(it)
    })
}

// ~values.indexOf() 只对-1返回0 (表示false)
// push()返回新数组的长度
// 如果array中某个元素不在values中，那么放入数组x
// 最后返回x
// const difference = (array, values) => array.reduce((x, y) => (~values.indexOf(y) || x.push(y), x), [])


wpfalive.differenceBy = function(array, ...vals) {
    let predicate = wpfalive.iteratee(vals.pop())

}

wpfalive.iteratee = function(func=wpfalive.identity) {
    if(typeof func === 'string') {
        return wpfalive.property()
    }
}

/**
 * Creates a function that returns the value at path of a given object.
 * Array|string
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
wpfalive.property = function(path) {
    let pathAry = []
    if(!Array.isArray(path)) {
        pathAry = path.split('.')
    } else {
        pathAry = path.slice()
    }
    return function(obj) {
        return pathAry.reduce((a, b) => {
            return a = a[b]
        }, obj)
    }
}

/**
 * Converts value to a property path array.
 * _.toPath('a.b.c') => ['a', 'b', 'c']
 * _.toPath('a[0].b.c') => ['a', '0', 'b', 'c']
 */
wpfalive.toPath = function(value) {
    const regex = /[\[\]\.]/
    const pathAry = value.split(regex)
    return pathAry
}

wpfalive.identity = function(value) {
    return value
}















