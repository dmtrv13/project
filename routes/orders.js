var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {

    let orders = await req.db.any(`
        SELECT
            orders.id AS id,
            orders.label AS label,
            order_statuses.label AS id_status,
            clients.label AS id_client,
            orders.amount AS amount
        FROM
            orders
        INNER JOIN
            clients ON clients.id = orders.id_client
        INNER JOIN
            order_statuses ON order_statuses.id = orders.id_status
    `)
    console.log(orders)

    let clients = await req.db.any(`
        SELECT
            *
        FROM
            clients
    `)
    console.log(clients)

    let order_statuses = await req.db.any(`
        SELECT
            *
        FROM
            order_statuses
    `)
    console.log(order_statuses)

    res.render('orders/list', { title: 'Заказы', orders: orders, clients: clients, order_statuses: order_statuses })

});

router.post('/create', async function(req, res, next) {

    let order = req.body

    await req.db.none('INSERT INTO orders(label, id_client, id_status, amount) VALUES(${label}, ${id_client}, ${id_status}, ${amount})', order);

    res.send({msg: ''})

});

router.delete('/delete', async function(req, res, next) {
    let order = req.body  
    await req.db.none('DELETE FROM orders WHERE id = ${id}', order);
    res.send({msg: ''})   
    });

router.put('/update', async function(req, res, next) {
    let order = req.body  
    await req.db.none('UPDATE orders SET label = ${label}, id_status = ${id_status}, id_client = ${id_client}, amount = ${amount} WHERE id = ${id}', order);
    res.send({msg: ''})   
    });

router.get('/:id', async function(req, res) {

    let id = req.params.id

    let order = await req.db.one(`
        SELECT
            orders.id AS id,
            orders.label AS label,
            order_statuses.label AS order_status_label,
            clients.label AS client_label,
            orders.amount AS amount
        FROM
            orders
        INNER JOIN
            clients ON clients.id = orders.id_client
        INNER JOIN
            order_statuses ON order_statuses.id = orders.id_status
        WHERE
            orders.id = $/id/
    `, {id: id})
    res.render('orders/view', { title: 'Заказ' + order.label, order: order })

});

module.exports = router;
