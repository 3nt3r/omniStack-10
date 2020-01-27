// GET / POST / PUT / DELETE
// Query: GET -> (Filtro, Ordenação, Paginação) = localhost/?search=Teste / Acesso -> req.query
// Route: PUT / DELETE -> localhost/users/1 - Acesso -> req.params
// Body:  POST / PUT -> Corpo da Requisição (JSON) = localhost/users / Acesso -> req.body

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const {setupWebSocket} = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-dlr2h.mongodb.net/semana10?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
