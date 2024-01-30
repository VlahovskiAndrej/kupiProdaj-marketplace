import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { signInWithPopup, getRedirectResult, GoogleAuthProvider, getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";

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

const username = document.querySelector('#f-name');
const l_name = document.querySelector('#l-name');
const email = document.querySelector('#e-mail-reg');
const password = document.querySelector('#password-reg');
const passwordRepeat = document.querySelector('#r-password-reg'); 
const registerBtn = document.querySelector('#register-btn');
const passwordVisibilityInput = document.querySelector('#pass-checkbox');
const loginGoogleBtn = document.querySelector('#google-btn');
const agreeTerms = document.querySelector('#agree-terms');

onAuthStateChanged(auth, (user) => {
    
    const loggedCheck = document.querySelector('#logged-check');
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.email;
      loggedCheck.innerHTML = (`${uid}`);
      // ...
    } else {
      
      // User is signed out
      // ...
      loggedCheck.innerHTML = ('Logged out');
    }
  });

function registerUser(){
    //----------------ADD TO AUTH-------------------------------------------------------------------------------------
    registerBtn.innerHTML = 'Creating Account...';
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        if(agreeTerms.checked == false)
          alert('terms must be checked');
        window.location.href = "index.html";
    })
    .catch((error) => {
        registerBtn.innerHTML = 'Create an Account';
        const errorCode = error.code;
        const errorMessage = error.message;

        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
          error.style="display:none;"
        });

        const f_nameError = document.querySelector('#error-f-name');
        const l_nameError = document.querySelector('#error-l-name');
        const emailError = document.querySelector('#error-e-mail-reg');
        const passwordError = document.querySelector('#error-password-reg');
        const r_passwordError = document.querySelector('#error-r-password-reg');
        
        f_nameError.innerHTML='Enter first name.';
        l_nameError.innerHTML='Enter your last name.';
        emailError.innerHTML='Enter your email address.';
        passwordError.innerHTML='Enter your password.';
        r_passwordError.innerHTML='Repeat your password.';

        if(username.value === '')
          f_nameError.style='display:block';
        if(l_name.value === '')
          l_nameError.style='display:block';
        if(email.value === '')
          emailError.style='display:block';
        if(password.value === '')
          passwordError.style='display:block';
        if(passwordRepeat.value === '')
          r_passwordError.style='display:block';
        
        if( username.value != '' && l_name.value != '' && email.value != '' && password.value != '' && passwordRepeat.value != ''){
          if(password.value != passwordRepeat.value){
            r_passwordError.innerHTML = 'Invalid password!';
            r_passwordError.style='display:block';
          }
          else if(errorMessage === 'Firebase: Error (auth/invalid-email).'){
            emailError.innerHTML = 'Invalid email address!';
            emailError.style='display:block';
          }
          else if(errorMessage === 'Firebase: Error (auth/wrong-password).'){
            passwordError.innerHTML='Invalid password!';
            passwordError.style='display:block';
          }
          else if(errorMessage === 'Firebase: Error (auth/email-already-in-use).'){
            emailError.innerHTML = 'Email address already in use!';
            emailError.style='display:block';
          }
          else if(errorMessage === 'Firebase: Password should be at least 6 characters (auth/weak-password).'){
            passwordError.innerHTML='Password should be at least 6 characters!';
            passwordError.style='display:block;';
          }
          else if(agreeTerms.checked === false){
            agreeTerms.style = 'background-color:red;';
          }
          else
            alert(error.message);
        }
        
    });

    function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    
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

function passwordVisibility() {
  var pass = document.getElementById("password-reg");
  var passRe = document.getElementById("r-password-reg");

  if (pass.type === "password") {
    pass.type = "text";
    passRe.type = 'text';
  } else {
    pass.type = "password";
    passRe.type = 'password';
  }
}

registerBtn.addEventListener('click', registerUser);
loginGoogleBtn.addEventListener('click', loginUserGoogle);
passwordVisibilityInput.addEventListener('click', passwordVisibility);