class Auth {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl; // Адрес откуда приходят данные
        this._headers = headers; // Токен пользователя
    }

    checkResponse(response) {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(`Ошибка: ${response.status}`);
    }

    register(email, password) {
        return fetch(`${this._baseUrl}/signup`, {
            method: "POST",
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then(this.checkResponse);
    }

    login(email, password, jwt) {
        return fetch(`${this._baseUrl}/signin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                password: password,
                email: email,
            }),
        }).then(this.checkResponse)
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("jwt", data.token);
                    return data;
                }
            })
    }

    checkTokenValidity(jwt) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        }).then((res) => this.checkResponse(res));
    }
}

const auth = new Auth({
    baseUrl: `${window.location.protocol}${'//localhost:3001' || process.env.REACT_APP_API_URL }`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default auth;
