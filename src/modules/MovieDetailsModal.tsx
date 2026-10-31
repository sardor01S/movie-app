import { useEffect, useState } from "react"
import { ExternalLink, Heart, Play, Star, X } from "lucide-react"
import { Link } from "react-router-dom"
import { getMovieById, getMoviePoster, isFavoriteMovie, toggleFavoriteMovie, type Movie } from "../api"

type MovieDetailsModalProps = {
  movie: Movie
  onClose: () => void
  showFullDetails?: boolean
  loadDetails?: boolean
}

const MovieDetailsModal = ({ movie, onClose, showFullDetails = true, loadDetails: shouldLoadDetails = true }: MovieDetailsModalProps) => {
  const [details, setDetails] = useState(movie)
  const [favorite, setFavorite] = useState(isFavoriteMovie(movie.id))
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)

  useEffect(() => {
    if (!shouldLoadDetails) return

    const loadDetails = async () => {
      const fullMovie = await getMovieById(movie.id)
      if (fullMovie) setDetails(fullMovie)
    }

    void loadDetails()
  }, [shouldLoadDetails, movie.id])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isTrailerOpen) setIsTrailerOpen(false)
        else onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isTrailerOpen, onClose])

  const handleFavorite = () => {
    toggleFavoriteMovie(movie.id)
    setFavorite((current) => !current)
  }

  const releaseYear = details.premiered?.slice(0, 4) || "—"
  const trailerSearch = encodeURIComponent(`${details.name} official trailer`)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#03050a]/85 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="movie-dialog-title"
        aria-modal="true"
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#101522] shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="relative h-56 sm:h-80">
          <img
            src={getMoviePoster(details.image?.original || details.image?.medium)}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#101522] via-[#101522]/30 to-black/10" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close movie details"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur transition hover:bg-white/15"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative -mt-12 space-y-5 px-5 pb-6 sm:-mt-16 sm:px-8 sm:pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
            <span>{releaseYear}</span>
            <span className="text-slate-600">•</span>
            <span>{details.runtime ? `${details.runtime} min` : "Runtime unavailable"}</span>
            <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] tracking-wide">{details.status || "Series"}</span>
            {details.rating?.average ? (
              <span className="ml-1 inline-flex items-center gap-1 text-amber-300">
                <Star size={14} fill="currentColor" /> {details.rating.average.toFixed(1)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 id="movie-dialog-title" className="text-3xl font-bold text-white sm:text-4xl">{details.name}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                {details.summary || "No overview is available for this title yet."}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
              >
                <Play size={16} fill="currentColor" /> Trailer
              </button>
              <button
                type="button"
                onClick={handleFavorite}
                aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
                className={`grid size-11 place-items-center rounded-full border transition ${favorite ? "border-pink-400/40 bg-pink-500/15 text-pink-300" : "border-white/15 bg-white/5 text-white hover:border-pink-400/50 hover:text-pink-300"}`}
              >
                <Heart size={18} fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(details.genres ?? []).map((genre) => (
              <span key={genre} className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-xs text-cyan-100">
                {genre}
              </span>
            ))}
          </div>

          <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cast</p>
              <p className="mt-2 text-sm text-slate-300">
                {details.cast?.length ? details.cast.join(" · ") : "Cast information unavailable"}
              </p>
            </div>
            {showFullDetails && (
              <Link
                to={`/movies/${movie.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-white"
              >
                Full details <ExternalLink size={15} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {isTrailerOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsTrailerOpen(false)
          }}
        >
          <div className="w-full max-w-4xl">
            <div className="mb-3 flex items-center justify-between text-white">
              <h3 className="font-semibold">{details.name} · Official trailer</h3>
              <button
                type="button"
                onClick={() => setIsTrailerOpen(false)}
                aria-label="Close trailer"
                className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed?listType=search&list=${trailerSearch}&autoplay=1`}
                title={`${details.name} trailer search on YouTube`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <a
              href={`https://www.youtube.com/results?search_query=${trailerSearch}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Open trailer search on YouTube <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetailsModal