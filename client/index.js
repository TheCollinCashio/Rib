console.log('test')

const socket = io()
socket.on('connect', () => {
    socket.emit('sayHello')
    socket.emit('sayLove')
})