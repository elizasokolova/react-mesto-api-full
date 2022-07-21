import {CurrentUserContext} from "../Contexts/CurrentUserContext";
import {useContext} from "react";

export default function Card(props) {
    const currentUser = useContext(CurrentUserContext);
    // Определяем, являемся ли мы владельцем текущей карточки и поставлен ли ей лайк.
    const isOwn = props.card.owner._id === currentUser._id;
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);
    // Создаём переменную, которую после зададим в `className` для кнопки удаления и кнопки лайка
    const cardDeleteButtonClassName = `card__delete-button ${isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`;
    const cardLikeButtonClassName = `${isLiked ? 'card__like-button card__like-button_active' : 'card__like-button'}`;

    const handleCardClick = () => props.onCardClick(props.card);
    const handleCardLike = () => props.onCardLike(props.card);
    const handleCardDelete = () => props.onCardDeleteConfirm(props.card);

    return (
        <article className="card">
            <img className="card__image" onClick={handleCardClick} alt={`Фотография ${props.card.name}`}
                 src={props.card.link} data-default-src="<%=require('./Images/no-image.jpg')%>"/>
            <div className="card__block">
                <h2 className="card__title">{props.card.name}</h2>
                <div className="card__container-like">
                    <button type="button"
                        className={cardLikeButtonClassName}
                        aria-label="Лайк"
                        onClick={handleCardLike}/>
                    <span className="card__sum-like">{props.card.likes.length}</span>
                </div>
            </div>
            <button type="button"
                className={cardDeleteButtonClassName}
                aria-label="Удалить"
                onClick={handleCardDelete}/>
        </article>
    );
}