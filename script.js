const API_KEY = "your API";
const articlesGrid = document.getElementById("articles-grid");
const loader = document.getElementById("loader");
const noResults = document.getElementById("no-results");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");

let currentCategory = "general";
let currentQuery = "";

const fetchNews = async () => {
  loader.style.display = "flex";
  articlesGrid.innerHTML = "";
  articlesGrid.style.display = "none";
  noResults.style.display = "none";
  errorMessage.style.display = "none";

  let url;
  if (currentQuery) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      currentQuery
    )}&apiKey=${API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${currentCategory}&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      renderArticles(data.articles);
    } else {
      noResults.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    errorMessage.style.display = "block";
  } finally {
    loader.style.display = "none";
  }
};

const renderArticles = (articles) => {
  articles.forEach((article) => {
    if (!article.title || !article.urlToImage || !article.description) return;

    const articleCard = document.createElement("div");
    articleCard.className =
      "bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 ease-in-out";

    const fallbackImage = `https://placehold.co/600x400/f5f5f4/1c1917?text=Image+Not+Found`;

    articleCard.innerHTML = `
                    <a href="${
                      article.url
                    }" target="_blank" rel="noopener noreferrer">
                        <img src="${article.urlToImage}" alt="${
      article.title
    }" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='${fallbackImage}';">
                    </a>
                    <div class="p-5 flex flex-col flex-grow">
                        <h2 class="text-xl font-bold text-stone-900 mb-2 flex-grow">
                             <a href="${
                               article.url
                             }" target="_blank" rel="noopener noreferrer" class="hover:text-stone-600">${
      article.title
    }</a>
                        </h2>
                        <p class="text-stone-600 mb-4 text-sm">${article.description.substring(
                          0,
                          100
                        )}...</p>
                        <div class="mt-auto flex items-center justify-between text-xs text-stone-500">
                           <span class="font-semibold">${
                             article.source.name
                           }</span>
                           <span>${new Date(
                             article.publishedAt
                           ).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
    articlesGrid.appendChild(articleCard);
  });
  articlesGrid.style.display = "grid";
};

categoryFilters.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const category = e.target.dataset.category;
    if (category !== currentCategory) {
      currentCategory = category;
      currentQuery = "";
      searchInput.value = "";

      document
        .querySelectorAll(".category-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      fetchNews();
    }
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    currentQuery = e.target.value.trim();
    if (currentQuery) {
      currentCategory = "";
      document
        .querySelectorAll(".category-btn")
        .forEach((btn) => btn.classList.remove("active"));
      fetchNews();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchNews();
});
