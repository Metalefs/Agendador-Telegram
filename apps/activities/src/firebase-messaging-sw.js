// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
  apiKey: "AIzaSyBrIZEqzfFDbjPThP_LfQGGjJ680nMef9M",
  authDomain: "mealprepscheduler.firebaseapp.com",
  projectId: "mealprepscheduler",
  storageBucket: "mealprepscheduler.appspot.com",
  messagingSenderId: "911796857770",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
