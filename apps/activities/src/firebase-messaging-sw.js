importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBrIZEqzfFDbjPThP_LfQGGjJ680nMef9M",
  authDomain: "mealprepscheduler.firebaseapp.com",
  projectId: "mealprepscheduler",
  storageBucket: "mealprepscheduler.appspot.com",
  messagingSenderId: "911796857770",
  appId: "1:911796857770:web:865f5c4f0571d5605119d3",
});


const isSupported = firebase.messaging.isSupported();
if (isSupported) {
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
        self.registration.showNotification(title, { body, icon: image || '/assets/icons/icon-72x72.png' });
    });
}
