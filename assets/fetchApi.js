async function postCredentials(credentials) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    } catch (e) {
        console.log('LOGIN FAILED', e);
    }
}

async function fetchClient(client) {
    try {
        const response = await fetch(`${API_URL}/clients/${client}`, {
            method: 'GET',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return await processProtectedResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

async function fetchClientsByGroup(groupId) {
    try {
        const response = await fetch(`${API_URL}/clients/group/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return await processProtectedResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}



async function addGroup(group) {
    try {
        const response = await fetch(`${API_URL}/groups/add`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': composeBearerToken()
                },
                body: JSON.stringify(group)
            });

        handleResponse(response);

    } catch (e) {
        console.log('ERROR IN ADDING GROUP', e);
    }

}

async function addDate(date) {
    try {
        const response = await fetch(`${API_URL}/dates/add`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': composeBearerToken()
                },
                body: JSON.stringify(date)
            });

        handleResponse(response);

    } catch (e) {
        console.log('ERROR IN ADDING DATE', e);
    }

}

async function addWishlistItem(item) {
    try {
        const response = await fetch(`${API_URL}/wishlistItems/add`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': composeBearerToken()
            },
            body: JSON.stringify(item)

        });
        handleResponse(response);
    } catch (e) {
        console.log('ERROR IN ADDING ITEM', e);
    }
}

async function fetchGroupByUserAndGroupId(userId, groupId) {
    try {
        const response = await fetch(`${API_URL}/groups/${userId}/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return processProtectedResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

async function fetchDateByUserAndDateId(userId, dateId) {
    try {
        const response = await fetch(`${API_URL}/dates/${userId}/${dateId}`, {
            method: 'GET',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return processProtectedResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

async function fetchWishlistItemByUserAndDateId(userId, itemId) {
    try {
        const response = await fetch(`${API_URL}/wishlistItems/${userId}/${itemId}`, {
            method: 'GET',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return processProtectedResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

async function removeGroup(groupId) {
    try {
        const response = await fetch(`${API_URL}/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return handleResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

async function removeDate(dateId) {
    try {
        const response = await fetch(`${API_URL}/dates/${dateId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return handleResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

async function removeWishlistItem(itemId) {
    try {
        const response = await fetch(`${API_URL}/wishlistItems/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': composeBearerToken()
            }
        });
        return handleResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}

function composeBearerToken() {
    return `Bearer ${localStorage.getItem('LOGIN_TOKEN')}`;
}


async function processProtectedResponse(response) {
    if (response.status >= 400 && response.status <= 403) {
        throw new Error('Unauthorized');
    } else {            
        return await response.json();
    }
}

function handleResponse(response) {
    if (response.status >= 401) {
        // clearAuthentication();
        throw new Error('Unauthorized');
    }
}