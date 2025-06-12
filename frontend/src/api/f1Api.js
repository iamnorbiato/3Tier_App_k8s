// src/api/f1Api.js
import axios from 'axios';

// A URL base da sua API
// Para desenvolvimento local, usamos localhost e a porta exposta pelo Kubernetes para o Nginx (frontend)
// O Nginx (frontend) fará o proxy reverso para o seu backend.
//const API_BASE_URL = 'http://home.app:30080/api';

const API_BASE_URL = window.appConfig ? window.appConfig.API_BASE_URL : 'http://localhost:30080/api';

// Função para buscar equipes de F1
export const getF1Teams = async (teamName = '', licensedIn = '') => { // <--- teamName adicionado
  try {
    const params = {};
    if (teamName) { // Adiciona teamname apenas se não estiver vazio
      params.teamname = teamName; // <--- Parâmetro para a API
    }
    if (licensedIn) { // Adiciona licensedin apenas se não estiver vazio
      params.licensedin = licensedIn; // <--- Parâmetro para a API
    }

    const response = await axios.get(`${API_BASE_URL}/f1teams`, {
      params: params // Passa o objeto params
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar equipes de F1:', error);
    throw error;
  }
};

// Função para buscar pilotos de F1
export const getF1Drivers = async (driverName = '', nationality = '') => { // <--- nationality adicionado
  try {
    const params = {};
    if (driverName) {
      params.drivername = driverName; // Parâmetro para a API
    }
    if (nationality) {
      params.nationality = nationality; // <--- nationality adicionado como parâmetro para a API
    }

    const response = await axios.get(`${API_BASE_URL}/f1drivers`, {
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pilotos de F1:', error);
    throw error;
  }
};