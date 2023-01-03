//#region Funciones utilizadas para el manejo de informacion
    //Convertimos el tiempo de las peliculas a formato 1h 0m
    const convert_time = (time)=>{
        //Pasamos el tiempo a horas
        let runtime = (time/60).toFixed(2).toString().split('.')
        //Convertimos el residuo de horas a minutos nuevamente para que salga con el formato 1h 0m
        runtime[1] = ((runtime[1]*0.01)*60).toFixed(0)
        return runtime
    }
    //Obtener los valores de la pagina actual y siguiente para poder navegar entre la cantidad de resultados que arroje la API
    let pageNumber = 1
    const btnPrevious = document.getElementById("btnAnterior")
    const btnNext = document.getElementById("btnSiguiente")

    btnNext.addEventListener('click',()=>{
        if(pageNumber<1000){
            pageNumber+=1
            loadMovie()
            paginationNumber(pageNumber)
        }
    })

    btnPrevious.addEventListener('click',()=>{
        if(pageNumber>1){
            pageNumber-=1
            loadMovie()
            paginationNumber(pageNumber)
        }
    })
    //Agregamos paginacion al inicio de la pantalla
    const btnPaginationPrev = document.getElementById("pagination-previous")
    const btnPaginationNext = document.getElementById("pagination-next")
    const first_pagination = document.getElementById("first-pagination")

    btnPaginationPrev.addEventListener('click',()=>{
        if(pageNumber>1){
            pageNumber-=1
            loadMovie()
            paginationNumber(pageNumber)
        }
    })
    
    btnPaginationNext.addEventListener('click',()=>{
        if(pageNumber<1000){
            pageNumber+=1
            loadMovie()
            paginationNumber(pageNumber)
        }
    })

    function paginationNumber(number){
        first_pagination.innerText = `Page ${pageNumber}`
    }


//#endregion



//#region Mostrar la informacion procesada
//Cargar las peliculas a la pagina de inicio cuando se entra al sitio web
const loadMovie = async() =>{
    try{
        //Pedimos las peliculas populares de la plataforma
        const reply = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=adedc1dcf969c858a80022097ce9a27c&page=${pageNumber}`)

        //Si la respuesta es correcta
        if(reply.status === 200){
            const data = await reply.json()

            let movies = ''
            //Corremos el array de peliculas populares con un foreach y las agregamos al sitio
            data.results.forEach(movie => {
                movies += `
                    <div class="col-12 col-sm-6 col-lg-3 mb-4 ">
                        <a id="btnInfo" onclick="moreInfo('${movie.id}')" data-bs-toggle="modal" data-bs-target="#modalMovie" >
                            <div class="card bg-dark">
                                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="Pelicula">
                                <div class="card-body ">
                                    <h6 class="card-title  text-center">${movie.title}</h6>
                                    
                                </div>
                            </div>
                        </a>
                    </div>
                `
            })
            
            document.getElementById("movie-container").innerHTML = movies
        }
        else if (reply.status === 401){
            alert("Invalid key")
        }
        else if (reply.status === 404){
            alert("The movie that you are searching does not exist!")
        }
        else{
            alert("Sorry, we don't know what happend! :(")
        }

    }catch(error){
        alert(error)
    }
}


//Cargar modal con informacion adicional de la pelicula
const moreInfo = async (id)=>{
    try{
        //Pedimos la pelicula que se mandó por parametro
        const reply = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=adedc1dcf969c858a80022097ce9a27c`)
        if(reply.status === 200){

            const movies = await reply.json()
            let more_info =  ''

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
            more_info += `
                
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

            document.getElementById('more-info').innerHTML = more_info


        }
        else if (reply.status === 401){
            alert("Invalid key")
        }
        else if (reply.status === 404){
            alert("The film you are looking for does not exist.!")
        }
        else{
            alert("Sorry, we don't know what happend! :(")
        }

    }catch(error){
        alert(error)
    }
    
}

//#region LLamando funcioness
loadMovie()
paginationNumber(pageNumber)
//#endregion