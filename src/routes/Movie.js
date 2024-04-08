import { Component } from '../core/heropy';
import movieStore, { getMovieDetails } from '../store/movie'

export default class Movie extends Component {
  async render() {
    this.el.classList.add('container', 'the-movie')
    this.el.innerHTML = /* html */ `
      <div class="poster skeleton"></div>
      <div class="specs">
        <div class="title skeleton"></div>
        <div class="labels skeleton"></div>
        <div class="plot skeleton"></div>
      </div>
    `
    await getMovieDetails(history.state.id)
    console.log(movieStore.state.movie)
    const { movie } = movieStore.state
    // movieStore.state.movie.Poster 이렇게 속성을 쓰기에 너무 코드가 길기때문에,
    // movieStore.state를 구조분해할당해서 movie 라는 속성만 꺼내 쓸 수 있도록 만듦
    // 이렇게 만들어서 movie.Poster로 코드가 짧아지게 만들 수 있음
    const bigPoster = movie.Poster.replace('SX300', 'SX700')

    this.el.innerHTML = /* html */ `
      <div 
        style="background-image: url(${bigPoster})" 
        class="poster"></div>
      <div class="specs">
        <div class="title">
          ${movie.Title}
        </div>
        <div class="labels">
          <span>${movie.Released}</span>
          &nbsp;/ &nbsp;
          <span>${movie.Runtime}</span>
          &nbsp;/ &nbsp;
          <span>${movie.Country}</span>
        </div>
        <div class="plot">
          ${movie.Plot}
        </div>
        <div>
          <h3>Ratings</h3>
          ${movie.Ratings.map(rating => {
            return `<p>${rating.Source} - ${rating.Value}</p>`
          }).join('')}
        </div>
        <div>
          <h3>Actors</h3>
          <p>${movie.Actors}</p>
        </div>
        <div>
          <h3>Director</h3>
          <p>${movie.Director}</p>
        </div>
        <div>
          <h3>Production</h3>
          <p>${movie.Production}</p>
        </div>
        <div>
          <h3>Genre</h3>
          <p>${movie.Genre}</p>
        </div>
      </div>
    `
    // &nbsp; >> html특수기호로 여러개의 띄어쓰기를 사용할 수 있음
    // 줄바꿈 처리는 띄어쓰기 1회에 해당하므로 &nbsp;기호를 통해 띄어쓰기가 2번이 됨
  }
}