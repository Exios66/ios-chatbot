const socket = io();

export function sendMessage(message) {
    return new Promise((resolve, reject) => {
        socket.emit('chat message', message, (response) => {
            if (response.error) {
                reject(new Error(response.error));
            } else {
                resolve(response);
            }
        });
    });
}

export function onReceiveMessage(callback) {
    socket.on('chat message', callback);
}

export function onTyping(callback) {
    socket.on('bot typing', callback);
}
