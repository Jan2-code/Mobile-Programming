import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "contacts"), {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
      createdAt: new Date()
    });

    alert("Message sent!");
  } catch (err) {
    console.error(err);
  }
});