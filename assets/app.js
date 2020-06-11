let client;
window.addEventListener('DOMContentLoaded', () => {
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
    client = await fetchClient(localStorage.getItem('LOGIN_USERNAME'));
    if (client) {
        displayMainClient(client);
        dateCheck();
        openWishlistItem();
        isitemReserved();
        closeLeftNavigation();
    } else {
        displayLoginPopup();
    }
}

async function doLoadSubClient(id) {
    let subClient = await fetchClientById(id);
    if (subClient) {
        displaySubClient(subClient);
        dateCheck();
        openWishlistItem();
        isitemReserved();
    }
}

async function doLoadClientsByGroup(groupId, groupName) {
    clients = await fetchClientsByGroup(groupId);
    if (clients) {
        displayClientsByGroup(clients, groupName);
    }
    toggleNavigation();
}

async function doEditItemStatus(userIdentifier, itemId, itemStatus) {
    if (userIdentifier > 0 && itemId > 0) {
        item = {
            id: itemId,
            status: itemStatus,
            userId: userIdentifier
        };
        await changeStatus(item);
    }

}

async function doEditGroup() {
    const validationResult = validateGroupForm();

    if (validationResult.length == 0) {
        let group;
        if (document.querySelector('#userId').value > 0) {
            group = {
                id: document.querySelector('#groupId').value,
                name: document.querySelector('#groupName').value,
                picture: document.querySelector('#groupPicture').value,
                description: document.querySelector('#groupDescription').value,
                userId: client.userId
            };
            await addGroup(group);
        } else {
            group = {
                name: document.querySelector('#groupName').value,
                picture: document.querySelector('#groupPicture').value,
                description: document.querySelector('#groupDescription').value,
                userId: client.userId
            };
            await addGroup(group);

        }
        await doLoadClient();
        closePopup();
    } else {
        displayFormErrors(validationResult);
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
        displayFormErrors(validationResult);
    }
}

async function doEditWishlistItem() {
    const validationResult = validateWishlistItemForm();

    if (validationResult.length == 0) {
        let item;
        if (document.querySelector('#userId').value > 0) {            
            item = {
                id: document.querySelector('#itemId').value,
                status: document.querySelector("#itemStatus").value,
                itemName: document.querySelector('#itemName').value,
                price: document.querySelector('#itemPrice').value,
                picture: document.querySelector('#itemPicture').value,
                description: document.querySelector('#itemDescription').value,
                link: document.querySelector('#itemLink').value,
                userId: client.userId
            };
            await addWishlistItem(item);
        } else {
            item = {
                status: document.querySelector("#itemStatus").value,
                itemName: document.querySelector('#itemName').value,
                price: document.querySelector('#itemPrice').value,
                picture: document.querySelector('#itemPicture').value,
                description: document.querySelector('#itemDescription').value,
                link: document.querySelector('#itemLink').value,
                userId: client.userId
            };
            await addWishlistItem(item);

        }
        await doLoadClient();
        closePopup();
    } else {
        displayFormErrors(validationResult);
    }
}

async function doDeleteGroup(groupId) {
    if (confirm('Do you wish to delete this group?')) {
        await removeGroup(groupId);
        doLoadClient();        
        closePopup();
        toggleNavigation();
    }

}

async function doDeleteDate(dateId) {
    if (confirm('Do you wish to delete this date?')) {
        await removeDate(dateId);
        await doLoadClient();
        closePopup();
    }

}



async function doDeleteWishlistItem(itemId) {
    if (confirm('Do you wish to delete this item?')) {
        await removeWishlistItem(itemId);
        doLoadClient();
        closePopup();
    }

}


/* 
    --------------------------------------------
    DISPLAY FUNCTIONS
    --------------------------------------------
*/

async function displayLoginPopup() {
    openPopup(POPUP_CONF_LOGIN_350_500, 'loginTemplate');
}

function displayMainClient(client) {
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
                    <div id="client-photo"><img onclick="doLoadClient()" class="client-photo-img" src="${client.photo}"></div>
                </div>
                <div id="groups-container">
                    <h2>Your groups:</h2> <br><br>
                    ${displayGroups(client.groups)}
                    <div class="add-element">
                        <div class="add-container">
                            <i onclick="displayAddEditGroupPopup()" class="material-icons">add</i>
                        </div>            
                    </div>                        
                </div>
            </div>
            <div id="client-dates">
                ${displayDates(client.dates)}
                <div class="add-element">
                    <div class="add-container">
                        <i onclick="displayAddEditDatesPopup()" class="material-icons">add</i>
                    </div>
                </div>
            </div>
            
            <div id="client-wishlist">
                ${displayWishlist(client.wishlistItems)}
                <div class="add-element">
                    <div class="add-container">
                        <i onclick="displayAddEditWishlistPopup()" class="material-icons">add</i>
                    </div>
                </div>
            </div>
        </div>
    `;
    mainElement.innerHTML = clientHtml;
}

function displaySubClient(subClient) {
    const mainElement = document.querySelector('main');
    let clientHtml = '';

    clientHtml += /*html*/ `
        <div id="client-box">
            <div id="client-header">
                <div id="client-name">${subClient.name}</div>            
            </div> <br>        
            <div id="client-groups-nav">
            <i id="nav-button-container" onclick="toggleNavigation()" class="material-icons">view_headline</i>
                <div id="client-picture-container">
                    <div id="client-photo"><img onclick="doLoadClient()" class="client-photo-img" src="${client.photo}"></div>
                </div>
                <div id="groups-container">
                    <h2>Your groups:</h2> <br><br>
                    ${displayGroups(client.groups)}
                    <div class="add-element">
                        <div class="add-container">
                            <i onclick="displayAddEditGroupPopup()" class="material-icons">add</i>
                        </div>            
                    </div>                        
                </div>
            </div>
            <div id="client-dates">
                ${displaySubClientDates(subClient.dates)}
            </div>
            
            <div id="client-wishlist">
                ${displaySubClientWishlist(subClient.wishlistItems)}                
            </div>
        </div>
    `;
    mainElement.innerHTML = clientHtml;
}



function displayClientsByGroup(clients, name) {
    const mainElement = document.querySelector('main');
    let clientsByGroupHtml = '';

    clientsByGroupHtml += /*html*/ `
        <div id="client-box">
            <div id="client-header">
                <div id="client-name">${name}</div>            
            </div> <br>        
            <div id="client-groups-nav">
            <i id="nav-button-container" onclick="toggleNavigation()" class="material-icons">view_headline</i>
                <div id="client-picture-container">
                    <div id="client-photo"><img onclick="doLoadClient()" class="client-photo-img" src="${client.photo}"></div>
                </div>
                <div id="groups-container">
                    <h2>Your groups:</h2> <br><br>
                    ${displayGroups(client.groups)}
                        
                </div>
            </div>
            <div id="clients-by-group">
                ${displayClients(clients)}
            </div>
            <div class="add-element">
                <div class="add-container">
                    <i class="material-icons" style="color: white;">add</i>
                </div>            
            </div>
        </div>
    `;
    mainElement.innerHTML = clientsByGroupHtml;
}

function displayClients(clients) {
    let clientsHtml = '';
    for (let client of clients) {
        clientsHtml += /*html*/`        
        <div>
            <div class="client-list-el">
                <img onclick="doLoadSubClient(${client.userId})" src="${client.photo}">
            </div>
            <div class="client-list-el" style="color: var(--main-color);">
                <h2>${client.name}</h2>            
            </div>                    
        </div>
        `;
    }
    return clientsHtml;
}

function displayGroups(groups) {
    let groupsHtml = '';
    for (let group of groups) {
        groupsHtml += /*html*/`        
        <div class="client-group">
            <div class="group-el">
                <img onclick="doLoadClientsByGroup(${group.id}, '${group.name}')" src="${group.picture}">
            </div>
            <div class="group-el">
                <h2>${group.name}</h2>            
            </div>
            <div class="date-edit">
                <i onclick="displayAddEditGroupPopup(${group.userId}, ${group.id})" id="edit-icon" class="material-icons">create</i>
            </div>                        
        </div>
        `;
    }
    return groupsHtml;
}

async function displayAddEditGroupPopup(userId, groupId) {
    await openPopup(POPUP_CONF_500_500, 'groupAddEditTemplate');

    if (userId > 0 && groupId > 0) {
        const group = await fetchGroupByUserAndGroupId(userId, groupId);
        document.querySelector('#groupId').value = group.id;
        document.querySelector('#userId').value = group.userId;
        document.querySelector('#groupName').value = group.name;
        document.querySelector('#groupPicture').value = group.picture;
        document.querySelector('#groupDescription').value = group.description;

    }
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
    return datesHtml;
}



async function displayAddEditDatesPopup(userId, dateId) {
    await openPopup(POPUP_CONF_500_500, 'datesAddEditTemplate');

    if (userId > 0 && dateId > 0) {
        const date = await fetchDateByUserAndDateId(userId, dateId);
        document.querySelector('#dateId').value = date.id;
        document.querySelector('#dateName').value = date.name;
        document.querySelector('#dateDate').value = date.date;
        document.querySelector('#clientId').value = date.userId;    
    }
}

function displaySubClientDates(dates) {
    let datesHtml = '';
    for (let date of dates) {
        datesHtml += /*html*/ `
        <div class="client-date">            
            <div class="date-name">${date.name}</div>
            <div class="date-date">${date.date}</div>
        </div>
        `;
    }
    return datesHtml;
}

function displayWishlist(wishlistItems) {
    let wishlistItemsHtml = '';
    for (let item of wishlistItems) {
        wishlistItemsHtml += /*html*/`
        <div class="wishlist-item">
            <div class="item-status" style="display: none;">${item.status}</div>
            <div class="item-name">${item.itemName}</div>            
            <div class="expand-item" >
                <i class="material-icons">keyboard_arrow_down</i>
            </div>
        </div>
        <div class="item-content">
            <div class="item-description">                
                <div class="item-desc-elements">
                    <a href="${item.link}" target="_blank">
                        <img class="item-picture" src="${item.picture}">    
                    </a>                    
                    <div class="item-desc-text">${item.description}</div> 
                    <div class="item-price">${item.price} €</div>
                    <div class="edit-remove-item-container">
                        <div class="date-edit"><i onclick="displayAddEditWishlistPopup(${item.userId}, ${item.id})" id="edit-icon" class="material-icons">create</i></div>
                    </div>                   
                </div>
            </div>
        </div>        
        `;
    }
    return wishlistItemsHtml;
}

async function displayAddEditWishlistPopup(userId, itemId) {
    await openPopup(POPUP_CONF_500_500, 'wishlistItemAddEditTemplate');

    if (userId > 0 && itemId > 0) {
        const item = await fetchWishlistItemByUserAndDateId(userId, itemId);
        document.querySelector('#itemId').value = item.id;
        document.querySelector('#userId').value = item.userId;
        document.querySelector('#itemStatus').value = item.status;
        document.querySelector('#itemName').value = item.itemName;
        document.querySelector('#itemPrice').value = item.price;
        document.querySelector('#itemPicture').value = item.picture;
        document.querySelector('#itemDescription').value = item.description;
        document.querySelector('#itemLink').value = item.link;

    }
}

function displaySubClientWishlist(wishlistItems) {
    let wishlistItemsHtml = '';
    for (let item of wishlistItems) {
        wishlistItemsHtml += /*html*/`
        <div id="item${item.id}" class="wishlist-item">
            <div class="item-status" style="display: none;">${item.status}</div>
            <div class="item-name">${item.itemName}</div>            
            <div class="expand-item" >
                <i class="material-icons">keyboard_arrow_down</i>
            </div>
        </div>
        <div id="content${item.id}" class="item-content">
            <div class="item-description">                
                <div class="item-desc-elements">
                    <a href="${item.link}" target="_blank">
                        <img class="item-picture" src="${item.picture}">    
                    </a>                    
                    <div class="item-desc-text">${item.description}</div> 
                    <div class="item-price">${item.price} €</div>
                    <div class="edit-remove-item-container">
                        <div onclick="reserveItem(${item.userId}, ${item.id}, ${item.status})" class="date-edit">
                            <i id="edit-icon" class="material-icons">done</i>
                        </div>
                    </div>                   
                </div>
            </div>
        </div>        
        `;
    }
    return wishlistItemsHtml;
}

let isNavigationOpen = false;

function openLeftNavigation() {
    let navigationElement = document.querySelector('#client-groups-nav');
    if (screen.width < 500) {
        navigationElement.style.width = '100%';
    } else {
        navigationElement.style.width = '33%';
    }
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
    let i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            let expandIcon = this.querySelector(".expand-item");
            if (content.style.display === "flex") {
                content.style.display = "none";
                expandIcon.innerHTML = '<i class="material-icons">keyboard_arrow_down</i>';
                this.style.borderBottomLeftRadius = "10px";
                this.style.borderBottomRightRadius = "10px";
                this.style.marginBottom = "8px";
            } else {
                content.style.display = "flex";
                expandIcon.innerHTML = '<i class="material-icons">keyboard_arrow_up</i>';
                this.style.borderBottomLeftRadius = "0";
                this.style.borderBottomRightRadius = "0";
                this.style.marginBottom = "0";
                this.nextElementSibling.style.marginBottom = "25px";
            }
        });
    }
    let numbers = document.querySelectorAll(".item-price");
    for (let el of numbers) {
        let string = el.innerHTML
        let price = parseInt(string.substr(0, string.indexOf(' ')));
        let priceToLocale = price.toLocaleString("fi-FI");
        el.innerHTML = priceToLocale + ' €';
    }
}

function dateCheck() {
    const dates = document.querySelectorAll(".date-date");
    const date1 = new Date();
    const year = date1.getFullYear();
    for (let el of dates) {
        const monthAndDay = el.innerHTML.substr(4, 10)
        const date2 = new Date(year + monthAndDay)
        const diffTime = date2 - date1;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30 && diffDays > 0) {
            el.parentElement.style.backgroundColor = '#E66060'
        }
    }
}

function setUpHeaderBar() {
    document.querySelector('#headerBar span').textContent = localStorage.getItem('LOGIN_USERNAME');
}

function validateGroupForm() {
    let errors = [];

    let groupName = document.querySelector('#groupName').value;

    if (groupName.length < 2) {
        errors.push('Group name has to be at least 2 characters')
    }
    return errors;
}

function validateDateForm() {
    let errors = [];

    let dateName = document.querySelector('#dateName').value;
    let dateDate = document.querySelector('#dateDate').value;

    if (dateName.length < 2) {
        errors.push('Date name has to be at least 2 characters')
    }

    if (dateDate == '') {
        errors.push('Date not specified')
    }
    return errors;
}

function validateWishlistItemForm() {
    let errors = [];
    let itemName = document.querySelector('#itemName').value;

    if (itemName.length < 2) {
        errors.push('Item name has to be at least 2 characters')
    }
    return errors;
}

function displayFormErrors(errors) {
    const errorBox = document.querySelector('#errorBox');
    errorBox.style.display = 'block';

    let errorsHtml = '';

    for (let errorMessage of errors) {
        errorsHtml += /*html*/`<div>${errorMessage}</div>`;
    }

    errorBox.innerHTML = errorsHtml;

}

function isitemReserved(){
    let coll = document.querySelectorAll(".wishlist-item");
    for(let el of coll) {
        if (el.firstElementChild.innerHTML === 'true') {
            el.style.opacity = '35%';
            el.nextElementSibling.style.opacity = '35%';
        } else {
            el.style.opacity = '100%';
            el.nextElementSibling.style.opacity = '100%';
        }
    }
}

function reserveItem(userId, id, status) {
    if (status == true) {
        doEditItemStatus(userId, id, false);
    } else {
        doEditItemStatus(userId, id, true)
    }
    doLoadSubClient(userId);   
    
}

function showSnackbar() {
    var x = document.getElementById("snackbar");
  
    x.className = "show";
  
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }