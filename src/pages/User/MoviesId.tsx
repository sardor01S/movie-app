import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getMovieById, type Movie } from "../../api"
import { PATH } from "../../components"
import MovieDetailsModal from "../../modules/MovieDetailsModal"

type MoviesIdProps = { theme: "dark" | "light" }

const MoviesId = ({ theme }: MoviesIdProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const movieId = Number(id)
      if (!Number.isInteger(movieId) || movieId <= 0) {
        setLoading(false)
        return
      }

      const result = await getMovieById(movieId)
      setMovie(result ?? null)
      setLoading(false)
    }

    void load()
  }, [id])

  if (loading) {
    return <main className={`grid min-h-[70vh] place-items-center ${theme === "dark" ? "bg-[#0b0f19]" : "bg-[#edf0f6]"}`}><div className="h-64 w-full max-w-xl animate-pulse rounded-xl bg-slate-800/40" /></main>
  }

  if (!movie) {
    return (
      <main className={`grid min-h-[70vh] place-items-center px-5 text-center ${theme === "dark" ? "bg-[#0b0f19] text-white" : "bg-[#edf0f6] text-slate-900"}`}>
        <div>
          <h1 className="text-2xl font-bold">We couldn’t find that title</h1>
          <p className="mt-2 text-sm opacity-65">It may have moved or is no longer available.</p>
          <Link to={PATH.movies} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-500"><ArrowLeft size={16} /> Back to movies</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={theme === "dark" ? "min-h-[70vh] bg-[#0b0f19]" : "min-h-[70vh] bg-[#edf0f6]"}>
      <MovieDetailsModal movie={movie} showFullDetails={false} loadDetails={false} onClose={() => navigate(PATH.movies)} />
    </main>
  )
}

export default MoviesId