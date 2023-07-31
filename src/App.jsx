import { useCallback, useEffec, useState } from 'react'
import './App.css'
import { Movies } from './components/Movie'
import { useMovies } from './hooks/useMovies'
import { useSearch } from './hooks/useSearch'
import debounce from 'just-debounce-it'

function App() {

  //Destructura pero le cambias el nombre a la variable
  const [sort, setSort] = useState(false)
  const { query, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ query, sort })
  const debounceGetMovies = useCallback(debounce(query => {
    getMovies({ query })
  }, 400), [getMovies])

  const handleSubmit = (event) => {
    event.preventDefault()
    /*
    //Forma no controlada
    //Para obtener lo que viene del formulario
    const {query} = Object.fromEntries(new window.FormData(event.target))
    //Se accede siempre desde current
    const inputEl = inputRef.current
    const value = inputEl.value
    */
    getMovies({ query })
  }

  const handleChange = (event) => {

    //Forma controlada
    //Evitar empezar con vacio
    //if (event.target.value.startWith(' ')) return
    const newSearch = event.target.value
    updateSearch(newSearch)
    debounceGetMovies(newSearch)
    //Aqui mismo puedo hacer las validaciones del useeffect pero recordar que el state es asincrono asi que guardar la variable antes
  }

  const handleSort = () => {
    setSort(!sort)
  }
  return (
    <div>
      <header>
        <h1>Buscador de Peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input style={{ border: '1px solid transparent', borderColor: error ? 'red' : 'transparent' }} onChange={handleChange} value={query} name="query" placeholder='Avengers' type="text" />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
