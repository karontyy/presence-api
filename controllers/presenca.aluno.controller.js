const mysql = require('../mysql').pool;

exports.buscaTodosOsPresentes = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT *
            FROM aluno_has_aula
            INNER JOIN aluno
            ON aluno_has_aula.fk_aluno = aluno.id_aluno
            INNER JOIN aula
            ON aluno_has_aula.fk_aula = aula.id_aula
            wHERE aula.data = \"${req.params.data}\";`,
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidadePresente: resultado.length,
                    presenca: resultado.map(pres => {
                        return {
                            aluno: {
                                id_aluno: pres.id_aluno,
                                nome: pres.nome,
                                idade: pres.idade ,
                                presente: pres.presente
                            },
                            // aula: {
                            //     id_aula: pres.id_aula,
                            //     data: pres.data,
                            //     quantidade_presentes: pres.quantidade_presentes,
                            //     quantidade_biblias: pres.quantidade_biblias,
                            //     quantidade_revista: pres.quantidade_revista
                            // },
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: ''
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

exports.salvarPresencaAluno = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'INSERT INTO aluno_has_aula (fk_aluno, fk_aula) VALUES (?,?)',
            [req.body.aluno, req.body.aula],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                
                const response = {
                    mensagem: 'presença inserida com sucesso', 
                    presenceCriado: {
                        aluno: req.body.aluno,
                        aula: req.body.aula
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