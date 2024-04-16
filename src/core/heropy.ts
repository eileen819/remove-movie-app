///// Component /////
interface ComponentPayload {
  tagName?: string
  props?: {
    [key: string]: unknown
  }
  state?: {
    [key: string]: unknown
  }
}

export class Component {
  public el
  public props
  public state
  constructor(payload: ComponentPayload = {}) {
    const {
      tagName = 'div', // 최상위 요소의 태그 이름
      props = {},
      state = {}
    } = payload
    this.el = document.createElement(tagName) // 컴포넌트의 최상위 요소
    this.props = props // 컴포넌트가 사용될 때 부모 컴포넌트에서 받는 데이터
    this.state = state // 컴포넌트 안에서 사용할 데이터
    this.render()
  }
  render() { // 컴포넌트를 렌더링하는 함수
    // ...
  }
}


///// Router /////
// 페이지 렌더링!
interface Route {
  path: string
  component: typeof Component
}
type Routes = Route[]

function routeRender(routes: Routes) {
  // 접속할 때 해시 모드가 아니면(해시가 없으면) /#/로 리다이렉트!
  // 주소에 해시가 없으면, 해시가 있는 페이지로 갈 수 있게 해 줌
  if (!location.hash) {
    history.replaceState(null, '', '/#/') // (상태, 제목, 주소)
    // location.hash 부분이 비어있다면, 
    // replaceState()를 통해서 히스토리를 남기지 않고 '/#/' 주소를 밀어넣음
  }
  const routerView = document.querySelector('router-view')
  const [hash, queryString = ''] = location.hash.split('?') 
  // split()를 통해 물음표를 기준으로 해시 정보와 쿼리스트링을 구분해서 배열데이터로 구조분해할당 해 줌
  // split()는 문자데이터를 기준을 이용해 배열데이터로 반환함

  // 1) 쿼리스트링을 객체로 변환해 히스토리의 상태에 저장!
  interface Query {
    [key: string]: string
  }
  const query = queryString
    .split('&')
    .reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    }, {} as Query)
    // 배열의 개수만큼 reduce()의 콜백이 실행되면서 acc가 누적되고 마지막의 호출되는 콜백의 값을 반환함
    // 예시) a=123&b=456
    // ['a=123', 'b=456']
    // { a: '123', b: '456'}
  history.replaceState(query, '') 
  // (상태, 제목) 주소 부분 생략 가능

  // 2) 현재 라우트 정보를 찾아서 렌더링!
  const currentRoute = routes.find(route => new RegExp(`${route.path}/?$`).test(hash))
  // find()를 통해서 콜백을 통과하는 배열의 아이템을 currentRoute로 할당하게 됨
  if (routerView) {
    routerView.innerHTML = ''
    currentRoute && routerView.append(new currentRoute.component().el)
  }

  // currentRoute 객체의 component 속성의 값은 클래스이므로, 
  // 생성자함수를 사용해서 호출한 뒤에 거기서 나온 인스턴스 객체의 el 요소를 append()로 밀어넣어줌

  // 3) 화면 출력 후 스크롤 위치 복구!
  window.scrollTo(0, 0)
  // 모든 페이지가 바뀔 때, 페이지에 처음 접근했을 때, 스크롤 위치를 최상단으로 맞춰서
  // 새로운 페이지로 바뀐 것처럼 눈속임 할 수 있음
}

export function createRouter(routes: Routes) {
  // 원하는(필요한) 곳에서 호출할 수 있도록 함수 데이터를 반환!
  return function () {
    window.addEventListener('popstate', () => {
      routeRender(routes)
    })
    routeRender(routes)
    // popstate 이벤트는 주소가 변경되어야 발생하는 이벤트이므로,
    // 처음에는 발생하기 어렵기 때문에 routeRender() 최초 호출 1회를 시켜줌
  }
}


///// Store /////
interface StoreObservers {
  [key: string]: SubscribeCallback[]
}
interface SubscribeCallback {
  (arg: unknown): void
}
export class Store<S> {
    public state = {} as S // 상태(데이터)
    private observers = {} as StoreObservers
  constructor(state: S) {
    for (const key in state) {
      // 각 상태에 대한 변경 감시(Setter) 설정!
      Object.defineProperty(this.state, key, {
        // Getter
        get: () => state[key],
        // Setter
        set: val => {
          state[key] = val
          if (Array.isArray(this.observers[key])) { // 호출할 콜백이 있는 경우!
            this.observers[key].forEach(observer => observer(val))
          }
        }
      })
    }
  }
  // 상태 변경 구독!
  subscribe(key: string, cb: SubscribeCallback) {
    Array.isArray(this.observers[key]) // 이미 등록된 콜백이 있는지 확인!
      ? this.observers[key].push(cb) // 있으면 새로운 콜백 밀어넣기!
      : this.observers[key] = [cb] // 없으면 콜백 배열로 할당!

    // 예시)
    // observers = {
    //   구독할상태이름: [실행할콜백1, 실행할콜백2]
    //   movies: [cb, cb, cb],
    //   message: [cb]
    // }
  }
}