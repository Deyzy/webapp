const createConnection = require('./db'); //função que cria a conexão

// Função para processar o login
const loginUser = (req, res) => {
    const { username, password } = req.body;

    // Cria a conexão com o banco de dados chamando a função
    const connection = createConnection();

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';

    // Verificar o usuário no banco de dados
    connection.query(
        sql, 
        [username, password],
        (err, results) => {
            connection.end(); // Fechar a conexão após a consulta

            if (err) {
                return res.status(500).send('Erro na consulta ao banco de dados.');
            } 

            if (results.length > 0) {
                const info = {
                    id: results[0].id,
                    username: results[0].username, 
                    fullname: results[0].fullname,
                    cpf: results[0].cpf,
                    phonenumber: results[0].phonenumber,
                    address: results[0].address,
                    dateofbirth: results[0].dateofbirth,
                }
                return res.render('info', { info });
            } else {
                return res.send('Usuário ou senha incorretos.');
            }
        }
    );
};

module.exports = { loginUser };