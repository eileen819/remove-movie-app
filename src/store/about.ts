import { Store } from '../core/heropy';

interface State {
  photo: string
  name: string
  email: string
  blog: string
  github: string
  repository: string
}

export default new Store<State>({
  photo: 'https://heropy.blog/css/images/logo.png',
  name: 'EILEEN / HHJ',
  email: 'ssumsum07@gmail.com',
  blog: '_',
  github: 'https://github.com/eileen819',
  repository: 'https://github.com/eileen819/vanillajs-movie-app'
})