// Scripts for firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// TODO: Replace with your project's config object from the Firebase Console.
// The service worker often treats these as static.
firebase.initializeApp({
  apiKey: 'AIzaSyDZtJVFdMr-bomkEFjFlHjdohggFH7aS88',
  authDomain: 'subscription-buddy-2353b.firebaseapp.com',
  projectId: 'subscription-buddy-2353b',
  storageBucket: 'subscription-buddy-2353b.firebasestorage.app',
  messagingSenderId: '699854859216',
  appId: '1:699854859216:web:82b8b51da0731ac72d27d5'
})

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload) // NOSONAR
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/img/icons/android-chrome-192x192.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
