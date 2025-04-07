// server/utils/dataManager.js
import fs from 'fs';
import path from 'path';

class DataManager {
  constructor(dataDir = "data") {
    this.baseDir = path.resolve(dataDir);
    this.chatHistory = [];
    this.questionnaire = [];
    this.notebooks = {};
    this.metadata = {
      created_at: new Date().toISOString(),
      last_response_time: null,
    };
  }

  _saveData() {
    // Se vuoi implementare il salvataggio su file, aggiungi qui la logica
  }

  _loadData() {
    // Se vuoi implementare il caricamento da file, aggiungi qui la logica
  }

  clearData() {
    this.chatHistory = [];
    this.questionnaire = [];
    this.notebooks = {};
    this.metadata.last_response_time = null;
    this._saveData();
  }

  addChatMessage(message) {
    this.chatHistory.push(message);
    this._saveData();
  }

  getChatHistory() {
    return this.chatHistory;
  }

  setQuestionnaire(q) {
    this.questionnaire = q;
    this._saveData();
  }

  getQuestionnaire() {
    return this.questionnaire;
  }

  getNotebook(role) {
    return this.notebooks[role] || [];
  }
}

export default new DataManager();
