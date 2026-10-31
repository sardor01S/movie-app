import { useEffect, useMemo, useState } from "react"
import { Heart, Play, Search, Sparkles, Star } from "lucide-react"
import { getMoviePoster, getMovies, isFavoriteMovie, toggleFavoriteMovie, type Movie } from "../../api"
import MovieDetailsModal from "../../modules/MovieDetailsModal"

const featuredBackdrop = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2200&q=90"
const pinnedGenres = ["Trending", "Action", "Sci-Fi", "Drama"]
const normalizeGenre = (genre: string) => genre.toLowerCase().replace(/[-\s]/g, "") === "sciencefiction" ? "scifi" : genre.toLowerCase().replace(/[-\s]/g, "")

type MoviesProps = { theme: "dark" | "light" }

const Movies = ({ theme }: MoviesProps) => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [query, setQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("Trending")
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = await getMovies()
      setMovies(result)
      setFavoriteIds(result.filter((movie) => isFavoriteMovie(movie.id)).map((movie) => movie.id))
      setLoading(false)
    }

    void load()
  }, [])

  const availableGenres = useMemo(() => {
    const genres = movies.flatMap((movie) => movie.genres ?? [])
    return [...new Set(genres)].filter((genre) => !pinnedGenres.some((pinned) => normalizeGenre(pinned) === normalizeGenre(genre)))
  }, [movies])

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return movies.filter((movie) => {
      const matchesSearch = !normalizedQuery || `${movie.name} ${movie.summary ?? ""} ${(movie.genres ?? []).join(" ")}`.toLowerCase().includes(normalizedQuery)
      const matchesGenre = activeGenre === "Trending"
        ? true
        : (movie.genres ?? []).some((genre) => normalizeGenre(genre) === normalizeGenre(activeGenre))
      return matchesSearch && matchesGenre
    })
  }, [activeGenre, movies, query])

  const featuredMovie = filteredMovies[0] ?? movies[0]

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>, movieId: number) => {
    event.stopPropagation()
    toggleFavoriteMovie(movieId)
    setFavoriteIds((current) => current.includes(movieId)
      ? current.filter((id) => id !== movieId)
      : [...current, movieId])
  }

  return (
    <main className={`min-h-screen pb-16 ${theme === "dark" ? "bg-[#0b0f19] text-white" : "bg-[#edf0f6] text-slate-900"}`}>
      <section className="relative isolate min-h-70 overflow-hidden text-white sm:min-h-97.5">
        <img src={featuredBackdrop} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#0b0f19] via-[#0b0f19]/75 to-[#0b0f19]/15" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#0b0f19] via-transparent to-[#0b0f19]/25" />

          <div className="mx-auto flex min-h-70 max-w-360 items-end px-5 pb-6 pt-8 sm:min-h-97.5 sm:px-10 sm:pb-12 sm:pt-12 lg:px-16">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-black/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
              <Sparkles size={14} /> The TwistFlix collection
            </div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Movies, picked for tonight</p>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.02] text-white sm:text-5xl lg:text-6xl">Find your next movie.</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
              Browse the collection, find a new favorite, and save it for later.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#browse" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 px-6 text-sm font-bold text-white shadow-lg shadow-violet-950/40 transition hover:brightness-110">
                <Play size={16} fill="currentColor" /> Browse collection
              </a>
              {featuredMovie && (
                <button type="button" onClick={() => setSelectedMovie(featuredMovie)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Explore featured <Play size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-10 right-10 hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/60 lg:flex">
          <span className="h-px w-12 bg-linear-to-r from-violet-400 to-cyan-300" /> Curated for tonight
        </div>
      </section>

      <section id="browse" className="mx-auto max-w-360 scroll-mt-28 px-5 pt-2 sm:px-10 lg:scroll-mt-20 lg:px-16">
        <div className="mb-4 flex flex-col gap-4 border-b border-white/10 pb-4 sm:mb-7 sm:gap-5 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Now showing</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Browse movies</h2>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, genres, stories"
              aria-label="Search titles, genres, and story summaries"
              className={`h-12 w-full rounded-full border pl-11 pr-4 text-sm transition focus:border-cyan-200/50 focus:outline-none ${theme === "dark" ? "border-white/10 bg-white/4.5 text-white placeholder:text-slate-500 focus:bg-white/[0.07]" : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:bg-white"}`}
            />
          </label>
        </div>

        <div className="hide-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1 sm:mb-8" aria-label="Filter by genre">
          {[...pinnedGenres, ...availableGenres].map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setActiveGenre(genre)}
              aria-pressed={activeGenre === genre}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${activeGenre === genre ? "border-white bg-white text-[#101522]" : theme === "dark" ? "border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/25 hover:text-white" : "border-slate-300 bg-white/70 text-slate-700 hover:border-slate-400 hover:text-slate-950"}`}
            >
              {genre}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => <div key={index} className="aspect-2/3 animate-pulse rounded-lg bg-white/6" />)}
          </div>
        ) : filteredMovies.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie, index) => {
              const favorite = favoriteIds.includes(movie.id)
              return (
                <article key={movie.id} className="group relative min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}>
                  <button type="button" onClick={() => setSelectedMovie(movie)} aria-label={`View details for ${movie.name}`} className="block w-full text-left">
                    <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-[#171d2a] ring-1 ring-white/8 transition duration-300 group-hover:-translate-y-1 group-hover:ring-cyan-300/60 group-hover:shadow-[0_14px_45px_-20px_rgba(34,211,238,0.5)]">
                      <img src={getMoviePoster(movie.image?.original || movie.image?.medium)} alt={movie.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/15 opacity-80 transition group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {(movie.genres ?? []).slice(0, 2).map((genre) => <span key={genre} className="rounded-full border border-white/20 bg-black/25 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur">{genre}</span>)}
                        </div>
                        <h3 className="line-clamp-2 text-base font-bold leading-tight text-white sm:text-lg">{movie.name}</h3>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                          <span>{movie.premiered?.slice(0, 4) || "New discovery"}</span>
                          {movie.rating?.average ? <span className="inline-flex items-center gap-1 text-amber-300"><Star size={12} fill="currentColor" />{movie.rating.average.toFixed(1)}</span> : null}
                        </div>
                      </div>
                      <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-white/90 text-slate-950 opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100"><Play size={19} fill="currentColor" /></span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => handleFavorite(event, movie.id)}
                    aria-label={favorite ? `Remove ${movie.name} from favourites` : `Add ${movie.name} to favourites`}
                    className={`absolute right-2 top-2 grid size-9 place-items-center rounded-full border backdrop-blur transition ${favorite ? "border-pink-300/40 bg-pink-500/90 text-white" : "border-white/20 bg-black/35 text-white hover:border-pink-300/50 hover:bg-pink-500/80"}`}
                  >
                    <Heart size={16} fill={favorite ? "currentColor" : "none"} />
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="border-y border-white/10 py-16 text-center">
            <p className="text-lg font-semibold text-white">Nothing found in this collection</p>
            <p className="mt-2 text-sm text-slate-400">Try another title or choose a different genre.</p>
          </div>
        )}
      </section>

      {selectedMovie && <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </main>
  )
}

export default Movies