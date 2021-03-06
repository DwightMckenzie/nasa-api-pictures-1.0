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
getNasaPictures();
