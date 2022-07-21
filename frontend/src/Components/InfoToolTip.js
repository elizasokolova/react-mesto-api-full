import React from "react";
import approved from "../Images/approved.svg";
import error from "../Images/error.svg";

export default function InfoToolTip({isOpen, onClose, isRegistered}) {
    return (
        <div className={`popup ${isOpen && "popup_opened"}`}>
            <div className="popup__container">
                <button onClick={onClose} type="button" className="popup__close-button" aria-label="Закрыть"/>
                {isRegistered ?
                    <div>
                        <img src={`${approved}`} alt="Зарегестрирован" className="popup__tooltip-img"/>
                        <p className="popup__tooltip-msg">Вы успешно зарегистрировались!</p>
                    </div>
                    :
                    <div>
                        <img src={`${error}`} alt="Не зарегестрирован" className="popup__tooltip-img"/>
                        <p className="popup__tooltip-msg">Что-то пошло не так! Попробуйте ещё раз.</p>
                    </div>
                }
            </div>
        </div>
    );
}