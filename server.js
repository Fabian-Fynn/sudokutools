const express = require('express');
const http = require('http');

const config = require('./config');
const GeneratorModule = require('./modules/generator')
const app = express();
const server = http.Server(app);

const Generator = GeneratorModule();

app.get('/', function (req, res) {
  res.status(200).send('Hello World');
});

app.get('/gen', function (req, res) {
  Generator.start(false, (sudoku) => {
    res.send(sudoku);
  });
});

Generator.start(20, (board) => { });

server.listen(config.port, () => {
  console.info('There we go ♕');
  console.info(`Gladly listening on http://127.0.0.1:${config.port}`);
});
