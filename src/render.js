
export function renderBooks(books) {
    const bookResults = document.querySelector("#book-results");

    bookResults.className =
        "grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

    if (books.length === 0) {
        bookResults.innerHTML = `
            <p class="col-span-full py-12 text-center text-stone-600">
                No books found. Try another search.
            </p>
        `;
        return;
    }

    bookResults.innerHTML = books.map(({
        key,
        title,
        author_name,
        first_publish_year,
        cover_i
    }) => {
        const safeTitle = escapeHTML(title || "Untitled");
        const safeAuthor = escapeHTML(
            author_name?.join(", ") || "Unknown author"
        );
        const safeKey = escapeHTML(key || "");
        const coverUrl = cover_i
            ? `https://covers.openlibrary.org/b/id/${encodeURIComponent(cover_i)}-L.jpg`
            : "";

        return `
            <article class="w-full min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                ${
                    coverUrl
                        ? `
                            <img
                                src="${coverUrl}"
                                alt="Cover of ${safeTitle}"
                                class="h-72 w-full bg-stone-100 object-contain"
                                loading="lazy"
                                onerror="this.onerror=null;this.style.display='none';"
                            >
                        `
                        : `
                            <div class="flex h-72 items-center justify-center bg-stone-100 px-4 text-center text-sm text-stone-500">
                                Cover unavailable
                            </div>
                        `
                }

                <div class="p-5">
                    <h2 class="mb-2 text-lg font-semibold text-stone-900">
                        ${safeTitle}
                    </h2>

                    <p class="mb-2 text-sm text-stone-600">
                        By ${safeAuthor}
                    </p>

                    <p class="mb-4 text-sm text-stone-500">
                        ${
                            first_publish_year || "Year unavailable"
                        }
                    </p>

                    <button
                        type="button"
                        data-book-key="${safeKey}"
                        class="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                    >
                        View details
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
