import { createRouter } from '../core/heropy'
import Home from './Home'
import Movie from './Movie'
import About from './About'
import NotFound from './NotFound'

export default createRouter([
  { path: '#/', component: Home },
  { path: '#/movie', component: Movie },
  { path: '#/about', component: About },
  { path: '.*', component: NotFound }
  // .{0,} = .* : 임의의 문자가 0개 이상 모두 일치한다는 정규표현식
  // 만들어 둔 페이지가 아닌 다른 페이지로 이동했을 때, NotFound 페이지를 보여주겠다는 의미
]) // 함수를 반환함