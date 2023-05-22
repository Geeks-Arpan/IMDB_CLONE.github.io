const url = 'https://www.omdbapi.com/?apikey=f26ec8b1';
let movieName = '';
var favArray = [];
let moviess = localStorage.getItem('favourites');

document.getElementById('favourites').addEventListener('click', () => {
    const win = window.open('./html/fav.html', '_blank');
    win.focus();
})

if(!moviess){
    console.log('inside')
    localStorage.setItem('favourites', JSON.stringify(favArray));
}

const searchMovie = document.querySelector('input[type=text]');
searchMovie.addEventListener('input', (event) => {
    movieName = event.target.value;
    getMovie(movieName);
})

async function getMovie(movieName){
    let res = await fetch(url+`&t=${movieName}`, {method: 'GET'});
    let data = await res.json();
    let movieContainer = document.getElementById('movies-container');

    movieContainer.innerHTML = '';

    if(!data.Error){

        let card = document.createElement("div");
        card.classList.add('card');
        movieContainer.appendChild(card);

        let poster = document.createElement('div');
        poster.classList.add('poster');
        card.appendChild(poster);

        let favouriteMovies = JSON.parse(localStorage.getItem('favourites'));
        let favouriteIcon = document.createElement('i');
        let bool = false;
        getFavIcon(data.imdbID, favouriteMovies, favouriteIcon);
        
        favouriteIcon.classList.add('fav', 'fa-regular', 'fa-heart');
        favouriteIcon.addEventListener('click', () => {
            console.log('yes');
            alterFav(data.imdbID, favouriteMovies, favouriteIcon);
        });
        movieContainer.appendChild(favouriteIcon);

        let posterImage = document.createElement('img');
        posterImage.src = data.Poster;
        posterImage.alt = 'Movie Poster';
        poster.appendChild(posterImage);

        let details = document.createElement('div');
        details.classList.add('details');
        card.appendChild(details);

        let title = document.createElement('h1');
        title.classList.add('title');
        title.innerHTML = data.Title;
        details.appendChild(title);

        let director = document.createElement('h3');
        director.classList.add('director');
        director.innerHTML = data.Director;
        details.appendChild(director);

        let ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating');
        details.appendChild(ratingDiv);
        const rating = data.imdbRating/2;
        const wholeRating = Math.floor(rating);
        let count = 0;
        for(let i=0; i<wholeRating; i++){
            let star = document.createElement('i');
            star.classList.add('fa-solid', 'fa-star');
            ratingDiv.appendChild(star);
            count++;
        }
        if(rating > wholeRating){
            let halfStar = document.createElement('i');
            halfStar.classList.add('fa-solid', 'fa-star-half-stroke');
            ratingDiv.appendChild(halfStar);
            count++;
        }
        while(count < 5){
            let emptyStar = document.createElement('i');
            emptyStar.classList.add('fa-regular', 'fa-star');
            ratingDiv.appendChild(emptyStar);
            count++;
        }
        let ratingSpan = document.createElement('span');
        ratingSpan.innerHTML = `${rating.toFixed(1)}/5`;
        ratingDiv.appendChild(ratingSpan);

        let tagsDiv = document.createElement('div');
        tagsDiv.classList.add('tags');
        details.appendChild(tagsDiv);
        let genres = data.Genre.split(', ');
        genres.forEach(elem => {
            let genreSpan = document.createElement('span');
            genreSpan.innerHTML = elem;
            tagsDiv.appendChild(genreSpan);
        });

        let reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        reviewDiv.innerHTML = data.Plot.substring(0, 200) + '...';
        details.appendChild(reviewDiv);
        

        card.addEventListener('click', () => {
            localStorage.setItem('movieDetails', data.imdbID);
            const win = window.open('movie.html', '_blank');
            win.focus();
        })
    }
}

function alterFav(imdbID, favouriteMovies, favouriteIcon){
    favouriteIcon.className = '';
    let bool = true;
    for(let i=0; i<favouriteMovies.length; i++){
        if(favouriteMovies[i] == imdbID){
            favouriteMovies.splice(i, 1);
            bool = false;
            favouriteIcon.classList.add('fav', 'fa-regular', 'fa-heart');
            break;
        }
    }
    if(bool){
        favouriteMovies.push(imdbID);
        favouriteIcon.classList.add('fav', 'fa-solid', 'fa-heart');
    }
    localStorage.setItem('favourites', JSON.stringify(favouriteMovies));
}

function getFavIcon(imdbID, favouriteMovies, favouriteIcon){
    favouriteMovies.forEach(elem => {
        if(imdbID == elem){
            favouriteIcon.classList.add('fav', 'fa-solid', 'fa-heart');
            return;
        }
    })
    favouriteIcon.classList.add('fav', 'fa-regular', 'fa-heart');
}