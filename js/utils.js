export function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
    }
    return userId;
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

export function showErrorMessage(message) {
    alert(message);
}

export function showSuccessMessage(message) {
    alert(message);
}
