// server/utils/settingsManager.js
const fs = require('fs');
const path = require('path');
const { DEFAULT_GLOBAL_PROMPT } = require('../config/constants');
const { defaultRoles } = require('../config/roles');

class SettingsManager {
  constructor() {
    this.userDir = path.join(__dirname, '../../users');
  }

  getSettingsFilePath(userId) {
    return path.join(this.userDir, userId, 'settings.json');
  }

  getSettings(userId) {
    const filePath = this.getSettingsFilePath(userId);
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        console.error("Errore nella lettura delle impostazioni:", err);
      }
    }
    // Se il file non esiste, crea le impostazioni di default
    const defaultSettings = {
      globalPrompt: DEFAULT_GLOBAL_PROMPT,
      experts: defaultRoles.map(role => ({
        name: role.name,
        description: role.description
      }))
    };
    this.updateSettings(userId, defaultSettings);
    return defaultSettings;
  }

  updateSettings(userId, settings) {
    const filePath = this.getSettingsFilePath(userId);
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  }
}

module.exports = new SettingsManager();
