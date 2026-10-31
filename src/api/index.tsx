export type Movie = {
  id: number
  name: string
  summary?: string
  image?: {
    medium?: string
    original?: string
  }
  premiered?: string
  rating?: {
    average?: number | null
  }
  runtime?: number | null
  genres?: string[]
  status?: string
  officialSite?: string
  url?: string
  cast?: string[]
}

type TvMazeShow = Omit<Movie, "summary" | "image" | "cast"> & {
  summary?: string | null
  image?: Movie["image"]
  _embedded?: {
    cast?: { person?: { name?: string } }[]
  }
}

const FAVORITES_KEY = "tvmovies-favorites"

const fallbackMovies: Movie[] = [
  {
    id: 1,
    name: "The Office",
    summary: "A mockumentary about office workers navigating the ups and downs of corporate life.",
    image: {
      medium: "https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg",
      original: "https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg",
    },
    premiered: "2005-03-24",
    rating: { average: 9.1 },
    runtime: 30,
    genres: ["Comedy"],
    status: "Ended",
    officialSite: "https://www.tvmaze.com",
  },
  {
    id: 2,
    name: "Breaking Bad",
    summary: "A chemistry teacher turned meth kingpin battles his own morality with every decision.",
    image: {
      medium: "https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg",
      original: "https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg",
    },
    premiered: "2008-01-20",
    rating: { average: 9.3 },
    runtime: 60,
    genres: ["Drama", "Crime"],
    status: "Ended",
    officialSite: "https://www.tvmaze.com",
  },
  {
    id: 3,
    name: "Stranger Things",
    summary: "A group of kids uncover supernatural mysteries in a small town while a government conspiracy simmers nearby.",
    image: {
      medium: "https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg",
      original: "https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg",
    },
    premiered: "2016-07-15",
    rating: { average: 8.7 },
    runtime: 60,
    genres: ["Drama", "Sci-Fi"],
    status: "Running",
    officialSite: "https://www.tvmaze.com",
  },
]

export const getMoviePoster = (path?: string) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
  }

  return path
}

export const getMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch("https://api.tvmaze.com/shows")

    if (!response.ok) {
      throw new Error("TVMaze request failed")
    }

    const data: unknown = await response.json()
    const shows = Array.isArray(data) ? data as TvMazeShow[] : []

    return shows.slice(0, 12).map((show) => ({
      id: show.id,
      name: show.name,
      summary: show.summary ? show.summary.replace(/<[^>]+>/g, "") : "No description available.",
      image: show.image,
      premiered: show.premiered,
      rating: show.rating,
      runtime: show.runtime,
      genres: show.genres,
      status: show.status,
      officialSite: show.officialSite,
      url: show.url,
    }))
  } catch {
    return fallbackMovies
  }
}

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`)

    if (!response.ok) {
      throw new Error("TVMaze detail request failed")
    }

    const show = await response.json() as TvMazeShow

    return {
      id: show.id,
      name: show.name,
      summary: show.summary ? show.summary.replace(/<[^>]+>/g, "") : "No description available.",
      image: show.image,
      premiered: show.premiered,
      rating: show.rating,
      runtime: show.runtime,
      genres: show.genres,
      status: show.status,
      officialSite: show.officialSite,
      url: show.url,
      cast: show._embedded?.cast?.slice(0, 8).map((entry) => entry.person?.name).filter((name): name is string => Boolean(name)),
    }
  } catch {
    return fallbackMovies.find((movie) => movie.id === id)
  }
}

export const getFavoriteMovieIds = (): number[] => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? (JSON.parse(saved) as number[]) : []
  } catch {
    return []
  }
}

export const isFavoriteMovie = (id: number): boolean => getFavoriteMovieIds().includes(id)

export const toggleFavoriteMovie = (id: number) => {
  const favorites = getFavoriteMovieIds()
  const nextFavorites = favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...favorites, id]

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites))
}
