const createConnection = require('./db'); 

const loginUser = (req, res) => {
    const { username, password } = req.body;
    const connection = createConnection();

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';

    connection.query(
        sql, 
        [username, password],
        (err, results) => {
            connection.end();

            if (err) {
                return res.status(500).send('Erro na consulta ao banco de dados.');
            }

            if (results.length > 0) {
                
                const user = results[0];
                if (user.adm === 1) { 
                    // Passar a informação do usuário logado e redirecionar para o painel
                    return res.render('admin', { user });
                } else {
                    return res.render('info', { info: user });
                }
            } else {
                return res.send('Usuário ou senha incorretos.');
            }
        }
    );
};
