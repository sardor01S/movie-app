import { NavLink } from "react-router-dom"
import { PATH } from "../components"

type HeaderProps = {
  theme: "dark" | "light"
  onToggleTheme: () => void
  isLoggedIn: boolean
  userName: string
  onSignIn: () => void
  onSignOut: () => void
}

const Header = ({ theme, onToggleTheme, isLoggedIn, userName, onSignIn, onSignOut }: HeaderProps) => {
  const isDark = theme === "dark"

  return (
    <header
      className={
        isDark
          ? "fixed left-0 right-0 top-0 z-40 border-b border-violet-500/30 bg-slate-950/80 backdrop-blur-xl"
          : "fixed left-0 right-0 top-0 z-40 border-b border-violet-200 bg-white/80 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 text-lg text-white shadow-lg shadow-violet-500/30">
            🎬
          </span>
          <h1 className="text-2xl font-black tracking-tight text-violet-400">TwistFlix</h1>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to={PATH.home}
            className={({ isActive }) =>
              `text-lg font-medium transition ${
                isActive ? "text-violet-400" : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={PATH.movies}
            className={({ isActive }) =>
              `text-lg font-medium transition ${
                isActive ? "text-violet-400" : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            Movies
          </NavLink>
          <NavLink
            to={PATH.favourites}
            className={({ isActive }) =>
              `text-lg font-medium transition ${
                isActive ? "text-violet-400" : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            Favourites
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className={
              isDark
                ? "rounded-full border border-violet-400/50 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                : "rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:border-violet-300"
            }
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-slate-900/80 px-3 py-2 shadow-lg shadow-violet-900/20">
              <span className="text-sm font-medium text-white">{userName}</span>
              <button
                type="button"
                onClick={onSignOut}
                className="text-sm font-medium text-violet-300 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-95"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header