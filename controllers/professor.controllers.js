const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastroDeUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM professor WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(409).send({mensagem: 'Professor já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({error: errBcrypt})}
                    conn.query(
                        `INSERT INTO professor (nome, email, senha, telefone, admin, turma_id_turma) VALUES (?,?,?,?,?,?)`, 
                        [   req.body.nome,
                            req.body.email, 
                            hash,
                            req.body.telefone, 
                            req.body.admin, 
                            req.body.turma_id_turma
                        ],
                        (error, results) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error })}
                                response = {
                                    mensagem: 'Professor cadastrado com successo',
                                    usuarioCriado: {
                                        id_usuario: results.insertId,
                                        email: req.body.email
                                    }
                                }
                                return res.status(201).send(response)
                        });
                });
            }
        })
    });
}

exports.loginDeUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:  error}) }
        const query = `SELECT * FROM professor WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if(results.length < 1) {
                return res.status(401).send({ mensagem: "Falha na autenticação" })
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: "Falha na autenticação" })
                }
                if (result) {
                    const token = jwt.sign({
                        id_professor: results[0].id_professor,
                        nome: results[0].nome,
                        email: results[0].email
                    }, "segredo", {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({ 
                        mensagem: 'Professor autenticado com sucesso',
                        token: token
                    })
                }
                return res.status(401).send({ mensagem: "Falha na autenticação" })
            })
        })
    });
}

exports.buscaDadosProfessor = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `
            SELECT professor.nome as prof_nome, professor.email, professor.telefone, professor.admin, turma.nome as turma_nome, turma.quantidade_alunos FROM professor INNER JOIN turma ON turma.id_turma = professor.turma_id_turma WHERE id_professor = ? ;
            `,
            [req.params.id_professor],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado professor com o este id'
                    });
                }

                const response = {
                    professor: resultado.map(prof => {
                        return {
                            id_professor: prof.id_professor,
                            nome: prof.prof_nome,
                            email: prof.email,
                            telefone: prof.telefone,
                            admin: prof.admin == 1 ? "true" : "false",
                            turma: {
                                id_turma: prof.id_turma,
                                nome: prof.turma_nome,
                                quantidade_alunos: prof.quantidade_alunos
                            },
                            aulas: {
    
                            }
                        }
                    })
                }
                return res.status(200).send({ response })
            }
        )
    });
}