const express = require('express');
const postController = require('../controllers/postController');
const isAuth = require('../middlewares/authMiddleware');
const { upload } = require('../utils/upload');
const router = express.Router();

router.get('/', isAuth, postController.index);
router.post('/', isAuth, upload, postController.create);

router.delete('/:id', isAuth, postController.destroy);

module.exports = router;
