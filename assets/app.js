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
        displayGroupFormErrors(validationResult);
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
        displayDateFormErrors(validationResult);
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
        displayWishlistItemFormErrors(validationResult);
    }
}

async function doDeleteGroup(groupId) {
    if (confirm('Do you wish to delete this group?')) {
        console.log('Deleting group: ', groupId);
        await removeGroup(groupId);
        doLoadClient();        
        closePopup();
        toggleNavigation();
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
        closePopup();
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
            <div class="date-edit">
                <i onclick="displayAddEditGroupPopup(${group.userId}, ${group.id})" id="edit-icon" class="material-icons">create</i>
            </div>                        
        </div>
        `;
    }
    groupsHtml += /*html*/`
    <div class="add-element">
        <div class="add-container">
            <i onclick="displayAddEditGroupPopup()" class="material-icons">add</i>
        </div>            
    </div>
    `;
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
            <div class="item-status" style="display: none;">${item.status}</div>
            <div class="item-name">${item.itemName}</div>            
            <div class="expand-item" id="expand-item-${item.id}">
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
    wishlistItemsHtml += /*html*/`
    <div class="add-element">
        <div class="add-container">
            <i onclick="displayAddEditWishlistPopup()" class="material-icons">add</i>
        </div>
    </div>
    `;
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
            let expandIcon = this.querySelector(".expand-item");
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