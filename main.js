// Titles: https://omdbapi.com/?s=thor&page=1&apikey=24fdee94
// details: http://www.omdbapi.com/?i=tt3896198&apikey=24fdee94

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

let movie_detail = JSON.parse(localStorage.getItem('movie_detail')) || [];


// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=24fdee94`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=24fdee94`);
            const movieDetails = await result.json();
            movie_detail[0]=movieDetails;
            saveToLocalStorage();
            changepage();
            displayMovieDetails();
        });
    });
}
function changepage(){
    window.location.href = "detail.html";
}
function saveToLocalStorage() {
    localStorage.setItem('movie_detail', JSON.stringify(movie_detail));
}
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});
// load via id (call by function)
function fav_detail(id){
            let pr=fetch(`http://www.omdbapi.com/?i=${id}&apikey=24fdee94`) // detail link
            pr.then((value1)=>{
                return value1.json()
            }).then((value2)=>{
                movie_detail[0]=value2;
                saveToLocalStorage();
            })
            setTimeout(()=>{
                changepage()
            },300)
            displayMovieDetails();
        }
// =================================  detail page
function displayMovieDetails(){
    let details=movie_detail[0];
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <div style="margin-bottom: 20px;" onclick="add_to_fab()">
            <button class="btn glass btn-secondary">
                <i class='bx bx-plus-circle'></i>
                Add to favourite
            </button>
        </div>
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}
// ===================================== favourite
const fab_list=document.getElementsByClassName('favourite')
let favourite = JSON.parse(localStorage.getItem('favourite')) || [];


function add_to_fab(){
    let details=movie_detail[0];
    let fav = {
        id: details.imdbID,
        Poster: details.Poster,
        Title: details.Title,
        Released: details.Released,
        Genre: details.Genre,
    }
    let isPresent = favourite.find(isPresent => isPresent.id === details.imdbID);
    if(isPresent==undefined){
        favourite.push(fav);
    }
    saveToLocalStorage_fav();
}

///---------- demo


//-------------
function saveToLocalStorage_fav() {
    localStorage.setItem('favourite', JSON.stringify(favourite));
}
let ul_taskList=document.getElementById('favourite')
//Delete form favourite
function delete_fav(id){
    favourite = favourite.filter(todo => todo.id !== id);
    saveToLocalStorage_fav();
    rander();
}
// Apend function 
function addlistItem(favourite_item){
    const fav_l=document.createElement('fav_l')
    fav_l.innerHTML=`
    <div class="fav-list ">
            <img style="height: 100%; width: 75px;" onclick="fav_detail('${favourite_item.id}')" src='${favourite_item.Poster}' alt="">
            <div class="favb-movie-list">
                <p style="margin: 2px 0px 0px 10px;font-size: large;color: gold;" class="fab-movie-name">${favourite_item.Title}</p>
                <p style="margin: 2px 0px 0px 10px;" class="fab-released">Released:${favourite_item.Released} </p>
                <p style="margin: 2px 0px 0px 10px;" class="fab-genre">${favourite_item.Genre}</p>
            </div>
            <button class="btn btn-error delete-btn" id="${favourite_item.id}" onclick="delete_fav('${favourite_item.id}')">
                <i class="bx bx-trash bx-sm"></i>
            </button>
    </div>
    `;
    ul_taskList.append(fav_l)
}
//rander function
function rander(){
    ul_taskList.innerHTML='';
    for(let i=0;i<favourite.length;i++){
        addlistItem(favourite[i]);
    }
}

