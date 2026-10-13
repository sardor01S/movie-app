import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getFavoriteMovieIds, getMoviePoster, getMovies, type Movie } from "../../api"

type FavouritesProps = {
  theme: "dark" | "light"
}

const Favourites = ({ theme }: FavouritesProps) => {
  const isDark = theme === "dark"
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const loadFavorites = async () => {
      const favorites = getFavoriteMovieIds()
      const allMovies = await getMovies()
      setMovies(allMovies.filter((movie) => favorites.includes(movie.id)))
    }

    void loadFavorites()
  }, [])

  return (
    <div className={isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-violet-400">Your list</p>
          <h1 className="text-4xl font-black">Favourite shows</h1>
        </div>

        {movies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-600 p-12 text-center text-slate-400">
            You have no favourite shows yet. Go to the movies section and add some.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={
                  isDark
                    ? "overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                    : "overflow-hidden rounded-2xl border border-slate-200 bg-white"
                }
              >
                <img
                  src={movie.image?.medium || movie.image?.original || getMoviePoster(undefined)}
                  alt={movie.name}
                  className="h-[360px] w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <h2 className="text-xl font-bold">{movie.name}</h2>
                  <p className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-600"}>
                    {movie.summary?.slice(0, 120) || "No overview available."}...
                  </p>
                  <Link
                    to={`/movies/${movie.id}`}
                    className="inline-block rounded-lg bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourites