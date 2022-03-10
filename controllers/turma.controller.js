const mysql = require('../mysql').pool;

exports.buscaTodasAsTurmas = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM turma;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidadeDeTurmas: resultado.length,
                    turmas: resultado.map(turmas => {
                        return {
                            id_turma: turmas.id_turma,
                            nome: turmas.nome,
                            quantidade_alunos: turmas.quantidade_alunos,
                            request: {
                                tipo: 'GET',
                                descricao: 'Mostrar detalhes da turma',
                                url: 'http://localhost:3000/turma/' + turmas.id_turma
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

exports.buscaTurmaPeloId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM turma WHERE id_turma = ?;',
            [req.params.id_turma],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado turma com o este id'
                    });
                }

                const response = {
                    turma: {
                        id_turma: resultado[0].id_turma,
                        nome: resultado[0].nome,
                        quantidade_alunos: resultado[0].quantidade_alunos,
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retornar todas as turmas',
                        url: 'http://localhost:3000/turma'
                    }
                }
                return res.status(200).send({ response })
            }
        )
    });
}

exports.salvarTurma = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'INSERT INTO turma (nome, quantidade_alunos) VALUES (?,?)',
            [req.body.nome, req.body.quantidade_alunos],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                
                const response = {
                    mensagem: 'Turma inserida com sucesso', 
                    turmaCriada: {
                        id_produto: resultado.id_turma,
                        nome: req.body.nome,
                        quantidade_alunos: req.body.quantidade_alunos,
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Lista turmas',
                        url: 'http://localhost:3000/turma'
                    }
                }

                return res.status(201).send({response});
            }
        )
    })
}

exports.deletarTurma = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM turma
                WHERE id_turma = ?`,
            [ req.params.id_turma ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Turma deletada com sucesso', 
                    request: {
                        tipo: 'DELETE',
                        descricao: '',
                        url: 'http://localhost:3000/turma/' + req.param.id_turma
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}

exports.alterarTurma = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE turma
                SET nome = ?, 
                    quantidade_alunos = ?
                WHERE id_turma = ?`,
            [
                req.body.nome, 
                req.body.quantidade_alunos, 
                req.params.id_turma
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Turma atualizado com sucesso', 
                    turmaAtualizada: {
                        id_turma: req.params.id_turma,
                        nome: req.body.nome,
                        quantidade_alunos: req.body.quantidade_alunos,
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Lista Turmas',
                        url: 'http://localhost:3000/turma/'
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}