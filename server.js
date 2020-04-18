const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/src/index.js'));
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});
const io = socket(server);

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});