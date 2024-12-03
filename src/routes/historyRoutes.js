
const express = require('express');
const router = express.Router();
const listeningHistoryController = require('../controllers/historyController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', listeningHistoryController.getAllListeningHistories);
router.get('/:id',listeningHistoryController.getListeningHistoryById);
router.post('/', listeningHistoryController.createListeningHistory);


module.exports = router;
