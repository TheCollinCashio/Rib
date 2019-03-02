export function isInObject(obj: any, query: any) {
    let isFound = true
    for (let key in query) {
        if (key === '$or') {
            let isOrFind = false
            for (let nextObj of query[key]) {
                for (let orKey in nextObj) {
                    let queryValue = nextObj[orKey]
                    if (queryValue['$in']) {
                        let foundInArray = true
                        for (let valueIn of queryValue['$in']) {
                            if (!obj[orKey].includes(valueIn.toString())) {
                                foundInArray = false
                                break
                            }
                        }

                        if (!foundInArray) {
                            isFound = false
                            break
                        } else {
                            isOrFind = true
                            break
                        }
                    } else if (typeof obj[orKey] === 'object' && typeof queryValue === 'object') {
                        isOrFind = isInObject(obj[orKey], queryValue)
                        if (isOrFind) {
                            break
                        }
                    } else if (typeof obj[orKey] === 'string' && typeof queryValue === 'string') {
                        if (obj[orKey].toUpperCase() === queryValue.toUpperCase()) {
                            isOrFind = true
                            break
                        }
                    } else if (obj[orKey] == queryValue) {
                        isOrFind = true
                        break
                    }
                }
                if (isOrFind) {
                    break
                }
            }
            isFound = isOrFind

        } else {
            let queryValue = query[key]

            if (key === '$in') {
                let foundInArray = true
                for (let valueIn of query['$in']) {
                    if (!obj.includes(valueIn.toString())) {
                        foundInArray = false
                        break
                    }
                }

                if (!foundInArray) {
                    isFound = false
                    break
                }
            } else {

                if (typeof obj[key] === 'object' && typeof queryValue === 'object') {
                    isFound = isInObject(obj[key], queryValue)
                    if (!isFound) {
                        break
                    }
                } else if (typeof obj[key] === 'string' && typeof queryValue === 'string') {
                    if (obj[key].toUpperCase() !== queryValue.toUpperCase()) {
                        isFound = false
                        break
                    }
                } else if (obj[key] != queryValue) {
                    isFound = false
                    break
                }
            }
        }
    }
    return isFound
}