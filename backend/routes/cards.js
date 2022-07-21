const express = require('express');

const router = express.Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { ValidationCreateCard, ValidationCardId } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', ValidationCreateCard, createCard);
router.delete('/:cardId', ValidationCardId, deleteCard);
router.put('/:cardId/likes', ValidationCardId, likeCard);
router.delete('/:cardId/likes', ValidationCardId, dislikeCard);

module.exports = router;
