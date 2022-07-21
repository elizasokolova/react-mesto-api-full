import '../App.css';
import React, {useEffect} from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import DeleteCardPopup from "./DeleteCardPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import api from "../Utils/Api";
import auth from "../Utils/Auth";
import {CurrentUserContext} from "../Contexts/CurrentUserContext";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import InfoToolTip from "./InfoToolTip";

export default function App() {
    const [isEditPopupOpened, setIsEditPopupOpened] = React.useState(false);
    const [isAddCardPopupOpened, setIsAddCardPopupOpened] = React.useState(false);
    const [isChangeAvatarPopupOpened, setIsChangeAvatarPopupOpened] = React.useState(false);
    const [isDeleteCardPopupOpened, setIsDeleteCardPopupOpened] = React.useState(false);
    const [isInfoToolTipPopupOpen, setIsInfoToolTipPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cardToDelete, setCardToDelete]= React.useState(null);
    const [isRegistered, setIsRegistered] = React.useState(false);
    const [isLogin, setIsLogin] = React.useState(false);
    const [email, setEmail] = React.useState(null);
    const history = useHistory();

    const [currentUser, setCurrentUser] = React.useState({
        name: '',
        about: ''
    });
    const [cards, setCards] = React.useState([]);

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(user => user._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => setCards((oldCards) =>
                oldCards.map((oldCard) => oldCard._id === newCard._id ? newCard : oldCard)
            ))
            .catch(err => console.error(`Error: ${err}`));
    }

    function handleCardDelete(card) {
        api.deleteCard(cardToDelete._id)
            .then(() => {
                setCards((oldCards) => oldCards.filter((oldCard) => oldCard._id !== cardToDelete._id))
                closeAllPopups();
            })
            .catch(err => console.error(`Error: ${err}`));
    }

    useEffect(() => {
        isLogin && api.getInitialCards()
            .then(setCards)
            .catch(err => console.error(`Error: ${err}`));
    }, [isLogin]);

    useEffect(() => {
        isLogin && api.getCurrentUser()
            .then((user) => {
                setCurrentUser(user);
            })
            .catch(err => console.error(`Error: ${err}`));
    }, [isLogin]);

    useEffect(() => {
        function handleOverlayEscClose(event) {
            if (event.target.classList.contains("popup_opened") || (event.key === 'Escape')) {
                closeAllPopups();
            }
        }
        document.addEventListener("click", handleOverlayEscClose);
        document.addEventListener("keydown", handleOverlayEscClose);
    });

    const closeAllPopups = () => {
        setIsEditPopupOpened(false);
        setIsAddCardPopupOpened(false);
        setIsChangeAvatarPopupOpened(false);
        setIsDeleteCardPopupOpened(false)
        setIsInfoToolTipPopupOpen(false);
        setSelectedCard(null);
    };

    function handleUpdateUser (userData) {
        api.updateCurrentUser(userData)
            .then(newUserData => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err => console.error(`Error: ${err}`)))
    }

    function handleUpdateAvatar (userData) {
        api.changeAvatar(userData)
            .then(newUserData => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err => console.error(`Error: ${err}`)))
    }

    function handleAddPlaceSubmit (userData) {
        api.addNewCard(userData)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err => console.error(`Error: ${err}`)))
    }

    useEffect(() => {
        // проверка токена в хранилище браузера localStorage
        if (localStorage.getItem("jwt")) {
            const jwt = localStorage.getItem("jwt");
                jwt && auth.checkTokenValidity(jwt)
                        .then((data) => {
                            setIsLogin(true);
                            setEmail(data.data.email);
                            history.push("/");
                        })
                        .catch((err => console.error(`Error: ${err}`)));
                }
    }, []);

    function handleLogIn(email, password) {
        auth
            .login(email, password)
            .then(data => {
                data.token &&
                localStorage.setItem("jwt", data.token);
                setIsLogin(true);
                setEmail(email);
                history.push("/");
            })
            .catch(err => {
                console.error(`Error: ${err}`)
                setIsInfoToolTipPopupOpen(true);
                setIsRegistered(false);
            });
    }

    function handleRegistration(email, password) {
        auth
            .register(email, password)
            .then(() => {
                setIsInfoToolTipPopupOpen(true);
                setIsRegistered(true);
                history.push("/signin");
            })
            .catch((err) => {
                console.error(`Error: ${err}`)
                setIsInfoToolTipPopupOpen(true);
                setIsRegistered(false);
            });
    }

    function handleLogOut() {
        localStorage.removeItem("jwt");
        setIsLogin(false);
        history.push("/signin");
    }

    const handleEditAvatarClick = () => setIsChangeAvatarPopupOpened(true);
    const handleEditProfileClick = () => setIsEditPopupOpened(true);
    const handleAddPlaceClick = () => setIsAddCardPopupOpened(true);
    const handleCardClick = (card) => setSelectedCard(card);
    const handleDeleteCardClick = (card) => {setCardToDelete(card); setIsDeleteCardPopupOpened(true)};

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <>
            <Header email={email} logOut={handleLogOut} />
            <Switch>
                <ProtectedRoute
                    exact path="/"
                    isLogin={isLogin}
                    component={Main}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onEditAvatar={handleEditAvatarClick}
                    onEditButton={handleEditProfileClick}
                    onAddButton={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardDeleteConfirm={handleDeleteCardClick}
                />
                <Route path="/signin">
                    <Login onLogin={handleLogIn} />
                </Route>
                <Route path="/signup">
                    <Register onRegister={handleRegistration} />
                </Route>
                <Route>
                    {isLogin ? <Redirect to="/" /> : <Redirect to="/signin" />}
                </Route>
            </Switch>

            <Footer/>

            {/* Попап Редактировать профиль */}
            <EditProfilePopup
                isOpen={isEditPopupOpened}
                onClose={closeAllPopups}
                onUserUpdate={handleUpdateUser}/>

            {/* Попап Добавить новую карточку */}
            <AddPlacePopup
                isOpen={isAddCardPopupOpened}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit} />

            {/* Попап Обновить аватарку */}
            <EditAvatarPopup
                onUpdateAvatar={handleUpdateAvatar}
                isOpen={isChangeAvatarPopupOpened}
                onClose={closeAllPopups} />

            {/* Попап удаления карточки */}
            <DeleteCardPopup
                isOpen={isDeleteCardPopupOpened}
                onClose={closeAllPopups}
                onCardDelete={handleCardDelete}
                card={cardToDelete} />

            {/* Попап открытия полноразмерной карточки */}
            <ImagePopup
                isOpen={selectedCard !== null}
                card={selectedCard}
                onClose={closeAllPopups} />

            {/* Попап успеха/ошибки авторизации */}
            <InfoToolTip
                isOpen={isInfoToolTipPopupOpen}
                onClose={closeAllPopups}
                isRegistered={isRegistered} />
            </>
        </CurrentUserContext.Provider>
    )
}