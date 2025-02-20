import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import UserContext from './store/UserContext.jsx';
import TripContext from './store/TripContext.jsx';
import SocketProvider from './store/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
      <UserContext>
        <TripContext>
          <SocketProvider>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </SocketProvider>
        </TripContext>
      </UserContext>
)
