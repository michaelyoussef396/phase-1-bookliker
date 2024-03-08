document.addEventListener("DOMContentLoaded", function () {
  const listPanel = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");
  const currentUser = { id: 1, username: "pouros" }; // Example current user

  // Fetch and display list of books
  function fetchBooks() {
    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((books) => {
        books.forEach((book) => {
          const li = document.createElement("li");
          li.textContent = book.title;
          li.addEventListener("click", () => showBookDetails(book.id));
          listPanel.appendChild(li);
        });
      });
  }

  // Show book details
  function showBookDetails(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`)
      .then((response) => response.json())
      .then((book) => {
        showPanel.innerHTML = `
                    <img src="${book.img_url}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.description}</p>
                    <ul id="users-who-liked">${book.users
                      .map((user) => `<li>${user.username}</li>`)
                      .join("")}</ul>
                    <button id="like-btn">${
                      book.users.some((user) => user.id === currentUser.id)
                        ? "UNLIKE"
                        : "LIKE"
                    }</button>
                `;
        document
          .getElementById("like-btn")
          .addEventListener("click", () => toggleLikeBook(book));
      });
  }

  // Toggle like or unlike a book
  function toggleLikeBook(book) {
    const likedByCurrentUser = book.users.some(
      (user) => user.id === currentUser.id
    );
    const updatedUsers = likedByCurrentUser
      ? book.users.filter((user) => user.id !== currentUser.id) // Remove current user
      : [...book.users, currentUser]; // Add current user

    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: updatedUsers }),
    })
      .then((response) => response.json())
      .then((updatedBook) => {
        showBookDetails(updatedBook.id); // Refresh book details
      });
  }

  fetchBooks(); // Initial call to fetch and display list of books
});
