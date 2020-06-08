window.addEventListener('DOMContentLoaded', () => {
    console.log('Content loaded')
    doLoadClient();
});


/* 
    --------------------------------------------
    ACTIONFUNCTIONS
    --------------------------------------------
*/


async function doLoadClient() {
    console.log('Loading client...');
    let client = await fetchClient();
    if (client) {
        displayClient(client);
        openWishlistItem();
    }
}


/* 
    --------------------------------------------
    DISPLAY FUNCTIONS
    --------------------------------------------
*/

function displayClient(client) {
    const mainElement = document.querySelector('main');
    let clientHtml = '';

    clientHtml += /*html*/ `
        <div id="client-box">
            <div id="client-header">
                <div id="client-photo"><img src="${client.photo}"></div>
                <div id="client-name">${client.name}</div>            
            </div>            
            <div id="client-groups-nav">
                <div>
                    <i id="nav-button-container" onclick="toggleNavigation()" class="material-icons">view_headline</i>
                </div>
                ${displayGroups(client.groups)}            
            </div>
            <div id="client-dates">
                ${displayDates(client.dates)}
            </div>
            <div id="client-wishlist">
                ${displayWishlist(client.wishlistItems)}
            </div>
        </div>
    `;
    mainElement.innerHTML = clientHtml;
}

function displayGroups(groups) {
    let groupsHtml = '';
    for (let group of groups) {
        groupsHtml += /*html*/`
        <div class=client-group">
            <div class="group-el">
            <img src="${group.picture}">
            </div>
            <div class="group-el">
                <h2>${group.name}</h2>            
            </div>            
        </div>
        `;
    }
    return groupsHtml;
}

function displayDates(dates) {
    let datesHtml = '';
    for (let date of dates) {
        datesHtml += /*html*/ `
        <div class="client-date">
            <div class="date-name">${date.name}</div>
            <div class="date-date">${date.date}</div>
        </div>
        `;
    }
    datesHtml += /*html*/`
    <div class="add-element">
        <div class="add-container">
            <i class="material-icons">add</i>
        </div>
    </div>
    `;
    return datesHtml;
}

function displayWishlist(wishlistItems) {
    let wishlistItemsHtml = '';
    for (let item of wishlistItems) {
        wishlistItemsHtml += /*html*/`
        <div class="wishlist-item">
            <div class="item-name">${item.itemName}</div>            
            <div class="expand-item">
                <i class="material-icons">keyboard_arrow_down</i>
            </div>

        </div>
        <div class="item-content">
            <div class="item-description">
                
                <div class="item-desc-elements">
                    <img class="item-picture" src="${item.picture}">
                    <div class="item-desc-text">${item.description}</div> 
                    <div style="font-size: 2em;">${item.price} €</div>                   
                </div>
            </div>
        </div>        
        `;
    }
    wishlistItemsHtml += /*html*/`
    <div class="add-element">
        <div class="add-container">
            <i class="material-icons">add</i>
        </div>
    </div>
    `;
    return wishlistItemsHtml;
}

let isNavigationOpen = false;

function openLeftNavigation() {
    let navigationElement = document.querySelector('#client-groups-nav');
    navigationElement.style.width = '50%';
    isNavigationOpen = true;
}

function closeLeftNavigation() {
    let navigationElement = document.querySelector('#client-groups-nav');
    navigationElement.style.width = '150px';
    isNavigationOpen = false;
}

function toggleNavigation() {
    let menuButtonContainer = document.querySelector('#nav-button-container');
    if (isNavigationOpen) {
        menuButtonContainer.innerHTML = '<i class="material-icons">view_headline</i>';
        closeLeftNavigation();
    } else {
        menuButtonContainer.innerHTML = '<i class="material-icons">close</i>';
        openLeftNavigation();
    }
    // isNavigationOpen ? closeLeftNavigation() : openLeftNavigation();
}

function test() {
    let myArray = document.querySelectorAll(".wishlist-item");
    console.log('My array length is: ', myArray)
}

function openWishlistItem() {
    let coll = document.querySelectorAll(".wishlist-item");
    console.log('coll length: ', coll.length);
    let i;
    

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            let expandIcon = document.querySelector(".expand-item");
            if (content.style.display === "flex") {
                content.style.display = "none";
                expandIcon.innerHTML = '<i class="material-icons">keyboard_arrow_down</i>';
            } else {
                content.style.display = "flex";
                expandIcon.innerHTML = '<i class="material-icons">keyboard_arrow_up</i>';

            }
        });
    }
}