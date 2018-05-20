/**
 * https://lodash.com/docs/4.17.10
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

// wpfalive.difference2 = function(array, ...vals) {
//     return array.reduce((x, y) => (~vals.indexOf(y) || x.push(y), x), [])
// }


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
 // wpfalive.difference2 = (array, values) => array.reduce((x, y) => (~values.indexOf(y) || x.push(y), x), [])


wpfalive.differenceBy = function(array, ...vals) {
    const result = []
    let predicate = wpfalive.iteratee(vals.pop())
    let ary = array.map(predicate)
    let removeAry = Array.from(new Set(wpfalive.flatten(vals))).map(predicate)
    ary.forEach((item, index) => {
        if (!removeAry.some(it => eq(it, item))) {
            result.push(array[index])
        }
    })
}

wpfalive.differenceWith = function(array, ...vals) {
    const func = vals.pop()
    if (wpfalive.getType(func) !== 'function') {
        return
    }

}

/**
 * todo: 判断带有环的对象的相等性 a.a = a, b.a = b
 * _.isEqual(a, b) => true
 * @param  {[type]}  value [description]
 * @param  {[type]}  other [description]
 * @return {Boolean}       [description]
 */
wpfalive.isEqual = function(value, other) {
    if (value === other) {
        return true
    }

    // NaN
    if (value !== value && other !== other) {
        return true
    }

    if (typeof a !== typeof b) {
        return false
    }

    if (Array.isArray(value) && Array.isArray(other)) {
        if (value.length !== other.length) {
            return false
        }

        for(let i = 0; i < value.length; i++) {
            if (!isEqual(value[i], other[i])) {
                return false
            }
        }
        return true
    }

    // 如果一个是数组而另外一个不是
    // 但不能直接写Array.isArray(a) && !Array.isArray(b)
    // 因为不知道a是数组还是b是数组
    // 区分object和array可以用getType
    // 或者下面的办法 亦或
    if (Array.isArray(value) ^ Array.isArray(other)) {
        return false
    }

    // [1,2,3]['length'] => 3
    // isEqual([1, 2, 3], {0:1, 1:2, 2:3, length=3}) 会进入这个分支
    if(value !== null && other !== null && typeof value === 'object' && typeof other === 'object') {
        for(var key in value) {
            if(!wpfalive.isEqual(value[key], other[key])) {
                return false 
            }
        }

        for(var key in other) {
            if(!wpfalive.isEqual(value[key], other[key])) {
                return false 
            }
        }

        return true
    }

    return false

}

wpfalive.range = function(start=0, end, step=1) {
    const result = []
    if (end === undefined) {
        if(start > 0) {
            step = 1
        } else {
            step = -1
        }
        end = start
        start = 0
    }
    const targetEnd = Math.abs(end)
    if(start >= targetEnd) {
        return result
    }

    if (step === 0) {
        return new Array(targetEnd - start).fill(start)
    }
    
    for (let i = start; Math.abs(i) < targetEnd; i += step) {
        result.push(i)
    }
    return result
}

wpfalive.sum = ary => ary.reduce((a, b) => (a += b, a), 0)

/**
 * Flattens array a single level deep.
 * flatten([1, [2, [3, [4]], 5]]) => [1, 2, [3, [4]], 5]
 */
wpfalive.flatten = function(array) {
    // return array.reduce((x, y) => (Array.isArray(y) ? x.push(...y) : x.push(y), x), [])
    return array.reduce((a, b) => a.concat(b), [])
}

/**
 * [map description]
 * @param  collection (Array|Object): The collection to iterate over.
 * @return {[type]}            [description]
 * 解构赋值
 */
wpfalive.map = function(collection, iteratee=wpfalive.identity) {
    const result = []
    if (typeof iteratee === 'string') {
        for (const {user:u} of collection) {
            result.push(u)
        }
        return result
    }
    if (Array.isArray(collection)) {
        for (let item of collection) {
            console.log(item)
            result.push(iteratee(item))
        }
    } else if (typeof collection === 'object') {
        for (const [key, value] of Object.entries(collection)) {
            result.push(iteratee(value))
        }
    }

    return result
}

/**
 * Performs a SameValueZero comparison between two values to determine if they are equivalent.
 * @return {[type]}       [description]
 * value === other对于+0 === -0返回 true
 */
wpfalive.eq = function(value, other) {
    return (value === other) || Object.is(value, other)
}

wpfalive.iteratee = function(func=wpfalive.identity) {
    const type = wpfalive.getType(func)
    if (type === 'string') {
        return wpfalive.property(func)
    } else if (type === 'object') {

    } else if (type === 'array') {

    } else if (type === 'regexp') {

    } else if (type === 'function') {

    }
}

/**
 * Creates a function that returns the value at path of a given object.
 * Array|string
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
wpfalive.property = path => (obj) => wpfalive.toPath(path).reduce((x, y) => x[y], obj)


// wpfalive.property = function(path) {
//     let pathAry = []
//     if(!Array.isArray(path)) {
//         pathAry = path.split('.')
//     } else {
//         pathAry = path.slice()
//     }
//     return function(obj) {
//         return pathAry.reduce((a, b) => {
//             return a = a[b]
//         }, obj)
//     }
// }
// 
    

/**
 * Converts value to a property path array.
 * _.toPath('a.b.c') => ['a', 'b', 'c']
 * _.toPath('a[0].b.c') => ['a', '0', 'b', 'c']
 */
wpfalive.toPath = value => Array.isArray(value) ? value : value.match(/[^\[\]\.]/g)

// wpfalive.toPath = value => value.replace(/[\[\]\.]/g, '').split('')
// wpfalive.toPath = value => value.match(/[^\[\]\.]/g)


wpfalive.identity = function(value) {
    return value
}

wpfalive.getType = function(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

wpfalive.matches = function(source) {
    return wpfalive.bind(wpfalive.isMatch, null, _, source)
}

wpfalive.isMatch = function(object, source) {
    for(let key in source) {
        if (!wpfalive.isEqual(source[key], object[key])) {
            return false
        }
    }
    return true
}

wpfalive.reverse = ary => ary.reverse()













