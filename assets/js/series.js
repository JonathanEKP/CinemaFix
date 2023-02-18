//#region Manejo de la informacion
//Cargamos el texto ingresado para buscar la pelicula
const serieName = document.getElementById('serieText')
const btnSearch = document.getElementById('btnSearch')
let serie = ''
let pageNumber = 1

btnSearch.addEventListener('click',()=>{
    
    if(serieName.value.trim() == '')
        alert("Texto Vacio")
    else{
        pageNumber = 1
        serie = serieName.value.trim()
        searchSeries()
    }
})
//Obtener los valores de la pagina actual y siguiente para poder navegar entre la cantidad de resultados que arroje la API

const btnPrevious = document.getElementById("btnAnterior")
const btnNext = document.getElementById("btnSiguiente")

btnNext.addEventListener('click',()=>{
    if(pageNumber<1000){
        pageNumber+=1
        searchSeries()
    }
})

btnPrevious.addEventListener('click',()=>{
    if(pageNumber>1){
        pageNumber-=1
        searchSeries()
    }
})



//#endregion

//#region Mostrar informacion de las series con la api
//Funcion para buscar series
async function searchSeries(){
    try{
        const searchS = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=adedc1dcf969c858a80022097ce9a27c&language=en-US&&query=${serie}&page=${pageNumber}`)
        //Verificamos la respuesta de la api y agregamos la informacion
        if(searchS.status === 200){
            const find = await searchS.json()
            let series = `<h3 class="text-lg-start text-center text-uppercase text-white h3 h-25 mt-3">Search Results</h3>`
            find.results.forEach(match => {
                series+=`
                <div class="col-12 col-sm-6 col-lg-3 mb-4">
                    <a id="btnInfo" onclick="moreInfo('${match.id}')" data-bs-toggle="modal" data-bs-target="#modalSeries" >
                        <div class="card bg-dark">
                            <img src="https://image.tmdb.org/t/p/w500/${match.poster_path}" class="card-img-top" alt="Poster">
                            <div class="card-body ">
                                <h6 class="card-title  text-center">${match.name}</h6>
                                
                            </div>
                        </div>
                    </a>
                </div>
            `
            });
            document.getElementById('series-container').innerHTML = series
            document.getElementById('botones-navegacion').style.visibility = 'visible'
        }
        else if(searchS.status === 401){
            alert('Invalid Key')
        }
        else if(searchS.status === 404){
            alert("The serie that you are searching does not exist!")
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
        const reply = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=adedc1dcf969c858a80022097ce9a27c&language=en-US`)
        //Validamos el estado de la respuesta y agregamos informacion
        if(reply.status === 200){
            const series = await reply.json()
            let modalInfo = ''
            //Arreglando datos de informacion para mostrarlos llamativamente
            
            //Obtenemos el año que se hizo la serie
            let dateSerie = series.first_air_date.split("-")
            //Obtenemos los generos de la pelicula
            let genres = ''
            series.genres.forEach(genreName=>{
                genres+=genreName.name+','
            })
            //Le quitamos el ultimo valor del string para que no se muestre , al final
            genre_name = genres.slice(0,-1)
            //Agregamos la informacion al modal
            console.log(series)
            modalInfo = `
                        <div class="modal-header text-white border border-0">
                            <h1 class="modal-title fs-5 " id="modalSeriesLabel">${series.name} <span class="text-muted">(${dateSerie[0]})</span></h1>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-white" 
                            style="background-image: linear-gradient(
                                0deg,
                                rgba(0,0,0,0.5),
                                rgba(0,0,0,1)
                            ), url(https://image.tmdb.org/t/p/w500/${series.backdrop_path});
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-position: center center;
                            object-fit: cover;
                            object-position: center;">

                            <div class="row py-2">
                                <div class="col-12 col-lg-5 py-1">
                                    <div class="card border border-0 bg-black">
                                        <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}"  alt="Movie poster">
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6 mt-2 py-3">
                                    <p class="fs-6">${dateSerie[2]+'/'+dateSerie[1]+'/'+dateSerie[0]} • ${genre_name} • ${series.episode_run_time}m</p>
                                    <p class="fs-6 fst-italic">${series.tagline}</p>
                                    <h1 class="modal-title fs-5 mb-3">Overview <span class="badge text-bg-light">${series.vote_average.toFixed(1)} </span> </h1> 
                                    <p class="fs-6">${series.overview}</p>
                                    <p class="fs-6"><i class="bi bi-collection-play"></i> Number of seasons: ${series.number_of_seasons}</p>
                                    <p class="fs-6"><i class="bi bi-play-fill"></i> Number of episodes: ${series.number_of_episodes} </p>
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
            alert("The serie that you are searching does not exist!")
        }
        else{
            alert("Sorry, we don't know what happend! :(")
        }
    }catch(error){
        alert(error)
    }
}