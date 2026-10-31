import { useEffect, useState } from "react"
import { Heart, Sparkles, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { getFavoriteMovieIds, getMoviePoster, getMovies, toggleFavoriteMovie, type Movie } from "../../api"
import { PATH } from "../../components"
import MovieDetailsModal from "../../modules/MovieDetailsModal"

type FavouritesProps = { theme: "dark" | "light" }

const Favourites = ({ theme }: FavouritesProps) => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const isDark = theme === "dark"

  useEffect(() => {
    const load = async () => {
      const favorites = getFavoriteMovieIds()
      const allMovies = await getMovies()
      setMovies(allMovies.filter((movie) => favorites.includes(movie.id)))
      setLoading(false)
    }

    void load()
  }, [])

  const removeFavorite = (event: React.MouseEvent<HTMLButtonElement>, movieId: number) => {
    event.stopPropagation()
    toggleFavoriteMovie(movieId)
    setMovies((current) => current.filter((movie) => movie.id !== movieId))
  }

  return (
    <main className={`min-h-screen px-5 pb-16 pt-8 sm:px-10 sm:pt-12 lg:px-16 ${isDark ? "bg-[#0b0f19] text-white" : "bg-[#edf0f6] text-slate-900"}`}>
      <div className="mx-auto max-w-360">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-current/10 pb-6">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-400"><Sparkles size={13} /> Your collection</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Saved for later</h1>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{movies.length} {movies.length === 1 ? "title" : "titles"} in your favourites</p>
          </div>
          <Link to={PATH.movies} className="inline-flex min-h-10 items-center rounded-full border border-current/15 px-4 text-sm font-semibold transition hover:border-cyan-300/50 hover:text-cyan-300">Discover more</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className={`aspect-2/3 animate-pulse rounded-lg ${isDark ? "bg-white/6" : "bg-slate-200"}`} />)}
          </div>
        ) : movies.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <article key={movie.id} className="group relative min-w-0">
                <button type="button" onClick={() => setSelectedMovie(movie)} aria-label={`View details for ${movie.name}`} className="block w-full text-left">
                  <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-slate-800 ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:ring-cyan-300/50">
                    <img src={getMoviePoster(movie.image?.original || movie.image?.medium)} alt={movie.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <h2 className="line-clamp-2 text-base font-bold text-white sm:text-lg">{movie.name}</h2>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                        <span>{movie.premiered?.slice(0, 4) || "Featured"}</span>
                        {movie.rating?.average ? <span className="inline-flex items-center gap-1 text-amber-300"><Star size={12} fill="currentColor" />{movie.rating.average.toFixed(1)}</span> : null}
                      </div>
                    </div>
                  </div>
                </button>
                <button type="button" onClick={(event) => removeFavorite(event, movie.id)} aria-label={`Remove ${movie.name} from favourites`} title="Remove from favourites" className="absolute right-2 top-2 grid size-9 place-items-center rounded-full border border-pink-300/40 bg-pink-500/90 text-white backdrop-blur transition hover:bg-pink-600">
                  <Heart size={16} fill="currentColor" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className={`border-y py-16 text-center ${isDark ? "border-white/10" : "border-slate-300"}`}>
            <Heart size={24} className="mx-auto text-pink-400" />
            <h2 className="mt-4 text-xl font-bold">Your list is waiting</h2>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Save the stories you want to come back to.</p>
            <Link to={PATH.movies} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-linear-to-r from-violet-500 to-cyan-400 px-5 text-sm font-bold text-white">Explore titles</Link>
          </div>
        )}
      </div>

      {selectedMovie && <MovieDetailsModal movie={selectedMovie} onClose={() => {
        setSelectedMovie(null)
        const favoriteIds = getFavoriteMovieIds()
        setMovies((current) => current.filter((movie) => favoriteIds.includes(movie.id)))
      }} />}
    </main>
  )
}

export default Favourites