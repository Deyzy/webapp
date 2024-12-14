 const createConnection = require('./db');

 // Criar um novo usuário
 const createUser = (req, res) => {
     const { username, password, fullname, cpf, phonenumber, address, dateofbirth } = req.body;
     const connection = createConnection();

     const query = 'INSERT INTO usuarios (username, password, fullname, cpf, phonenumber, address, dateofbirth) VALUES (?, ?, ?, ?, ?, ?, ?)';
     connection.query(query, [username, password, fullname, cpf, phonenumber, address, dateofbirth], (err, results) => {
         if (err) {
             console.error(err);
             return res.status(500).send('Erro ao criar usuário');
         }
         res.redirect('/usuarios');   //Redireciona para a listagem de usuários
     });
 };

 // Listar todos os usuários
 function getUsers() {
     const connection = createConnection();

     const query = 'SELECT * FROM users';
     connection.query(query, (err, results) => {
         if (err) {
             console.error(err);
             return res.status(500).send('Erro ao buscar usuários');
         }
        return results
     });
 };

 // Mostrar um usuário específico
 const getUser = (req, res) => {
     const { id } = req.params;
     const connection = createConnection();

     const query = 'SELECT * FROM usuarios WHERE id = ?';
     connection.query(query, [id], (err, results) => {
         if (err) {
             console.error(err);
             return res.status(500).send('Erro ao buscar usuário');
         }
         if (results.length > 0) {
             res.render('usuariodetalhe', { usuario: results[0] });   //Renderiza os detalhes do usuário
         } else {
             res.status(404).send('Usuário não encontrado');
         }
     });
 };

  // Atualizar um usuário
 const updateUser = (req, res) => {
     const { id } = req.params;
     const { username, password, fullname, cpf, phonenumber, address, dateofbirth } = req.body;
     const connection = createConnection();

     const query = 'UPDATE usuarios SET username = ?, password = ?, fullname = ?, cpf = ?, phonenumber = ?, address = ?, dateofbirth = ? WHERE id = ?';
     connection.query(query, [username, password, fullname, cpf, phonenumber, address, dateofbirth, id], (err, results) => {
         if (err) {
             console.error(err);
             return res.status(500).send('Erro ao atualizar usuário');
         }
         res.redirect(`/usuarios/${id}`);  // Redireciona para os detalhes do usuário
     });
 };

 // Deletar um usuário
 const deleteUser = (req, res) => {
     const { id } = req.params;
     const connection = createConnection();

     const query = 'DELETE FROM usuarios WHERE id = ?';
     connection.query(query, [id], (err, results) => {
         if (err) {
             console.error(err);
             return res.status(500).send('Erro ao deletar usuário');
         }
         res.redirect('/usuarios');  // Redireciona para a lista de usuários
     });
 };

 module.exports = {
     createUser,
     getUsers,
     getUser,
     updateUser,
     deleteUser
 };
