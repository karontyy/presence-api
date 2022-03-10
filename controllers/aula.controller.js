const mysql = require('../mysql').pool;

exports.buscaTodasAsAulas = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM aula;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidadeDeAulas: resultado.length,
                    aulas: resultado.map(aulas => {
                        return {
                            id_aula: aulas.id_aula,
                            data: aulas.data,
                            quantidade_presentes: aulas.quantidade_presentes,
                            quantidade_biblias: aulas.quantidade_biblias,
                            quantidade_revista: aulas.quantidade_revista,
                            request: {
                                tipo: 'GET',
                                descricao: 'Mostrar detalhes da aula',
                                url: 'http://localhost:3000/aula/' + aulas.id_aula
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

exports.buscarAulaPorData = (req, res, next) => {
    const query = `SELECT * FROM aula WHERE data = \"${req.params.data}\";`;
    const queryOfc = `SELECT * FROM aula WHERE data = \" ? \";`;

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            query,
            [req.params.data],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidadeDeAulas: resultado.length,
                    aulas: resultado.map(aulas => {
                        return {
                            id_aula: aulas.id_aula,
                            data: aulas.data,
                            quantidade_presentes: aulas.quantidade_presentes,
                            quantidade_biblias: aulas.quantidade_biblias,
                            quantidade_revista: aulas.quantidade_revista,
                            request: {
                                tipo: 'GET',
                                descricao: 'Mostrar detalhes da aula',
                                url: 'http://localhost:3000/aula/' + aulas.id_aula
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

exports.salvarAula = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'INSERT INTO aula (data, quantidade_presentes, quantidade_biblias, quantidade_revista) VALUES (?,?,?,?)',
            [req.body.data, req.body.quantidade_presentes, req.body.quantidade_biblias, req.body.quantidade_revista],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                
                const response = {
                    mensagem: 'Aula inserida com sucesso', 
                    aulaCriada: {
                        id_aula: resultado.id_aula,
                        data: req.body.data,
                        quantidade_presentes: req.body.quantidade_presentes,
                        quantidade_biblias: req.body.quantidade_biblias,
                        quantidade_revista: req.quantidade_revista
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Lista Aulas',
                        url: 'http://localhost:3000/aula'
                    }
                }

                return res.status(201).send({response});
            }
        )
    })
}

exports.deletarAula = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM aula
                WHERE id_aula = ?`,
            [ req.params.id_aula ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Aula deletada com sucesso', 
                    request: {
                        tipo: 'DELETE',
                        descricao: '',
                        url: 'http://localhost:3000/aula/' + req.param.id_turma
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}

exports.alterarAula = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE aula
                SET data = ?
                , quantidade_presentes= ?
                , quantidade_biblias = ?
                , quantidade_revista = ?
                WHERE id_aula = ?`,
            [
                req.body.data, 
                req.body.quantidade_presentes, 
                req.body.quantidade_biblias,
                req.body.quantidade_revista,
                req.params.id_aula
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Aula atualizado com sucesso', 
                    aulaAtualizada: {
                       data : req.body.data, 
                        presentes : req.body.quantidade_presentes, 
                        biblias : req.body.quantidade_biblias,
                        resvistas : req.body.quantidade_revista,
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Lista Aulas',
                        url: 'http://localhost:3000/aulas/'
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}