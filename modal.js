// Function to open a modal
export function openAuthModal() {
  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.style.display = "block";
  }
}

// Function to close a modal
export function closeAuthModal() {
  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.style.display = "none";
  }
}
