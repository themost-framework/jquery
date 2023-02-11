const { getApplication, serveApplication } = require('@themost/test');
const path = require('path');
const express = require('express');
const { Router } = require('express');

function insertRouterBefore(parent, before, insert) {
    const beforeIndex = parent.stack.findIndex( (item) => {
        return item === before;
    });
    const findIndex = parent.stack.findIndex( (item) => {
        return item === insert;
    });
    // remove last router
    parent.stack.splice(findIndex, 1);
    // move up
    parent.stack.splice(beforeIndex, 0, insert);
}

const app = getApplication();
app.use('/home', express.static('public/home'));

const addRouter = Router()
addRouter.use('^/$', (req, res,next) => {
    return res.redirect('auth/login?redirect_uri=/home')
});
app.use('/', addRouter);

const router = app._router;
const before = router.stack.find((item) => {
    return item.name === 'router' && item.regexp && item.regexp.test('/');
});
const insert = router.stack[router.stack.length - 1];
insertRouterBefore(router, before, insert)

serveApplication(app, 8080);