import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function DeleteCardPopup (props) {
    function onDeleteCardSubmit(event) {
        event.preventDefault();
        props.onCardDelete();
    }

    return (
        <PopupWithForm
            name="delete-card"
            title="Вы уверены?"
            saveButtonText="Да"
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={onDeleteCardSubmit}
        />
    );
}