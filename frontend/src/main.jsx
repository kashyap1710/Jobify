import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Auth0Provider
      domain="dev-js62l7dyu6g81sdx.us.auth0.com"
      clientId="ZqrYhoo6pPfBsgnMZhRfSkHneMgvPgaP"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-js62l7dyu6g81sdx.us.auth0.com/api/v2/",
      }}
    >
    </Auth0Provider> */}
  </StrictMode>,
)
