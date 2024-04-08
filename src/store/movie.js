import { Store } from '../core/heropy'

const store = new Store({
  searchText: '',
  page: 1,
  pageMax: 1,
  movies: [],
  movie: {},
  loading: false,
  message: 'Search for the movie title!'
})

export default store
export const searchMovies = async page => {
  store.state.loading = true

  store.state.page = page
  if (page === 1) {
    store.state.movies = []
    // 새로운 내용을 검색하면, page 와 movie 부분을 초기화해 줌
    store.state.message = ''
    // 페이지가 1개라도 출력이 되면 더 이상 메시지가 출력되지 않도록 함
  } 
  try {
    const res = await fetch(`https://omdbapi.com?apikey=7035c60c&s=${store.state.searchText}&page=${page}`)
    const { Search, totalResults, Response, Error } = await res.json()
    if (Response === 'True') {
      store.state.movies = [
        ...store.state.movies,
        ...Search
        // 페이지가 늘어날 때마다, 추가되는 영화 정보들을 새롭게 갱신시켜 줌
      ]
      store.state.pageMax = Math.ceil(Number(totalResults) / 10)
    } else {
      store.state.message = Error
      store.state.pageMax = 1
    }
  } catch (error) {
    console.log('searchMovies error:', error)
  } finally {
    store.state.loading = false
  }
}

export const getMovieDetails = async id => {
  try {
    const res = await fetch(`https://omdbapi.com?apikey=7035c60c&i=${id}&plot=full`)
    store.state.movie = await res.json()
  } catch (error) {
    console.log('getMovieDetails error:', error)
  }
}