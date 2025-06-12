// backend/src/app.js

const cors = require('cors');
const express = require('express');
const app = express();
const { executeSqlAndFetchData } = require('./runme');
const { getF1Teams } = require('./f1teams');
const { getF1Drivers } = require('./f1drivers');

const port = process.env.PORT || 5000;

// Configuração do CORS
const corsOptions = {
    // Certifique-se de que http://home.local:30080 ou 6000 está aqui, dependendo de como você acessa o frontend
    // Como o navegador acessa o frontend na 6000, e a API é chamada do front, o origin é 6000.
    // Se você acessar o frontend em 30080, mude para 30080.
    origin: ['http://localhost:3000', 'http://localhost:6000', 'http://home.local:6000', 'http://home.local:30080'], // <--- AJUSTE COM SUAS PORTAS DE ACESSO AO FRONTEND
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // <--- ADICIONE ESTA LINHA, ANTES DE app.use(express.json());

app.use(express.json());

// A rota no Express DEVE corresponder ao que o Nginx envia
// que é o caminho *sem* o prefixo /api
app.get('/runme-data', async (req, res) => { // <--- Rota /runme-data, não /api/runme-data
    try {
        const data = await executeSqlAndFetchData();
        res.json({
            message: 'Dados do runme.js obtidos com sucesso!',
            result: data
        });
    } catch (error) {
        console.error('Erro na rota /runme-data:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao processar runme.js', details: error.message });
    }
});

// Exemplo de uso: GET /f1teams?teamname=Ferrari&licensedin=Italy
// --- NOVA ROTA PARA BUSCAR EQUIPES DE F1 ---
app.get('/f1teams', async (req, res) => {
    // Pega os parâmetros 'teamname' e 'licensedin' da query string da URL
    const { teamname, licensedin } = req.query;

    try {
        // Chama a função getF1Teams (que está em f1teams.js) com os parâmetros
        const teams = await getF1Teams(teamname, licensedin);
        res.json({
            message: 'Equipes de F1 encontradas.',
            count: teams.length,
            data: teams
        });
    } catch (error) {
        console.error('Erro na rota /f1teams:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar equipes de F1.', details: error.message });
    }
});
// --- FIM DA NOVA ROTA ---

// Exemplo de uso: GET /f1drivers?nationality=Brazil
// --- NOVA ROTA PARA BUSCAR Pilotos DE F1 ---
app.get('/f1drivers', async (req, res) => {
    // Pega os parâmetros 'drivername' e 'nationality' da query string da URL
    const { drivername, nationality } = req.query;

    try {
        // Chama a função getF1Drivers (que está em f1teams.js) com os parâmetros
        const drivers = await getF1Drivers(drivername, nationality);
        res.json({
            message: 'Pilotos de F1 encontradas.',
            count: drivers.length,
            data: drivers
        });
    } catch (error) {
        console.error('Erro na rota /f1drivers:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar pilotos de F1.', details: error.message });
    }
});
// --- FIM DA NOVA ROTA ---

// ... suas outras rotas do backend ...

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});