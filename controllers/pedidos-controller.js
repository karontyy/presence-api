const mysql = require('../mysql').pool;

exports.getPedidos =  (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT pedidos.id_pedido,
                    pedidos.quantidade, 
                    produtos.id_produto, 
                    produtos.nome, 
                    produtos.preco 
                FROM pedidos 
          INNER JOIN produtos 
                  ON produtos.id_produto = pedidos.id_produto;`,
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    pedidos: resultado.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
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

exports.getPedidoById = (req, res, next) => {
    const id = req.params.id_pedido;
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com o este id'
                    });
                }

                const response = {
                    pedido: {
                        id_pedido: resultado[0].id_pedido,
                        quantidade: resultado[0].quantidade,
                        id_produto: resultado[0].id_produto,
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Pedido com id '  + resultado[0].id_pedido + ' retornado',
                        url: 'http://localhost:3000/pedidos'
                    }
                }
                return res.status(200).send({ response })
            }
        )
    });
}

exports.salvaPedido = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            'SELECT * FROM produtos WHERE id_produto = ?', 
            [req.body.id_produto], 
            (error, resultado, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    });
                }
                conn.query(
                    'INSERT INTO pedidos (quantidade, id_produto) VALUES (?,?)',
                    [req.body.quantidade, req.body.id_produto],
                    (error, resultado, field) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        
                        const response = {
                            mensagem: 'Pedido inserido com sucesso', 
                            pedidoCriado: {
                                id_pedido: resultado.id_pedido,
                                quantidade: req.body.quantidade,
                                id_produto: req.body.id_produto,
                            },
                            request: {
                                tipo: 'POST',
                                descricao: 'Pedido Inserido',
                                url: 'http://localhost:3000/pedidos'
                            }
                        }
        
                        return res.status(201).send({response});
                    }
                )
            });
    });
}

exports.deletaPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM pedidos
                WHERE id_pedido = ?`,
            [ req.params.id_pedido ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Pedido removido com sucesso', 
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Pedido ' + resultado.id_pedido + ' removido',
                        url: 'http://localhost:3000/pedido/' + req.body.id_pedido
                    }
                }

                res.status(202).send({ response });
            }
        )
    })
}