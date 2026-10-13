import { Route, Routes } from "react-router-dom"
import { PATH } from "../../components"
import { Favourites, Movies, MoviesId, NotFound, UserHome } from "../../pages"

type UserRoutesProps = {
  theme: "dark" | "light"
  isLoggedIn: boolean
  userName: string
  onSignIn: () => void
}

const UserRoutes = ({ theme, isLoggedIn, userName, onSignIn }: UserRoutesProps) => {
  return (
    <Routes>
      <Route path={PATH.home} element={<UserHome theme={theme} userName={userName} isLoggedIn={isLoggedIn} onSignIn={onSignIn} />} />
      <Route path={PATH.movies} element={<Movies theme={theme} />} />
      <Route path={PATH.moviesId} element={<MoviesId theme={theme} />} />
      <Route path={PATH.favourites} element={<Favourites theme={theme} />} />
      <Route path={PATH.notFound} element={<NotFound theme={theme} />} />
    </Routes>
  )
}

export default UserRoutes