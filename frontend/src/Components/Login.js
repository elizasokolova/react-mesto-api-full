import React from "react";

export default function Login({onLogin}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const onEmailChange = (event) => setEmail(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    function handleSubmit(event) {
        event.preventDefault();
        onLogin(email, password);
    }

    return (
        <div className="popup__container popup__container_authorization">
            <h2 className="popup__edit popup__edit_authorization">Вход</h2>
            <form className="popup__form" onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={onEmailChange}
                    className="popup__edit-area popup__edit-area_authorization"
                    required
                    type="email"
                    autoComplete="off"
                    placeholder="Email"
                />
                <input
                    value={password}
                    onChange={onPasswordChange}
                    className="popup__edit-area popup__edit-area_authorization"
                    required
                    type="password"
                    autoComplete="off"
                    placeholder="Пароль"
                />
                <button className="popup__save-button popup__save-button_authorization" type="submit">Войти</button>
            </form>
        </div>
    );
}