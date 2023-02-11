const { Router } = require('express');

const homeRouter = Router()
homeRouter.use('^/$', (req, res,next) => {
    return res.redirect('auth/login?redirect_uri=/home')
});

module.exports = {
    homeRouter
}