const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.emit('updateData', tasks);

  socket.on('addTask', (addedTask) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    tasks.push(addedTask);
    socket.broadcast.emit('addTask', addedTask);
  });

  socket.on('removeTask', (removedTask) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    tasks = tasks.filter(task => task.id !== removedTask);
    console.log('removed tasks', removedTask);
    socket.broadcast.emit('removeTask', removedTask);
  });
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});