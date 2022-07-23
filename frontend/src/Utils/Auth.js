export const BASE_URL = `${window.location.protocol}${process.env.REACT_APP_API_URL}`;

const checkResponse = (response) => {
    if (response.ok) {
             return response.json();
        }
        return Promise.reject(`Ошибка: ${response.status}`);
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, email }),
    })
        .then(checkResponse);
}

export const login = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, email }),
    })
        .then(checkResponse);
}

export const checkTokenValidity = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization" : `Bearer ${token}`,
        }
    })
        .then(checkResponse);
}
