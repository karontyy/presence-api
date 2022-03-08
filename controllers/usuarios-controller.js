const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastroDeUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(409).send({mensagem: 'Usuario já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({error: errBcrypt})}
                    conn.query(
                        `INSERT INTO usuarios (email, senha) VALUES (?,?)`, 
                        [req.body.email, hash],
                        (error, results) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error })}
                                response = {
                                    mensagem: 'Usuário cadastrado com successo',
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
        const query = `SELECT * FROM usuarios WHERE email = ?`;
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
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, "segredo", {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token 
                    })
                }
                return res.status(401).send({ mensagem: "Falha na autenticação" })
            })
        })
    });
}