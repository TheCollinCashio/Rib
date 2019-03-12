import { ClientStore } from '../../../../lib/client/RibClient'

let appStore = new ClientStore({
    name: null,
    theme: {
        color: 'blue'
    }
})

export default appStore