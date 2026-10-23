
export async function getJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error fetching book data");
        }

        const data = await response.json();

        return data;

    } catch (error) {
        throw error;
    }
}

export async function fetchData(query = "programming") {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&fields=key,title,author_name,first_publish_year,cover_i,subject,edition_count`;

    try {
        const data = await getJSON(url);

        return data.docs;

    } catch (error) {
        throw error;
    }
}
