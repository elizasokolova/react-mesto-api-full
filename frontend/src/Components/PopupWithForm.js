export default function PopupWithForm (props) {
    return (
        <div className={`popup ${props.isOpen && "popup_opened" }`} id={`popup-${props.name}`}>
            <div className="popup__container">
                <button className="popup__close-button" onClick={props.onClose} type="button" aria-label="Закрыть"/>
                <h2 className="popup__edit">{props.title}</h2>
                <form name={`popup_form-${props.name}`} onSubmit={props.onSubmit} className="popup__form">
                    {props.children}
                    <button className="popup__save-button" type="submit" aria-label={`${props.saveButtonText}`}>{props.saveButtonText}</button>
                </form>
            </div>
        </div>
    )
}