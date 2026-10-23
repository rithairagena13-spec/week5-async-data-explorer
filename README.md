# PageBloom — Book Discovery Explorer

A responsive book discovery application that helps users explore books, search by title or author, filter by subject, sort results, and view additional book details.

## Project Information

- **Student:** Ritha IRAGENA
- **Project Name:** PageBloom — Book Discovery Explorer
- **GitHub Repository:** https://github.com/rithairagena13-spec/week5-async-data-explorer
- **Live Demo:** [Add your deployed application URL]
- **Demo Video:** [Add your 3–5 minute demo video URL]
- **API Used:** Open Library Search API

## About the Project

PageBloom is a frontend web application built to practise asynchronous JavaScript and working with external API data. It retrieves book information from Open Library and displays the results in a responsive interface.

The application demonstrates how to fetch data using `async/await`, handle multiple requests with `Promise.all()`, manage application state, render dynamic content, and provide loading, error, and empty states.

## Features

- **Asynchronous data fetching:** Loads book information from the Open Library API when the application starts.
- **Reusable API helper:** Uses `getJSON(url)` to fetch JSON data and handle unsuccessful HTTP responses.
- **Loading state:** Provides feedback while data is loading.
- **Error handling:** Displays an error message when a request fails and provides a Retry button.
- **Book cards:** Displays book titles, authors, publication years, and available cover images.
- **Live search:** Searches book titles, authors, and subjects without refetching data for every search.
- **Subject filtering:** Filters books by available subjects.
- **Sorting:** Supports alphabetical sorting and publication-year sorting.
- **Book details modal:** Displays additional information about a selected book.
- **Empty state:** Shows a helpful message when no books match the current search or filter.
- **Computed statistics:** Uses `reduce()` to calculate book collection statistics.
- **Duplicate prevention:** Uses a `Map` to remove duplicate books by their unique keys.
- **Responsive design:** Adapts the interface to different screen sizes.
- **Accessible interactions:** Includes labelled controls, keyboard support for the details modal, and an `aria-live` region for result updates.
- **Safe rendering:** Uses an HTML-escaping helper for API text inserted into HTML.

## Technologies Used

- HTML5
- Tailwind CSS v4
- JavaScript (ES modules)
- Vite
- Fetch API
- Open Library Search API
- Git and GitHub

## API Documentation

**API provider:** Open Library

Documentation: https://openlibrary.org/dev/docs/api/search

The Search API returns information about books, including titles, authors, publication years, subjects, edition counts, and cover identifiers when available.

Example endpoint:

```text
https://openlibrary.org/search.json?q=programming&limit=6
```

The application requests selected fields to reduce unnecessary data and improve the usefulness of the returned results.

Fields used include:

- `key` — unique work identifier
- `title` — book title
- `author_name` — author names, when available
- `first_publish_year` — first publication year, when available
- `cover_i` — cover image identifier, when available
- `subject` — subjects associated with the book
- `edition_count` — number of editions, when available

### Example API Response

The following is an illustrative example of the relevant data structure, not a captured response from a specific API request.

```json
{
  "docs": [
    {
      "key": "/works/OL12345W",
      "title": "Introduction to Programming",
      "author_name": ["Example Author"],
      "first_publish_year": 2020,
      "cover_i": 123456,
      "subject": ["Programming", "Computers"],
      "edition_count": 3
    }
  ]
}
```

Some books may not contain every field. The application should handle missing information gracefully.

## Asynchronous Data Fetching

The API logic is organized in `src/api.js`.

### Reusable `getJSON(url)` function

The helper uses `fetch()` to request data from a URL. It checks `response.ok` and throws an error containing the HTTP status when the response is unsuccessful. If the request succeeds, it returns the parsed JSON data.

This keeps the request and response-handling logic reusable.

### Using `async/await`

The `fetchData()` function retrieves book data asynchronously. It accepts a search query, constructs the API URLs, and requests two result pages.

### Using `Promise.all()`

`Promise.all()` runs both requests concurrently and waits for both to complete successfully. Their book results are combined, and a `Map` removes duplicate entries using each book's unique `key`.

If either request fails, the error is passed to the application's error-handling flow.

## Project Structure

```text
week5-async-data-explorer/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── screenshots/
│   ├── loading.png
│   ├── success.png
│   ├── empty.png
│   └── error.png
└── src/
    ├── api.js
    ├── main.js
    ├── render.js
    └── style.css
```

## Application State

The application uses one central state object in `src/main.js` to keep track of the data and current interface status.

```javascript
const state = {
    books: [],
    searchQuery: "",
    selectedSubject: "all",
    status: "loading",
    error: null
};
```

- `books` stores the fetched book records.
- `searchQuery` stores the current search text.
- `selectedSubject` stores the selected subject filter.
- `status` represents the current loading or result status.
- `error` stores error information when a request fails.

### State-to-Render Flow

1. The application starts and requests book data.
2. The loading state is displayed while requests are in progress.
3. Successful responses update the state with the retrieved books.
4. Search, filter, and sort controls update the relevant state or display selection.
5. The rendering functions display the current results.
6. If a request fails, the error interface offers the user an opportunity to retry.

This approach separates application data and state from the functions responsible for displaying the interface.

## Search, Filtering, and Sorting

### Search

The search feature compares the user's query against available book titles, authors, and subjects without making a new API request for each change.

Search matching is case-insensitive.

### Filtering

The subject filter is populated from unique subjects available in the fetched book records. Selecting a subject displays matching books.

### Sorting

The application supports two sorting options:

- **Title A–Z:** Sorts book titles alphabetically.
- **Publication year:** Sorts books by publication year, with newer years first where available.

The `toSorted()` method is used to create sorted arrays without mutating the original array.

### Pure Filtering and Sorting Helper

The `getVisibleItems(state, sortBy)` helper determines which books should be displayed based on the current search query, subject filter, and sorting selection.

Keeping this logic separate from DOM rendering makes it easier to understand, test, and maintain.

## Computed Statistics

PageBloom uses `reduce()` to calculate two collection statistics:

1. **Total books:** Counts the number of loaded book records.
2. **Books with known authors:** Counts the records that contain author information.

These values are calculated from the fetched data rather than being hard-coded.

## Book Details Modal

When a user selects the details button on a book card, the application requests additional information for that book using its Open Library work key.

The modal displays available information, such as a description and subjects. It also supports closing through its close button, the Escape key, or clicking the backdrop.

Missing details are handled gracefully because the API does not guarantee that every book contains every field.

## Screenshots

The screenshots below demonstrate the application's main interface states.

### 1. Loading State

![PageBloom loading state](screenshots/loading.png)

Shows the interface while book data is being requested.

### 2. Successful Results

![PageBloom successful results](screenshots/success.png)

Shows the book collection after the API request succeeds.

### 3. Empty State

![PageBloom empty search results](screenshots/empty.png)

Shows the message displayed when the current search or filter returns no matching books.

### 4. Error State

![PageBloom error state](screenshots/error.png)

Shows the error message and Retry button when a request fails.

## How to Run the Project Locally

### Prerequisites

Install Node.js and npm before running the project.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rithairagena13-spec/week5-async-data-explorer.git
   ```

2. Navigate into the project folder:

   ```bash
   cd week5-async-data-explorer
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in the terminal.

### Production Build

To check that the project builds successfully, run:

```bash
npm run build
```

## Error Handling and Limitations

The application checks HTTP responses and displays a user-friendly error state when book data cannot be loaded. The Retry button allows the user to attempt the request again.

Open Library data is community-maintained, so some records may have missing authors, publication years, cover images, descriptions, or subjects. The interface must account for these missing values rather than assuming every field exists.

The application also depends on an internet connection to retrieve book data.

## Demo Video

**Video link:** [Add your 3–5 minute demo video URL]

The demonstration should show:

1. The loading state and successful book results.
2. Searching, filtering, and sorting.
3. Opening and closing a book's details modal.
4. The empty state.
5. An error and the Retry button.
6. The `getJSON()` helper, central state, and `Promise.all()` implementation.
7. API requests in the browser's Network panel.

## Reflection

Working on PageBloom helped me practise asynchronous JavaScript and understand how frontend applications communicate with external APIs. I learned how to use `async/await` and `Promise.all()` to manage multiple requests. I also practised organizing API logic into reusable functions and maintaining application state. Implementing search, filtering, and sorting helped me understand how to transform data before displaying it. Handling loading, error, and empty states showed me why clear feedback is important in a user interface. I also learned to account for missing API fields and escape external text before inserting it into HTML. Overall, this project strengthened my understanding of modular JavaScript and dynamic frontend development.

## Acknowledgements

- [Open Library](https://openlibrary.org/) for providing book data.
- [Open Library Search API Documentation](https://openlibrary.org/dev/docs/api/search) for API reference material.
- Vite and Tailwind CSS documentation for development guidance.
