const express = require('express');

const router = express.Router();
const {
  getUsers, getUserInfo, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');
const { ValidationUpdateProfile, ValidationUpdateAvatar, ValidationUserId } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', ValidationUserId, getUserById);
router.patch('/me', ValidationUpdateProfile, updateProfile);
router.patch('/me/avatar', ValidationUpdateAvatar, updateAvatar);

module.exports = router;
