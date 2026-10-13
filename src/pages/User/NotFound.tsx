import { Link } from "react-router-dom"
import { PATH } from "../../components"

type NotFoundProps = {
  theme: "dark" | "light"
}

const NotFound = ({ theme }: NotFoundProps) => {
  const isDark = theme === "dark"

  return (
    <div className={isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}>
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#00d2ff]">404</p>
        <h1 className="text-5xl font-black">Page not found</h1>
        <p className={isDark ? "mt-4 max-w-xl text-slate-300" : "mt-4 max-w-xl text-slate-600"}>
          The page you are looking for does not exist. Return to the home page and continue browsing.
        </p>
        <Link
          to={PATH.home}
          className="mt-8 rounded-xl bg-[#00d2ff] px-6 py-3 font-semibold text-white transition hover:bg-[#00b4cc]"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

export default NotFound