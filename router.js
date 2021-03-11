const express = require('express');

const router = express.Router();

const htmlRouter = require('./htmlRouter');
const loginRouter = require('./authRouter'); 

router.use('/html', htmlRouter);
router.use('/auth', loginRouter);

module.exports.router = router;