import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();


  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        // var credential = result.credential;

        // // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = credential.accessToken;
        // // The signed-in user info.
        var user = result.user;
        // console.log(user);
        const {displayName, photoURL, email} = user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  const handleSignOut  = () => {
    firebase.auth().signOut().then(res => {
      // Sign-out successful.
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(signedOutUser);
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>
        
      }
      
      {
        user.isSignedIn && <p> Welcome, {user.name}</p>
      }
    </div>
  );
}

export default App;
