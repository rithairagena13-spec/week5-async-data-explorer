import { fetchData, getJSON } from "./api.js";
import { renderBooks } from "./render.js";
import "./style.css";

document.querySelector("#app").innerHTML = `
  <div class="min-h-screen bg-[#f8f7f2] text-[#253b30]">
    <header class="border-b border-[#e4e6dc] bg-[#f8f7f2]">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <a href="#" class="text-2xl font-bold tracking-tight">
          Page<span class="text-[#719477]">Bloom</span>
        </a>

        <p class="hidden text-sm text-[#66756a] sm:block">
          A little inspiration for your next read
        </p>

        <a
          href="#discover"
          class="rounded-full bg-[#304d3b] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#45684f] focus:outline-2 focus:outline-offset-2 focus:outline-[#304d3b]"
        >
          Explore books
        </a>
      </nav>
    </header>

    <main>
      <section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#719477]">
          Your next chapter starts here
        </p>

        <h1 class="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-7xl">
          Find a book that
          <span class="font-serif italic text-[#719477]">feels like you.</span>
        </h1>

        <p class="mt-6 max-w-xl text-base leading-7 text-[#66756a] md:text-lg">
          Explore stories, discover new authors, and find your next favorite
          book with PageBloom.
        </p>

        <div id="discover" class="mt-10 max-w-2xl">
          <label for="book-search" class="mb-3 block text-sm font-medium">
            What would you love to read?
          </label>

          <form id="search-form" class="flex flex-col gap-3 sm:flex-row">
            <input
              id="book-search"
              name="search"
              type="search"
              placeholder="Try fantasy, history, or programming..."
              aria-label="Search loaded books by title, author, or subject"
              class="min-w-0 flex-1 rounded-xl border border-[#d9ded3] bg-white px-5 py-4 text-sm outline-none transition placeholder:text-[#9aa398] focus:border-[#719477] focus:ring-2 focus:ring-[#719477]/20"  >

            <button
              type="submit"
              class="rounded-xl bg-[#304d3b] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#45684f] focus:outline-2 focus:outline-offset-2 focus:outline-[#304d3b]">
              Discover books
            </button>
          </form>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-medium text-[#719477]">
              A world of possibilities
            </p>

            <h2 class="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Books worth discovering
            </h2>
          </div>

          <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e6dc] bg-white/70 p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <label for="book-sort" class="text-sm text-[#66756a]">
                Sort by:
              </label>

              <select
                id="book-sort"
                class="rounded-lg border border-[#d9ded3] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[#719477]" >
                <option value="title">Title (A–Z)</option>
                <option value="year">Newest first</option>
              </select>
            </div>

            <div class="flex items-center gap-3">
              <label for="book-subject" class="text-sm text-[#66756a]">
                Subject:
              </label>

              <select
                id="book-subject"
                class="max-w-48 rounded-lg border border-[#d9ded3] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[#719477]"  >
                <option value="all">All subjects</option>
              </select>
            </div>
          </div>
        </div>

        <div
          id="book-results"
          aria-live="polite"
          class="w-full rounded-2xl border border-dashed border-[#cbd5c7] bg-white/60 p-4 sm:p-6"  >
          <p class="text-lg font-medium">
            Your next favorite book is waiting.
          </p>

          <p class="mt-2 text-sm text-[#66756a]">
            Search for a topic to start exploring.
          </p>
        </div>
      </section>
    </main>

    <footer class="border-t border-[#e4e6dc] px-5 py-7 text-center text-sm text-[#66756a]">
      Made for curious minds and lifelong readers.
    </footer>

    
<div
  id="book-modal"
  class="fixed inset-0 z-50 hidden items-center justify-center bg-[#253b30]/60 p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div class="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#f8f7f2] p-6 shadow-xl sm:p-8">
    <div class="mb-6 flex items-start justify-between gap-4">
      <h2 id="modal-title" class="text-2xl font-semibold">
        Book details
      </h2>

      <button
        id="close-modal"
        type="button"
        aria-label="Close book details"
        class="rounded-lg px-3 py-2 text-xl hover:bg-[#e4e6dc] focus:outline-2 focus:outline-[#719477]"
      >
        &times;
      </button>
    </div>

    <div id="modal-content" aria-live="polite">
      <p class="text-[#66756a]">Choose a book to explore its details.</p>
    </div>
  </div>
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
const closeModalButton = document.querySelector("#close-modal");

let previouslyFocusedElement = null;

const state = {
    books: [],
    searchQuery: "",
    selectedSubject: "all",
    status: "loading",
    error: null
};

function populateSubjects() {
    const subjects = [
        ...new Set(
            state.books.flatMap(({ subject }) => subject || [])
        )
    ].toSorted((a, b) => a.localeCompare(b));

    subjectSelect.innerHTML = `
        <option value="all">All subjects</option>
        ${subjects.map(subject => `
            <option value="${escapeHTML(subject)}">
                ${escapeHTML(subject)}
            </option>
        `).join("")}
    `;
}

function getVisibleBooks() {
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

    if (sortSelect.value === "title") {
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
    renderBooks(getVisibleBooks());
}

async function loadBooks() {
    state.status = "loading";
    state.error = null;

    bookResults.className =
        "w-full rounded-2xl border border-dashed border-[#cbd5c7] bg-white/60 p-4 sm:p-6";

    bookResults.innerHTML = `
        <p class="py-12 text-center text-stone-600" role="status">
            Loading your next favorite books...
        </p>
    `;

    try {
        state.books = await fetchData();

        populateSubjects();

        state.status = "success";
        updateResults();
    } catch (error) {
        state.status = "error";
        state.error = error;

        bookResults.className =
            "w-full rounded-2xl border border-dashed border-[#cbd5c7] bg-white/60 p-6";

        bookResults.innerHTML = `
            <div class="py-12 text-center">
                <p class="mb-4 text-red-700" role="alert">
                    We couldn't load the books. Please try again.
                </p>

                <button
                    id="retry-button"
                    type="button"
                    class="rounded-lg bg-green-800 px-4 py-2 text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                >
                    Retry
                </button>
            </div>
        `;

        document.querySelector("#retry-button")
            .addEventListener("click", loadBooks);
    }
}

searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;

    if (state.status === "success") {
        updateResults();
    }
});

searchForm.addEventListener("submit", (event) => {
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

subjectSelect.addEventListener("change", (event) => {
    state.selectedSubject = event.target.value;

    if (state.status === "success") {
        updateResults();
    }
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

loadBooks();