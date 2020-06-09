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

async function fetchClient() {
    try {
        const response = await fetch(`${API_URL}/clients/admin`, {
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