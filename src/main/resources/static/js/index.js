const API_URL = '/api/users';
let allUsers = [];

document.addEventListener('DOMContentLoaded', fetchUsers);

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        allUsers = await response.json();
        renderUsers(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function renderUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'user-row';
        row.innerHTML = `
            <td>${user.id}</td>
            <td style="font-weight: 500;">${user.name}</td>
            <td style="color: var(--text-muted);">${user.email}</td>
            <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
            <td class="actions">
                <i class="fas fa-edit action-btn" onclick="editUser(${user.id})" title="Edit User"></i>
                <i class="fas fa-trash action-btn delete" onclick="deleteUser(${user.id})" title="Delete User"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterUsers() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    renderUsers(filtered);
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value
    };

    try {
        let response;
        if (userId) {
            response = await fetch(`${API_URL}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }

        if (response.ok) {
            closeModal();
            fetchUsers();
            document.getElementById('userForm').reset();
        }
    } catch (error) {
        console.error('Error saving user:', error);
    }
});

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

function editUser(id) {
    const user = allUsers.find(u => u.id === id);
    if (user) {
        document.getElementById('modalTitle').innerText = 'Edit User';
        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        openModal();
    }
}

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('modalTitle').innerText = 'Create New User';
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('userModal');
    if (event.target == modal) {
        closeModal();
    }
}
