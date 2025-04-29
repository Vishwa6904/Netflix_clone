// Add Firebase CDN initialization
// Ensure you have added the Firebase CDN scripts in your index.html
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"></script>

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpc4cIl_d3qJGZ3b4NVSd3D-X9znadiMw",
  authDomain: "clone-db6ca.firebaseapp.com",
  projectId: "clone-db6ca",
  storageBucket: "clone-db6ca.firebasestorage.app",
  messagingSenderId: "421505972575",
  appId: "1:421505972575:web:3fdf84abe04a9d0179deea",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Attach Firebase services to the global window object
window.auth = auth;
window.db = db;

// Export Firebase services
export { auth, db };
