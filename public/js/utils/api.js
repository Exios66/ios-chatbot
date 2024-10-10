const socket = io({
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000
});

export function sendMessage(message) {
    return new Promise((resolve, reject) => {
        socket.emit('chat message', message, (response) => {
            if (response.error) {
                console.error('Error sending message:', response.error);
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

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

socket.on('reconnect_attempt', (attempt) => {
    console.log(`Reconnection attempt #${attempt}`);
});
