var express = require('express');
var router = express.Router();
const md5 = require('md5')

router.get('/', async function(req, res, next) {

    let users = await req.db.any(`
        SELECT
            users.id AS id,
            users.login AS login,
            users.fio AS fio,
            roles.label AS role_label
        FROM
            users
        INNER JOIN roles ON roles.id = users.id_role
        ORDER BY id
    `)
    console.log(users)

    let roles = await req.db.any(`
    SELECT
        *
    FROM
        roles
    `)
    console.log(roles)
    
    res.render('users/list', { title: 'Пользователи', users: users, roles: roles})
});

router.post('/create', async function(req, res, next) {
    let users = req.body  
    await req.db.none('INSERT INTO users(login, password, fio, id_role) VALUES(${login}, md5(${password}), ${fio}, ${id_role})', users);
    res.send({msg: ''})   
    });

router.get('/:id', async function(req, res) {

    let id = req.params.id

    let user = await req.db.one(`
        SELECT
            users.id AS id,
            users.login AS login,
            users.fio AS fio,
            roles.label AS role_label
        FROM
            users
        INNER JOIN roles ON roles.id = users.id_role
        ORDER BY id
        WHERE
            users.id = $/id/
    `, {id: id})
    res.render('users/view', { title: 'Пользователь' + user.label, user: user })

});

module.exports = router;
