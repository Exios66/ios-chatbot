export function initializeAdmin() {
    loadUserList();
    loadSystemStats();
    document.getElementById('add-user-btn').addEventListener('click', showAddUserForm);
}

async function loadUserList() {
    try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
            throw new Error('Failed to fetch user list');
        }
        const users = await response.json();
        displayUserList(users);
    } catch (error) {
        console.error('Error loading user list:', error);
    }
}

function displayUserList(users) {
    const userTableBody = document.querySelector('#user-table tbody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button class="edit-user" data-id="${user.id}">Edit</button>
                <button class="delete-user" data-id="${user.id}">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', () => editUser(btn.dataset.id));
    });
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
}

async function loadSystemStats() {
    try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
            throw new Error('Failed to fetch system stats');
        }
        const stats = await response.json();
        displaySystemStats(stats);
    } catch (error) {
        console.error('Error loading system stats:', error);
    }
}

function displaySystemStats(stats) {
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('active-chats').textContent = stats.activeChats;
    document.getElementById('server-uptime').textContent = stats.serverUptime;
}

function showAddUserForm() {
    // Implement a modal or form to add a new user
    console.log('Show add user form');
}

function editUser(userId) {
    // Implement user editing functionality
    console.log('Edit user:', userId);
}

async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            loadUserList(); // Reload the user list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}
