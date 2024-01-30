import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-storage.js"; 

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
const db = getFirestore();
const storage = getStorage();

onAuthStateChanged(auth, (user) => {
  const loggedCheck = document.querySelector('#logged-check');
  if (user) {
    // User is signed in, see docs for a list of available properties
    const uid = user.email;
    loggedCheck.innerHTML = (`${uid}`);
    // ...
  } else {
    // User is signed out
    const loginLink = document.createElement('a');
    loginLink.setAttribute('href', 'login.html');
    loginLink.setAttribute('id', 'loginLinkBtn');
    loginLink.innerText = 'Login now!';
    loggedCheck.append(loginLink);
    signOutBtn.remove();
    document.querySelector('#nav-add-listing').remove();
    addListingBtn.remove();
  }
});

const buttonDiv = document.querySelector('#buttons-div');
const signOutBtn = document.querySelector('#sign-out-btn');
const addListingBtn = document.querySelector('#add-listing-btn');
const resetListingBtn = document.querySelector('#reset-listing-btn');
const location = document.querySelector('#location');
const category = document.querySelector('#category');
const title = document.querySelector('#ttitle');
const description = document.querySelector('#description');
const price = document.querySelector('#price');
let currency;
const currencyMKD = document.querySelector('#radio1');  
const currencyUSD = document.querySelector('#radio2');  
const currencyEUR = document.querySelector('#radio3'); 
const phone = document.querySelector('#phone'); 
const addListingForm = document.querySelector('#add-listing-form');
const loggedCheck = document.querySelector('#logged-check');

onAuthStateChanged(auth, (user) => {
    const loggedCheck = document.querySelector('#logged-check');
    if (user) { // User is signed in, see docs for a list of available properties
      const uid = user.email;
      loggedCheck.innerHTML = (`${uid}`);
    } else {  // User is signed out
      loggedCheck.innerHTML = ('Logged out');
    }
});

function signOutUser(){
    event.preventDefault();
    signOut(auth);
    window.location.href = "login.html";
}

const unsuccessfullyAddedListing = document.createElement('h5');
unsuccessfullyAddedListing.style = 'color: rgb(200, 0, 0); margin-top:5px;'; 
buttonDiv.appendChild(unsuccessfullyAddedListing);

function addListing(){
    event.preventDefault();
    
    title.style = 'border: 1px solid rgb(212, 212, 212);';
    phone.style = 'border: 1px solid rgb(212, 212, 212);';
    category.style = 'border: 1px solid rgb(212, 212, 212);';
    location.style = 'border: 1px solid rgb(212, 212, 212);';

    let priceDenari;
    if(currencyMKD.checked === true){ 
      currency = currencyMKD;
      priceDenari = price.value;
    }
    else if(currencyUSD.checked === true){
      currency = currencyUSD;
      priceDenari = price.value * 60.34;
    }
    else{                           
      currency = currencyEUR;
      priceDenari = price.value * 61.49;
    }
  
    const dateNow = new Date();
    const minutes = dateNow.getMinutes();
    let minutesReformated; // Adding 0 if minutes is single digit number (05 insted of 5)
    if(minutes < 10)
      minutesReformated = '0' + minutes;
    else
      minutesReformated = minutes;
    
    // if(title.value === '')
    //   title.value = '- No Title -';
    if(description.value === '')
      description.value = ' - Empty Desription - ';
    if(price.value === '')
      price.value = 0;
    // if(phone.value === '')
    //   phone.value = '0';
    // if(category.value === 'none')
    //   category.value = 'Books';
    // if(location.value === 'none')
    //   location.value = 'all';
    const IDnumber = Date.now(); 

    
    unsuccessfullyAddedListing.innerHTML = '';
    

    if(title.value != '' && phone.value != '' && category.value != 'none' && location.value != 'none'){
      addDoc(collection(db, "listings"), { // Saving to Firestore Database
        title: title.value,
        description: description.value,
        price: price.value,
        priceInDenari: priceDenari,
        location: location.value,
        category: category.value,
        currency: currency.value,
        email: loggedCheck.innerHTML,
        phone: phone.value,
        date: dateNow.getDate() + '.' + (dateNow.getMonth()+1) + '.' + dateNow.getFullYear(),
        time: dateNow.getHours() + ':' + minutesReformated,
        IDnumber: (IDnumber).toString(),
        mainImage: document.getElementById('add-file').value
      });
      
      // Storing images to Firebase Storage
      const mainImageRef = ref(storage, (IDnumber).toString());
      const file = document.getElementById('add-file').files[0];
  
      const ImageRef2 = ref(storage, (IDnumber).toString() + '-2');
      const file2 = document.getElementById('add-file-2').files[0];
  
      const ImageRef3 = ref(storage, (IDnumber).toString() + '-3');
      const file3 = document.getElementById('add-file-2').files[1];
      
      const ImageRef4 = ref(storage, (IDnumber).toString() + '-4');
      const file4 = document.getElementById('add-file-2').files[2];
      
      const ImageRef5 = ref(storage, (IDnumber).toString() + '-5');
      const file5 = document.getElementById('add-file-2').files[3];
  
      const ImageRef6 = ref(storage, (IDnumber).toString() + '-6');
      const file6 = document.getElementById('add-file-2').files[4];
  
      
      uploadBytes(mainImageRef, file).then((snapshot) => {
          console.log('Uploaded Main file');
      });
      uploadBytes(ImageRef2, file2).then((snapshot) => {
        console.log('Uploaded file 2');
      });
      uploadBytes(ImageRef3, file3).then((snapshot) => {
        console.log('Uploaded file 3');
      });
      uploadBytes(ImageRef4, file4).then((snapshot) => {
        console.log('Uploaded file 4');
      });
      uploadBytes(ImageRef5, file5).then((snapshot) => {
        console.log('Uploaded file 5');
      });
      uploadBytes(ImageRef6, file6).then((snapshot) => {
        console.log('Uploaded file 6');
      });

      unsuccessfullyAddedListing.style = 'color: green;';
      unsuccessfullyAddedListing.innerHTML = 'Succesfully Added Listing.';
      addListingForm.reset();
    }
    else{
      if(title.value === '')
        title.style = 'border:1px solid red';
      if(phone.value === '')
        phone.style = 'border:1px solid red';
      if(category.value === 'none')
        category.style = 'border:1px solid red';
      if(location.value === 'none')
        location.style = 'border:1px solid red';

        unsuccessfullyAddedListing.style = 'color: rgb(200, 0, 0);';
        unsuccessfullyAddedListing.innerHTML = 'Please fill out all required fields.';
    }   
}

function resetListing(){
  event.preventDefault();
  addListingForm.reset(); 
}

resetListingBtn.addEventListener('click', resetListing);
addListingBtn.addEventListener('click', addListing);
signOutBtn.addEventListener('click', signOutUser);
