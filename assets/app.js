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
        <div class="client-box">
            <div class="client-photo"><img src="${client.photo}" width="200" height="200"></div>
            <div class="client-name">${client.name}</div>
            <div class="client-groups">
                <h3>Groups</h3>
                ${displayGroups(client.groups)}            
            </div>
            <div class="client-dates">
                <h3>Dates</h3>
                ${displayDates(client.dates)}
            </div>
            <div class="client-wishlist">
                <h3>Wishlist</h3>
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
        <div>
            <div>${group.id}</duv>
            <div>${group.name}</duv>
            <div>${group.picture}</duv>
            <div>${group.description}</duv>
            <div>${group.userId}</duv>
        </div>
        `;
    }
    return groupsHtml;
}

function displayDates(dates) {
    let datesHtml = '';
    for (let date of dates) {
        datesHtml += /*html*/ `
        <div>
            <div>${date.id}</div>
            <div>${date.name}</div>
            <div>${date.date}</div>
            <div>${date.userId}</div>
        </div>
        `;
    }
    return datesHtml;
}

function displayWishlist(wishlistItems) {
    let wishlistItemsHtml = '';
    for (let item of wishlistItems) {
        wishlistItemsHtml += /*html*/`
        <div>
            <div>${item.id}</div>
            <div>${item.status}</div>
            <div>${item.itemName}</div>
            <div>${item.price}</div>
            <div>${item.picture}</div>
            <div>${item.description}</div>
            <div>${item.link}</div>
            <div>${item.userId}</div>
        </div>
        `;
    }
    return wishlistItemsHtml;
}