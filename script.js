const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// nasa api 
const count = 10;
const apiKey = 'DEMO_KEY'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

// mine
const excrptLmt = 75;
let btnRead = document.querySelector('.btn');

let origResult = '';
let crdBdy = '';
let crdTxt = '';
let excrpt = '';



// remove excerpt
// function readMore(e) {
//   e.preventDefault;
//   console.log('read more');

//   // origninal text from read more befoe excerpt need brought over some how

//   console.log(e);


//   // crdTxt = e.previousSibling;

//   // switch variable and open bdy text
//   // excrpt = crdTxt.substring(0, 10000);

//   // apply body text
//   // crdTxt.textContent = excrpt;

//   // set read more button
//   // btnRead.setAttribute('onclick', 'readLess(this)');
//   // btnRead.textContent = 'Read Less...';
// }

// apply excerpt
function tggleExcerpt(page) {
  console.log('read less');

  const results = 'page';

  // convert to array 
  const a = imagesContainer.children;
  const b = Array.from(a);
  
  // initialize excerpt on each paragraph
  b.forEach((e, i) => {
    let crdBdy = e.children[1];
    let crdTxt = crdBdy.children[2].textContent;
    let hTxt = crdTxt;

    console.log(hTxt);

    // compare full paragraph to excerpt limit
    if (crdTxt.length > excrptLmt) {

      // apply excerpt

      excrpt = crdTxt.substring(0, excrptLmt);

      // update text
      crdBdy.children[2].textContent = excrpt;
    }

  });

}

function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant'});
  loader.classList.add('hidden');

  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
}

// dynamic elements
function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
  // const currentArray = page === 'result' ? Object.values(favorites) : resultsArray;

  // console.log('current array ', page, currentArray);

  currentArray.forEach((result) => {
    // card container
    const card = document.createElement('div');
    card.classList.add('card');

    // link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';

    // image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Pitucer of they Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');

    // card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // card title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;

    // save text
    const saveText = document.createElement('a');
    saveText.classList.add('clickable');
    // saveText.textContent = 'Add to Favorites';
    // saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    
    if (page === 'results') {
      saveText.textContent = 'Add to Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    // }
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }

    // card text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;


    
    // excerpt text
    const btnExcrpt = document.createElement('p');
    btnExcrpt.setAttribute('class', 'clickable btn');
    btnExcrpt.setAttribute('onclick', 'tggleExcerpt(this)');
    btnExcrpt.textContent = 'Read More';



    // footer container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');

    // date
    const date = document.createElement('strong');
    date.textContent = result.date;

    // copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = `${copyrightResult}`;

    // append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, btnExcrpt, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);

  });


  // trigger excerpt
  tggleExcerpt(page);

}

// update the local 
function updateDOM(page) {
  console.log('dom update');

  // get favorites from local storage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    console.log('from local ', favorites);
  }
  
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
}

// get 10 images from nasa api
async function getNasaPictures() {
  // show loader
  loader.classList.remove('hidden');
  
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    // console.log(resultsArray);
    updateDOM('results');
  } catch (error) {
    // catch error here
  }
}

// add result to faviorites
function saveFavorite(itemUrl) {
  // console.log(itemUrl);

  resultsArray.forEach((item) => {

    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // console.log(JSON.stringify(favorites));
      
      // show save confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
    
      // set favorites in local storage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
      
  });

}

// remove result from favortites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // set favorites in local storage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}



// onload
// excerptTxt();
getNasaPictures();