import App from './App';
import router from './routes/index';

const root = document.querySelector('#root')
root.append(new App().el)

router() 
// index.js 파일에서 호출된 결과를 다시 호출함, 즉 index.js 파일에서 호출된 결과는 함수임을 알 수 있음