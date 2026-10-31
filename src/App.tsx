import { useEffect, useState } from "react"
import Header from "./modules/Header"
import { UserRoutes } from "./routes"

type Theme = "dark" | "light"

const App = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("tvmovies-theme")
    return savedTheme === "light" ? "light" : "dark"
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userName, setUserName] = useState(() => localStorage.getItem("tvmovies-user") || "Guest")

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    localStorage.setItem("tvmovies-theme", theme)
  }, [theme])

  const handleSignIn = (name: string) => {
    const nextName = name.trim() || "Guest"
    localStorage.setItem("tvmovies-user", nextName)
    setUserName(nextName)
    setIsModalOpen(false)
  }

  const handleSignOut = () => {
    localStorage.removeItem("tvmovies-user")
    setUserName("Guest")
  }

  return (
    <div className={theme === "dark" ? "bg-[#0b0f19] text-white" : "bg-[#f8fafc] text-slate-900"}>
      <div className="min-h-screen transition-colors duration-300">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          isLoggedIn={userName !== "Guest"}
          userName={userName}
          onSignIn={() => setIsModalOpen(true)}
          onSignOut={handleSignOut}
        />

        <div className="pt-25.5 md:pt-15.5">
          <UserRoutes
            theme={theme}
            isLoggedIn={userName !== "Guest"}
            userName={userName}
            onSignIn={() => setIsModalOpen(true)}
          />
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={
                theme === "dark"
                  ? "w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
                  : "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
              }
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Sign in</h2>
                <button
                  className="text-xl text-slate-400 hover:text-slate-200"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  const name = String(formData.get("name") || "")
                  handleSignIn(name)
                }}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Your name</label>
                  <input
                    name="name"
                    defaultValue={userName !== "Guest" ? userName : ""}
                    className={
                      theme === "dark"
                        ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500"
                        : "w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-0 placeholder:text-slate-500"
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#00d2ff] px-4 py-3 font-semibold text-white transition hover:bg-[#00b4cc]"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App