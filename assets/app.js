let client;

window.addEventListener('DOMContentLoaded', () => {
    console.log('Content loaded')
    doLoadClient();
    setUpHeaderBar();
});


/* 
    --------------------------------------------
    ACTIONFUNCTIONS
    --------------------------------------------
*/

async function doLogin() {
    let usernameElement = document.querySelector('#loginUsername');
    let passwordElement = document.querySelector('#loginPassword');
    let credentials = {
        username: usernameElement.value,
        password: passwordElement.value,
    };
    let loginResponse = await postCredentials(credentials);
    if (loginResponse.id > 0) {
        localStorage.setItem('LOGIN_USERNAME', loginResponse.username);
        localStorage.setItem('LOGIN_TOKEN', loginResponse.token);
        setUpHeaderBar();
        closePopup();
        doLoadClient();
    } else {
        doLogout();
        displayLoginPopup();

    }

}

function doLogout() {
    localStorage.removeItem('LOGIN_USERNAME');
    localStorage.removeItem('LOGIN_TOKEN');
    displayLoginPopup();
}


async function doLoadClient() {
    console.log('Loading client...');
    client = await fetchClient(localStorage.getItem('LOGIN_USERNAME'));
    if (client) {
        displayClient(client);
        openWishlistItem();
    } else {
        displayLoginPopup();
    }
}

async function doEditDate() {
    const validationResult = validateDateForm();

    if (validationResult.length == 0) {
        let date;
        if (document.querySelector('#clientId').value > 0) {
            date = {
                id: document.querySelector('#dateId').value,
                name: document.querySelector('#dateName').value,
                date: document.querySelector('#dateDate').value,
                userId: client.userId
            };
            await addDate(date);
        } else {
            date = {
                name: document.querySelector('#dateName').value,
                date: document.querySelector('#dateDate').value,
                userId: client.userId
            };
            await addDate(date);

        }
        await doLoadClient();
        closePopup();
    } else {
        displayCompanyFormErrors(validationResult);
    }
}

async function doDeleteDate(dateId) {
    if (confirm('Do you wish to delete this date?')) {
        console.log('Deleting date: ', dateId);
        await removeDate(dateId);
        await doLoadClient();
        closePopup();
    }

}

async function doDeleteWishlistItem(itemId) {
    if (confirm('Do you wish to delete this item?')) {
        console.log('Deleting item: ', itemId);
        await removeWishlistItem(itemId);
        doLoadClient();
    }

}


/* 
    --------------------------------------------
    DISPLAY FUNCTIONS
    --------------------------------------------
*/

async function displayLoginPopup() {
    openPopup(POPUP_CONF_BLANK_300_300, 'loginTemplate');
}

function displayClient(client) {
    const mainElement = document.querySelector('main');
    let clientHtml = '';

    clientHtml += /*html*/ `
        <div id="client-box">
            <div id="client-header">
                <div id="client-name">${client.name}</div>            
            </div> <br>        
            <div id="client-groups-nav">
            <i id="nav-button-container" onclick="toggleNavigation()" class="material-icons">view_headline</i>
                <div id="client-picture-container">
                    <div id="client-photo"><img src="${client.photo}"></div>
                </div>
                <div id="groups-container">
                    <h2>Your groups:</h2> <br><br>
                    ${displayGroups(client.groups)}
                    <div class="add-element">
                        <div class="add-container">
                            <i class="material-icons">add</i>
                        </div>            
                    </div>    
                </div>
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
        
        <div class="client-group">
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
            <div class="date-edit"><i onclick="displayAddEditDatesPopup(${date.userId}, ${date.id})" id="edit-icon" class="material-icons">create</i></div>
        </div>
        `;
    }
    datesHtml += /*html*/`
    <div class="add-element">
        <div class="add-container">
            <i onclick="displayAddEditDatesPopup()" class="material-icons">add</i>
        </div>
    </div>
    `;
    return datesHtml;
}



async function displayAddEditDatesPopup(userId, dateId) {
    await openPopup(POPUP_CONF_500_500, 'datesAddEditTemplate');

    if (userId > 0 && dateId > 0) {
        console.log(userId, dateId);
        const date = await fetchDateByUserAndDateId(userId, dateId);
        console.log(date);
        document.querySelector('#dateId').value = date.id;
        document.querySelector('#dateName').value = date.name;
        document.querySelector('#dateDate').value = date.date;
        document.querySelector('#clientId').value = date.userId;    
    }
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
                    <img href="${item.link}" target="_blank" class="item-picture" src="${item.picture}">
                    <div class="item-desc-text">${item.description}</div> 
                    <div class="item-price">${item.price} €</div>
                    <div class="edit-remove-item-container">
                        <div class="edit-icon-container"><i id="edit-icon" class="material-icons">create</i></div>
                        <div class="remove-icon-container"><i id="remove-icon" onClick="doDeleteWishlistItem(${item.id})" class="material-icons">close</i></div>
                    </div>                   
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
    navigationElement.style.width = '33%';
    document.querySelector("#groups-container").style.display = "flex";
    document.querySelector("#client-picture-container").style.display = "flex";
    document.querySelector("#nav-button-container").style.display = "flex";

    isNavigationOpen = true;
}

function closeLeftNavigation() {
    let navigationElement = document.querySelector('#client-groups-nav');
    navigationElement.style.width = '50px';
    document.querySelector("#groups-container").style.display = "none";
    document.querySelector("#client-picture-container").style.display = "none";

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

function setUpHeaderBar() {
    document.querySelector('#headerBar span').textContent = localStorage.getItem('LOGIN_USERNAME');
}

function validateDateForm() {
    let errors = [];

    let dateName = document.querySelector('#dateName').value;
    let dateDate = document.querySelector('#dateDate').value;

    if (dateName.length < 2) {
        errors.push('Date name has to at least 2 characters')
    }

    if (dateDate == '') {
        errors.push('Date not specified')
    }
    return errors;
}

function displayCompanyFormErrors(errors) {
    const errorBox = document.querySelector('#errorBox');
    errorBox.style.display = 'block';

    let errorsHtml = '';

    for (let errorMessage of errors) {
        errorsHtml += /*html*/`<div>${errorMessage}</div>`;
    }

    errorBox.innerHTML = errorsHtml;

}