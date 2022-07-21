class Api {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl; // Адрес откуда приходят данные
        this._headers = headers; // Токен пользователя
    }

    _checkResponse(response) {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(`Ошибка: ${response.status}`);
    }

    getCurrentUser() {
        return fetch(`${this._baseUrl}/users/me`, {
            credentials: 'include',
            headers: this._headers})
            .then(this._checkResponse);
    }

    updateCurrentUser(data) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(this._checkResponse);
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            credentials: 'include',
            headers: this._headers})
            .then(this._checkResponse);
    }

    addNewCard(data) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify(data)
        }).then(this._checkResponse);
    }

    deleteCard(id) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse);
    }

    addLike(id) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'PUT',
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse);
    }

    deleteLike(id) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this._headers,
        }).then(this._checkResponse);
    }

    changeLikeCardStatus(id, isLiked) {
        return isLiked ? this.addLike(id) : this.deleteLike(id);
    }

    changeAvatar(data) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data['avatar'],
            })
        }).then(this._checkResponse);
    }
}

const api = new Api({
    baseUrl: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`,
    headers: {
        'Content-Type': 'application/json'
    }
});

window.api = api;
export default api;
