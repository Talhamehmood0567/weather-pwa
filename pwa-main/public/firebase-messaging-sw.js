// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
 apiKey: "AIzaSyA_SZW89VxVGdpD9VQ6pj3CYL3ZDrJqBhE",
  authDomain: "weather-pwa-f69e7.firebaseapp.com",
  projectId: "weather-pwa-f69e7",
  storageBucket: "weather-pwa-f69e7.firebasestorage.app",
  messagingSenderId: "27071407991",
  appId: "1:27071407991:web:a63eabe618ea8c719a6372",
  measurementId: "G-CY1JQW7TFF"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});
