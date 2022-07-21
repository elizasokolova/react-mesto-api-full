import React from "react";
import Card from './Card';
import {CurrentUserContext} from "../Contexts/CurrentUserContext";

export default function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__overlay">
                    <img src={currentUser.avatar} alt="Аватарка" className="profile__avatar"/>
                    <button className="profile__avatar-button" onClick={props.onEditAvatar} type="button"
                     aria-label="Изменить аватар"/>
                </div>
                <div className="profile__info">
                    <div className="profile__container">
                        <h1 className="profile__author">{currentUser.name}</h1>
                        <button className="profile__edit-button" onClick={props.onEditButton} type="button"
                        aria-label="Редактировать"/>
                    </div>
                    <p className="profile__status">{currentUser.about}</p>
                </div>
                <button className="profile__add-button" onClick={props.onAddButton} type="button"
                aria-label="Добавить"/>
            </section>

            <section className="photo-grid">
                {props.cards.map(card => (<Card key={card._id}
                                            card={card}
                                            onCardClick={props.onCardClick}
                                            onCardDelete={props.onCardDelete}
                                            onCardDeleteConfirm={props.onCardDeleteConfirm}
                                            onCardLike={props.onCardLike} />))}
            </section>
        </main>
    )
}