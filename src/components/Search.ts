import { Component } from '../core/heropy';
import movieStore, { searchMovies } from '../store/movie'

export default class Search extends Component {
  render() {
    this.el.classList.add('search')
    this.el.innerHTML = /* HTML */ `
      <input 
        value="${movieStore.state.searchText}"
        placeholder="Enter the movie title to search!"/>
      <button class="btn btn-primary">
        Search!
      </button>
    `

    const inputEl = this.el.querySelector('input')
    inputEl?.addEventListener('input', () => {
      movieStore.state.searchText = inputEl.value
    })
    inputEl?.addEventListener('keydown', event => {
      if (event.key === 'Enter' && movieStore.state.searchText.trim()) {
        // 검색창에 아무 것도 없을 때는 검색이 되지 않도록 함
        // 엔터키를 누르고, 검색창에 문자가 존재할 때만 검색이 되도록 만듦
        // trim() 대상문자의 앞뒤 공백 문자를 제거한 새로운 문자를 반환함
        searchMovies(1)
      }
    })

    const btnEl = this.el.querySelector('.btn')
    btnEl?.addEventListener('click', () => {
      if (movieStore.state.searchText.trim()) {
        searchMovies(1)
      }
    })
  }
}