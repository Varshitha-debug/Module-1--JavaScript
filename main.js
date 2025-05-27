// 1. Setup & Basic Logging
console.log("Welcome to the Community Portal");

window.onload = () => {
  alert("Page fully loaded!");
  init();
};

// Global data storage
let events = [];
let registrations = {};

// 2. Syntax, Data Types & Operators
const exampleEventName = "Music Fiesta";
const exampleEventDate = "2025-06-15";
let exampleSeats = 50;
console.log(`Event: ${exampleEventName}, Date: ${exampleEventDate}, Seats Available: ${exampleSeats}`);

// Decrement seat when user registers
function decrementSeats() {
  if (exampleSeats > 0) exampleSeats--;
  console.log(`Seats left: ${exampleSeats}`);
}

// 3. Conditionals, Loops & Error Handling

// Check if event is upcoming and has seats
function isValidEvent(event) {
  const now = new Date();
  const eventDate = new Date(event.date);
  return eventDate >= now && event.seats > 0;
}

// 4. Functions, Scope, Closures, HOFs

// Closure to track total registrations for a category
function createCategoryTracker() {
  let total = 0;
  return {
    increment: () => total++,
    getTotal: () => total,
  };
}
const musicCategoryTracker = createCategoryTracker();

function addEvent(event) {
  if (!event.name || !event.date || event.seats == null) throw new Error("Invalid event data");
  events.push(event);
}

function registerUser(eventId, user) {
  try {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");
    if (event.seats <= 0) throw new Error("No seats available");
    if (!user.name || !user.email) throw new Error("User info incomplete");

    // Register user
    if (!registrations[eventId]) registrations[eventId] = [];
    registrations[eventId].push(user);

    event.seats--;
    if(event.category === 'music') musicCategoryTracker.increment();

    return "Registration successful";
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

function filterEventsByCategory(category, callback) {
  let filtered = category === "all" ? [...events] : events.filter(e => e.category === category);
  if (callback) callback(filtered);
  return filtered;
}

// 5. Objects & Prototypes

class Event {
  constructor(id, name, date, seats, category, location) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.seats = seats;
    this.category = category;
    this.location = location;
  }
}

Event.prototype.checkAvailability = function() {
  return this.seats > 0;
};

// 6. Arrays & Methods

function addSampleEvents() {
  addEvent(new Event(1, "Music Fiesta", "2025-06-15", 30, "music", "Community Hall"));
  addEvent(new Event(2, "Baking Workshop", "2025-06-20", 15, "workshop", "Kitchen Studio"));
  addEvent(new Event(3, "Soccer Tournament", "2025-07-01", 20, "sports", "Local Stadium"));
  addEvent(new Event(4, "Jazz Night", "2025-06-25", 0, "music", "Jazz Club")); // Full event
}

function getMusicEvents() {
  return events.filter(e => e.category === "music");
}

function formatEventCards(eventsList) {
  return eventsList.map(e => `${e.name} (${e.category})`);
}

// 7. DOM Manipulation

const eventsContainer = document.querySelector("#eventsContainer");
const eventSelect = document.querySelector("#eventSelect");

function renderEvents(eventsList) {
  eventsContainer.innerHTML = "";
  eventSelect.innerHTML = '<option value="">--Select--</option>';

  eventsList.forEach(event => {
    if (!isValidEvent(event)) return; // Skip invalid events

    // Create event card
    const card = document.createElement("div");
    card.className = "eventCard";

    card.innerHTML = `
      <h3>${event.name}</h3>
      <p><b>Date:</b> ${event.date}</p>
      <p><b>Category:</b> ${event.category}</p>
      <p><b>Location:</b> ${event.location}</p>
      <p><b>Seats Available:</b> ${event.seats}</p>
      <button class="registerBtn" data-id="${event.id}">Register</button>
    `;
    eventsContainer.appendChild(card);

    // Add option to registration select
    const option = document.createElement("option");
    option.value = event.id;
    option.textContent = `${event.name} (${event.date})`;
    eventSelect.appendChild(option);
  });
}

// 8. Event Handling

eventsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("registerBtn")) {
    const eventId = Number(e.target.dataset.id);
    const userName = registrationForm.userName.value.trim();
    const userEmail = registrationForm.userEmail.value.trim();
    const messageDiv = document.getElementById("formMessage");

    const msg = registerUser(eventId, { name: userName, email: userEmail });
    messageDiv.textContent = msg;

    if (msg === "Registration successful") {
      renderEvents(events);
      registrationForm.reset();
    }
  }
});

const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

categoryFilter.onchange = () => {
  let filtered = filterEventsByCategory(categoryFilter.value);
  filtered = filtered.filter(e => e.name.toLowerCase().includes(searchInput.value.toLowerCase()));
  renderEvents(filtered);
};

searchInput.onkeydown = () => {
  let filtered = filterEventsByCategory(categoryFilter.value);
  filtered = filtered.filter(e => e.name.toLowerCase().includes(searchInput.value.toLowerCase()));
  renderEvents(filtered);
};

// 11. Working with Forms

const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target.userName.value.trim();
  const email = e.target.userEmail.value.trim();
  const eventId = Number(e.target.eventSelect.value);
  const messageDiv = document.getElementById("formMessage");

  if (!name || !email || !eventId) {
    messageDiv.textContent = "Please fill all fields.";
    return;
  }
  const msg = registerUser(eventId, { name, email });
  messageDiv.textContent = msg;

  if (msg === "Registration successful") {
    renderEvents(events);
    registrationForm.reset();
  }
});

// 9. Async JS (Mock Fetch)

function mockFetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(events);
    }, 1500);
  });
}

async function loadEventsAsync() {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "block";

  try {
    const data = await mockFetchEvents();
    spinner.style.display = "none";
    renderEvents(data);
  } catch {
    spinner.style.display = "none";
    eventsContainer.textContent = "Failed to load events.";
  }
}

// 12. AJAX & Fetch API (Mock POST)

function mockPostRegistration(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) resolve({ status: "success" });
      else reject({ status: "error" });
    }, 1000);
  });
}

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const messageDiv = document.getElementById("formMessage");
  messageDiv.textContent = "Submitting registration...";

  const formData = {
    name: registrationForm.userName.value.trim(),
    email: registrationForm.userEmail.value.trim(),
    eventId: Number(registrationForm.eventSelect.value),
  };

  try {
    const response = await mockPostRegistration(formData);
    if (response.status === "success") {
      messageDiv.textContent = "Registration successful (via server)!";
      renderEvents(events);
      registrationForm.reset();
    }
  } catch {
    messageDiv.textContent = "Registration failed. Please try again.";
  }
});

// 13. Debugging notes:
// Use console.log generously to track states, especially event list and registrations.

// 14. Version control: This would be managed on GitHub, commit after adding each feature or bug fix.

// Initialize data and UI
function init() {
  addSampleEvents();
  loadEventsAsync();
}
