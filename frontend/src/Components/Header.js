import logo from '../Images/logo.svg';
import React from 'react';
import {Switch, Route, Link} from "react-router-dom";

export default function Header({logOut, email}) {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип"/>
            <Switch>
                <Route exact path="/signin">
                    <Link to="/signup" className="header__button">Регистрация</Link>
                </Route>
                <Route exact path="/signup">
                    <Link to="/signin" className="header__button">Войти</Link>
                </Route>
                <Route exact path="/">
                    <div className="header__user">
                        <p className="header__user-email">{email}</p>
                        <Link to='/signin' className="header__button" onClick={logOut}>Выйти</Link>
                    </div>
                </Route>
            </Switch>
        </header>
    )
}