const baseUrl = "https://67295f836d5fa4901b6cf342.mockapi.io/api/v1/ID";

// Fetch and display books
document.getElementById("getData").addEventListener("click", function () {
  fetch(baseUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    })
    .then((books) => renderBooks(books))
    .catch((error) => showMessage("Error: " + error.message, "danger"));
});

// Render books
function renderBooks(books) {
  const output = document.getElementById("output");
  output.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${book.title}</strong> by ${book.author} (${book.year})
      </div>
      <div>
        <button class="btn btn-warning btn-sm" onclick="editBook('${book.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteBook('${book.id}')">Delete</button>
      </div>
    `;
    output.appendChild(li);
  });
}

// Add or Edit book
document.getElementById("bookForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const id = document.getElementById("bookId").value;
  const newBook = {
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    year: document.getElementById("bookYear").value,
    publisher: document.getElementById("bookPublisher").value,
    episode: document.getElementById("bookEpisode").value,
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${baseUrl}/${id}` : baseUrl;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to save book");
      document.getElementById("bookForm").reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById("bookModal"));
      modal.hide();
      refreshBooks();
    })
    .catch((error) => showMessage("Error: " + error.message, "danger"));
});

// Edit book
function editBook(id) {
  fetch(`${baseUrl}/${id}`)
    .then((response) => response.json())
    .then((book) => {
      document.getElementById("bookId").value = book.id;
      document.getElementById("bookTitle").value = book.title;
      document.getElementById("bookAuthor").value = book.author;
      document.getElementById("bookYear").value = book.year;
      document.getElementById("bookPublisher").value = book.publisher;
      document.getElementById("bookEpisode").value = book.episode;

      const modal = new bootstrap.Modal(document.getElementById("bookModal"));
      modal.show();
    })
    .catch((error) => showMessage("Error: " + error.message, "danger"));
}

// Delete book
function deleteBook(id) {
  fetch(`${baseUrl}/${id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete book");
      refreshBooks();
    })
    .catch((error) => showMessage("Error: " + error.message, "danger"));
}

// Refresh book list
function refreshBooks() {
  fetch(baseUrl)
    .then((response) => response.json())
    .then((books) => renderBooks(books))
    .catch((error) => showMessage("Error: " + error.message, "danger"));
}

// Show message
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = `alert alert-${type}`;
  messageDiv.classList.remove("d-none");
  setTimeout(() => messageDiv.classList.add("d-none"), 3000);
}
