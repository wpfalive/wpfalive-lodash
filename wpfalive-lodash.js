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

// 这种写法，无法支持多个数组的情况
// wpfalive.difference2 = function(array, ...vals) {
//     return array.reduce((x, y) => (~vals.indexOf(y) || x.push(y), x), [])
// }

wpfalive.difference3 = function(array, ...vals) {
    const result = []
    const removeAry = Array.from(new Set(wpfalive.flatten(vals)))
    array.forEach((item, index) => {
        if (!removeAry.some(it => wpfalive.eq(it, item))) {
            result.push(array[index])
        }
    })
    return result
}

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
        if (!removeAry.some(it => wpfalive.eq(it, item))) {
            result.push(array[index])
        }
    })
}

wpfalive.differenceWith = function(array, ...vals) {
    const result = []
    const func = vals.pop()
    debugger
    const removeAry = Array.from(new Set(wpfalive.flatten(vals)))
    array.forEach((item, index) => {
        if(!removeAry.some(it => func(it, item))) {
            result.push(array[index])
        }
    })
    return result
}

/**
 * splice的返回值是被删除的那一项
 * @param  {[type]} array [description]
 * @param  {Number} n     [description]
 * @return {[type]}       [description]
 */
wpfalive.drop = (array, n=1) => (array.splice(0, n), array)

/**
 * Creates a slice of array with n elements dropped from the end
 */
wpfalive.dropRight = (array, n=1) => array.reduce((a, b, i) => (i < array.length - n && a.push(b), a), [])

// wpfalive.dropRight = function(array, n=1) {
//     let start = array.length - n
//     if (start < 0) {
//         start = 0
//     }
//     array.splice(start)
//     return array
// }

wpfalive.dropRightWhile = function(array, predicate=wpfalive.identity) {
    const func = wpfalive.iteratee(predicate)
    while (array.length && func(array[array.length - 1])) {
        array.pop()
    }
    return array
}

wpfalive.fill = function(array, value, start=0, end=array.length) {
    const replaceAry = []
    const length = end - start
    for(let i = 0; i < length; i++) {
        replaceAry.push(value)
    }
    array.splice(start, length, ...replaceAry)
    return array
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

/**
 * Converts value to a property path array.
 * _.toPath('a.b.c') => ['a', 'b', 'c']
 * _.toPath('a[0].b.c') => ['a', '0', 'b', 'c']
 * https://github.com/ramda/ramda/issues/1965
 */
wpfalive.toPath = value => Array.isArray(value) ? value : value.split(/[^\w\d]+/g)

wpfalive.identity = function(value) {
    return value
}

wpfalive.getType = function(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

wpfalive.matches = function(source) {
    return wpfalive.bind(wpfalive.isMatch, null, '#', source)
}

wpfalive.isMatch = function(object, source) {
    for(let key in source) {
        if (!wpfalive.isEqual(source[key], object[key])) {
            return false
        }
    }
    return true
}

wpfalive.iteratee = function(func=wpfalive.identity) {
    const type = wpfalive.getType(func)
    if (type === 'string') {
        return wpfalive.property(func)
    } else if (type === 'object') {
        return wpfalive.matches(func)
    } else if (type === 'array') {
        // func是数组，数组第一个元素为属性，第二个元素为srcVal
        return wpfalive.matchesProperty(func[0], func[1])
    } else if (type === 'regexp') {

    } else if (type === 'function') {
        return func
    }
}

/**
 * Creates a function that returns the value at path of a given object.
 * Array|string
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
// wpfalive.property = path => (obj) => wpfalive.toPath(path).reduce((x, y) => x[y], obj)


// 使用key in array 遍历下标
// 使用key of array 遍历数组的每一项
// 可以使用forEach或者reduce, 然后在外部捕获异常
wpfalive.property = function (path) {
    const type = wpfalive.getType(path)
    if( type === 'number') {
        path = String(path)
    }
    if (type !== 'array' && type !== 'string' && type !== 'number') {
        return undefined
    }
    let pathAry = wpfalive.toPath(path)
    return function (obj) {
        try {
            return pathAry.reduce((a,b) => {
                return a = a[b]
            }, obj)
        } catch(e) {
            console.log('error occurs: ', e)
            return undefined
        }
    }
}



wpfalive.matchesProperty = function(path, srcValue) {
    return function(obj) {
        const getProperty = wpfalive.property(path)
        return wpfalive.isEqual(getProperty(obj), srcValue)
    }
}

wpfalive.find = function(collection, predicate=wpfalive.identity, fromIndex=0) {
    const func = wpfalive.iteratee(predicate)
    for (let i = fromIndex; i < collection.length; i++) {
        if (func(collection[i])) {
            return collection[i]
        }
    }
}

wpfalive.findIndex = function(array, predicate=wpfalive.identity, fromIndex=0) {
    const func = wpfalive.iteratee(predicate)
    for (let i = fromIndex; i < array.length; i++) {
        if (func(array[i])) {
            return i
        }
    }
    return -1
}

wpfalive.findLastIndex = function(array, predicate=wpfalive.identity, fromIndex=array.length-1) {
    const func = wpfalive.iteratee(predicate)
    for (let i = fromIndex; i >= 0; i--) {
        if(func(array[i])) {
            return i
        }
    }
    return -1
}

// concat是把数组的每一项都拿进来了
wpfalive.flatten = array => array.reduce((a, b) => a.concat(b), [])

// wpfalive.flatten = function(array) {
//     return array.reduce((a, b) => (Array.isArray(b) ? a.push(...b) : a.push(b), a), [])
// }


wpfalive.flattenDeep = array => array.reduce((a, b) => a.concat(Array.isArray(b) ? wpfalive.flattenDeep(b) : b), [])

// wpfalive.flattenDeep = function(array, result=[]) {
//     for (let item of array) {
//         if (Array.isArray(item)) {
//             wpfalive.flattenDeep(item, result)
//         } else {
//             result.push(item)
//         }
//     }
//     return result
// }

// depth > 1 ???
wpfalive.flattenDepth = (array, depth=1) => array.reduce((a, b) => a.concat(Array.isArray(b) && depth > 1 ? 
    wpfalive.flattenDepth(b, --depth) : 
    b), [])
// _.flattenDepth([1, [2, [3, [4]], 5]], 1) => [1, 2, [3, [4]], 5]
// _.flattenDepth([1, [2, [3, [4]], 5]], 2) => [1, 2, 3, [4], 5]
// wpfalive.flattenDepth = function(array, depth=1, result=[]) {
    
//     // depth -= 1

//     for (let item of array) {
//         if (Array.isArray(item) && depth > 0) {
//             depth -= 1
//             result.concat(wpfalive.flattenDepth(item, depth, result))
//         } else {
//             result.push(item)
//         }
//     }

//     return result
// }

// array to object
// _.fromPairs([['a', 1], ['b', 2]]) => { 'a': 1, 'b': 2 }
wpfalive.fromPairs = pairs => pairs.reduce((a, b) => (a[b[0]] = b[1], a), {})

// object to array
wpfalive.toPairs = function(object) {
    const result = []
    const entries = Object.entries(object)
    for (let entry of entries) {
        result.push(entry)
    }
    return result
}

wpfalive.head = array => array.shift()

wpfalive.indexOf = function(array, value, fromIndex=0) {
    if (fromIndex < 0) {
        fromIndex = array.length + fromIndex
    }
    for (let i = fromIndex; i < array.length; i++) {
        if (wpfalive.isEqual(array[i], value)) {
            return i
        }
    }
    return -1
}

wpfalive.initial = array => array.slice(0, -1)
// wpfalive.initial = function(array) {
//     array.pop()
//     return array
// }

// 如何简化成一行
wpfalive.intersection = function(...arrays) {
    let result = arrays[0]
    for (let i = 1; i < arrays.length; i++) {
        result = wpfalive.getCommon(result, arrays[i])
    }
    return result
}

// 获取两个数组中相同的数，返回新数组
wpfalive.getCommon = function(a, b, iteratee=wpfalive.identity) {
    const result = []
    const func = wpfalive.iteratee(iteratee)
    const tempB = b.map(func)
    const tempA = a.map(func)
    for (let i = 0; i < tempA.length; i++) {
        if(tempB.indexOf(tempA[i]) !== -1) {
            result.push(a[i])
        }
    }
    return result
}

wpfalive.intersectionBy = function(...arrays) {
    const iteratee = arrays.pop()
    let result = arrays[0]
    for (let i = 1; i < arrays.length; i++) {
        result = wpfalive.getCommon(result, arrays[i], iteratee)
    }
    return result
}

wpfalive.intersectionWith = function(...arrays) {


}

wpfalive.join = function(array, separator=',') {
    return array.reduce((a, b) => a += b + separator, '').slice(0, -1)
}

wpfalive.last = array => array[array.length - 1]

wpfalive.lastIndexOf = function(array, value, fromIndex=array.length-1) {
    if (fromIndex < 0) {
        fromIndex = array.length + fromIndex
    }
    for (let i = fromIndex; i >= 0; i--) {
        if (wpfalive.isEqual(array[i], value)) {
            return i
        }
    }
    return -1
}

wpfalive.nth = function(array, n=0) {
    if (n > array.length) {
        return 
    }
    if (n < 0) {
        n = array.length + n
    }
    return array[n]
}

wpfalive.pull = (array, ...values) => array.reduce((result, item, index) => (values.indexOf(item) === -1 ? result.push(item) : (1 === 1), result), [])

// wpfalive.pull = function(array, ...values) {
//     const result = []
//     array.forEach((item, index) => {
//         if (values.indexOf(item) === -1) {
//             result.push(item)
//         }
//     })
//     array = result
//     return array
// }

// values is an array
wpfalive.pullAll = function(array, values) {
    return wpfalive.pull(array, ...values)
}

wpfalive.pullAllWith = function(array, values, comparator) {
    const result = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < values.length; j++) {
            if (!comparator(array[i], values[j])) {
                result.push(array[i])
            }
        }
    }
    array = result
    return array
}

// splice一次之后，已经无法通过最初传进来的index判断要移除的元素了
wpfalive.pullAt = function(array, ...index) {
    const indexAry = wpfalive.flattenDeep(index)
    const pulled =  indexAry.reduce((a, b) => (a.push(array.splice(b, 1, '#')), a), [])
    // array = array.filter(item => item !== '#') // 这种写法没法直接影响外部的array
    for (let i = 0; i < array.length; i++) {
        if (array[i] === '#') {
            array.splice(i, 1)
            i--
        }
    }
    return pulled
}

wpfalive.remove = function(array, predicate=wpfalive.identity) {
    const func = wpfalive.iteratee(predicate)
    // 被移除元素的集合
    return array.reduce((pulled, item, idx) => (func(item) ? pulled.push(array.splice(idx, 1)) : (1 === 1), pulled), [])
}

wpfalive.reverse = ary => ary.reverse()

// This method is used instead of Array#slice to ensure dense arrays are returned.
// Array#slice 效果如下
// const ary = new Array(5)
// ary[1] = 1
// ary[2] = 2
// ary[3] = 3
// ary.slice(0) => [empty, 1, 2, 3, empty]
// _.slice(ary, 0) => [undefined, 1, 2, 3, undefined]
wpfalive.slice = function(array, start=0, end=array.length) {
    const result = []
    for (let i = start; i < end; i++) {
        result.push(array[i])
    }
    return result
}

/**
 * 二分查找 value合适放置的最小下标
 * array (Array): The sorted array to inspect
 */
wpfalive.sortedIndex = function(array, value) {
    const len = array.length
    let start = 0
    let end = len - 1
    let mid = Math.floor((start + end) / 2)
    
    if (value <= array[0]) {
        return 0
    }
    if (value > array[end]) {
        return end + 1
    }
    
    while(start < end) {
        if (array[mid] > value) {
            end = mid
            mid = Math.floor((start + end) / 2)
        } else if (array[mid] < value) {
            start = mid
            mid = Math.floor((start + end) / 2)
        } else if (array[mid] === value) {
            return mid
        }
        if (mid === start) {
            return start + 1
        }
        // 因为总是取Math.floor, 所以这里mid不可能等于end
        // if (mid === end) {
        //     console.log('mid = end')
        //     return end - 1
        // } 
    }
}

wpfalive.sortedIndexBy = function(array, value, iteratee=wpfalive.identity) {
    const func = wpfalive.iteratee(iteratee)
    return wpfalive.sortedIndex(array.map(func), func(value))
}

// wrong
// 二分查找元素，如果没找到则返回 -1
wpfalive.sortedIndexOf = function(array, value) {
    const len = array.length
    let start = 0
    let end = len - 1
    let mid = Math.floor((start + end) / 2)
    
    if (value < array[0] || value > array[end]) {
        return -1
    }
    
    while(start < end) {
        if (array[mid] > value) {
            end = mid
            mid = Math.floor((start + end) / 2)
        } else if (array[mid] < value) {
            start = mid
            mid = Math.floor((start + end) / 2)
        } else if (array[mid] === value) {
            return mid
        }
        if (mid === start) {
            return -1
        }
    }
}

// wrong
wpfalive.sortedLastIndex = function(array, value) {
    const len = array.length
    let start = 0
    let end = len - 1
    let mid = Math.ceil((start + end) / 2)
    
    if (value <= array[0]) {
        return 0
    }
    if (value > array[end]) {
        return end + 1
    }
    
    while(start < end) {
        if (array[mid] > value) {
            end = mid
            mid = Math.ceil((start + end) / 2)
        } else if (array[mid] < value) {
            start = mid
            mid = Math.ceil((start + end) / 2)
        } else if (array[mid] === value) {
            return mid
        }
        // if (mid === start) {
        //     return start + 1
        // }
        // 因为总是取Math.floor, 所以这里mid不可能等于end
        if (mid === end) {
            console.log('mid = end')
            return end - 1
        } 
    }
}

wpfalive.uniq = function(array) {
    return Array.from(new Set(array))
}

wpfalive.sortedUniq = function(array) {
    return array.reduce((a, b) => a.indexOf(b) === -1 ? a.concat(b) : a, [])
}

wpfalive.uniqBy = function(array, iteratee=wpfalive.identity) {
    const result = []
    const func = wpfalive.iteratee(iteratee)
    const newAry = array.map(func)
    newAry.forEach((item, index) => {
        if (!result.some(it => wpfalive.eq(func(it), item))) {
            result.push(array[index])
        }
    })
    return result
}

wpfalive.uniqWith = function(array, comparator) {
    const result = []
    array.forEach(item => {
        if (!result.some((it) => comparator(item, it))) {
            result.push(item)
        }
    })
    return result
}

wpfalive.sortedUniqBy = function(array, iteratee) {
    if (!typeof iteratee === 'function') {
        throw new TypeError('iteratee - what is trying to be bound is not callable')
    }

    // 每次读到唯一的元素，就放到temp数组中
    let temp = []
    let result = []
    let ary = array.map(iteratee)
    ary.forEach((item, index) => {
        if (!wpfalive.eq(item, wpfalive.last(ary))) {
            temp.push(array[index])
            result.push(array[index])
        }
    })
    
    return result
}

// Gets all but the first element of array.
wpfalive.tail = array => array.slice(1)

wpfalive.take = (array, n=1) => array.slice(0, n)

wpfalive.takeRight = (array, n=1) => (n <=0 ? [] : array.slice(-n))

wpfalive.takeRightWhile = (array, predicate=wpfalive.identity) => {
    const func = wpfalive.iteratee(predicate)
    const len = array.length
    let n = 0
    while (func(array[len-n-1])) {
        n += 1
    }
    return wpfalive.takeRight(array, n)
}

wpfalive.takeWhile = (array, predicate=wpfalive.identity) => {
    const func = wpfalive.iteratee(predicate)
    let n = 0
    while (func(array[n])) {
        n += 1
    }
    return wpfalive.take(array, n)

}

wpfalive.union = (...arrays) => arrays.reduce((result, a) => Array.from(new Set(result.concat(a))),[])

wpfalive.unionBy = (...arrays) => {
    const result = []
    const func = wpfalive.iteratee(arrays.pop())
    const criterionAry = []
    arrays.forEach(item => {
        criterionAry.push(item.map(func))
    })
    
    criterionAry.forEach((item, idxa) => {
        item.forEach((it, idxb) => {
            if (!result.some(a => wpfalive.eq(func(a), it))) {
                result.push(arrays[idxa][idxb])
            }
        })
    })
    return result
}

wpfalive.unionWith = (...arrays) => {
    const func = wpfalive.iteratee(arrays.pop())
    const result = []
    arrays.forEach((item, idx) => {
        item.forEach((it) => {
            if (!result.some(() => func(item[idx], it))) {
                result.push(it)
            }
        })
    })
    return result
}

// arraysMaxLength([1,2,3], ['a', 'b', 'c', 'd'], [true, false]) => 4
wpfalive.arraysMaxLength = (...arrays) => Math.max(...arrays.map(item => item.length))

wpfalive.zip = function(...arrays) {
    const len = arrays.length
    const result = []
    // 算出arrays中的数组的最大长度
    const maxLength = wpfalive.arraysMaxLength(...arrays)

    for (let i = 0; i < len; i++) {
        let ele = []
        for (let j = 0; j < maxLength; j++) {
            ele.push(arrays[j][i])
        }
        result.push(ele)
    }

    return result
}

/**
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 => [['a', 1, true], ['b', 2, false]]
 
 _.unzip(zipped);
 => [['a', 'b'], [1, 2], [true, false]]
 */

wpfalive.unzip = function(array) {
    const len = array.length
    // 每个元素都是一个数组，所有数组的长度相同，所以取第一个的长度就可以了
    const eleLength = array[0].length
    const result = []

    for (let i = 0; i < eleLength; i++) {
        let ele = []
        array.forEach((item) => ele.push(item[i]))
        result.push(ele)
    }

    return result
}

wpfalive.unzipWith = function(array, iteratee=wpfalive.identity) {
    const zipped = wpfalive.unzip(array)

    const result = zipped.map(item => {
        return item.reduce((a, b) => iteratee(a, b), 0)
    })

    return result
}

// An empty object is returned for uncloneable values such as error objects, functions, DOM nodes, and WeakMaps
wpfalive.clone = function(value) {
    const type = wpfalive.getType(value)
    if (type === 'error'
        || type === 'weakmap'
        || type === 'function'
        ) {
        return {}
    }
    else {
        const copy = value
        return copy
    }
}

wpfalive.cloneDeep = function(value) {
    let type = wpfalive.getType(value)
    if (type !== 'array' && type !== 'object') {
        return value
    } else if (type == 'array') {
        return Object.keys(value).map(key => wpfalive.cloneDeep(value[key]))
    } else {
        let obj = Object.create(Object.getPrototypeOf(value))
        Object.keys(value).forEach(key => {
            obj[key] = wpfalive.cloneDeep(value[key])
        })
        return obj
    }
}

/*
function clone(obj) {
    if (typeof obj === 'object' && obj !== null) {
        var o = String.prototype.toString.call(obj).slice(8, -1) === 'array' ? [] : {}
        for (var k in obj) {
            if (typeof obj[k] === 'object' && obj !== null) {
                o[k] = clone(obj[k])
            } else {
                o[k] = obj[k]
            }
        }
    } else {
        return obj
    }
    
    return o
}
*/

wpfalive.get = function(object, path, defaultValue) {
    const func = wpfalive.property(path)
    const result = func(object)
    return result === undefined ? defaultValue : result
}

// bind -> matches -> dropRightWhile
// the placeholder is '#''
// Array.prototype.map returns a new array
// test case
// function greet(greeting, punctuation) {
//  return greeting + ' ' + this.user + punctuation;
// }
// var object = { 'user': 'fred' }
// var bound = wpfalive.bind(greet, object, '#', '!');
// bound('hi')
// => 'hi fred!'

wpfalive.bind = function(func, thisArg, ...partials) {
    if (typeof func != 'function') {
        throw new TypeError('bind - what is trying to be bound is not callable')
    }

    // partials is already an array
    return function() {
        const funcArgs = Array.prototype.slice.call(arguments)
        const result = partials.map(item => {
            if (item === '#') {
                return item = funcArgs.shift()
            } else {
                return item
            }
        })
        const finalArgs = wpfalive.concat(result, funcArgs)
        return func.apply(thisArg, finalArgs)
    }
}













