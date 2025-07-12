import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker path from public
const swPath = `${process.env.PUBLIC_URL}/serviceWorker.js`;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log("Service Worker registered:", reg);

        // Background Sync ready
        if ("SyncManager" in window) {
          console.log("Background Sync supported.");
        }

        // Push Notification permission
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Notifications enabled!", {
              body: "You’ll now receive weather alerts.",
              icon: "/logo.png"
            });
          } else {
            console.log("Notification permission:", permission);
          }
        });
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  });
}
