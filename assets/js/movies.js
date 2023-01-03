//#region Manejo de informacion
//Cargamos el texto ingresado para buscar la pelicula
const movieName = document.getElementById('movieText')
const btnSearch = document.getElementById('btnSearch')
let movie = ''
let pageNumber = 1

btnSearch.addEventListener('click',()=>{

    if(movieName.value.trim() == ''){
        alert("Texto vacio")
    }
    else{
        pageNumber = 1
        movie = movieName.value.trim()
        searchMovies()
    }
})

//Obtener los valores de la pagina actual y siguiente para poder navegar entre la cantidad de resultados que arroje la API

const btnPrevious = document.getElementById("btnAnterior")
const btnNext = document.getElementById("btnSiguiente")

btnNext.addEventListener('click',()=>{
    if(pageNumber<1000){
        pageNumber+=1
        searchMovies()
    }
})

btnPrevious.addEventListener('click',()=>{
    if(pageNumber>1){
        pageNumber-=1
        searchMovies()
    }
})

//Convertimos el tiempo de las peliculas a formato 1h 0m
const convert_time = (time)=>{
    //Pasamos el tiempo a horas
    let runtime = (time/60).toFixed(2).toString().split('.')
    //Convertimos el residuo de horas a minutos nuevamente para que salga con el formato 1h 0m
    runtime[1] = ((runtime[1]*0.01)*60).toFixed(0)
    return runtime
}

//#endregion

//#region Mostrar informacion con la API
//Funcion para buscar peliculas
async function searchMovies() {
    try{    
        const searchM = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=adedc1dcf969c858a80022097ce9a27c&language=en-US&query=${movie}&page=${pageNumber}`)
        
        //Verificamos las respuestas de la api y agregamos la informacion
        if(searchM.status === 200){
            const find = await searchM.json()
            let movies = `<h3 class="text-lg-start text-center text-uppercase text-white h3 h-25 mt-3">Search Results</h3>`
            find.results.forEach(match => {
                movies +=`
                        <div class="col-12 col-sm-6 col-lg-3 mb-4">
                            <a id="btnInfo" onclick="moreInfo('${match.id}')" data-bs-toggle="modal" data-bs-target="#modalMovie" >
                                <div class="card bg-dark">
                                    <img src="https://image.tmdb.org/t/p/w500/${match.poster_path}" class="card-img-top" alt="Poster">
                                    <div class="card-body ">
                                        <h6 class="card-title  text-center">${match.title}</h6>
                                        
                                    </div>
                                </div>
                            </a>
                        </div>
                    `
            });
            document.getElementById('movie-container').innerHTML = movies
            document.getElementById('botones-navegacion').style.visibility = 'visible'
        }
        else if(searchM.status === 401){
            alert("Invalid key")
        }
        else if(searchM.status == 404){
            alert("The movie that you are searching does not exist!")
        }
        else{
            alert("Sorry, we don't know what happend! :(")
        }
        
    }catch(error){
        alert(error)
    }
}

async function moreInfo(id){
    try{
        const reply = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=adedc1dcf969c858a80022097ce9a27c`)
        //Validamos el estado de la respuesta y agregamos informacion
        if(reply.status === 200){
            const movies = await reply.json()
            let modalInfo = ''

            //Arreglando datos de informacion para mostrarlos llamativamente
                //Obtenemos el año que se hizo la pelicula
                let dateMovie = movies.release_date.split("-")

                //Obtenemos los generos de la pelicula
                let genres = ''
                movies.genres.forEach(genreName=>{
                    genres+=genreName.name+','
                })

                //Le quitamos el ultimo valor del string para que no se muestre , al final
                genre_name = genres.slice(0,-1)

                //Obtenemos la duracion de la pelicula
                let time = convert_time(movies.runtime)
            //Agregamos la informacion al modal
                modalInfo = `
                        <div class="modal-header text-white border border-0">
                            <h1 class="modal-title fs-5 " id="modalMovieLabel">${movies.title} <span class="text-muted">(${dateMovie[0]})</span></h1>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-white" 
                            style="background-image: linear-gradient(
                                0deg,
                                rgba(0,0,0,0.5),
                                rgba(0,0,0,1)
                            ), url(https://image.tmdb.org/t/p/w500/${movies.backdrop_path});
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-position: center center;
                            object-fit: cover;
                            object-position: center;">

                            <div class="row py-2">
                                <div class="col-12 col-lg-5 py-1">
                                    <div class="card border border-0 bg-black">
                                        <img src="https://image.tmdb.org/t/p/w500/${movies.poster_path}"  alt="Movie poster">
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6 mt-2 py-3">
                                    <p class="fs-6">${dateMovie[2]+'/'+dateMovie[1]+'/'+dateMovie[0]} • ${genre_name} • ${time[0]}h ${time[1]}m</p>
                                    <p class="fs-6 fst-italic">${movies.tagline}</p>
                                    <h1 class="modal-title fs-5 mb-3">Overview <span class="badge text-bg-light">${movies.vote_average.toFixed(1)}</span></h1> 
                                    <p class="fs-6">${movies.overview}</p>
                                    <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>

                        </div>
                `
            document.getElementById('more-info').innerHTML = modalInfo
        }
        else if(reply.status === 401){
            alert("Invalid key")
        }
        else if(reply.status === 404){
            alert("The movie that you are searching does not exist!")
        }
        else{
            alert("Sorry, we don't know what happend! :(")
        }


    }catch(error){
        alert('Some is wrong: '+ error)
    }
}
//#region 