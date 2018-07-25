const https = require('https');

module.exports = app => {

    const ip = app.get('ip');
    let counter = 0;

    const carros = [
        { "nome": "Corte", "preco": 50.0, "fotos": [] },
        { "nome": "Escova", "preco": 30.0, "fotos": [] },
        { "nome": "Chapinha", "preco": 20.0, "fotos": [] },
        { "nome": "Alisamento", "preco": 100.0, "fotos": [] },
        { "nome": "Hidratação", "preco": 40.0, "fotos": [] },
        { "nome": "Limpeza de Pele", "preco": 70.0, "fotos": [] },
        { "nome": "Depilação", "preco": 50.0, "fotos": [] },
        { "nome": "Manicure", "preco": 25.0, "fotos": [] },
        { "nome": "Pedicure", "preco": 30.0, "fotos": [] }
    ];

    const usuario = {
        "id": 1,
        "nome": "Jady Bezzera Domingues",
        "dataNascimento": "13/07/1994",
        "telefone": "(16) 98824 8856",
        "email": "jady_bd@hotmail.com",
        "senha": "Jady123!"
    };

    app.get('/api/carro/listaTodos', (req, res) =>
        res.json(carros));

    app.post('/api/agendamento/agenda', (req, res) => {
        counter++;

        const agendamento = req.body;
        
        if (counter % 3 != 0) {
            console.log('Agendamento recebido: ' + JSON.stringify(agendamento));
            setTimeout(() => enviaNotificacao(agendamento), 5000);
            res.json(null);
        } else {
            console.log('Erro no processamento do agendamento.');
            res.status(500).end();
        }
    });

    app.post('/api/login', (req, res) => {
        let usuarioLogin = req.body;

        if (usuarioLogin.email == usuario.email 
            && usuarioLogin.senha == usuario.senha) {

                res.json(usuario);
        } else {
            res.status(403).end();
        }
    });

    function enviaNotificacao(agendamento) {
        const agendamentoId = agendamento.emailCliente + agendamento.data.substr(0, 10);

        const message = { 
            app_id: "e53f5d24-40e4-458f-99db-5230cf3f8bc0",
            headings: {"en": "Awoman"},
            contents: {"en": "Agendamento confirmado!"},
            data: {"agendamento-id": agendamentoId},
            included_segments: ["All"]
        };

        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic MGJlOGMxZGEtMDY3Ni00NWY3LWI0ZjYtMjRjMjYzMzhmZmEz"
        };
        
        const options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };
        
        const req = https.request(options, function(res) {  
          res.on('data', function(data) {
            // console.log("Response:");
            // console.log(JSON.parse(data));
          });
        });
        
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(message));
        req.end();
      }
};
