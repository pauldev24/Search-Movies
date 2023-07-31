import { useRef, useState, useMemo, useCallback } from 'react'
import { serchMovies } from '../services/movies'
export function useMovies({ query, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previusSearch = useRef(query)

  /*//Se hace para no depender de la api sino internamente tener nuestros propios datos
  const mappeMovies = movies?.map((movie) => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster,
  }));*/

  const getMovies = useCallback(async ({ query }) => {
    //Preguntar al red si ya existe
    //current es para llamar el dato del ref
    if (query === previusSearch.current) return
    try {
      setLoading(true)
      setError(null)
      previusSearch.current = query
      const newMovies = await serchMovies({ query })
      setMovies(newMovies)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  //Para ordenar por titulo
  //Para evitar que este ejecutando la operacion el usememo que cuando sepa solo ejecuta la funcion de ordenar cuando cambia el sort o las peliculas
  const sortMovies = useMemo(() => {
    if (!movies || !Array.isArray(movies) || typeof movies[Symbol.iterator] !== 'function') {
      return []; // Devuelve una lista vacía si movies no es iterable
    }
    return sort ?
      [...movies].sort((a, b) => a.title.localeCompare(b.tittle)) : movies
  }, [sort, movies])

  return { movies: sortMovies, loading, getMovies }
}
