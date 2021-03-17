import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const fbProvider = new firebase.auth.FacebookAuthProvider();


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
        const { displayName, photoURL, email } = user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        // console.log(displayName, photoURL, email);
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

  const handleSignOut = () => {
    firebase.auth().signOut().then(res => {
      // Sign-out successful.
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        error: '',
        success: ''
      }
      setUser(signedOutUser);
    }).catch((error) => {
      // An error happened.
    });
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // Signed in 
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          // console.log(res);
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          // var errorMessage = error.message;
          // console.log(errorCode, errorMessage);
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);

          // ..
        });
    }
    e.preventDefault();
  }

  const handleBlur = (e) => {
    // console.log(e.target.name, e.target.value);
    let isFormValid = true;
    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isFormValid);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      // [...cart, new] 
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        console.log('fb', user);

        // ...
      })
      .catch((error) => {
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



  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>

      }
      <br />

      <button onClick={handleFbSignIn}>Sign in Using Facebook</button>

      {
        user.isSignedIn && <div>
          <h1>Welcome, {user.name}</h1>
          <br />
          <h3>{user.email}</h3>
          <br />
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentication</h1>
      {/* <p>Email: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}
      <input type="checkbox" onChange={() => setUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input onBlur={handleBlur} type="text" name="name" id="" placeholder="Your Name" required />}

        <br />
        <input onBlur={handleBlur} type="text" name="email" id="" placeholder="Your Email Address" required />
        <br />
        <input onBlur={handleBlur} type="password" name="password" id="" placeholder="Your Password" required />
        <br />
        <input type="submit" value="SUBMIT" />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>Successful!</p>
      }
    </div>
  );
}

export default App;
