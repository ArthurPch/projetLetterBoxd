document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type') || 'movie';

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    const api = new TMDBApi();
    const data = await api.getDetails(type, id);

    if (data) {
        document.title = `${data.title || data.name} - Détails`;
        
        const heroSection = document.getElementById('focus-hero');
        if (data.backdrop_path) {
            heroSection.style.backgroundImage = `url(${api.imgOriginalUrl}${data.backdrop_path})`;
        }

        const poster = document.getElementById('focus-poster');
        poster.src = data.poster_path ? `${api.imgBaseUrl}${data.poster_path}` : 'https://via.placeholder.com/500x750?text=Pas+d+image';
        
        document.getElementById('focus-title').innerHTML = `${data.title || data.name} <span style="font-weight: 300;">(${new Date(data.release_date || data.first_air_date).getFullYear()})</span>`;
        
        const rating = Math.round(data.vote_average * 10);
        document.getElementById('focus-rating').textContent = `${rating}%`;

        const date = new Date(data.release_date || data.first_air_date).toLocaleDateString('fr-FR');
        const genres = data.genres.map(g => g.name).join(', ');
        const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : (data.episode_run_time ? `${data.episode_run_time[0]}m` : '');
        
        document.getElementById('focus-meta').textContent = `${date} - ${genres} ${runtime ? '- ' + runtime : ''}`;
        
        document.getElementById('focus-synopsis').textContent = data.overview || 'Aucun synopsis disponible.';

        const castGrid = document.getElementById('cast-grid');
        if (data.credits && data.credits.cast) {
            data.credits.cast.slice(0, 8).forEach(actor => {
                const img = actor.profile_path ? `${api.imgBaseUrl}${actor.profile_path}` : 'https://via.placeholder.com/500x750?text=Inconnu';
                const div = document.createElement('div');
                div.className = 'cast-card';
                div.innerHTML = `
                    <img src="${img}" alt="${actor.name}" loading="lazy">
                    <h4>${actor.name}</h4>
                    <p>${actor.character}</p>
                `;
                castGrid.appendChild(div);
            });
        }
    }
});