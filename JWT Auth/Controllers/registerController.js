const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const path = require('path');
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');

const handleNewUsers = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    //check for duplicates

    const duplicates = usersDB.users.find(person => person.username === user);
    if (duplicates) return res.sendStatus(409);
    try {
        //encrypt the passwd
        const hashePwd = await bcrypt.hash(pwd, 10);
        //store new users
        const newUser = { "username": user, "password": hashePwd };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({ 'message': `New User ${user} Created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUsers };
