import React from 'react';
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup ({isOpen, onClose, onUpdateAvatar}) {

    const avatarRef = React.useRef('');

    function handleSubmit(event) {
        event.preventDefault();
        onUpdateAvatar({
            avatar: avatarRef.current.value,
        });
    }

    React.useEffect(() => {
        avatarRef.current.value = ''; /* Сбрасываем поле ввода */
    }, [isOpen]);

    return (
        <PopupWithForm
            name="change-avatar"
            title="Обновить аватар"
            onSubmit={handleSubmit}
            saveButtonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}>

            <input ref={avatarRef} name="avatar" id="avatar" type="url" required placeholder="Ссылка на аватар"
                   className="popup__edit-area"/>
            <span className="popup__error" id="popup__avatar-error"/>
        </PopupWithForm>
    )
}