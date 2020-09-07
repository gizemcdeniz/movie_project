//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        const genreList = await APIService.fetchDropdowngenres()
        //const actors = await APIService.fetchActors()
        //console.log(genreList);
        HomePage.renderMovies(movies);
        GenresMovies.renderGeners(genreList);
        //ActorsPage.renderActors(actors);
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

    static async fetchActorsInEachMovie(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        return data.cast.slice(0, 5).map(actor => new ActorsInMovie(actor))
    }
    static async fetchDirector(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        //.map(({ foo }) => foo)
        return data.crew.map(({ job }) => job)
        //filter((job) => job.dierctor !== job.dierctor)

    }
    static async fetchSimilarMovies(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/similar`)
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data);
        return data.results.slice(0, 5).map(similarMovie => new Movie(similarMovie))
    }
    static async fetchDropdowngenres() {
        const url = APIService._constructUrl(`genre/movie/list`)
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        return data.genres
    }
    static async fetchGenresList() {
        const url = APIService._constructUrl(`discover/movie`)
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data.results
    }
    static async fetchActors() {
        const url = APIService._constructUrl(`person/popular`);
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        return data.results.map(actor => new Actor(actor));
    }
    static async fetchActor(person_id) {
        const url = APIService._constructUrl(`person/${person_id}`);
        const response = await fetch(url);
        const data = await response.json();
       // console.log(data)
        return new Actor(data)
    }

    static async fetchVideos(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/videos`);
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.results[0].key)
        return new Video(data.results[0].key)
    }
}
// static renderGeners(genres){
//     const genresNames = document.getElementById('dropdown-genres')
//     genresNames.innerHTML = genres.map(genre => {
//       return  `<a class="dropdown-item" href="#">${genre.name}</a>`
//     }).join("");
// }

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        //console.log(movies);
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function () {
                Movies.run(movie);
            });


            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }
}



class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id);
        //console.log(movieData)
        const actorsInEachMovie = await APIService.fetchActorsInEachMovie(movie.id)
        //console.log(actors);
        const similar = await APIService.fetchSimilarMovies(movie.id)
        //console.log(similar);
        const directorName = await APIService.fetchDirector(movie.id)
        //console.log(directorName);
        const videos = await APIService.fetchVideos(movie.id);

        MoviePage.renderMovieSection(movieData, actorsInEachMovie, similar, directorName, videos);
    }
}


class MoviePage {
    static container = document.getElementById('container');

static renderMovieSection(movie, actorsInMovie, similar, directorName, videos) {
    MovieSection.renderMovie(movie, actorsInMovie, similar, directorName, videos);
    }
}
class ActorSection {
    static renderActor(actor) {
        ActorsPage.actorContainer.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="actor-backdrop" src=${actor.backdropUrlActors}> 
        </div>
        <div class="col-md-8">
          <h2 id="actor-name">${actor.name}</h2>
          <p id="actor-gender">${actor.gender}</p>
           <p id="actor-birthday">${actor.birthday}</p>
          
          <p id="actor-popularity">${actor.popularity}</p>
          <h3>Biography:</h3>
          <p id="actor-biography">${actor.biography}</p>
        </div>
      </div>
    `;
    }
}



class MovieSection {
    static renderMovie(movie, actors, similar, directorName, videos) {
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
      <h4>Videos</h4>
      <iframe width="560" height="315" src="https://youtube.com/embed/${videos.key}" allowfullscreen></iframe>
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
        this.genres = json.genres;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
}


class ActorsPage {
    static actorContainer = document.getElementById("actorsDataContainer")
    static renderActors(actors) {
        console.log(actors);
        //const mainDiv = document.createElement("div")
        actors.forEach(actor => {
            const actorDiv = document.createElement("div");
            const actorImage = document.createElement("img");
            actorImage.src = `${actor.backdropUrlActors}`;
            const actorName = document.createElement("h3");
            actorName.textContent = `${actor.name}`;
            actorImage.addEventListener("click", function () {
                Actors.runActor(actor);
            })
            actorDiv.appendChild(actorName);
            actorDiv.appendChild(actorImage);
            //mainDiv.appendChild(actorDiv);
            ActorsPage.actorContainer.appendChild(actorDiv);
        })
    }
}


class Actors {
    static async run() {
        const actorData = await APIService.fetchActors();
        //console.log(actorData);
        ActorsPage.renderActors(actorData);
    }
    static async runActor(actor) {
        const actorData = await APIService.fetchActor(actor.id)
        ActorSection.renderActor(actorData);
    }
}

class ActorPage {
    static actorContainer = document.getElementById("actorsDataContainer");
    static renderActorSection(actor){
        ActorSetion.renderActor(actor);
    }
}




class Video {
    constructor(json) {
        this.key = json;
    }
    static async getVideoUrl(movie_id) {
        const dataVideo = await APIService.fetchVideos(movie_id);
        console.log(dataVideo);
        return `${dataVideo}`;
    }

}
class Actor {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        //console.log(json);
        this.name = json.name;
        this.profile_path = json.profile_path;
        this.birthday = json.birthday;
        this.gender = json.gender;
        this.popularity = json.popularity;
        this.biography = json.biography;
        this.id = json.id;
    }
    get backdropUrlActors() {
        return this.profile_path ? Actor.BACKDROP_BASE_URL + this.profile_path : "";
    }
}





class GenresMovies {
    static renderGeners(genres) {
        const genresNames = document.getElementById('dropdown-genres')
        genresNames.innerHTML = genres.map(genre => {
            return `<a class="dropdown-item" href="#">${genre.name}</a>`
        }).join("");
    }
}

class GenresList {
    static async renderList(results) {
        console.log(results)
        //const genresItems = document.getElementById('dropdown-genres')

    }
}

class ActorsInMovie {
    constructor(json) {
        //console.log(json); 
        this.name = json.name;
        this.gender = json.gender
        this.profile_path = json.profile_path;
        this.job = json.job
    }
    get backdropUrl() {
        return this.profile_path ? Movie.BACKDROP_BASE_URL + this.profile_path : "";
    }
}





function showActors() {
    //const actorsListBtn = document.getElementById("actorsListBtn");
    //actorsListBtn.addEventListener("click", function () {
            MoviePage.container.innerHTML = ""
            //ActorsPage.actorContainer.innerHTML = ""
            Actors.run()
    // })
}
document.addEventListener("DOMContentLoaded", App.run);
