// @todo: напишите здесь код парсера

/* "meta": {
    "title": "About Vite",
    "description": "Explore Vite - A modern development tool for faster and efficient web applications. Learn about features, suggested products, and reviews.",
    "keywords": [
      "Vite",
      "modern development tool",
      "web development",
      "UI design",
      "UX design",
      "prototyping",
      "reviews"
    ],
    "language": "en",
    "opengraph": {
      "title": "About Vite",
      "image": "./assets/logo.svg",
      "type": "website"
    }
  }, */

metaObject = {};
metaObject.title = document.querySelector(
    'title').textContent.split('—')[0].trim();
metaObject.description = document.querySelector(
    'meta[name="description"]').getAttribute('content').trim();
metaObject.keywords = document.querySelector(
    'meta[name="keywords"]').getAttribute(
        'content').trim().split(', ');
metaObject.language = document.querySelector(
    'html').getAttribute('lang');

openGraphObject = {};
const properties = document.querySelectorAll('meta[property]')
for (const item of properties) {
    const key = item.getAttribute('property').split(':')[1]
    if (key == 'title') {
        openGraphObject[key] = item.getAttribute('content').split('—')[0].trim();
    } else {
        openGraphObject[key] = item.getAttribute('content').trim();
    }
}
metaObject.opengraph = openGraphObject;

/* "product": {
    "id": "product1",
    "name": "About Vite",
    "isLiked": false,
    "tags": {
      "category": [
        "tag1"
      ],
      "discount": [
        "tag3"
      ],
      "label": [
        "tag2"
      ]
    },
    "price": 50,
    "oldPrice": 80,
    "discount": 30,
    "discountPercent": "37.50%",
    "currency": "RUB",
    "properties": {
      "key1": "value1",
      "key2": "value2",
      "key3": "value3"
    },
    "description": "<h3>Title</h3>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>",
    "images": [
      {
        "preview": "https://placehold.co/92x66?text=1",
        "full": "https://placehold.co/600?text=1",
        "alt": "slide1"
      },.......
    ]
  }, */


productObject = {}
const product = document.querySelector('.product')
productObject.id = product.dataset.id
productObject.name = document.querySelector('.product .title').textContent
productObject.isLiked = document.querySelector('.like').classList.contains('active')

tagsObject = {};
const tags = document.querySelector('.product .tags').children;
for (const item of tags) {
    switch(item.className) {
        case 'green':
            tagsObject.category = [item.textContent];
            break;
        case 'red':
            tagsObject.discount = [item.textContent];
            break;
        default:
            tagsObject.label = [item.textContent];
    }
}
productObject.tags = tagsObject;

const currencySymbol = document.querySelector('.price').textContent.trim()[0]
const productPrice = +(document.querySelector('.price').textContent.split(currencySymbol)[1])
const productOldPrice = +(document.querySelector('.price').children[0].textContent.split(currencySymbol)[1])
productObject.price = productPrice
productObject.oldPrice = productOldPrice
productObject.discount = productOldPrice - productPrice
productObject.discountPercent = `${((1 - productPrice / productOldPrice) * 100).toFixed(2)}%`

// определяем поле currency - по значку
switch(currencySymbol) {
        case '$':
            productObject.currency = 'USD';
            break;
        case '€':
            productObject.currency = 'EUR';
            break;
        case '₽':
            productObject.currency = 'RUB';
            break;
        default:
            productObject.currency = 'CNY';
    }

const propertiesObj = {};
const productPropertiesLi = document.querySelectorAll('.properties li');
productPropertiesLi.forEach(li => {
    const spans = li.querySelectorAll('span')
    if (spans.length >= 2) {
        const key = spans[0].textContent.trim();
        const value = spans[1].textContent.trim();
        propertiesObj[key] = value;
    }
})
productObject.properties = propertiesObj;


const description = document.querySelector('.description');
let descriptionResult = '';
if (description) {
    // Клонируем элемент в память, чтобы не ломать оригинальную страницу
    const descriptionClone = description.cloneNode(true);
    const h3 = descriptionClone.querySelector('h3');
    if (h3) {
        h3.removeAttribute('class');
    }
    descriptionResult = descriptionClone.innerHTML.trim();
}
productObject.description = descriptionResult;

const productImages = [];
const imagesRaw = document.querySelectorAll('nav img');
imagesRaw.forEach(image => {
    const imageSet = {
        "preview": image.src,
        "full": image.dataset.src,
        "alt": image.alt
    }
    productImages.push(imageSet);
})
productObject.images = productImages;




/* "suggested": [
    {
      "name": "test title",
      "description": "desc about product",
      "image": "https://placehold.co/240x300?text=A",
      "price": "34123",
      "currency": "RUB"
    },*/

const productSuggested = [];
const suggestedItems = document.querySelectorAll('.suggested article');
suggestedItems.forEach(item => {
    const currencySymbol = document.querySelector('b').textContent.trim()[0];
    switch(currencySymbol) {
        case '$':
            currencyName = 'USD';
            break;
        case '€':
            currencyName = 'EUR';
            break;
        case '₽':
            currencyName = 'RUB';
            break;
        default:
            currencyName = 'CNY';
    }
    const suggestedSet = {
        name: item.querySelector('h3').textContent.trim(),
        description: item.querySelector('p').textContent.trim(),
        image: item.querySelector('img').src,
        price: item.querySelector('b').textContent.split(currencySymbol)[1].trim(),
        currency: currencyName
    }
    productSuggested.push(suggestedSet);
})



/* "reviews": [
    {
      "rating": 2,
      "author": {
        "avatar": "https://placehold.co/48/424242/white.svg?text=1",
        "name": "author"
      },
      "title": "title",
      "description": "desc",
      "date": "date"
    }, */

productsReviews = [];
const reviewItems = document.querySelectorAll('.reviews article');
reviewItems.forEach(item => {
    const authorObj = {
        avatar: item.querySelector('.author img').src.trim(),
        name: item.querySelector('.author span').textContent.trim()
    };
    const reviewObj = {
        rating: item.querySelectorAll('.rating span.filled').length,
        title: item.querySelector('.title').textContent.trim(),
        description: item.querySelector('p').textContent.trim(),
        date: item.querySelector('.author i').textContent.trim().replaceAll('/', '.'),
        author: authorObj
    };
    productsReviews.push(reviewObj);
})



function parsePage() {
    return {
        meta: metaObject,
        product: productObject,
        suggested: productSuggested,
        reviews: productsReviews
    };
}

window.parsePage = parsePage;