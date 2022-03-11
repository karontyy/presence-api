const mysql = require('../mysql').pool;

exports.buscaTodosOsAlunos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM aluno;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidadeDeAlunos: resultado.length,
                    alunos: resultado.map(aluno => {
                        return {
                            id_aluno: aluno.id_aluno,
                            nome: aluno.nome,
                            idade: aluno.idade,
                            presente: aluno.presente,
                            request: {
                                tipo: 'GET',
                                descricao: 'Mostrar detalhes do aluo',
                                url: 'http://localhost:3000/aula/' + aluno.id_aluno
                            }
                        }
                    })
                }
                return res.status(200).send({
                    response: response
                })
            }
        )
    });
}

exports.buscarAlunoPorId = (req, res, next) => {
    const query = `SELECT * FROM aluno WHERE id_aluno = ?;`;

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            query,
            [req.params.data],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    aluno: {
                        id_aluno: resultado[0].id_aluno,
                        nome: resultado[0].nome,
                        idade: resultado[0].idade,
                        presente: resultado[0].presente
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retornar todos os alunos',
                        url: 'http://localhost:3000/aluno'
                    }
                }
                return res.status(200).send({
                    response: response
                })
            }
        )
    });
}

exports.salvarAluno = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'INSERT INTO aluno (nome, idade, esta_presente) VALUES (?,?,?)',
            [req.body.nome, req.body.idade, req.body.esta_presente],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                
                const response = {
                    mensagem: 'Aluno inserida com sucesso', 
                    alunoCriado: {
                        id_aluno: resultado.id_aluno,
                        nome: req.body.nome,
                        esta_presente: req.body.esta_presente
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Lista Alunos',
                        url: 'http://localhost:3000/aluno'
                    }
                }

                return res.status(201).send({response});
            }
        )
    })
}

exports.deletarAluno = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM aluno
                WHERE id_aluno = ?`,
            [ req.params.id_aluno ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'aluno deletada com sucesso', 
                    request: {
                        tipo: 'DELETE',
                        descricao: '',
                        url: 'http://localhost:3000/aula/' + req.param.id_aluno
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}

exports.alterarAluno = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE aluno
                SET nome = ?
                , idade= ?
                , esta_presente = ?
                WHERE id_aluno = ?`,
            [
                req.body.nome, 
                req.body.idade, 
                req.body.esta_presente,
                 req.params.id_aula
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Aluno atualizado com sucesso', 
                    aulaAtualizada: {
                        nome : req.body.nome, 
                        idade : req.body.idade, 
                        esta_presente : req.body.esta_presente
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Lista Alunos',
                        url: 'http://localhost:3000/alunos/'
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}