import { Component } from '../core/heropy';
import movieStore from '../store/movie'
import MovieItem from './MovieItem';

export default class MovieList extends Component {
  constructor() {
    super()
    movieStore.subscribe('movies', () => {
      this.render()
    })
    movieStore.subscribe('loading', () => {
      this.render()
    })
    movieStore.subscribe('message', () => {
      this.render()
    })
  }
  render() {
    this.el.classList.add('movie-list')
    this.el.innerHTML = /* html */ `
      ${movieStore.state.message
        ? `<div class="message">${movieStore.state.message}</div>`
        : '<div class="movies"></div>'}
      <div class="the-loader hide"></div>
    `

    const movieEl = this.el.querySelector('.movies')
    movieEl?.append( // 선택적 체이닝을 통해서 movieEl가 있을 때만, append()가 동작하도록 함
      ...movieStore.state.movies.map(movie => new MovieItem({
        movie
      }).el)
    )

    const loaderEl = this.el.querySelector('.the-loader')
    movieStore.state.loading 
      ? loaderEl?.classList.remove('hide')
      : loaderEl?.classList.add('hide')
  }
}