import React from 'react';
import { CurrentUserContext } from "../Contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

export default function EditProfilePopup ({isOpen, onClose, onUserUpdate}) {

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    const onNameChange = (event) => setName(event.target.value);
    const onDescriptionChange = (event) => setDescription(event.target.value);

    // Подписка на контекст
    const currentUser = React.useContext(CurrentUserContext);
    // После загрузки текущего пользователя из API его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    function handleSubmit(event) {
        // Запрещаем браузеру переходить по адресу формы
        event.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onUserUpdate({
            name: name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            name="edit"
            title="Редактировать профиль"
            saveButtonText="Сохранить"
            onSubmit={handleSubmit}
            isOpen={isOpen}
            onClose={onClose}>

            <input name="name" id="name" type="text" minLength="2" maxLength="40" required
                   placeholder="Имя" onChange={onNameChange} value={name || ''} className="popup__edit-area"/>
            <span className="popup__error" id="popup__name-error"/>
            <input name="about" id="about" type="text" minLength="2" maxLength="200" required
                   placeholder="Описание" onChange={onDescriptionChange} value={description || ''} className="popup__edit-area"/>
            <span className="popup__error" id="popup__about-error"/>
        </PopupWithForm>
    )
}