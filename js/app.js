class App {
    constructor() {
        this.api = new TMDBApi();
        this.trendingGrid = document.getElementById('trending-grid');
        this.tvGrid = document.getElementById('tv-grid');
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.initEventListeners();
    }

    async init() {
        this.displayTrending('movie', 'day');
        this.displayTV('top_rated');
    }

    initEventListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                const section = e.target.closest('section');
                
                section.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                if (section.classList.contains('trending')) {
                    this.displayTrending('movie', filter);
                } else if (section.classList.contains('tv-shows')) {
                    this.displayTV(filter);
                }
            });
        });
    }

    async displayTrending(type, timeWindow) {
        const data = await this.api.getTrending(type, timeWindow);
        this.renderGrid(data.results, this.trendingGrid);
    }

    async displayTV(filter) {
        const response = await fetch(`${this.api.baseUrl}/tv/${filter}?language=fr-FR`, this.api.options);
        const data = await response.json();
        this.renderGrid(data.results, this.tvGrid);
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
        const poster = this.getPosterUrl(item);
        const itemType = this.getItemType(item);
        
        const rating = Math.round(item.vote_average * 10); 

        const article = document.createElement('article');
        article.classList.add('movie-card');
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

    getPosterUrl(item) {
        if (item.poster_path) {
            return `${this.api.imgBaseUrl}${item.poster_path}`;
        }
        return 'assets/placeholder-poster.png';
    }

    getItemType(item) {
        if (item.title) {
            return 'movie';
        }
        return 'tv';
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Date inconnue';
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    }
}