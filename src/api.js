
export async function getJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error fetching book data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function fetchData(query = "programming") {
    const fields =
        "key,title,author_name,first_publish_year,cover_i,subject,edition_count";

    const fictionURL =
        `https://openlibrary.org/search.json?q=subject:fiction&limit=6&fields=${fields}`;

    const programmingURL =
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=6&fields=${fields}`;

    try {
        const [fictionData, programmingData] = await Promise.all([
            getJSON(fictionURL),
            getJSON(programmingURL)
        ]);

        const uniqueBooks = new Map();

        [...fictionData.docs, ...programmingData.docs].forEach(book => {
            if (book.key && !uniqueBooks.has(book.key)) {
                uniqueBooks.set(book.key, book);
            }
        });

        return [...uniqueBooks.values()];
    } catch (error) {
        throw error;
    }
}
