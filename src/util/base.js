import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Rebase from 're-base'

// Changes all the values you see below

let app = firebase.initializeApp({
    apiKey: "PLACE_YOUR_VALUE_HERE",
    authDomain: "PLACE_YOUR_VALUE_HERE",
    databaseURL: "PLACE_YOUR_VALUE_HERE",
    projectId: "PLACE_YOUR_VALUE_HERE",
    storageBucket: "PLACE_YOUR_VALUE_HERE",
    messagingSenderId: "PLACE_YOUR_VALUE_HERE"
});

export const auth = firebase.auth
let db = firebase.database(app);
export let base = Rebase.createClass(db)