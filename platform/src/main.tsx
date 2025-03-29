import i18n from "i18next";
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { initReactI18next } from 'react-i18next'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '@ant-design/v5-patch-for-react-19';
import store from './redux/store.ts'
import App from './App.tsx'
import interceptorsService from './services/InterceptorsService.ts'
import socketServices from './services/socketServices.ts'
import en from './messages/en.json';
import he from './messages/he.json';
import './styles/DashboardView.css'
import './styles/darkmode.css'
import './styles/global.css'
import './styles/index.css'
import './styles/style.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interceptorsService.createInterceptors();
socketServices.initSocket();
export const queryClient = new QueryClient();

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
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
