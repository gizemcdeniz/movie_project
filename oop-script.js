//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        const genreList = await APIService.fetchDropdowngenres()
        //console.log(genreList);
        HomePage.renderMovies(movies);
        GenresMovies.renderGeners(genreList);
    }
}

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data)
        return data.results.map(movie => new Movie(movie))
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        return new Movie(data)
    }
    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
    
    static async fetchActors(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data);
        return data.cast.slice(0,5).map(actor => new Actor(actor))
    }
    static async fetchDirector(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        //.map(({ foo }) => foo)
        return data.crew.map(({job}) => job)
        //filter((job) => job.dierctor !== job.dierctor)
        
    }
    static async fetchSimilarMovies(movie_id){
        const url = APIService._constructUrl(`movie/${movie_id}/similar`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        return data.results.slice(0,5).map(similarMovie => new Movie(similarMovie))
    }
    static async fetchDropdowngenres(){
        const url = APIService._constructUrl(`genre/movie/list`)
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        return data.genres
    }


}
class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function() {
                Movies.run(movie);
            });

            
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }
}

// class ActorSection {
//     static renderActor(actors){
//         MoviePage.container.innerHTML = ``  
//     }
// }

class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id);
        //console.log(movieData)
        const actors = await APIService.fetchActors(movie.id)
        //console.log(actors);
        const similar = await APIService.fetchSimilarMovies(movie.id)
        //console.log(similar);
        const directorName = await APIService.fetchDirector(movie.id)
        console.log(directorName);
        // const genresMovies = await APIService.fetchDropdowngenres(movie)
        // console.log(genresMovies);
        
        MoviePage.renderMovieSection(movieData,actors, similar, directorName);
    }
}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie, actors, similar, directorName) {
        MovieSection.renderMovie(movie,actors, similar, directorName);
    }
}

class MovieSection {
    static renderMovie(movie, actors, similar, directorName) {
        MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres.map(genre => genre.name)}</p>
          <p id="language">${movie.original_language}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
          <h4>Dirctor Name</h4>
          <p id="directorName">${directorName.name}</p>
          <h5>Production Companies</h5>
          <p id="prductionNames">${movie.production_companies.map(production_company => production_company.name)}</P>
        </div>
        <div>
        ${similar.map(simiMovie => `
        <p>${simiMovie.title}</p>
        `
        ).join("")}
        </div>
      </div>
      <h3>Actors:</h3>
        <div>
        ${actors.map(actor => `
        <img src=${actor.backdropUrl} width = 20% >
        <p> ${actor.name}</p>
        `   
        )}
    
        </div>
    `;
    //console.log(movie);
    }
}

class GenresMovies {
  static renderGeners(genres){
      const genresNames = document.getElementById('dropdown-genres')
      genresNames.innerHTML = genres.map(genre => {
        return  `<a class="dropdown-item" href="#">${genre.name}</a>`
      }).join("");
  }
}


class Actor {
    //static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        //console.log(json); 
        this.name = json.name;
        this.gender=json.gender
        this.profile_path = json.profile_path;
        this.job = json.job
        // this.title = json.title;
        // this.releaseDate = json.release_date;
        // this.runtime = json.runtime + " minutes";
        // this.overview = json.overview;
        // this.backdropPath = json.backdrop_path;
    }
    get backdropUrl() {
        return this.profile_path ? Movie.BACKDROP_BASE_URL + this.profile_path : "";
    }
}
class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        //console.log(json);
        this.id = json.id;
        this.title = json.title;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
        this.original_language = json.original_language;
        this.genre_ids = json.genre_ids;
        this.production_companies = json.production_companies;
        //console.log(production_companies);
        //console.log(this.genre_ids);
        this.genres = json.genres;
        //this.original_language = original_language;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }


}
//comment test 
document.addEventListener("DOMContentLoaded", App.run);
