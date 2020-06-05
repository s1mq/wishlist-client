async function fetchClient() {
    try {
        const response = await fetch(`${API_URL}/clients/admin`);
        return await processProtectedResponse(response);
    } catch (e) {
        console.log('ERROR OCCURED', e);
    }
}


async function processProtectedResponse(response) {
    if (response.status >= 400 && response.status <= 403) {
        throw new Error('Unauthorized');
    } else {            
        return await response.json();
    }
}