import { ClientStore } from 'rib-store'
import RibClient from 'rib-client'

let myRib = new RibClient()

let message = new ClientStore({
    messages: []
})

message.bindToServerStore('messageStore', myRib)

export default message