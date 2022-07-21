export default function ImagePopup (props) {
    return (
        <div className={`popup popup_transparent ${props.isOpen && "popup_opened" }`} id="popup-fullsize">
            <figure className="popup__full-container">
                <button className="popup__close-button" onClick={props.onClose} type="button" aria-label="Закрыть"/>
                <img src={props.card?.link} className="popup__full-img" alt={props.card?.name}/>
                <figcaption className="popup__full-img-name">{props.card?.name}</figcaption>
            </figure>
        </div>
    );
}