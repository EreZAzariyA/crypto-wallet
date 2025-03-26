import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './redux/store.ts'
import App from './App.tsx'
import i18n from "i18next";
import '@ant-design/v5-patch-for-react-19';
import interceptorsService from './services/InterceptorsService.ts'
import './styles/DashboardView.css'
import './styles/darkmode.css'
import './styles/global.css'
import './styles/index.css'
import './styles/style.css'
import { initReactI18next } from 'react-i18next'
import en from './messages/en.json';
import he from './messages/he.json';
import socketIo from './services/socketServices.ts'

interceptorsService.createInterceptors();
socketIo.initSocket();

i18n
.use(initReactI18next)
.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en
    },
    he: {
      translation: he
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
)
