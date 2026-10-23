
import { fetchData, getJSON } from "./api.js";
import { renderBooks } from "./render.js";
import "./style.css";

document.querySelector("#app").innerHTML = `
  <div class="min-h-screen bg-[#f8faf0] text-gray-800">
    <header class="border-b border-green-100 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <a href="#" class="text-2xl font-bold tracking-tight text-green-800">
          PageBloom<span class="text-green-500">.</span>
        </a>
        <p class="hidden text-sm text-gray-500 sm:block">
          Discover your next favorite book.
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-5 py-10">
      <section class="mb-10">
        <p class="mb-3 font-semibold uppercase tracking-widest text-green-700">
          Your next chapter starts here
        </p>
        <h1 class="mb-4 max-w-3xl text-4xl font-bold leading-tight text-green-950 sm:text-5xl">
          Books worth discovering.
        </h1>
        <p class="mb-7 max-w-2xl leading-7 text-gray-600">
          Explore books, discover new subjects, and find your next great read.
        </p>

        <form id="search-form" class="flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label for="book-search" class="sr-only">Search books</label>
          <input
            id="book-search"
            type="search"
            placeholder="Search by title, author, or subject..."
            class="min-w-0 flex-1 rounded-xl border border-green-200 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          <button
            type="submit"
            class="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Search books
          </button>
        </form>
      </section>

      <section aria-label="Book statistics" class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article class="rounded-2xl border border-green-100 bg-white p-5">
          <p class="text-sm text-gray-500">Books loaded</p>
          <p id="total-books-stat" class="mt-2 text-3xl font-bold text-green-800">—</p>
        </article>
        <article class="rounded-2xl border border-green-100 bg-white p-5">
          <p class="text-sm text-gray-500">Books with known authors</p>
          <p id="known-authors-stat" class="mt-2 text-3xl font-bold text-green-800">—</p>
        </article>
      </section>

      <section>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-green-950">Explore the collection</h2>
            <p class="mt-1 text-sm text-gray-500">Search, filter, and sort the books.</p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label for="book-subject" class="mb-1 block text-sm font-medium">Subject</label>
              <select id="book-subject" class="w-full rounded-lg border border-green-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200">
                <option value="all">All subjects</option>
              </select>
            </div>

            <div>
              <label for="book-sort" class="mb-1 block text-sm font-medium">Sort by</label>
              <select id="book-sort" class="w-full rounded-lg border border-green-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200">
                <option value="year">Latest publication year</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
          </div>
        </div>

        <div id="book-results" aria-live="polite" aria-busy="true"></div>
      </section>
    </main>

    <footer class="mt-12 border-t border-green-100 bg-white">
      <div class="mx-auto max-w-7xl px-5 py-6 text-sm text-gray-500">
        PageBloom · Discover your next favorite book.
      </div>
    </footer>
  </div>

  <div
    id="book-modal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 id="modal-title" class="text-xl font-bold text-green-950">Book details</h2>
        <button
          id="close-book-modal"
          type="button"
          aria-label="Close book details"
          class="rounded-lg px-3 py-2 text-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
        >×</button>
      </div>
      <div id="modal-content"></div>
    </div>
  </div>
`;

const bookResults = document.querySelector("#book-results");
const searchInput = document.querySelector("#book-search");
const searchForm = document.querySelector("#search-form");
const sortSelect = document.querySelector("#book-sort");
const subjectSelect = document.querySelector("#book-subject");
const bookModal = document.querySelector("#book-modal");
const modalContent = document.querySelector("#modal-content");
const closeModalButton = document.querySelector("#close-book-modal");
const totalBooksStat = document.querySelector("#total-books-stat");
const knownAuthorsStat = document.querySelector("#known-authors-stat");

const state = {
    books: [],
    searchQuery: "",
    selectedSubject: "all",
    status: "loading",
    error: null
};

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function calculateBookStatistics(books) {
    const totalBooks = books.reduce(total => total + 1, 0);

    const booksWithKnownAuthors = books.reduce((total, book) => {
        return total + (book.author_name?.length ? 1 : 0);
    }, 0);

    return { totalBooks, booksWithKnownAuthors };
}

function updateBookStatistics() {
    const { totalBooks, booksWithKnownAuthors } =
        calculateBookStatistics(state.books);

    totalBooksStat.textContent = totalBooks.toLocaleString();
    knownAuthorsStat.textContent = booksWithKnownAuthors.toLocaleString();
}

function populateSubjects() {
    const subjects = [
        ...new Set(
            state.books.flatMap(({ subject }) => subject || [])
        )
    ].toSorted((a, b) => a.localeCompare(b));

    subjectSelect.innerHTML = `
        <option value="all">All subjects</option>
        ${subjects.map(subject => `
            <option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>
        `).join("")}
    `;
}

function getVisibleItems(state, sortBy) {
    const query = state.searchQuery.toLowerCase().trim();

    const filteredBooks = state.books.filter(
        ({ title, author_name, subject }) => {
            const searchableText = [
                title || "",
                ...(author_name || []),
                ...(subject || [])
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(query);

            const matchesSubject =
                state.selectedSubject === "all" ||
                (subject || []).includes(state.selectedSubject);

            return matchesSearch && matchesSubject;
        }
    );

    if (sortBy === "title") {
        return filteredBooks.toSorted((a, b) =>
            (a.title || "").localeCompare(b.title || "")
        );
    }

    return filteredBooks.toSorted(
        (a, b) =>
            (b.first_publish_year || 0) -
            (a.first_publish_year || 0)
    );
}

function updateResults() {
    renderBooks(getVisibleItems(state, sortSelect.value));
    bookResults.setAttribute("aria-busy", "false");
}

function showMessage(message, type = "info") {
    const styles = {
        info: "border-green-100 bg-white text-gray-600",
        error: "border-red-200 bg-red-50 text-red-700"
    };

    bookResults.innerHTML = `
        <div class="rounded-xl border p-6 text-center ${styles[type] || styles.info}">
            ${escapeHTML(message)}
        </div>
    `;
    bookResults.setAttribute("aria-busy", "false");
}

function showRetryButton(message) {
    bookResults.innerHTML = `
        <div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p class="mb-4 text-red-700">${escapeHTML(message)}</p>
            <button
                id="retry-loading"
                type="button"
                class="rounded-lg bg-green-800 px-5 py-2 font-semibold text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
                Try again
            </button>
        </div>
    `;
    bookResults.setAttribute("aria-busy", "false");
}

let previousFocusedElement = null;

async function showBookDetails(bookKey) {
    const book = state.books.find(item => item.key === bookKey);

    if (!book) return;

    previousFocusedElement = document.activeElement;
    bookModal.classList.remove("hidden");
    bookModal.classList.add("flex");
    modalContent.innerHTML = `
        <p class="py-8 text-center text-gray-500" role="status">
            Loading book details...
        </p>
    `;
    closeModalButton.focus();

    try {
        const detail = await getJSON(
            `https://openlibrary.org${encodeURI(bookKey)}.json`
        );

        const description = typeof detail.description === "string"
            ? detail.description
            : detail.description?.value || "No description is available.";

        const authors = book.author_name?.join(", ") || "Unknown author";
        const subjects = (detail.subjects || book.subject || []).slice(0, 10);

        modalContent.innerHTML = `
            <div class="space-y-4">
                <p class="text-lg font-semibold text-green-900">
                    ${escapeHTML(detail.title || book.title || "Untitled")}
                </p>
                <p class="text-sm text-gray-600">
                    <span class="font-semibold">Author:</span>
                    ${escapeHTML(authors)}
                </p>
                <p class="text-sm text-gray-600">
                    <span class="font-semibold">First published:</span>
                    ${escapeHTML(book.first_publish_year || "Unknown")}
                </p>
                <div>
                    <h3 class="mb-2 font-semibold text-green-900">Description</h3>
                    <p class="whitespace-pre-line leading-7 text-gray-600">
                        ${escapeHTML(description)}
                    </p>
                </div>
                <div>
                    <h3 class="mb-2 font-semibold text-green-900">Subjects</h3>
                    ${
                        subjects.length
                            ? `<div class="flex flex-wrap gap-2">
                                ${subjects.map(subject => `
                                    <span class="rounded-full bg-green-50 px-3 py-1 text-xs text-green-800">
                                        ${escapeHTML(subject)}
                                    </span>
                                `).join("")}
                               </div>`
                            : `<p class="text-sm text-gray-500">No subjects available.</p>`
                    }
                </div>
            </div>
        `;
    } catch {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <p class="text-red-700">We couldn't load the full book details.</p>
                <button
                    id="retry-book-details"
                    type="button"
                    class="rounded-lg bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900"
                >
                    Try again
                </button>
            </div>
        `;

        document.querySelector("#retry-book-details")
            .addEventListener("click", () => showBookDetails(bookKey));
    }
}

function closeBookModal() {
    bookModal.classList.add("hidden");
    bookModal.classList.remove("flex");

    if (previousFocusedElement instanceof HTMLElement) {
        previousFocusedElement.focus();
    }
}

async function loadBooks() {
    state.status = "loading";
    state.error = null;
    bookResults.setAttribute("aria-busy", "true");
    showMessage("Loading books...");

    try {
        state.books = await fetchData();
        state.status = "success";

        populateSubjects();
        updateBookStatistics();
        updateResults();

        if (state.books.length === 0) {
            showMessage("No books are available right now.");
        }
    } catch (error) {
        state.status = "error";
        state.error = error.message || "Something went wrong.";

        totalBooksStat.textContent = "—";
        knownAuthorsStat.textContent = "—";

        showRetryButton("We couldn't load the books. Check your connection and try again.");
    }
}

searchInput.addEventListener("input", () => {
    state.searchQuery = searchInput.value;

    if (state.status === "success") {
        updateResults();
    }
});

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    state.searchQuery = searchInput.value;

    if (state.status === "success") {
        updateResults();
    }
});

sortSelect.addEventListener("change", () => {
    if (state.status === "success") {
        updateResults();
    }
});

subjectSelect.addEventListener("change", () => {
    state.selectedSubject = subjectSelect.value;

    if (state.status === "success") {
        updateResults();
    }
});

bookResults.addEventListener("click", event => {
    const detailsButton = event.target.closest("[data-book-key]");

    if (detailsButton) {
        showBookDetails(detailsButton.dataset.bookKey);
        return;
    }

    if (event.target.closest("#retry-loading")) {
        loadBooks();
    }
});

closeModalButton.addEventListener("click", closeBookModal);

bookModal.addEventListener("click", event => {
    if (event.target === bookModal) {
        closeBookModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !bookModal.classList.contains("hidden")) {
        closeBookModal();
    }
});

loadBooks();
