import { API_BASE_URL, TRANSFER_LIST_SIZE, ACCESS_TOKEN } from '../variables/constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
    );
};

export function getAllTransfers(page, size) {
    page = page || 0;
    size = size || TRANSFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/transfer/list?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserCreatedTransfers(page, size) {
    page = page || 0;
    size = size || TRANSFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/transfer/me?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getCTRLTransfers(page, size) {
    page = page || 0;
    size = size || TRANSFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/transfer/ctrllist?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getCTNTransfers(page, size) {
    page = page || 0;
    size = size || TRANSFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/transfer/ctnlist?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function doTransfer(transferData) {
    return request({
        url: API_BASE_URL + "/transfer/dotransfer",
        method: 'POST',
        body: JSON.stringify(transferData)
    });
}

export function updateTransfer(id, transferRequest) {
    return request({
        url: API_BASE_URL + "/transfers/" + id,
        method: 'PUT',
        body: JSON.stringify(transferRequest)
    });
}

export function deleteTransfer(id) {
    return request({
        url: API_BASE_URL + "/transfers/" + id,
        method: 'DELETE'
    });
}

export function getTransfer(id) {
    return request({
        url: API_BASE_URL + "/transfer/" + id,
        method: 'GET'
    });
}

export function cancelTransfer(id) {
    return request({
        url: API_BASE_URL + "/transfer/cancel/" + id,
        method: 'PUT'
    });
}

export function refuseTransfer(id,reason) {
    return request({
        url: API_BASE_URL + "/transfer/refuse/" + id,
        method: 'PUT',
        body: JSON.stringify(reason)
    });
}

export function acceptTransfer(id) {
    return request({
        url: API_BASE_URL + "/transfer/validate/" + id,
        method: 'PUT'
    });
}

export function sendTransfer(id) {
    return request({
        url: API_BASE_URL + "/transfer/sendToCtn/" + id,
        method: 'PUT'
    });
}


export function getAccountData(id) {
    return request({
        url: API_BASE_URL + "/transfer/account/" + id,
        method: 'GET'
    });
}

export function getAccountCurrency(numberAccount) {
    return request({
        url: API_BASE_URL + "/transfer/account/stateOrCurrency/"+numberAccount,
        method: 'GET'//,
        //body: JSON.stringify(numberAccount)
    });
}

export function getCommissionData(commissionData) {
    return request({
        url: API_BASE_URL + "/transfer/tarification/tarifier",
        method: 'POST',
        body: JSON.stringify(commissionData)
    });
}


export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/auth/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/auth/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/auth/users/" + username,
        method: 'GET'
    });
}

export function updateUserProfile(username, userRequest) {
    return request({
        url: API_BASE_URL + "/auth/users/" + username,
        method: 'PUT',
        body: JSON.stringify(userRequest)
    });
}

export function getStatistics() {

    return request({
        url: API_BASE_URL + "/dashboard",
        method: 'GET'
    });
}
