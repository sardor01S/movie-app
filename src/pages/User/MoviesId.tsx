import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getMovieById, getMoviePoster, isFavoriteMovie, toggleFavoriteMovie, type Movie } from "../../api"
import { PATH } from "../../components"

type MoviesIdProps = {
  theme: "dark" | "light"
}

const MoviesId = ({ theme }: MoviesIdProps) => {
  const isDark = theme === "dark"
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      setLoading(true)
      const foundMovie = await getMovieById(Number(id))
      setMovie(foundMovie || null)
      setFavorite(isFavoriteMovie(Number(id)))
      setLoading(false)
    }

    void loadMovie()
  }, [id])

  const handleFavorite = () => {
    if (!movie) return

    toggleFavoriteMovie(movie.id)
    setFavorite((value) => !value)
  }

  return (
    <div className={isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="h-[60vh] animate-pulse rounded-[2rem] bg-slate-800" />
        ) : !movie ? (
          <div className="rounded-[2rem] border border-dashed border-slate-600 p-10 text-center text-slate-400">
            Show not found.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] border border-violet-500/20 bg-slate-900 shadow-2xl shadow-violet-950/30">
              <div className="relative">
                <img
                  src={movie.image?.original || movie.image?.medium || getMoviePoster(undefined)}
                  alt={movie.name}
                  className="h-[420px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/30" />
              </div>

              <div className="relative -mt-16 space-y-6 p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm font-medium text-violet-300">
                    {movie.premiered || "Unknown date"}
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">
                    ⭐ {movie.rating?.average ?? "N/A"}
                  </span>
                  {movie.runtime ? (
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
                      {movie.runtime} min
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-3xl space-y-4">
                    <h1 className="text-4xl font-black md:text-6xl">{movie.name}</h1>
                    <p className="max-w-2xl text-slate-300">{movie.summary || "No description available."}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleFavorite}
                      className={
                        favorite
                          ? "rounded-full bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-400"
                          : "rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 hover:opacity-95"
                      }
                    >
                      {favorite ? "Remove favorite" : "Add favorite"}
                    </button>
                    <Link
                      to={PATH.movies}
                      className="rounded-full border border-slate-600 px-5 py-3 font-semibold text-white hover:border-slate-400"
                    >
                      Back to movies
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="overflow-hidden rounded-[2rem] border border-violet-500/20 bg-slate-900 p-3 shadow-xl shadow-violet-950/20">
                <img
                  src={movie.image?.original || movie.image?.medium || getMoviePoster(undefined)}
                  alt={movie.name}
                  className="aspect-video w-full rounded-[1.25rem] object-cover"
                />
              </div>

              <div className={isDark ? "rounded-[2rem] border border-violet-500/20 bg-slate-900 p-6" : "rounded-[2rem] border border-violet-200 bg-white p-6 shadow-lg"}>
                <h2 className="mb-4 text-2xl font-bold">Show info</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Status</span>
                    <span className="font-medium">{movie.status || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Release</span>
                    <span className="font-medium">{movie.premiered || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Rating</span>
                    <span className="font-medium">{movie.rating?.average ?? "N/A"}</span>
                  </div>
                  <div>
                    <p className={isDark ? "mb-2 text-slate-400" : "mb-2 text-slate-500"}>Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {(movie.genres ?? []).map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-xs text-violet-300"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  {movie.officialSite ? (
                    <a
                      href={movie.officialSite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 font-medium text-white"
                    >
                      Official site
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MoviesId