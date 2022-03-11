const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// PRESENTE
const RotaProfessor = require('./routes/professor.routes');
const RotaTurma = require('./routes/turma.routes');
const RotaAula = require('./routes/aula.routes');
const RotaAluno = require('./routes/aluno.routes');
const RotaPresenceAluno = require('./routes/presenca.aluno.routes');

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods', 
            'PUT', 'POST', 'PATCH', 'DELETE', 'GET'
        );
        return res.status(200).send({})
    }
    next();
});

//PRESENTE
app.use('/professor', RotaProfessor);
app.use('/turma', RotaTurma);
app.use('/aula', RotaAula);
app.use('/aluno', RotaAluno);
app.use('/presence-aluno', RotaPresenceAluno);

app.use((req, res, next) => {
    const erro = new Error('Endpoint não encontrado ;(');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;
