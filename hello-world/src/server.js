const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejs = require('ejs');
const {login} = require('./rotas/login')
const createConnection = require('./rotas/db');
const {info} = require('./rotas/info')
const {loginUser} = require('./rotas/loginUser');
 
//CRIAR UMA PAG ADMIN, COM UMA PALAVRA SECRETA QUE SÓ O ADM TEM ACESSO
 
const app = express(); 
console.log(__dirname)

app.set('view engine', 'ejs'); //renderizar os dados dinamicamente
app.set('views', path.join(__dirname, 'views')); //definir as pastas que estão os templates

//para processar dados do formulário
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('src'));

const connection = createConnection(); //função para conexão com o MySQL

app.get('/', login ); // para chamar a página de login

app.get('/info', info); 
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Cria a conexão com o banco de dados chamando a função
    const connection = createConnection();

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';

//     // Verificar o usuário no banco de dados
//     connection.query(
//         sql, 
//         [username, password],
//         (err, results) => {
//             connection.end(); // Fechar a conexão após a consulta

//             if (err) {
//                 return res.status(500).send('Erro na consulta ao banco de dados.');
//             } 

//             if (results.length > 0) {
//                 if (results[0].adm === 1) {
//                     const users = getUsers()
//                     const info = {
//                         users, results
//                     }
//                     console.log(info)
//                     return res.render('usuarios', {info});
//                 } else {
//                     return res.render('info', { info:results[0]});
//                 }
//             } else {
//                 return res.send('Usuário ou senha incorretos.');
//             }
//         }
//     );
// }); 


    // Verificar o usuário no banco de dados
    connection.query(
        sql,
        [username, password],
        (err, results) => {
            if (err) {
                connection.end(); // Fechar a conexão se der erro
                return res.status(500).send('Erro na consulta ao banco de dados.');
            }

            if (results.length > 0) {
                if (results[0].adm === 1) {
                    // Se for admin, buscar todos os usuários
                    connection.query('SELECT * FROM users', (err, users) => {
                        if (err) {
                            connection.end(); // Fechar a conexão se der erro
                            return res.status(500).send('Erro ao buscar usuários');
                        }
                        const info = {
                            users,
                            results
                        };
                        // console.log(info);
                         res.render('admin', { user: results[0], usuarios: users });
                    });
                } else {
                    // Se não for admin, renderiza a página de informações do usuário
                    connection.end(); // Fechar a conexão após finalizar todas as operações
                    return res.render('info', { info: results[0] });
                }
            } else {
                connection.end(); // Fechar a conexão se não encontrar o usuário
                return res.send('Usuário ou senha incorretos.');
            }
        }
    );
});


// Rota para o painel de administração
app.get('/admin', (req, res) => {
    const connection = createConnection();
    connection.query('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).send('Erro ao buscar usuários');
        }
        res.render('admin', { users });
    });
});

// Rota para excluir um usuário
app.get('/usuarios/excluir/:id', (req, res) => {
    const { id } = req.params;
    const connection = createConnection();
    
    connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).send('Erro ao excluir usuário');
        }
        res.redirect('/admin');  // Redireciona para o painel de administração
    });
});

// Rota para editar um usuário
app.get('/usuarios/editar/:id', (req, res) => {
    const { id } = req.params;
    const connection = createConnection();
    
    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro ao buscar usuário');
        }
        res.render('editarUsuario', { usuario: results[0] });
    });
});

app.post('/usuarios/editar/:id', (req, res) => {
    const { id } = req.params;
    const { fullname, cpf, phonenumber, address, dateofbirth } = req.body;
    const connection = createConnection();
    
    const query = 'UPDATE users SET fullname = ?, cpf = ?, phonenumber = ?, address = ?, dateofbirth = ? WHERE id = ?';
    connection.query(query, [fullname, cpf, phonenumber, address, dateofbirth, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).send('Erro ao atualizar usuário');
        }
        res.redirect('/admin');  // Redireciona para o painel de administração
    });
});




// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
