// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-analytics.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAzNszs5pXDa0WHWSXZimxWCdgwX1ZkMos",
  authDomain: "eagle-core-43ec2.firebaseapp.com",
  databaseURL: "https://eagle-core-43ec2.firebaseio.com",
  projectId: "eagle-core-43ec2",
  storageBucket: "eagle-core-43ec2.appspot.com",
  messagingSenderId: "146792283192",
  appId: "1:146792283192:web:60657680a24c1858d8facd",
  measurementId: "G-R8NPQR8Y6F"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Pigeon Suite - Group Call - ' + payload.data.groupId;
  const notificationOptions = {
    "data": {
      "message": "HELLO MESSAGE",
      "groupId": "APPDEV",
      "roomnumber": "ROOMID"
    }
  };
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  console.log('[firebase-messaging-sw.js] notification click ', event.notification.data);
  event.waitUntil(async function () {
    const allClients = await clients.matchAll({
      includeUncontrolled: true // Required otherwise the browser tab is not found and a new tab is opened
    });
    let pigeonClient;
    // Let's see if we already have a chat window open:
    for (const client of allClients) {
      const url = new URL(client.url);
      console.log('[firebase-messaging-sw.js] searching tabs to focus on: ', url);
      if (url.pathname == '/chat/chat-web') {
        // Excellent, let's use it!
        client.focus();
        // if ('navigate' in client) {
        // return client.navigate('www.google.com');
        // do something with your WindowClient after navigation
        // };
        pigeonClient = client;
        break;
      }
    }

    // If we didn't find an existing chat window,
    // open a new one:
    if (!pigeonClient) {
      pigeonClient = await clients.openWindow('/call/');
    }

    // Message the client:
    pigeonClient.postMessage(event.notification.data);
  }());
});

