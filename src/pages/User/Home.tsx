import { Link } from "react-router-dom"
import { PATH } from "../../components"

type UserHomeProps = {
  theme: "dark" | "light"
  userName: string
  isLoggedIn: boolean
  onSignIn: () => void
}

const UserHome = ({ theme, userName, isLoggedIn, onSignIn }: UserHomeProps) => {
  const isDark = theme === "dark"

  return (
    <div className={isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}>
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
              {isLoggedIn ? `Welcome back, ${userName}` : "New to TwistFlix?"}
            </p>
            <h1 className="text-5xl font-black tracking-tight md:text-6xl">
              Stream the <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">best movies</span>
            </h1>
            <p className={isDark ? "max-w-xl text-lg text-slate-300" : "max-w-xl text-lg text-slate-600"}>
              Explore trending cinema, save favorites, and jump into sharp movie details with trailers right inside the app.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={PATH.movies}
                className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.02]"
              >
                Browse movies
              </Link>
              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={onSignIn}
                  className={
                    isDark
                      ? "rounded-full border border-slate-600 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:border-slate-500"
                      : "rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:border-slate-400"
                  }
                >
                  Sign in
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 p-4 shadow-2xl shadow-violet-950/30">
            <div className="overflow-hidden rounded-[1.5rem]">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
                alt="Movie banner"
                className="h-[430px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserHome