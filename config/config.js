import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyDHgM_gDi_ITAHjGfdAAmKGjDx3fkf7gnY",
    authDomain: "chefbook-99fca.firebaseapp.com",
    databaseURL: "https://chefbook-99fca.firebaseio.com",
    projectId: "chefbook-99fca",
    storageBucket: "chefbook-99fca.appspot.com",
    messagingSenderId: "22685791431"
};
firebase.initializeApp(config);

export const f =firebase;
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
