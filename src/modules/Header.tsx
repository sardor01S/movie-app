import { Clapperboard, Heart, Home, Moon, Sun, Tv, UserRound } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
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
  const links = [
    { to: PATH.home, label: "Home", icon: Home },
    { to: PATH.movies, label: "Movies", icon: Tv },
    { to: PATH.favourites, label: "Favourites", icon: Heart },
  ]
  const navClass = ({ isActive }: { isActive: boolean }) => `relative inline-flex items-center gap-2 py-2 text-sm font-semibold transition ${isActive ? `${isDark ? "text-white" : "text-slate-900"} after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:bg-gradient-to-r after:from-violet-400 after:to-cyan-300` : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-2xl ${isDark ? "border-white/8 bg-[#0b0f19]/75" : "border-slate-200/80 bg-white/80"}`}>
      <div className="mx-auto flex h-15.5 max-w-360 items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <Link to={PATH.home} className="flex shrink-0 items-center gap-2.5" aria-label="TwistFlix home">
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-950/30">
            <Clapperboard size={19} strokeWidth={2.2} />
          </span>
          <span className={`font-bold tracking-normal ${isDark ? "text-white" : "text-slate-950"}`}>Twist<span className="text-cyan-400">Flix</span></span>
        </Link>

        <nav className="hidden h-full items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map(({ to, label }) => <NavLink key={to} to={to} end={to === PATH.home} className={navClass}>{label}</NavLink>)}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`grid size-9 place-items-center rounded-full border transition ${isDark ? "border-white/10 bg-white/4 text-slate-300 hover:border-white/25 hover:text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {isLoggedIn ? (
            <div className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 sm:pr-3 ${isDark ? "border-white/10 bg-white/4.5" : "border-slate-200 bg-white"}`}>
              <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">{userName.slice(0, 1).toUpperCase()}</span>
              <span className={`hidden max-w-24 truncate text-xs font-semibold sm:inline ${isDark ? "text-slate-200" : "text-slate-800"}`}>{userName}</span>
              <button type="button" onClick={onSignOut} title="Sign out" aria-label="Sign out" className={`hidden text-xs font-medium sm:inline ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>Exit</button>
            </div>
          ) : (
            <button type="button" onClick={onSignIn} className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-slate-950 transition hover:bg-cyan-100">
              <UserRound size={15} /> <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </div>

      <nav className={`flex h-10 items-center justify-center gap-9 border-t px-4 md:hidden ${isDark ? "border-white/6" : "border-slate-200"}`} aria-label="Mobile navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === PATH.home} className={({ isActive }) => `inline-flex items-center gap-1.5 text-xs font-semibold transition ${isActive ? "text-cyan-300" : isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Icon size={14} /> {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header