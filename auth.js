// Import necessary modules (replace with your actual imports)
import { auth, db } from "./firebase-config.js"; // Assuming you have a firebaseConfig.js
import { closeAuthModal, openAuthModal } from "./modal.js"; // Assuming you have a modal.js
import { createMovieCard } from "./movieCard.js"; // Assuming you have a movieCard.js

// User authentication state
let currentUser = null;

// Check if user is logged in
function checkAuthState() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      updateUIForLoggedInUser(user);
      loadMyList();
    } else {
      currentUser = null;
      updateUIForLoggedOutUser();
    }
  });
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  document.getElementById("auth-buttons").style.display = "none";
  document.getElementById("user-profile").style.display = "flex";
  document.getElementById("user-name").textContent =
    user.displayName || user.email;
  document.getElementById("my-list-nav").style.display = "block";
  document.getElementById("mylist").style.display = "block";
  document.getElementById("add-to-list-button").style.display = "inline-block";
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
  document.getElementById("auth-buttons").style.display = "flex";
  document.getElementById("user-profile").style.display = "none";
  document.getElementById("my-list-nav").style.display = "none";
  document.getElementById("mylist").style.display = "none";
  document.getElementById("add-to-list-button").style.display = "none";
}

// Sign up user
async function signUpUser(name, email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    await userCredential.user.updateProfile({
      displayName: name,
    });

    // Create user document in Firestore
    await db.collection("users").doc(userCredential.user.uid).set({
      name,
      email,
      myList: [],
    });

    closeAuthModal();
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// Update the navbar after login
function updateNavbarAfterLogin(user) {
  const userNameElement = document.getElementById("user-name");
  const authButtons = document.getElementById("auth-buttons");
  const userProfile = document.getElementById("user-profile");

  if (user) {
    userNameElement.textContent = user.displayName || user.email;
    authButtons.style.display = "none";
    userProfile.style.display = "flex";
  }
}

// Modify loginUser to update the navbar
async function loginUser(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    closeAuthModal();
    updateNavbarAfterLogin(userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// Modify logoutUser to update the navbar
async function logoutUser() {
  try {
    await auth.signOut();
    // Reset the navbar to logged-out state
    const authButtons = document.getElementById("auth-buttons");
    const userProfile = document.getElementById("user-profile");

    authButtons.style.display = "flex";
    userProfile.style.display = "none";
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Add movie/show to user's list
async function addToMyList(content) {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  try {
    const userRef = db.collection("users").doc(currentUser.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const myList = userData.myList || [];

      // Check if content is already in the list
      const existingIndex = myList.findIndex(
        (item) => item.id === content.id && item.type === content.type
      );

      if (existingIndex === -1) {
        // Add to list if not already present
        myList.push(content);
        await userRef.update({ myList });
        alert("Added to My List");
        loadMyList();
      } else {
        // Remove from list if already present
        myList.splice(existingIndex, 1);
        await userRef.update({ myList });
        alert("Removed from My List");
        loadMyList();
      }
    }
  } catch (error) {
    console.error("Error updating My List:", error);
  }
}

// Load user's list
async function loadMyList() {
  if (!currentUser) {
    return;
  }

  try {
    const userRef = db.collection("users").doc(currentUser.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const myList = userData.myList || [];

      const myListRow = document.getElementById("my-list-row");
      myListRow.innerHTML = "";

      if (myList.length === 0) {
        myListRow.innerHTML =
          '<div class="loading">Your list is empty. Add some movies or shows!</div>';
        return;
      }

      myList.forEach((item) => {
        const card = createMovieCard(item);
        myListRow.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Error loading My List:", error);
  }
}

// Check if content is in user's list
async function isInMyList(contentId, contentType) {
  if (!currentUser) {
    return false;
  }

  try {
    const userRef = db.collection("users").doc(currentUser.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const myList = userData.myList || [];

      return myList.some(
        (item) => item.id === contentId && item.type === contentType
      );
    }

    return false;
  } catch (error) {
    console.error("Error checking My List:", error);
    return false;
  }
}

// Export the addToMyList function
export { addToMyList };

// Export the checkAuthState function
export { checkAuthState };

// Export the loadMyList function
export { loadMyList };

// Export the signUpUser function
export { signUpUser };

// Export the loginUser function
export { loginUser };

// Export the logoutUser function
export { logoutUser };

// Export the isInMyList function
export { isInMyList };
