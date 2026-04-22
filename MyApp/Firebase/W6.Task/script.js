import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
import { getDatabase, ref, set, get, update, remove } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:"AIzaSyAFbaB1N88OqDzddWW8beayyzahXhG8zfI",
  authDomain: "fooddonationapp-29bc5.firebaseapp.com",
  databaseURL: "https://fooddonationapp-29bc5-default-rtdb.firebaseio.com",
  projectId: "fooddonationapp-29bc5",
  storageBucket: "fooddonationapp-29bc5.firebasestorage.app",
  messagingSenderId: "891388433091",
  appId: "1:891388433091:web:fc528032aa1418ed828876",
  measurementId: "G-T3YJ2V8X75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

console.log("Database initialized:", db);


// 🟢 CREATE
function writeUserData(userId, firstname, lastname, email, address, phone) {
  set(ref(db, 'users/' + userId), {
    firstname,
    lastname,
    email,
    address,
    phone
  })
  .then(() => console.log("User added"))
  .catch((error) => console.error("Error:", error));
}

// Example
writeUserData(2, "Janisha", "Rayamajhi", "janisha@example.com", "Kathmandu", "9800000000");


// 🔵 READ
function readUser() {
  const userRef = ref(db, 'users');

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          console.log(child.key, "=>", child.val());
        });
      } else {
        console.log("No data found");
      }
    })
    .catch((error) => console.error(error));
}

readUser();


// 🟡 UPDATE
function updateUserData(userId, updatedData) {
  update(ref(db, 'users/' + userId), updatedData)
    .then(() => console.log("User updated"))
    .catch((error) => console.error(error));
}

// Example
updateUserData(2, { firstname: "Jeny" });


// 🔴 DELETE
function deleteUserData(userId) {
  remove(ref(db, 'users/' + userId))
    .then(() => console.log("User deleted"))
    .catch((error) => console.error(error));
}

// Example
// deleteUserData(2);