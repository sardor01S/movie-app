import { useEffect, useState } from "react"
import { ArrowRight, Play, Sparkles, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { getMoviePoster, getMovies, type Movie } from "../../api"
import { PATH } from "../../components"
import MovieDetailsModal from "../../modules/MovieDetailsModal"

type UserHomeProps = {
  theme: "dark" | "light"
  userName: string
  isLoggedIn: boolean
  onSignIn: () => void
}

const heroImage = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2200&q=90"

const UserHome = ({ theme, userName, isLoggedIn, onSignIn }: UserHomeProps) => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const load = async () => setMovies(await getMovies())
    void load()
  }, [])

  const featured = movies[0]
  const isDark = theme === "dark"

  return (
    <main className={`min-h-screen ${isDark ? "bg-[#0b0f19] text-white" : "bg-[#edf0f6] text-slate-900"}`}>
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden text-white">
        <img src={heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#090d16] via-[#090d16]/80 to-[#090d16]/20" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#0b0f19] via-transparent to-[#0b0f19]/25" />
        <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-10 lg:px-16">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-300" /> {isLoggedIn ? `Welcome back, ${userName}` : "Your next favorite starts here"}
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.23em] text-cyan-200">Stories with a twist</p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[0.98] sm:text-6xl lg:text-7xl">
              Stay in. <span className="bg-linear-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">Go anywhere.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              A world of unforgettable stories, picked for the nights you want to get lost in something good.
            </p>
            {featured && (
              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-200">
                <span className="font-semibold text-white">Featured tonight</span>
                <span className="text-white/40">·</span>
                <span>{featured.name}</span>
                {featured.rating?.average ? <span className="inline-flex items-center gap-1 text-amber-300"><Star size={13} fill="currentColor" />{featured.rating.average.toFixed(1)}</span> : null}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={PATH.movies} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 px-6 text-sm font-bold text-white shadow-lg shadow-violet-950/50 transition hover:brightness-110">
                Browse collection <ArrowRight size={17} />
              </Link>
              {featured ? (
                <button type="button" onClick={() => setSelectedMovie(featured)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
                  <Play size={15} fill="currentColor" /> Discover the pick
                </button>
              ) : !isLoggedIn ? (
                <button type="button" onClick={onSignIn} className="inline-flex min-h-12 items-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">Sign in</button>
              ) : null}
            </div>
          </div>

          <div className="mt-16 border-t border-white/15 pt-5 sm:mt-20 sm:flex sm:items-center sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">A better kind of screen time</p>
            <a href="#tonight" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-cyan-200 sm:mt-0">Explore what's on <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>

      <section id="tonight" className="mx-auto max-w-360 scroll-mt-28 px-5 py-14 sm:px-10 sm:py-16 lg:scroll-mt-20 lg:px-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">A place to begin</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Tonight’s discoveries</h2>
          </div>
          <Link to={PATH.movies} className="hidden items-center gap-2 pb-1 text-sm font-semibold text-cyan-400 transition hover:text-cyan-200 sm:inline-flex">See all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {movies.slice(0, 5).map((movie) => (
            <button key={movie.id} type="button" onClick={() => setSelectedMovie(movie)} className="group min-w-0 text-left">
              <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-slate-800 ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:ring-cyan-300/50">
                <img src={getMoviePoster(movie.image?.medium || movie.image?.original)} alt={movie.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="line-clamp-2 text-sm font-bold text-white sm:text-base">{movie.name}</p>
                  <p className="mt-1 text-xs text-slate-300">{movie.genres?.[0] || "Featured"}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Link to={PATH.movies} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 sm:hidden">Browse all titles <ArrowRight size={15} /></Link>
      </section>

      {selectedMovie && <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </main>
  )
}

export default UserHome