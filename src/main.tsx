import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register custom service worker for push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-push.js').then((registration) => {
    console.log('Push SW registered:', registration.scope);
  }).catch((error) => {
    console.log('Push SW registration failed:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
