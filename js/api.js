class TMDBApi {
    constructor() {
        this.apiKey = 'e299943e1793eb1963aba29a72e93d5b';
        this.token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjk5OTQzZTE3OTNlYjE5NjNhYmEyOWE3MmU5M2Q1YiIsIm5iZiI6MTc3NDY5NDkyMy42NzM5OTk4LCJzdWIiOiI2OWM3YjIwYmMyMDQwOWFkMDMwNzQ1M2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.UesfRuLxsGO-xvDHvWdiWPTPpI4y3RxT0FMfVtHr8Hs';
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.imgBaseUrl = 'https://image.tmdb.org/t/p/w500';
        this.imgOriginalUrl = 'https://image.tmdb.org/t/p/original';
        this.options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        };
    }

    async getTrending(type = 'movie', timeWindow = 'day') {
        try {
            const response = await fetch(`${this.baseUrl}/trending/${type}/${timeWindow}?language=fr-FR`, this.options);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async getTVShows(filter = 'top_rated') {
        try {
            const response = await fetch(`${this.baseUrl}/tv/${filter}?language=fr-FR`, this.options);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async search(query) {
        try {
            const response = await fetch(`${this.baseUrl}/search/multi?query=${encodeURIComponent(query)}&language=fr-FR`, this.options);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async getDetails(type, id) {
        try {
            const response = await fetch(`${this.baseUrl}/${type}/${id}?append_to_response=credits&language=fr-FR`, this.options);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}