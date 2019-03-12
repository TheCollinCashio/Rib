export default class RibStore {
    private data = new Map<string, any>()
    private functionMap = new Map<string, ((value?: any) => void)[]>()

    constructor(obj: object) {
        this.set(obj)
    }

    set(obj: object, addFunc?: (value?: any) => void) {
        let unBindFunctions = []

        for (let key in obj) {
            this.data.set(key, obj[key])

            let functions = this.functionMap.get(key)
            
            if (functions) {
                functions.forEach(fn => fn({ [key]: obj[key] }))
            }

            if (addFunc) {
                if (functions) {
                    this.functionMap.set(key, [...functions, addFunc])
                } else {
                    this.functionMap.set(key, [addFunc])
                }

                unBindFunctions.push(() => {
                    this.unBind(key, addFunc)
                })
            }
        }

        return () => {
            unBindFunctions.forEach(f => f())
        }
    }

    get(obj : object) {
        let returnObj = {}
        for (let key in obj) {
            returnObj[key] = this.data.get(key) || obj[key]
        }
        return returnObj
    }

    private unBind(key: string, fnToUnbind: (value?: any) => void) {
        const functions = this.functionMap.get(key)
        this.functionMap.set(key, functions.filter(fn => fn !== fnToUnbind))
    }
}