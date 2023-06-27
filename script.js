// Sign-in and Login
const loginPage = document.getElementById('loginPage');
const signupPage = document.getElementById('signupPage');
const todoPage = document.getElementById('todoPage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupLink = document.getElementById('signupLink');
const loginLink = document.getElementById('loginLink');
const messageElement = document.getElementById('message');
const signupMessageElement = document.getElementById('signupMessage');
const logoutBtn = document.getElementById('logoutBtn');
let loggedInUsername = '';


// Event listener for signup form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsernameInput').value;
  const password = document.getElementById('signupPasswordInput').value;
  if (username && password) {
    const user = { username, password };
    signup(user);
  }
});

// Event listener for signup link click
signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(signupPage);
});

// Event listener for login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;
  if (username && password) {
    const user = { username, password };
    login(user);
  }
});

// Event listener for login link click
loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(loginPage);
});

// Function to handle user signup
function signup(user) {
  // Retrieve registered users from localStorage
  let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

  // Check if the username is already taken
  const isUsernameTaken = registeredUsers.some((registeredUser) => registeredUser.username === user.username);

  if (isUsernameTaken) {
    // Display error message
    signupMessageElement.textContent = 'Username is already taken. Please choose a different username.';
  } else {
    // Add the user to the registered users list
    registeredUsers.push(user);
    // console.log(registeredUsers);
    // Save the updated registered users list to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Display success message
    signupMessageElement.textContent = 'Signup successful. Please login to proceed.';

    // Clear the signup form
    signupForm.reset();

    // Show the login page
    showPage(loginPage);
  }
}


// Function to handle user login
function login(user) {
  // Perform login logic (replace with your own logic)
  // Here, you can validate the user credentials and check against a database or storage

  // Retrieve registered users from localStorage
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));

  if (registeredUsers) {
    // Find the user in the registered users list
    const foundUser = registeredUsers.find(
      (registeredUser) =>
        registeredUser.username === user.username && registeredUser.password === user.password
    );

    if (foundUser) {
      // Set the logged-in username
      loggedInUsername = user.username;

      // Clear the login form
      loginForm.reset();

      // Display success message
      messageElement.textContent = 'Login successful. Redirecting to the To-Do List page...';

      // Show the To-Do List page after a short delay
      setTimeout(() => {
        showPage(todoPage);
        loadTodoList();
      }, 500);
    } else {
      // Display error message
      messageElement.textContent = 'Invalid username or password.';
    }
  } else {
    // Display error message (no registered users found)
    messageElement.textContent = 'No registered users found.';
  }
}


// Function to show a specific page and hide the rest
function showPage(page) {
  const pages = [loginPage, signupPage, todoPage];

  // Hide all pages
  pages.forEach(page => page.style.display = 'none');

  // Show the specified page
  page.style.display = 'block';
}

// Initially show only the sign-up page
showPage(signupPage);

// Logout button event listener
logoutBtn.addEventListener('click', () => {
  loggedInUsername = '';
  showPage(loginPage);
});

// Function to retrieve the user data from local storage
function getUserFromLocalStorage() {
  const userString = localStorage.getItem('user');
  return JSON.parse(userString);
}

// Rest of the code for the To-Do List functionality...
// To-Do List
class Task {
  constructor(todo, dueDate, priority) {
    this.id = Date.now();
    this.todo = todo;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

class Todo extends Task {
  constructor(todo, dueDate, priority) {
    super(todo, dueDate, priority);
  }
}

class UI {
  constructor() {
    this.form = document.getElementById('todoForm');
    this.lists = document.querySelector('[data-lists]');
    this.input = document.querySelector('[data-input]');
    this.dueDateInput = document.querySelector('[data-due-date]');
    this.priorityInput = document.querySelector('[data-priority]');
    this.removeAllBtn = document.querySelector('.removeAll_btn');
  }

  init() {
    this.form.addEventListener('submit', this.addTask.bind(this));
    this.lists.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove')) {
        this.removeTask(e);
        this.saveTodoList();
      }
    });
    this.removeAllBtn.addEventListener('click', this.removeAllTasks.bind(this));
    this.loadTodoList_();
  }

  saveTodoList() {
    const todoList = Array.from(this.lists.children).map((todoItem) => {
      const todo = {
        id: todoItem.dataset.id,
        todo: todoItem.querySelector('.todo_text').textContent,
        dueDate: todoItem.querySelector('.due_date').textContent.split(': ')[1],
        priority: todoItem.querySelector('.priority').textContent.split(': ')[1],
      };
      return todo;
    });

    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  addTask(e) {
    e.preventDefault();

    const todo = this.input.value;
    const dueDate = this.dueDateInput.value;
    const priority = this.priorityInput.value;

    const newTodo = new Todo(todo, dueDate, priority);
    this.addTodoToList(newTodo);

    this.input.value = '';
    this.dueDateInput.value = '';
    this.priorityInput.value = 'low';

    this.saveTodoList();
  }

  removeTodoFromList(todoId) {
    const todoItem = this.lists.querySelector(`[data-id="${todoId}"]`);
    if (todoItem) {
      todoItem.remove();
    }
  }
  removeTask(e) {
    if (e.target.classList.contains('remove')) {
      const todoId = e.target.parentElement.dataset.id;
      this.removeTodoFromList(todoId);
      this.saveTodoList();
    }
  }

  removeAllTasks() {
    while (this.lists.firstChild) {
      this.lists.firstChild.remove();
    }
    this.saveTodoList();
  }

  addTodoToList(todo) {
    const todoItem = this.createTodoItem(todo);
    this.lists.appendChild(todoItem);
  }

  createTodoItem(todo) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo');
    todoItem.innerHTML = `
      <p class="todo_text">${todo.todo}</p>
      <p class="due_date">Due Date: ${todo.dueDate}</p>
      <p class="priority">Priority: ${todo.priority}</p>
      <div class="icon" data-id="${todo.id}">
          <span class="remove">🗑</span>
      </div>
    `;
    
    const removeButton = todoItem.querySelector('.remove');
  removeButton.addEventListener('click', (e) => {
    this.removeTask(e);
  });
    return todoItem;
  }

  loadTodoList_() {
    const savedTodoList = JSON.parse(localStorage.getItem('todoList'));

    if (savedTodoList) {
      savedTodoList.forEach((todo) => {
        const newTodo = new Todo(todo.todo, todo.dueDate, todo.priority);
        this.addTodoToList(newTodo);
      });
    }
  }
}

const storage = new Storage();
storage.saveTodoList(todoList);
const loadedTodoList = storage.loadTodoList();

class Storage {
  constructor() {
    // No initialization tasks required for the constructor
  }

  static saveTodoList(todoList) {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  static loadTodoList() {
    const savedTodoList = JSON.parse(localStorage.getItem('todoList'));
    return savedTodoList ? savedTodoList : [];
  }
}


const ui = new UI();
ui.init();
