class App {
    constructor() {
        this.api = new TMDBApi();
        this.trendingGrid = document.getElementById('trending-grid');
        this.tvGrid = document.getElementById('tv-grid');
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-button');
        
        if (this.trendingGrid && this.tvGrid) {
            this.initEventListeners();
        }
    }

    async init() {
        if (!this.trendingGrid || !this.tvGrid) return;
        await this.displayTrending('movie', 'day');
        await this.displayTV('top_rated');
    }

    initEventListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                const section = e.target.closest('section');
                
                section.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                if (section.id === 'trending') {
                    this.displayTrending('movie', filter);
                } else if (section.id === 'tv-shows') {
                    this.displayTV(filter);
                }
            });
        });

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.handleSearch());
        }
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.handleSearch());
        }
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        const tvSection = document.getElementById('tv-shows');
        const trendingTitle = document.querySelector('#trending h2');

        if (query.length > 0) {
            const data = await this.api.search(query);
            if (data && data.results) {
                this.renderGrid(data.results.filter(item => item.media_type !== 'person'), this.trendingGrid);
                if (tvSection) tvSection.style.display = 'none';
                if (trendingTitle) trendingTitle.textContent = 'Résultats de recherche';
            }
        } else {
            await this.displayTrending('movie', 'day');
            if (tvSection) tvSection.style.display = 'block';
            if (trendingTitle) trendingTitle.textContent = 'Tendances';
        }
    }

    async displayTrending(type, timeWindow) {
        const data = await this.api.getTrending(type, timeWindow);
        if (data && data.results) {
            this.renderGrid(data.results, this.trendingGrid);
        }
    }

    async displayTV(filter) {
        const data = await this.api.getTVShows(filter);
        if (data && data.results) {
            this.renderGrid(data.results, this.tvGrid);
        }
    }

    renderGrid(items, container) {
        if (!container) return;
        container.innerHTML = ''; 

        items.slice(0, 4).forEach(item => { 
            const card = this.createCard(item);
            container.appendChild(card);
        });
    }

    createCard(item) {
        const title = item.title || item.name;
        const date = item.release_date || item.first_air_date;
        const poster = item.poster_path ? `${this.api.imgBaseUrl}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=Pas+d+image';
        const itemType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
        const rating = Math.round(item.vote_average * 10); 

        const article = document.createElement('article');
        article.className = 'movie-card';
        article.innerHTML = `
            <a href="focus.html?id=${item.id}&type=${itemType}">
                <div class="poster-container">
                    <img src="${poster}" alt="${title}" loading="lazy">
                    <span class="rating-badge">${rating}%</span>
                </div>
                <div class="card-content">
                    <h3>${title}</h3>
                    <p>${this.formatDate(date)}</p>
                </div>
            </a>
        `;
        return article;
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Date inconnue';
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    }
}