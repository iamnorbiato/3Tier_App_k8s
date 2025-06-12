// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; // Importe estes componentes
import './App.css';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import { getF1Drivers, getF1Teams } from './api/f1Api';


const DriverSearchPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Definição das colunas para a tabela de Pilotos
  // Aqui você pode mudar o "header" para ser diferente do nome da coluna do banco de dados
  const driverColumns = [
    { header: 'Nome do Piloto', accessor: 'drivername' },
    { header: 'Nacionalidade', accessor: 'nationality' },
    { header: 'Corridas Iniciadas', accessor: 'racestarts' },
    { header: 'Poles', accessor: 'polepositions' },
    { header: 'Vitórias', accessor: 'racewins' },
    { header: 'Pódios', accessor: 'podiums' },
    { header: 'Voltas Rápidas', accessor: 'fastestlaps' },
    { header: 'Pontos', accessor: 'points' },
    // Adicione outras colunas conforme desejar
  ];

  const handleSearchDrivers = async (name, nationality) => { // 'name' é o valor do input1
    setLoading(true);
    setError(null);
    setDrivers([]);
    try {
      const result = await getF1Drivers(name, nationality); // <--- AGORA PASSA AMBOS 'name' e 'nationality'
      setDrivers(result.data || []);
    } catch (err) {
      setError('Erro ao buscar pilotos. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <h2>Buscar Piloto</h2>
      <SearchForm
        onSearch={handleSearchDrivers}
        inputLabels={{ input1: "Nome do Piloto", input2: "Nacionalidade" }}
        buttonText="Buscar Piloto"
      />

      {loading && <p>Carregando pilotos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        drivers.length > 0 ? (
          <div className="table-scroll-wrapper">
            <ResultsTable data={drivers} columns={driverColumns} />
          </div> 
        ) : (
          <p>Nenhum piloto encontrado. Tente ajustar os termos de busca.</p>
        )
      )}
    </div>
  );
};

  const TeamSearchPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Definição das colunas para a tabela de Equipes
  const teamColumns = [
    { header: 'Nome da Equipe', accessor: 'teamname' },
    { header: 'Licenciada em', accessor: 'licensedin' },
    { header: 'Corridas Iniciadas', accessor: 'racesstarted' },
    { header: 'Vitórias', accessor: 'wins' },
    { header: 'Pódios', accessor: 'podiums' },
    { header: 'Pontos', accessor: 'points' },
    // Adicione outras colunas conforme desejar
  ];

  const handleSearchTeams = async (name, licensedIn) => { // 'name' é o valor do input1
    setLoading(true);
    setError(null);
    setTeams([]);
    try {
      // Agora passamos AMBOS os parâmetros para a API
      const result = await getF1Teams(name, licensedIn); // <--- AGORA PASSA O 'name'
      setTeams(result.data || []);
    } catch (err) {
      setError('Erro ao buscar equipes. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <h2>Buscar Equipe</h2>
      <SearchForm
        onSearch={handleSearchTeams}
        inputLabels={{ input1: "Nome da Equipe", input2: "Licenciada em (País)" }}
        buttonText="Buscar Equipe"
      />

      {loading && <p>Carregando equipes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        teams.length > 0 ? (
          <div className="table-scroll-wrapper">
            <ResultsTable data={teams} columns={teamColumns} />
          </div>
        ) : (
          <p>Nenhuma equipe encontrada. Tente ajustar os termos de busca.</p>
        )
      )}
    </div>
  );
};

function App() {
  return (
    <Router> {/* Envolve toda a aplicação com o Router */}
      <div className="app-container">
        {/* Componente da Área de Menu (Sidebar) */}
        <aside className="sidebar">
          Área de Menu
          {/* Usamos NavLink para navegação */}
          <NavLink
            to="/drivers"
            className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
          >
            Buscar Piloto
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
          >
            Buscar Equipe
          </NavLink>
        </aside>

        {/* Área de Conteúdo Principal */}
        <div className="main-content">
          {/* Componente do Título (Header) */}
          <header className="app-header">
            <h1>Formula One History - Drives and Teams</h1>
          </header>

          {/* Aqui será onde o conteúdo dinâmico (formulário de busca, tabela) será renderizado */}
          <main> {/* Removi a div content-area daqui pois ela já está nos componentes de página */}
            <Routes> {/* Define as rotas da aplicação */}
              <Route path="/drivers" element={<DriverSearchPage />} />
              <Route path="/teams" element={<TeamSearchPage />} />
              {/* Rota padrão para quando nenhuma rota for correspondida */}
              <Route path="/" element={<div className="content-area"><p>Selecione uma opção no menu.</p></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;