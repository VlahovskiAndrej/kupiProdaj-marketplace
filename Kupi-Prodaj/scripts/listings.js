import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { onSnapshot, updateDoc, getFirestore, deleteDoc, doc, collection, addDoc, getDocs, getDoc, query, where} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
import { uploadBytes, getStorage, ref, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-storage.js"; 

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

const signOutBtn = document.querySelector('#sign-out-btn');
const loggedCheck = document.querySelector('#logged-check');

onAuthStateChanged(auth, (user) => {
    const loggedCheck = document.querySelector('#logged-check');
    if (user) {
      // User is signed in, see docs for a list of available properties
      const uid = user.email;
      loggedCheck.innerHTML = (`${uid}`);
      // ...
    } else {
      // User is signed out
      const navItem2 = document.querySelector('#nav-item2');
      const loginLink = document.createElement('a');
      loginLink.setAttribute('href', 'login.html');
      loginLink.setAttribute('id', 'loginLinkBtn');
      loginLink.innerText = 'Login now!';
      navItem2.append(loginLink);
      signOutBtn.remove();
      document.querySelector('#nav-add-listing').remove();
    }
  });

signOutBtn.addEventListener('click', signOutUser);
function signOutUser(){
    event.preventDefault();
    signOut(auth);
    window.location.href = "login.html";
}

// SEARCH BAR
const searchLocation = document.querySelector('#location');
const searchCategory = document.querySelector('#category');
const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const Listings = document.querySelectorAll('.new-listing');
  Listings.forEach((li) => {
    if(li.hasAttribute('data-id')){
      const categoryH6 = li.querySelector('#c');
      const locationH6 = li.querySelector('#l');
      const title = li.querySelector('h1');
      const description = li.querySelector('p');

      if(searchCategory.value === 'all' && searchLocation.value === 'all'){
        if((title.innerText.toLowerCase().includes(searchInput.value.toLowerCase()) || description.innerText.toLowerCase().includes(searchInput.value.toLowerCase())))
          li.style.display = 'flex';
        else
          li.style.display = 'none';
      }
      else if(searchCategory.value != 'all' && searchLocation.value === 'all'){
        if(searchCategory.value === categoryH6.innerText)
          if((title.innerText.toLowerCase().includes(searchInput.value.toLowerCase()) || description.innerText.toLowerCase().includes(searchInput.value.toLowerCase())))
            li.style.display = 'flex';
          else
            li.style.display = 'none';
        else
          li.style.display = 'none';
      }
      else if(searchCategory.value === 'all' && searchLocation.value != 'all'){
        if(searchLocation.value === locationH6.innerText || locationH6.innerText === 'all')
          if((title.innerText.toLowerCase().includes(searchInput.value.toLowerCase()) || description.innerText.toLowerCase().includes(searchInput.value.toLowerCase())))
            li.style.display = 'flex';
          else
            li.style.display = 'none';
        else
          li.style.display = 'none';
      }
      else if(searchCategory.value != 'all' && searchLocation.value != 'all'){
        if((searchLocation.value === locationH6.innerText || locationH6.innerText === 'all') && searchCategory.value === categoryH6.innerText)
          if((title.innerText.toLowerCase().includes(searchInput.value.toLowerCase()) || description.innerText.toLowerCase().includes(searchInput.value.toLowerCase())))
            li.style.display = 'flex';
          else
            li.style.display = 'none';
        else
          li.style.display = 'none';
      }
    }
  }); 

});

// LISTINGS
const querySnapshot = await getDocs(collection(db, "listings"));
let numDocs=0;
querySnapshot.forEach((doc) => {
  numDocs++;
  const listSection = document.querySelector('#Listings');
  const listUl = document.querySelector('#listing-ul');
  const Listing = document.createElement('li');
  Listing.classList = 'new-listing';
  Listing.setAttribute('data-id', doc.id);
  
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('id', 'closeBtn');
  closeBtn.addEventListener('click', closeFullScreen);
  closeBtn.innerHTML = `<img src="/images/remove (1).png">`;
  closeBtn.style = 'display: none;';
  

  let isFullScreen;
  const imageDiv = document.createElement('div');
  imageDiv.setAttribute('id', 'image');
  const image = document.createElement('img');
  image.setAttribute('id','main-img');
  image.setAttribute('width', '150px');
  image.setAttribute('height', '150px');
  image.setAttribute('onerror', "this.src='/images/noImage500px.jpg'");

  const fullPage = document.querySelector('#fullpage');
  image.addEventListener('click', openImage);
  fullPage.addEventListener('click', closeImage);

  function openImage(){
    if(isFullScreen && image.src != ''){
      fullPage.style.backgroundImage = 'url(' + image.src + ')';
      fullPage.style.display = 'block';
      listUl.style.display = 'none';
    }
  }
  function closeImage(){
    listUl.style.display = 'block';
    fullPage.style.display = 'none';
    const openedListing = document.querySelector('.new-listing-enlarge');
    scrollTo(openedListing);
  }
  
  const textDiv = document.createElement('div');
  textDiv.setAttribute('id', 'text');
  const TitleDateDiv = document.createElement('div');
  TitleDateDiv.setAttribute('id', 'title-date');
  const listingTitle = document.createElement('h1');
  listingTitle.addEventListener('click', openFullScreen);
  const listingDate = document.createElement('h5');
  const listingPrice = document.createElement('h4');
  const listingDescription = document.createElement('p');
  const listingCity = document.createElement('h6');
  listingCity.setAttribute('id', 'c');
  const newComa = document.createElement('h6');
  newComa.innerText = ', ';
  const listingCategory = document.createElement('h6');
  listingCategory.setAttribute('id', 'l');
  const cityCategoryDiv = document.createElement('div');
  cityCategoryDiv.setAttribute('id', 'city-category');

  const userEmailDiv = document.createElement('div');
  userEmailDiv.setAttribute('id','userEmailDiv');
  const userEmailImg = document.createElement('img');
  userEmailImg.setAttribute('src','/images/mail-icon.png');
  userEmailImg.setAttribute('width','40px');
  const userEmail = document.createElement('h5');
  userEmail.setAttribute('id', 'userEmail');
  const phoneNumberDiv = document.createElement('div');
  phoneNumberDiv.setAttribute('id','phoneNumberDiv');
  const phoneNumberImg = document.createElement('img');
  phoneNumberImg.setAttribute('src','/images/phone-icon.png');
  phoneNumberImg.setAttribute('width', '32px');
  const phoneNumber = document.createElement('h5');
  phoneNumber.setAttribute('id', 'phoneNumber');

  listingTitle.innerText = doc.data().title;
  listingDate.innerText = doc.data().time + " " + doc.data().date;
  listingPrice.innerText = doc.data().price + " " + doc.data().currency;
  listingDescription.innerText = doc.data().description;
  listingCity.innerText = doc.data().category;
  listingCategory.innerText = doc.data().location;
  userEmail.innerText = doc.data().email;
  phoneNumber.innerText = doc.data().phone;

  userEmailDiv.style = 'display:none';
  phoneNumberDiv.style = 'display:none';

  listSection.appendChild(listUl);
  listUl.appendChild(Listing);
  Listing.appendChild(imageDiv);
  Listing.appendChild(textDiv);
  imageDiv.appendChild(image);
  textDiv.appendChild(closeBtn);
  textDiv.appendChild(cityCategoryDiv);
  textDiv.appendChild(TitleDateDiv);
  textDiv.appendChild(listingPrice);
  textDiv.appendChild(listingDescription);
  textDiv.appendChild(userEmailDiv);
  userEmailDiv.appendChild(userEmailImg);
  userEmailDiv.appendChild(userEmail);
  textDiv.appendChild(phoneNumberDiv);
  phoneNumberDiv.appendChild(phoneNumberImg);
  phoneNumberDiv.appendChild(phoneNumber);
  cityCategoryDiv.appendChild(listingCity);
  cityCategoryDiv.appendChild(newComa);
  cityCategoryDiv.appendChild(listingCategory);
  TitleDateDiv.appendChild(listingTitle);
  TitleDateDiv.appendChild(listingDate);

  const otherImagesDiv = document.createElement('div');
  otherImagesDiv.setAttribute('id', 'other-images');
  const image1 = document.createElement('img');
  image1.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
  const image2 = document.createElement('img');
  image2.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
  const image3 = document.createElement('img');
  image3.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
  const image4 = document.createElement('img');
  image4.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
  const image5 = document.createElement('img');
  image5.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
  
  imageDiv.appendChild(otherImagesDiv);
  otherImagesDiv.appendChild(image1);
  otherImagesDiv.appendChild(image2);
  otherImagesDiv.appendChild(image3);
  otherImagesDiv.appendChild(image4);
  otherImagesDiv.appendChild(image5);

  image1.addEventListener('click', changeImage1);
  image2.addEventListener('click', changeImage2);
  image3.addEventListener('click', changeImage3);
  image4.addEventListener('click', changeImage4);
  image5.addEventListener('click', changeImage5);
  otherImagesDiv.style = 'display: none;';

  // const closeBtn2 = document.createElement('button');
  //   closeBtn2.setAttribute('id', 'closeBtn2');
  //   closeBtn2.addEventListener('click', closeFullScreen);
  //   closeBtn2.innerHTML = `<img src="/images/minimize.png">`;
  //   // closeBtn2.style = 'display: block;';
  //   imageDiv.appendChild(closeBtn2);

  getDownloadURL(ref(storage, doc.data().IDnumber)).then((url) => {
    image.setAttribute('src', url);
    
  })
  getDownloadURL(ref(storage, doc.data().IDnumber + '-2')).then((url) => {
    image1.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, doc.data().IDnumber + '-3')).then((url) => {
    image2.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, doc.data().IDnumber + '-4')).then((url) => {
    image3.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, doc.data().IDnumber + '-5')).then((url) => {
    image4.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, doc.data().IDnumber + '-6')).then((url) => {
    image5.setAttribute('src', url);
  })

  function changeImage1(){
    let url1 = image.getAttribute('src');
    let url2 = image1.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image1.setAttribute('src', url1);
    }
  }
  function changeImage2(){
    let url1 = image.getAttribute('src');
    let url2 = image2.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image2.setAttribute('src', url1);
    }
  }
  function changeImage3(){
    let url1 = image.getAttribute('src');
    let url2 = image3.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image3.setAttribute('src', url1);
    }
  }
  function changeImage4(){
    let url1 = image.getAttribute('src');
    let url2 = image4.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image4.setAttribute('src', url1);
    }
  }
  function changeImage5(){
    let url1 = image.getAttribute('src');
    let url2 = image5.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image5.setAttribute('src', url1);
    }
  }

  function openFullScreen(){
    isFullScreen = 1;
    Listing.classList = 'new-listing-enlarge';
    otherImagesDiv.style = 'display: flex;';
    closeBtn.style = 'display: block;'; 
    userEmailDiv.style = 'display:flex';
    phoneNumberDiv.style = 'display:flex';
    imageDiv.style='overflow:visible;';
    closeBtn.style = 'display: inline;';
    // closeBtn.remove();
    // imageDiv.appendChild(closeBtn);
    scrollTo(closeBtn);
    function scrollTo(element) {
      var headerOffset = 140;
      var elementPosition = element.offsetTop;
      var offsetPosition = elementPosition - headerOffset;
      document.documentElement.scrollTop = offsetPosition;
      document.body.scrollTop = offsetPosition; // For Safari
    }
  }
  function closeFullScreen(){
    event.preventDefault();
    isFullScreen = 0;
    Listing.classList = 'new-listing';
    otherImagesDiv.style = 'display: none;';
    closeBtn.style = 'display: none;';
    userEmailDiv.style = 'display:none';
    phoneNumberDiv.style = 'display:none';
    imageDiv.style='overflow:hidden;';
  }
});

// MY LISTINGS
const q = query(collection(db, "listings"), where("email", "==", loggedCheck.innerHTML));
const querySnapshot2 = await getDocs(q);
let numMyDocs=0;
querySnapshot2.forEach((docc) => {
    numMyDocs++;
    // doc.data() is never undefined for query doc snapshots
    const listSection = document.querySelector('#myListings');
    const listUl = document.querySelector('#my-listing-ul');
    const Listing = document.createElement('li');
    Listing.classList = 'new-listing';
    Listing.setAttribute('data-id', docc.id);

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('id', 'closeBtn');
    closeBtn.addEventListener('click', closeFullScreen);
    closeBtn.innerHTML = `<img src="/images/remove (1).png">`;
    closeBtn.style = 'display: none;';

    let isFullScreen;
    const imageDiv = document.createElement('div');
    imageDiv.setAttribute('id', 'image');
    const image = document.createElement('img');
    image.setAttribute('id','main-img');
    image.setAttribute('width', '150px');
    image.setAttribute('height', '150px');
    image.setAttribute('onerror', "this.src='/images/noImage500px.jpg'");
    
    const fullPage = document.querySelector('#fullpage');
    image.addEventListener('click', openImage);
    fullPage.addEventListener('click', closeImage);

    function openImage(){
      if(isFullScreen && image.src != ''){
        fullPage.style.backgroundImage = 'url(' + image.src + ')';
        fullPage.style.display = 'block';
        listUl.style.display = 'none';
      }
    }
    function closeImage(){
      listUl.style.display = 'block';
      fullPage.style.display = 'none';
      const openedListing = document.querySelector('.new-listing-enlarge');
      scrollTo(openedListing);
    }
    
    const textDiv = document.createElement('div');
    textDiv.setAttribute('id', 'text');
    const TitleDateDiv = document.createElement('div');
    TitleDateDiv.setAttribute('id', 'title-date');
    const listingTitle = document.createElement('h1');
    listingTitle.addEventListener('click', openFullScreen);
    const listingDate = document.createElement('h5');
    const listingPrice = document.createElement('h4');
    const listingDescription = document.createElement('p');
    const listingCity = document.createElement('h6');
    listingCity.setAttribute('id', 'c');
    const newComa = document.createElement('h6');
    newComa.innerText = ', ';
    const listingCategory = document.createElement('h6');
    listingCategory.setAttribute('id', 'l');
    const cityCategoryDiv = document.createElement('div');
    cityCategoryDiv.setAttribute('id', 'city-category');
    const userEmailDiv = document.createElement('div');
    userEmailDiv.setAttribute('id','userEmailDiv');
    const userEmailImg = document.createElement('img');
    userEmailImg.setAttribute('src','/images/mail-icon.png');
    userEmailImg.setAttribute('width','40px');
    const userEmail = document.createElement('h5');
    userEmail.setAttribute('id', 'userEmail');
    const phoneNumberDiv = document.createElement('div');
    phoneNumberDiv.setAttribute('id','phoneNumberDiv');
    const phoneNumberImg = document.createElement('img');
    phoneNumberImg.setAttribute('src','/images/phone-icon.png');
    phoneNumberImg.setAttribute('width', '32px');
    const phoneNumber = document.createElement('h5');
    phoneNumber.setAttribute('id', 'phoneNumber');

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('id', 'delete-listing-btn');
    const editBtn = document.createElement('button');
    editBtn.setAttribute('id', 'edit-listing-btn');
    editBtn.setAttribute('href', 'edit_listing.html');

    listingTitle.innerText = docc.data().title;
    listingDate.innerText = docc.data().time + "  " + docc.data().date;
    listingPrice.innerText = docc.data().price + " " + docc.data().currency;
    listingDescription.innerText = docc.data().description;
    listingCity.innerText = docc.data().category;
    listingCategory.innerText = docc.data().location;
    userEmail.innerText = docc.data().email;
    phoneNumber.innerText = docc.data().phone;  
    deleteBtn.innerText = 'Delete Listing';
    editBtn.innerHTML = 'Edit Listing';
    
    userEmailDiv.style = 'display:none';
    phoneNumberDiv.style = 'display:none';

    listSection.appendChild(listUl);
    listUl.appendChild(Listing);
    
    Listing.appendChild(imageDiv);
    Listing.appendChild(textDiv);
    imageDiv.appendChild(image);
    textDiv.appendChild(closeBtn);
    textDiv.appendChild(cityCategoryDiv);
    textDiv.appendChild(TitleDateDiv);
    textDiv.appendChild(listingPrice);
    textDiv.appendChild(listingDescription);
    
    textDiv.appendChild(userEmailDiv);
    userEmailDiv.appendChild(userEmailImg);
    userEmailDiv.appendChild(userEmail);
    textDiv.appendChild(phoneNumberDiv);
    phoneNumberDiv.appendChild(phoneNumberImg);
    phoneNumberDiv.appendChild(phoneNumber);
    // textDiv.appendChild(deleteBtn);
    // textDiv.appendChild(editBtn);
    cityCategoryDiv.appendChild(listingCity);
    cityCategoryDiv.appendChild(newComa);
    cityCategoryDiv.appendChild(listingCategory);
    TitleDateDiv.appendChild(listingTitle);
    TitleDateDiv.appendChild(listingDate);
    
    const otherImagesDiv = document.createElement('div');
    otherImagesDiv.setAttribute('id', 'other-images');
    const image1 = document.createElement('img');
    image1.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
    const image2 = document.createElement('img');
    image2.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
    const image3 = document.createElement('img');
    image3.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
    const image4 = document.createElement('img');
    image4.setAttribute('onerror', "this.src='/images/noImage90.jpg'");
    const image5 = document.createElement('img');
    image5.setAttribute('onerror', "this.src='/images/noImage90.jpg'");

    imageDiv.appendChild(otherImagesDiv);
    otherImagesDiv.appendChild(image1);
    otherImagesDiv.appendChild(image2);
    otherImagesDiv.appendChild(image3);
    otherImagesDiv.appendChild(image4);
    otherImagesDiv.appendChild(image5);

    image1.addEventListener('click', changeImage1);
    image2.addEventListener('click', changeImage2);
    image3.addEventListener('click', changeImage3);
    image4.addEventListener('click', changeImage4);
    image5.addEventListener('click', changeImage5);
    otherImagesDiv.style = 'display: none;';

    // const closeBtn2 = document.createElement('button');
    // closeBtn2.setAttribute('id', 'closeBtn2');
    // closeBtn2.addEventListener('click', closeFullScreen);
    // closeBtn2.innerHTML = `<img src="/images/minimize.png">`;
    // // closeBtn2.style = 'display: block;';
    // imageDiv.appendChild(closeBtn2);

    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('id', 'button-div');
    buttonDiv.appendChild(deleteBtn);
    buttonDiv.appendChild(editBtn);
    // buttonDiv.appendChild(closeBtn2);
    imageDiv.appendChild(buttonDiv);
    // imageDiv.appendChild(closeBtn);
    

  getDownloadURL(ref(storage, docc.data().IDnumber)).then((url) => {
    image.setAttribute('src', url);
    
  })
  getDownloadURL(ref(storage, docc.data().IDnumber + '-2')).then((url) => {
    image1.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, docc.data().IDnumber + '-3')).then((url) => {
    image2.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, docc.data().IDnumber + '-4')).then((url) => {
    image3.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, docc.data().IDnumber + '-5')).then((url) => {
    image4.setAttribute('src', url);
  })
  getDownloadURL(ref(storage, docc.data().IDnumber + '-6')).then((url) => {
    image5.setAttribute('src', url);
  })



  function changeImage1(){
    let url1 = image.getAttribute('src');
    let url2 = image1.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image1.setAttribute('src', url1);
    }
  }
  function changeImage2(){
    let url1 = image.getAttribute('src');
    let url2 = image2.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image2.setAttribute('src', url1);
    }
  }
  function changeImage3(){
    let url1 = image.getAttribute('src');
    let url2 = image3.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image3.setAttribute('src', url1);
    }
  }
  function changeImage4(){
    let url1 = image.getAttribute('src');
    let url2 = image4.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image4.setAttribute('src', url1);
    }
  }
  function changeImage5(){
    let url1 = image.getAttribute('src');
    let url2 = image5.getAttribute('src');
    if(url2 != null && url2 != '/images/noImage90.jpg'){
      image.setAttribute('src', url2);
      image5.setAttribute('src', url1);
    }
    console.log(url2);
  }

  function openFullScreen(){
    isFullScreen = 1;
    Listing.classList = 'new-listing-enlarge';
    otherImagesDiv.style = 'display: flex;';
    closeBtn.style = 'display: block;'; 
    userEmailDiv.style = 'display:flex';
    phoneNumberDiv.style = 'display:flex';
    imageDiv.style='overflow:visible;';
    closeBtn.style = 'display: inline;';
    // closeBtn.remove();
    // imageDiv.appendChild(closeBtn);
    scrollTo(closeBtn);
  }
  function closeFullScreen(){
    event.preventDefault();
    isFullScreen = 0;
    Listing.classList = 'new-listing';
    otherImagesDiv.style = 'display: none;';
    closeBtn.style = 'display: none;';
    userEmailDiv.style = 'display:none';
    phoneNumberDiv.style = 'display:none';
    imageDiv.style='overflow:hidden;';
  }
  function scrollTo(element) {
    var headerOffset = 140;
    var elementPosition = element.offsetTop;
    var offsetPosition = elementPosition - headerOffset;
    document.documentElement.scrollTop = offsetPosition;
    document.body.scrollTop = offsetPosition; // For Safari
  }
    getDownloadURL(ref(storage, docc.data().IDnumber)).then((url) => {
      image.setAttribute('src', url);
    })

    //DELETE DOCS
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
      deleteDoc(doc(db, "listings", id));
      Listing.remove();

      const deleteRef = ref(storage, docc.data().IDnumber);
      deleteObject(deleteRef).then(() => {
        // File deleted successfully
      })

      const deleteRef2 = ref(storage, docc.data().IDnumber + '-2');
      deleteObject(deleteRef2).then(() => {
        // File deleted successfully
      })

      const deleteRef3 = ref(storage, docc.data().IDnumber + '-3');
      deleteObject(deleteRef3).then(() => {
        // File deleted successfully
      })

      const deleteRef4 = ref(storage, docc.data().IDnumber + '-4');
      deleteObject(deleteRef4).then(() => {
        // File deleted successfully
      })

      const deleteRef5 = ref(storage, docc.data().IDnumber + '-5');
      deleteObject(deleteRef5).then(() => {
        // File deleted successfully
      })

      const deleteRef6 = ref(storage, docc.data().IDnumber + '-6');
      deleteObject(deleteRef6).then(() => {
        // File deleted successfully
      })
    });
    
    //EDIT DOCS
    editBtn.addEventListener('click', (e) => {
      openFullScreen();
      let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
      const Listings = document.querySelectorAll('.new-listing, .new-listing-enlarge');
      Listings.forEach((li) => {
          if(li.hasAttribute('data-id')){
            const li_id = li.getAttribute('data-id');
            if(li_id === id){
              textDiv.remove();
              imageDiv.remove();
              closeBtn.remove();
              otherImagesDiv.remove();
            }
            else{
              li.remove();
            }}
      });
      
      const editFormContainer = document.createElement('div');
      editFormContainer.setAttribute('id', 'add-listing-container');
      editFormContainer.style.width = '100%';
      const editForm = document.createElement('form');
      editForm.setAttribute('id', 'add-listing-form');
      const editFormTitle = document.createElement('h2');
      editFormTitle.innerText = `Edit Listing`;
      
      const locationCategoryDiv = document.createElement('div');
      locationCategoryDiv.setAttribute('id', 'location-category');
        const labelInputDiv1 = document.createElement('div');
        labelInputDiv1.classList = 'label-input';
          const labelLocation = document.createElement('label');
          labelLocation.innerText = 'Location:';
          const selectLocation = document.createElement('select');
          selectLocation.innerHTML = `<option value="all"> Site Gradovi</option>
                                      <option value="Skopje">Skopje</option>
                                      <option value="Veles">Veles</option>
                                      <option value="Ohrid">Ohrid</option>
                                      <option value="Kumanovo">Kumanovo</option>
                                      <option value="Tetovo">Tetovo</option>
                                      <option value="Kicevo">Kicevo</option>
                                      <option value="Berovo">Berovo</option>
                                      <option value="Bitola">Bitola</option>
                                      <option value="Bogdanci">Bogdanci</option>
                                      <option value="Valandovo">Valandovo</option>
                                      <option value="Vinica">Vinica</option>
                                      <option value="Berovo">Berovo</option>
                                      <option value="Gevgelija">Gevgelija</option>
                                      <option value="Gostivar">Gostivar</option>
                                      <option value="Debar">Debar</option>
                                      <option value="Delcevo">Delcevo</option>
                                      <option value="Demir Kapija">Demir Kapija</option>
                                      <option value="Demir Hisar">Demir Hisar</option>
                                      <option value="Kavadarci">Kavadarci</option>
                                      <option value="Kocani">Kocani</option>
                                      <option value="Kratovo">Kratovo</option>
                                      <option value="Kriva Palanka">Kriva Palanka</option>
                                      <option value="Makedonski Brod">Makedonski Brod</option>
                                      <option value="Negotino">Negotino</option>
                                      <option value="Pehcevo">Pehcevo</option>
                                      <option value="Prilep">Prilep</option>
                                      <option value="Probistip">Probistip</option>
                                      <option value="Radovish">Radovish</option>
                                      <option value="Resen">Resen</option>
                                      <option value="Sveti Nikole">Sveti Nikole</option>
                                      <option value="Struga">Struga</option>
                                      <option value="Strumica">Strumica</option>
                                      <option value="Stip">Stip</option>`;
          selectLocation.value = docc.data().location;

        const labelInputDiv2 = document.createElement('div');
        labelInputDiv2.classList = 'label-input';
          const labelCategory = document.createElement('label');
          labelCategory.innerText = 'Category:';
          const selectCategory = document.createElement('select');
          selectCategory.innerHTML = `<option value="Books">Books</option>
                                      <option value="Clothing, Shoes & Accessories">Clothing, Shoes & Accessories</option>
                                      <option value="Collectibles">Collectibles</option>
                                      <option value="Electronics">Electronics</option>
                                      <option value="Home & Garden">Home & Garden</option>
                                      <option value="Cars & Vehicles">Cars & Vehicles</option>
                                      <option value="Pet Supplies">Pet Supplies</option>
                                      <option value="Sporting Goods">Sporting Goods</option>
                                      <option value="Toys">Toys</option>
                                      <option value="Computers/Tablets & Networking">Computers/Tablets & Networking</option>
                                      <option value="Other">Other</option>`;
          selectCategory.value = docc.data().category;

      const tpmDescriptionDiv = document.createElement('div');
      tpmDescriptionDiv.setAttribute('id', 'tpm-descriprion');
        const titlePriceMobileDiv = document.createElement('div');
        titlePriceMobileDiv.setAttribute('id','title-price-mobile');
          const labelInputDiv3 = document.createElement('div');
          labelInputDiv3.classList = 'label-input';
            const labelTitle = document.createElement('label');
            labelTitle.innerText = 'Title:';
            const inputTitle = document.createElement('input');
            inputTitle.value = docc.data().title;

          const labelInputDiv4 = document.createElement('div');
          labelInputDiv4.classList = 'label-input';
          labelInputDiv4.setAttribute('id', 'price-div');
            const priceNumberDiv = document.createElement('div');
            priceNumberDiv.setAttribute('id','price-number');
              const labelPrice = document.createElement('label');
              labelPrice.innerText = 'Price:';
              const inputPrice = document.createElement('input');
              inputPrice.setAttribute('id', 'price');
              inputPrice.value = docc.data().price;
            const priceRadiosDiv = document.createElement('div');
            priceRadiosDiv.setAttribute('id','price-radios');
              const labelRadioMKD = document.createElement('label');
              labelRadioMKD.innerText = 'MKD';
              const radioMKD = document.createElement('input');
              radioMKD.setAttribute('type', 'radio');
              radioMKD.setAttribute('value', 'den');
              radioMKD.setAttribute('name', 'price');
              radioMKD.innerText = 'MKD';
              if(radioMKD.value === docc.data().currency)
                radioMKD.checked = true;
        
              const labelRadioUSD = document.createElement('label');
              labelRadioUSD.innerText = 'USD';
              const radioUSD = document.createElement('input');
              radioUSD.setAttribute('type', 'radio');
              radioUSD.setAttribute('value', 'usd');
              radioUSD.setAttribute('name', 'price');
              radioUSD.innerText = 'USD';
              if(radioUSD.value === docc.data().currency)
                radioUSD.checked = true;
        
              const labelRadioEUR = document.createElement('label');
              labelRadioEUR.innerText = 'EUR';
              const radioEUR = document.createElement('input');
              radioEUR.setAttribute('type', 'radio');
              radioEUR.setAttribute('value', 'euro');
              radioEUR.setAttribute('name', 'price');
              radioEUR.innerText = 'EUR';
              if(radioEUR.value === docc.data().currency)
                radioEUR.checked = true;

          const labelInputDiv5 = document.createElement('div');
          labelInputDiv5.classList = 'label-input';
            const labelPhone = document.createElement('label');
            labelPhone.innerText = 'Mobile number:';
            const inputPhone = document.createElement('input');
            inputPhone.setAttribute('id', 'phone');
            inputPhone.value = docc.data().phone;

          const labelInputDiv6 = document.createElement('div');
          labelInputDiv6.classList = 'label-input';
            const labelDescription = document.createElement('label');
            labelDescription.innerText = 'Description:';
            const inputDescription = document.createElement('textarea');
            inputDescription.setAttribute('cols', '40');
            inputDescription.setAttribute('rows', '7');
            inputDescription.value = docc.data().description;
    
      const mainOtherDiv = document.createElement('div');
      mainOtherDiv.setAttribute('id','main-other');
      const labelInputDiv7 = document.createElement('div');
      labelInputDiv7.classList = 'label-input';
      
      const labelMainImage = document.createElement('label');
      labelMainImage.innerText = 'Main Image:';
      const mainImage = document.createElement('input');
      mainImage.setAttribute('id', 'add-file');
      mainImage.setAttribute('type', 'file');
      mainImage.setAttribute('accept', 'image/png, image/gif, image/jpeg');
      mainImage.style = "display: none;";

      const labelInputDiv8 = document.createElement('div');
      labelInputDiv8.classList = 'label-input';

      const labelOtherImages = document.createElement('label');
      labelOtherImages.innerText = 'Other Images:';
      const otherImages = document.createElement('input');
      otherImages.setAttribute('id', 'add-file-2');
      otherImages.setAttribute('type', 'file');
      otherImages.setAttribute('accept', 'image/png, image/gif, image/jpeg');
      otherImages.setAttribute('multiple', '');
      otherImages.style = "display: none;";

      const removeMainBtn = document.createElement('button');
      removeMainBtn.setAttribute('id','removeMainBtn');
      removeMainBtn.innerHTML = 'Remove Main Image';
      let changeMainImage = 0;
      removeMainBtn.addEventListener('click', (e) => {
        e.preventDefault();
        changeMainImage = 1;
        removeMainBtn.style = 'display: none;';
        mainImage.style = "display: block;";

        const deleteRef = ref(storage, docc.data().IDnumber);
        deleteObject(deleteRef).then(() => {
          // File deleted successfully
        })
      });

      const removeOtherBtn = document.createElement('button');
      removeOtherBtn.setAttribute('id','removeOtherBtn');
      removeOtherBtn.innerHTML = 'Remove Other Images';
      let changeOtherImages = 0;
      removeOtherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        changeOtherImages = 1;
        removeOtherBtn.style = 'display: none;';
        otherImages.style = "display: block;";

        const deleteRef2 = ref(storage, docc.data().IDnumber + '-2');
        deleteObject(deleteRef2).then(() => {
          // File deleted successfully
        })

        const deleteRef3 = ref(storage, docc.data().IDnumber + '-3');
        deleteObject(deleteRef3).then(() => {
          // File deleted successfully
        })

        const deleteRef4 = ref(storage, docc.data().IDnumber + '-4');
        deleteObject(deleteRef4).then(() => {
          // File deleted successfully
        })

        const deleteRef5 = ref(storage, docc.data().IDnumber + '-5');
        deleteObject(deleteRef5).then(() => {
          // File deleted successfully
        })

        const deleteRef6 = ref(storage, docc.data().IDnumber + '-6');
        deleteObject(deleteRef6).then(() => {
          // File deleted successfully
        })
      });

      Listing.append(editFormContainer);
      editFormContainer.append(editForm);
      editForm.append(editFormTitle);

      editForm.append(locationCategoryDiv);
      locationCategoryDiv.append(labelInputDiv1);
      locationCategoryDiv.append(labelInputDiv2);
      labelInputDiv1.appendChild(labelLocation);
      labelInputDiv1.appendChild(selectLocation);
      labelInputDiv2.append(labelCategory);
      labelInputDiv2.append(selectCategory);
      
      editForm.append(tpmDescriptionDiv);
      tpmDescriptionDiv.append(titlePriceMobileDiv);
      titlePriceMobileDiv.append(labelInputDiv3);
      labelInputDiv3.append(labelTitle);
      labelInputDiv3.append(inputTitle);
      titlePriceMobileDiv.append(labelInputDiv4);
      labelInputDiv4.append(priceNumberDiv);
        priceNumberDiv.append(labelPrice);
        priceNumberDiv.append(inputPrice);
      labelInputDiv4.append(priceRadiosDiv);
        priceRadiosDiv.append(radioMKD);
        priceRadiosDiv.append(labelRadioMKD);
        priceRadiosDiv.append(radioUSD);
        priceRadiosDiv.append(labelRadioUSD);
        priceRadiosDiv.append(radioEUR);
        priceRadiosDiv.append(labelRadioEUR);
        titlePriceMobileDiv.append(labelInputDiv5);
        labelInputDiv5.append(labelPhone);
        labelInputDiv5.append(inputPhone);
      tpmDescriptionDiv.append(labelInputDiv6);
      labelInputDiv6.append(labelDescription);
      labelInputDiv6.append(inputDescription);

      listUl.style = 'width: 100%;';

      editForm.append(mainOtherDiv);
      mainOtherDiv.append(labelInputDiv7);
      mainOtherDiv.append(labelInputDiv8);
      labelInputDiv7.append(labelMainImage);
      labelInputDiv7.append(mainImage);
      labelInputDiv7.append(removeMainBtn);
      labelInputDiv8.append(labelOtherImages);
      labelInputDiv8.append(otherImages);
      labelInputDiv8.append(removeOtherBtn);
      
      //BUTTONS (Save, Cancel)
      const saveChangesBtn = document.createElement('button');
      saveChangesBtn.setAttribute('id', 'add-listing-btn');
      saveChangesBtn.innerText = 'Save Changes';
      const cancelUpdateBtn = document.createElement('button');
      cancelUpdateBtn.setAttribute('id', 'cancelUpdateBtn');
      cancelUpdateBtn.innerText = 'Cancel';
      editForm.append(saveChangesBtn);
      editForm.append(cancelUpdateBtn);

      const successfullyAddedListing = document.createElement('h6');
      successfullyAddedListing.style = 'color: rgb(200, 0, 0); margin-top:5px;'; 
      editForm.appendChild(successfullyAddedListing);

      saveChangesBtn.addEventListener('click', (e) => {
        e.preventDefault();

        inputTitle.style = 'border: 1px solid rgb(212, 212, 212);';
        inputPhone.style = 'border: 1px solid rgb(212, 212, 212);';

        const docToUpdate = doc(db, "listings", id);
        const d = new Date();
        const minutes = d.getMinutes();
        let min2;
        if(minutes < 10){
          min2 = '0' + minutes;
        }else{
          min2 = minutes;
        }
        let currency;
        let priceDenari;

        if(radioMKD.checked === true){ 
          currency = radioMKD;
          priceDenari = inputPrice.value;
        }
        else if(radioUSD.checked === true){
          currency = radioUSD;
          priceDenari = inputPrice.value * 60.34;
        }
        else{                           
          currency = radioEUR;
          priceDenari = inputPrice.value * 61.49;
        }

        if(inputTitle.value != '' && inputPhone.value != ''){
          updateDoc(docToUpdate, {
            title: inputTitle.value,
            description: inputDescription.value,
            price: inputPrice.value,
            priceInDenari: priceDenari,
            location: selectLocation.value,
            category: selectCategory.value,
            currency: currency.value,
            phone: inputPhone.value,
            last_update_date: d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear(),
            last_upadte_time: d.getHours() + ':' + min2
          });

          if(changeMainImage === 1){
            const mainImageRef = ref(storage, docc.data().IDnumber);
            const file = document.getElementById('add-file').files[0];

            uploadBytes(mainImageRef, file).then((snapshot) => {
              console.log('Changed Main file');
            });
          }

          successfullyAddedListing.innerHTML = '';

          if(changeOtherImages === 1){
            const ImageRef2 = ref(storage, docc.data().IDnumber + '-2');
            const file2 = document.getElementById('add-file-2').files[0];

            const ImageRef3 = ref(storage, docc.data().IDnumber + '-3');
            const file3 = document.getElementById('add-file-2').files[1];
            
            const ImageRef4 = ref(storage, docc.data().IDnumber + '-4');
            const file4 = document.getElementById('add-file-2').files[2];
            
            const ImageRef5 = ref(storage, docc.data().IDnumber + '-5');
            const file5 = document.getElementById('add-file-2').files[3];

            const ImageRef6 = ref(storage, docc.data().IDnumber + '-6');
            const file6 = document.getElementById('add-file-2').files[4];

            uploadBytes(ImageRef2, file2).then((snapshot) => {
              console.log('Changed file 2');
            });
            uploadBytes(ImageRef3, file3).then((snapshot) => {
              console.log('Changed file 3');
            });
            uploadBytes(ImageRef4, file4).then((snapshot) => {
              console.log('Changed file 4');
            });
            uploadBytes(ImageRef5, file5).then((snapshot) => {
              console.log('Changed file 5');
            });
            uploadBytes(ImageRef6, file6).then((snapshot) => {
              console.log('Changed file 6');
            });
          }

          cancelUpdateBtn.innerText = 'Close';
          successfullyAddedListing.innerHTML = 'Your changes have been successfully saved!';
        }
        else{
          if(inputTitle.value === '')
            inputTitle.style = 'border:1px solid red';
          if(inputPhone.value === '')
            inputPhone.style = 'border:1px solid red';

          successfullyAddedListing.innerHTML = 'Please fill out all required fields.';
        }
        
        
      });

      cancelUpdateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'my_listing.html';
      });
    }); 
});

const NoListingsFound = document.querySelector('#no-listings-found');
const NoMyListingsFound = document.querySelector('#no-my-listings-found');
if(numMyDocs === 0)
  NoMyListingsFound.style = 'display:block;';
if(numDocs === 0)
  NoListingsFound.style = 'display:block;';





