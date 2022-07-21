import React from 'react';
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup ({isOpen, onClose, onAddPlace}) {
    const [title, setTitle] = React.useState('');
    const [link, setLink] = React.useState('');
    const onTitleChange = (event) => setTitle(event.target.value);
    const onLinkChange = (event) => setLink(event.target.value);

    function handleSubmit(event) {
        event.preventDefault();
        onAddPlace({
            name: title,
            link: link,
        });
    }

    React.useEffect(() => {
        setTitle('');
        setLink('');
    }, [isOpen]); /* Сбрасываем поля ввода */

    return (
        <PopupWithForm
            name="add"
            title="Новое место"
            onSubmit={handleSubmit}
            saveButtonText="Создать"
            isOpen={isOpen}
            onClose={onClose}>

            <input name="title" id="title" value={title} onChange={onTitleChange}
                   type="text" minLength="2" maxLength="30" required
                   placeholder="Название" className="popup__edit-area"/>
            <span className="popup__error" id="popup__title-error"/>
            <input name="link" id="link" value={link} onChange={onLinkChange}
                   type="url" required placeholder="Ссылка на картинку" className="popup__edit-area"/>
            <span className="popup__error" id="popup__link-error"/>
        </PopupWithForm>
    )
}