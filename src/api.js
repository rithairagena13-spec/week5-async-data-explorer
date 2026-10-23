
export async function getJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
}

export async function fetchData(query = "programming") {
    const fields =
        "key,title,author_name,first_publish_year,cover_i,subject,edition_count";

    const encodedQuery = encodeURIComponent(query);

    const firstURL =
        `https://openlibrary.org/search.json?q=${encodedQuery}&limit=6&fields=${fields}`;

    const secondURL =
        `https://openlibrary.org/search.json?q=${encodedQuery}&limit=6&fields=${fields}&page=2`;

    try {
        const [firstData, secondData] = await Promise.all([
            getJSON(firstURL),
            getJSON(secondURL)
        ]);

        const uniqueBooks = new Map();

        [...firstData.docs, ...secondData.docs].forEach(book => {
            if (book.key && !uniqueBooks.has(book.key)) {
                uniqueBooks.set(book.key, book);
            }
        });

        return [...uniqueBooks.values()];
    } catch (error) {
        throw new Error(`Unable to load books: ${error.message}`);
    }
}
