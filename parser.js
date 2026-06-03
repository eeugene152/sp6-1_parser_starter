// @todo: напишите здесь код парсера

// Общие функции
function switchData(value, variantMap, defaultValue) {
    // проверяем есть ли в объекте ключ, если нет берем дефолт
    return variantMap.hasOwnProperty(value) ? variantMap[value] : defaultValue;
}

const variantMap = {
    $: "USD",
    "€": "EUR",
    "₽": "RUB",
};

// Основная функция
function parsePage() {
    const metaObject = {};
    const productObject = {};
    const productSuggested = [];
    const productsReviews = [];

    /************ meta *********************/

    metaObject.title = document
        .querySelector("title")
        .textContent.split("—")[0]
        .trim();
    metaObject.description = document
        .querySelector('meta[name="description"]')
        .getAttribute("content")
        .trim();
    metaObject.keywords = document
        .querySelector('meta[name="keywords"]')
        .getAttribute("content")
        .trim()
        .split(", ");
    metaObject.language = document.querySelector("html").getAttribute("lang");
    
    const openGraphObject = {};
    const properties = document.querySelectorAll("meta[property]");
    for (const item of properties) {
        const key = item.getAttribute("property").split(":")[1];
        if (key == "title") {
            openGraphObject[key] = item.getAttribute("content").split("—")[0].trim();
        } else {
            openGraphObject[key] = item.getAttribute("content").trim();
        }
    }
    metaObject.opengraph = openGraphObject;

    /************ product *********************/

    const product = document.querySelector(".product");
    productObject.id = product.dataset.id;
    productObject.name = document.querySelector(".product .title").textContent;
    productObject.isLiked = document
        .querySelector(".like")
        .classList.contains("active");

    const tagsObject = {};
    const tags = document.querySelector(".product .tags").children;
    for (const item of tags) {
        switch (item.className) {
            case "green":
                tagsObject.category = [item.textContent];
                break;
            case "red":
                tagsObject.discount = [item.textContent];
                break;
            default:
                tagsObject.label = [item.textContent];
        }
    }
    productObject.tags = tagsObject;

    const currencySymbol = document.querySelector(".price").textContent.trim()[0];
    const productPrice = +document.querySelector(".price").firstChild.textContent.replace(/\D/g, '');
    const productOldPrice = +document.querySelector(".price").children[0].textContent.replace(/\D/g, '');
    productObject.price = productPrice;
    productObject.oldPrice = productOldPrice;
    productObject.discount = productOldPrice - productPrice;
    productObject.discountPercent = `${((1 - productPrice / productOldPrice) * 100).toFixed(2)}%`;

    productObject.currency = switchData(currencySymbol, variantMap, "CNY");

    const propertiesObj = {};
    const productPropertiesLi = document.querySelectorAll(".properties li");
    productPropertiesLi.forEach((li) => {
        const spans = li.querySelectorAll("span");
        if (spans.length >= 2) {
            const key = spans[0].textContent.trim();
            const value = spans[1].textContent.trim();
            propertiesObj[key] = value;
        }
    });
    productObject.properties = propertiesObj;

    const description = document.querySelector(".description");
    let descriptionResult = "";
    if (description) {
        // Клонируем элемент в память, чтобы не ломать оригинальную страницу
        const descriptionClone = description.cloneNode(true);
        const h3 = descriptionClone.querySelector("h3");
        if (h3) {
            h3.removeAttribute("class");
        }
        descriptionResult = descriptionClone.innerHTML.trim();
    }
    productObject.description = descriptionResult;

    const productImages = [];
    const imagesRaw = document.querySelectorAll("nav img");
    imagesRaw.forEach((image) => {
        const imageSet = {
            preview: image.src,
            full: image.dataset.src,
            alt: image.alt,
        };
        productImages.push(imageSet);
    });
    productObject.images = productImages;

    /************ suggested *********************/

    const suggestedItems = document.querySelectorAll(".suggested article");
    suggestedItems.forEach((item) => {
        const currencySymbol = item.querySelector("b").textContent.trim()[0];
        const suggestedSet = {
            name: item.querySelector("h3").textContent.trim(),
            description: item.querySelector("p").textContent.trim(),
            image: item.querySelector("img").src,
            price: item
                .querySelector("b")
                .textContent.split(currencySymbol)[1]
                .trim(),
            currency: switchData(currencySymbol, variantMap, "CNY"),
        };
        productSuggested.push(suggestedSet);
    });

    /************ reviews *********************/

    const reviewItems = document.querySelectorAll(".reviews article");
    reviewItems.forEach((item) => {
        const authorObj = {
            avatar: item.querySelector(".author img").src.trim(),
            name: item.querySelector(".author span").textContent.trim(),
        };
        const reviewObj = {
            rating: item.querySelectorAll(".rating span.filled").length,
            title: item.querySelector(".title").textContent.trim(),
            description: item.querySelector("p").textContent.trim(),
            date: item
                .querySelector(".author i")
                .textContent.trim()
                .replaceAll("/", "."),
            author: authorObj,
        };
        productsReviews.push(reviewObj);
    });

    return {
        meta: metaObject,
        product: productObject,
        suggested: productSuggested,
        reviews: productsReviews,
    };
}

window.parsePage = parsePage;
