
import './style.css';

document.querySelector('#app').innerHTML = `
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
          class="rounded-full bg-[#304d3b] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#45684f] focus:outline-2 focus:outline-offset-2 focus:outline-[#304d3b]" >
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
              class="min-w-0 flex-1 rounded-xl border border-[#d9ded3] bg-white px-5 py-4 text-sm outline-none transition placeholder:text-[#9aa398] focus:border-[#719477] focus:ring-2 focus:ring-[#719477]/20">

            <button
              type="submit"
              class="rounded-xl bg-[#304d3b] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#45684f] focus:outline-2 focus:outline-offset-2 focus:outline-[#304d3b]">
              Discover books
            </button>
          </form>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-[#719477]">A world of possibilities</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Books worth discovering
            </h2>
          </div>

          <p class="text-sm text-[#66756a]">Your reading journey begins here.</p>
        </div>

        <div
          id="book-results"
          aria-live="polite"
          class="rounded-2xl border border-dashed border-[#cbd5c7] bg-white/60 px-6 py-12 text-center">
          <p class="text-lg font-medium">Your next favorite book is waiting.</p>
          <p class="mt-2 text-sm text-[#66756a]">
            Search for a topic to start exploring.
          </p>
        </div>
      </section>
    </main>

    <footer class="border-t border-[#e4e6dc] px-5 py-7 text-center text-sm text-[#66756a]">
      Made for curious minds and lifelong readers.
    </footer>
  </div>
`;
