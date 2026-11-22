const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editingUserId = null;

// 1. Load and display users when the page opens
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await getAllUsersAPI();
    const users = Array.isArray(response)
      ? response
      : response.data || response.users;

    users.forEach((user) => displayUserOnScreen(user));
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
});

// 2. Handle form submission (Create OR Update)
userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userData = {
    username: document.getElementById("username").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
  };

  try {
    if (editingUserId) {
      // UPDATE EXISTING USER
      const response = await updateUserAPI(editingUserId, userData);
      const updatedUser = response.user || response.data || response;

      const existingLi = document.getElementById(`user-${editingUserId}`);
      if (existingLi) {
        const newLi = createUserListItem(updatedUser);
        existingLi.replaceWith(newLi);
      }

      resetFormState();
    } else {
      // CREATE NEW USER
      const response = await createUserAPI(userData);
      const newUser = response.user || response.data || response;

      displayUserOnScreen(newUser);
      userForm.reset();
    }
  } catch (error) {
    console.error("Failed to save user:", error);
    const errMsg =
      error.response?.data?.message || "Error saving user. Check console.";
    alert(errMsg);
  }
});

// Cancel edit mode
cancelEditBtn.addEventListener("click", () => {
  resetFormState();
});

function resetFormState() {
  editingUserId = null;
  userForm.reset();
  formTitle.textContent = "Registration Form";
  submitBtn.textContent = "Register User";
  cancelEditBtn.classList.add("d-none");
}

// 3. Build a list item with Edit and Delete buttons
function createUserListItem(user) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  li.id = `user-${user.id}`;

  const infoSpan = document.createElement("span");
  infoSpan.innerHTML = `<strong>${user.username}</strong> - ${user.phone} (${user.email})`;

  const btnGroup = document.createElement("div");

  // Edit Button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn btn-warning btn-sm me-2";
  editBtn.onclick = () => {
    editingUserId = user.id;
    document.getElementById("username").value = user.username;
    document.getElementById("phone").value = user.phone;
    document.getElementById("email").value = user.email;

    formTitle.textContent = "Edit User";
    submitBtn.textContent = "Update User";
    cancelEditBtn.classList.remove("d-none");
  };

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.onclick = async () => {
    try {
      await deleteUserAPI(user.id);
      li.remove();
      if (editingUserId === user.id) {
        resetFormState();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);
  li.appendChild(infoSpan);
  li.appendChild(btnGroup);

  return li;
}

function displayUserOnScreen(user) {
  const li = createUserListItem(user);
  userList.appendChild(li);
}
