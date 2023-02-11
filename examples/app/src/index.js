const { getApplication, serveApplication } = require('@themost/test');
const path = require('path');
const express = require('express');
const { Router } = require('express');
const { homeRouter } = require('./homeRouter');

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

app.use('/', homeRouter);

const router = app._router;
const before = router.stack.find((item) => {
    return item.name === 'router' && item.regexp != null && item.regexp.test('/');
});
const insert = router.stack[router.stack.length - 1];
insertRouterBefore(router, before, insert);

serveApplication(app, 8080);