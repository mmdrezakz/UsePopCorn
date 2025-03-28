import { useEffect, useState } from "react";
import StarRating from "./StarRating";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
const keyApi ="a6700a12"
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");

  const [watched, setWatched] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false)
  const [Errorings,setError] =useState("")
  const [selectedId,setSelectedId] = useState(null)


  function selectMovieHandler(id){
    setSelectedId((curid) => id === curid ? null : id)
  }

  function CloseSelectedMovie(){
    setSelectedId(null)
  }

  function handleAddWatch(movie){
    setWatched(movies => [...movies,movie])
    
  }

  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }
  useEffect(function() {
      const controller = new AbortController();
    async function fetchMovie(){
    try{  
      setIsLoading(true)
      setError("")
      const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${keyApi}&s=${query}`,{signal: controller.signal})
      
      if(!res.ok) throw new Error ("اینترنت قطع شده است")
      const data = await res.json();
    
    if(data.Response === "False") throw new Error ("فیلمی پیدا نشد")
      setMovies(data.Search) 
      setError("")
    }catch(err){
      if(err.name !== "AbortError")
      {
        setError(err.message)
      }
    }finally{
      setIsLoading(false)
    }
  }

  if(query.length < 3 ){
    setMovies([])
    setError('')
    return
  }
  CloseSelectedMovie();
  fetchMovie()
  return function(){
    controller.abort();
  }
},[query])


return (
    <>
      <Nav>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <ResualtFind movies={movies}/>
      </Nav>
      
      <Main >
      <Box >
      {isLoading && <Loading /> }
      {!isLoading && !Errorings && <Movie movies={movies} selectMovieHandler={selectMovieHandler} watched={watched}/>}
      {Errorings && <Erroring Errorings={Errorings}/> }
       
      </Box>
      <Box >
        {
        selectedId ? <MovieDetails handleAddWatch={handleAddWatch} selectedId={selectedId} CloseSelectedMovie={CloseSelectedMovie} watched={watched} /> :
        <>
        <SummuryWatched watched={watched}/>
        <SummuryWatchedMovies watched={watched} handleDeleteWatched={handleDeleteWatched} />
        </> 
        }
      </Box>
      </Main>
      <MMD />
    </>
  );
}

function Loading(){
  return (
    <p className="text-4xl flex justify-center h-full items-center"><span>LOADING ... </span></p>
  )
}
function Erroring({Errorings}){
  return     <p className="text-4xl flex justify-center h-full items-center"><span>⚠️{Errorings}</span></p>
}
function Nav({children}){

  return(
  <nav className="nav-bar">
    {children}
  </nav>

  )
}
function Logo(){
  return(

    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}
function SearchBar({query,setQuery}){
  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}
function ResualtFind({movies}){
  return(
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}
function Main({children}){


  return(
    <main className="main">
      {children}
    </main>
  )
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);
  
  return(
    <div className="box ">
    <ToggleBtn isOpen={isOpen} setIsOpen={setIsOpen} />
    {isOpen && (
    children
    )}
  </div>

  )
}
// function  ListBoxWatchedMovie({children}){
//   const [isOpen2, setIsOpen2] = useState(true);

//   return(
//     <div className="box">
//         <ToggleBtn2Right setIsOpen2={setIsOpen2} isOpen2={isOpen2}/>
//         {children}
//     </div>
//   )
// }

function ToggleBtn({setIsOpen,isOpen}){
  return(
    <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  )
}
// function ToggleBtn2Right({setIsOpen2,isOpen2}){
//   return(
//     <button
//     className="btn-toggle"
//     onClick={() => setIsOpen2((open) => !open)}
//   >
//     {isOpen2 ? "–" : "+"}
//   </button>
//   )
// }
function Movie({movies,selectMovieHandler}){
  return(
    <ul className="list list-movies">
    {movies?.map((movie) => (
      <MapMovie movie={movie} selectMovieHandler={selectMovieHandler} key={movie.imdbID} />
    ))}
  </ul>
  )
}
function MapMovie({movie,selectMovieHandler}){
  return(
    <li key={movie.imdbID} onClick={() => selectMovieHandler(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
  )
}
function MovieDetails({selectedId,CloseSelectedMovie,handleAddWatch,watched}){
  const [movieAllDetails,setMovieAllDetails] = useState({})
    // const [showRate,setShowRate] = useState(0)
  const [Loading,setLoading] = useState(false)

  const [userRating,setUserRating] = useState("")

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)

  const WatchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating

  const {
    Actors:actors, 
    Awards:awards,
    Country:country,
    Director:director, 
    Genre:genre,
    Plot:plot,
    Runtime:runtime,
    Poster:poster,
    Released:released,
    Year:year,
    Title:title,
    Writer:writer,
    imdbRating:imdbRating
  } = movieAllDetails;
  

  function handleAdd(){

    const newMovie = {
       imdbRating:Number(imdbRating),imdbID:selectedId,
       title,
       year,
       runtime:Number(runtime.split(" ").at(0)),
       poster,
      userRating}

    handleAddWatch(newMovie)
    CloseSelectedMovie()

    

  }
  useEffect(function () {
   
      if(!title) return;
       document.title = `Movie : ${title}`

     return function () {
      document.title = "UsePopCorn"
     }
    
    
   },[title])
 


  useEffect(function(){
    async function fetchMovie(){
      setLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${keyApi}&i=${selectedId}`)
      const data = await res.json()
      setLoading(false)
      
      setMovieAllDetails(data)
    }
    fetchMovie()
  },[selectedId])
  
  useEffect(function() {
    function eventHandler(){
      
        CloseSelectedMovie();
    }
    document.addEventListener("keydown", eventHandler)
    return function(){
      document.removeEventListener("keydown",eventHandler)
    }
  },[CloseSelectedMovie])

  return (
    <div className="details">
      {(!Loading && movieAllDetails) ? <>
        <header className="flex flex-col md:flex-row">
    
     
    <button className="btn-back" onClick={CloseSelectedMovie}>&larr;</button>
    <img className="img-details w-full md:w-[50%]" src={poster} alt={title}/> 
  
  <div className="details-overview col-span-2 ">
  <h2 className="text-sm md:text-lg">{title}</h2>
  <p className="text-sm md:text-lg">{released} 💠{runtime}</p>
  <p className="text-sm md:text-lg">{genre}</p>
  <p className="text-sm md:text-lg">{imdbRating}<span>IMDB raiting</span></p>
  </div>
</header>
     
     <section className="text-sm lg:text-lg w-full">
       <div className="rating flex justify-center items-center">
        {!isWatched ? <>
          <StarRating  onSetRating={setUserRating} />
          {userRating > 0 &&<button  onClick={handleAdd} className="btn-add">Add To Watch +</button>}
        </> : <p>You set Rate Fror This Film ⭐{WatchedUserRating}⭐</p>}
       </div>
       <p className="w-full">
       <em>
         {plot}
       </em>
       </p>
       <p>
         Staring : {actors}
       </p>
       <p>
         Directors : {director}
       </p>
     </section>
      </> : <p className="flex justify-center items-center h-72 text-4xl"><span>LOADING ...</span></p>}
  </div>
  )
}


function SummuryWatched({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
    <div className="summary">
    <h2>Movies you watched</h2>
    <div className="summury-watchedtop">
      <p>
        <span id="onelogo">#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span id="onelogo">⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span id="onelogo">🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span id="onelogo">⏳</span>
        <span>{avgRuntime.toFixed(2)} min</span>
      </p>
    </div>
  </div>
  )
}
function SummuryWatchedMovies({watched,handleDeleteWatched}){
  return(
    <ul className="list">
    {watched.map((movie) => (
      <SummuryWatchedMapMovies movie={movie} handleDeleteWatched={handleDeleteWatched} key={movie.imdbID}/>
    ))}
  </ul>
  )
}
function SummuryWatchedMapMovies({movie,handleDeleteWatched}){
  return(
    <li className="watched-list" key={movie.imdbID}>

    <img className="images-watch" src={movie.poster} alt={`${movie.title} poster`} />
    <h3 className="watched-h3">{movie.title}</h3>
    <div className="watched-save-rate">
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
      <button className="btn-delete" onClick={() => handleDeleteWatched(movie.imdbID)}>✖️</button>
    </div>
  </li>
  )
}
function MMD(){
  return (
    <h4>Mohammadreza Kazemi</h4>
  )
}