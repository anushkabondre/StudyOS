import ReactDOM from "react-dom/client";

import App from "./app/App";
import {
  SupabaseAuthProvider,
} from "./context/SupabaseAuthContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <SupabaseAuthProvider>
    <App />
  </SupabaseAuthProvider>
);