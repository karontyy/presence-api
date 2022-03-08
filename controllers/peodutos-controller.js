const mysql = require('../mysql').pool;

exports.buscaPordutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: resultado.length,
                    produtos: resultado.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
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

exports.salvaProduto = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                
                const response = {
                    mensagem: 'Produto inserido com sucesso', 
                    produtoCriado: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path
                    },
                    request: {
                        tipo: 'POST',
                        descricao: 'Produto Inserido',
                        url: 'http://localhost:3000/produtos'
                    }
                }

                return res.status(201).send({response});
            }
        )
    })
}

exports.deletaProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM produtos
                WHERE id_produto = ?`,
            [ req.params.id_produto ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto removido com sucesso', 
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Produto ' + resultado.nome + ' removido',
                        url: 'http://localhost:3000/produtos/' + req.body.id_produto
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}

exports.alteraProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE produtos
                SET nome = ?, 
                    preco = ?,
                    imagem_produto = ?
                WHERE id_produto = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.file.path,
                req.params.id_produto
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto atualizado com sucesso', 
                    produtoAtualizado: {
                        id_produto: req.params.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path
                    },
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Produto ' + req.body.nome + ' atualizado',
                        url: 'http://localhost:3000/produtos/' + req.body.id_produto
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}

exports.buscaProdutoPeloId = (req, res, next) => {
    const id = req.params.id_produto;
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com o este id'
                    });
                }

                const response = {
                    produto: {
                        id_produto: resultado[0].id_produto,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        imagem_produto: resultado[0].imagem_produto
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Produto com id '  + resultado[0].id_produto + ' retornado',
                        url: 'http://localhost:3000/produtos'
                    }
                }
                return res.status(200).send({ response })
            }
        )
    });
}