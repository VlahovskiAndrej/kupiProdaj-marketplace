import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { browserLocalPersistence, browserSessionPersistence, setPersistence, getRedirectResult, signInWithPopup, GoogleAuthProvider, getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIEGVPRahHoPN52bjBtz89v5AKk1fWQ7o",
    authDomain: "kupiprodaj-20691.firebaseapp.com",
    databaseURL: "https://kupiprodaj-20691-default-rtdb.firebaseio.com",
    projectId: "kupiprodaj-20691",
    storageBucket: "kupiprodaj-20691.appspot.com",
    messagingSenderId: "230562017846",
    appId: "1:230562017846:web:9df402cfba0979149cde97"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();


const email = document.querySelector('#e-mail-log');
const password = document.querySelector('#password-log');
const loginBtn = document.querySelector('#login-btn');
const loginGoogleBtn = document.querySelector('#google-btn');
const signOutBtn = document.querySelector('#sign-out-btn');
const loggedCheck = document.querySelector('#logged-check');
const passwordVisibilityInput = document.querySelector('#pass-checkbox');
const rememberMe = document.querySelector('#remember-me');

function loginUser(){
    loginBtn.innerHTML = 'Logging in...';
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        // Signed in 
        let user = userCredential.user;
        user = auth.currentUser;
        const userEmail = user.firstName;
        window.location.href = "index.html"; 
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
          error.style="display:none;"
        });

        const emailError = document.querySelector('#error-e-mail-log');
        const passwordError = document.querySelector('#error-password-log');

        emailError.innerHTML='Enter your email address.';
        passwordError.innerHTML='Enter your password.';

        if(email.value === '' && password.value === ''){
          emailError.style = 'display:block';
          passwordError.style = 'display:block';
        }
        else if(email.value === '')
          emailError.style = 'display:block';
        else if(password.value === '')
          passwordError.style = 'display:block';
        else if(errorMessage === 'Firebase: Error (auth/invalid-email).'){
          emailError.innerHTML = 'Invalid email address!';
          emailError.style='display:block';
        }
        else if(errorMessage === 'Firebase: Error (auth/wrong-password).'){
          passwordError.innerHTML='Invalid password!';
          passwordError.style='display:block';
        }
        else
          alert(error.message);
        loginBtn.innerHTML = 'Login';
    });
    event.preventDefault();
}

function loginUserGoogle(){
  event.preventDefault();
  getRedirectResult(auth);
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    window.location.href = "index.html"; 
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

onAuthStateChanged(auth, (user) => {
    const loggedCheck = document.querySelector('#logged-check');
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.email;
      loggedCheck.innerHTML = (`${uid}`);
      // ...
      if(rememberMe.checked){
        setPersistence(auth, browserLocalPersistence);
      }
      else{
        setPersistence(auth, browserSessionPersistence);
      }

    } else {
      // User is signed out
      // ...
      loggedCheck.innerHTML = ('Logged out');
    }
  });

function signOutUser(){
    event.preventDefault();
    signOut(auth);
    window.location.href = "login.html";
}

function passwordVisibility() {
  var pass = document.getElementById("password-log");
  if (pass.type === "password") {
    pass.type = "text";
  } else {
    pass.type = "password";
  }
}

signOutBtn.addEventListener('click', signOutUser);
loginBtn.addEventListener('click', loginUser);
loginGoogleBtn.addEventListener('click', loginUserGoogle);
passwordVisibilityInput.addEventListener('click', passwordVisibility);