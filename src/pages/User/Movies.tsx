import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getMoviePoster, getMovies, isFavoriteMovie, toggleFavoriteMovie, type Movie } from "../../api"

type MoviesProps = {
  theme: "dark" | "light"
}

const Movies = ({ theme }: MoviesProps) => {
  const isDark = theme === "dark"
  const [movies, setMovies] = useState<Movie[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const nextMovies = await getMovies()
      setMovies(nextMovies)
      setLoading(false)
    }

    void getData()
  }, [])

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => movie.name.toLowerCase().includes(query.trim().toLowerCase()))
  }, [movies, query])

  const handleToggleFavorite = (id: number) => {
    toggleFavoriteMovie(id)
    setMovies((currentMovies) => [...currentMovies])
  }

  return (
    <div className={isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-violet-400">Popular right now</p>
            <h1 className="text-4xl font-black">Shows</h1>
          </div>

          <div className="w-full max-w-md">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shows..."
              className={
                isDark
                  ? "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500"
                  : "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500"
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={
                  isDark
                    ? "h-[420px] animate-pulse rounded-2xl bg-slate-800"
                    : "h-[420px] animate-pulse rounded-2xl bg-slate-200"
                }
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
            {filteredMovies.map((movie) => {
              const favorite = isFavoriteMovie(movie.id)
              const poster = movie.image?.medium || movie.image?.original || getMoviePoster(undefined)

              return (
                <div
                  key={movie.id}
                  className={
                    isDark
                      ? "group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-slate-950/50"
                      : "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/80"
                  }
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={poster}
                      alt={movie.name}
                      className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(movie.id)}
                      className={`absolute right-3 top-3 rounded-full p-2 text-lg transition ${
                        favorite ? "bg-red-500 text-white" : "bg-slate-900/80 text-white hover:bg-red-500"
                      }`}
                      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      ♥
                    </button>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="line-clamp-2 text-xl font-bold">{movie.name}</h2>
                      <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs font-semibold text-violet-300">
                        {movie.rating?.average ?? "N/A"}
                      </span>
                    </div>

                    <p className={isDark ? "line-clamp-3 text-sm text-slate-300" : "line-clamp-3 text-sm text-slate-600"}>
                      {movie.summary || "No overview available."}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                        {movie.premiered || "Unknown date"}
                      </span>

                      <Link
                        to={`/movies/${movie.id}`}
                        className="rounded-lg bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filteredMovies.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-600 py-12 text-center text-slate-400">
            No shows found for the current search.
          </div>
        )}
      </div>
    </div>
  )
}

export default Movies