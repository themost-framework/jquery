const { getApplication, serveApplication } = require('@themost/test');
const path = require('path');
const express = require('express');
const app = getApplication();
app.use('/home', express.static('public/home'));
serveApplication(app, 8080);