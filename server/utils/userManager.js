// server/utils/userManager.js
import fs from 'fs';
import path from 'path';

class UserManager {
  constructor() {
    // Definisce la cartella degli utenti come "users" nella root del progetto
    this.userDir = path.join(process.cwd(), 'users');
    if (!fs.existsSync(this.userDir)) {
      fs.mkdirSync(this.userDir, { recursive: true });
    }
  }

  getUserFilePath(userId) {
    return path.join(this.userDir, userId, 'profile.json');
  }

  login(userId) {
    const userPath = path.join(this.userDir, userId);
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true });
    }
    const profilePath = this.getUserFilePath(userId);
    if (!fs.existsSync(profilePath)) {
      const defaultProfile = { userId, name: "", age: "", gender: "Non specificato", bio: "" };
      fs.writeFileSync(profilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }
    return true;
  }

  getProfile(userId) {
    const profilePath = this.getUserFilePath(userId);
    if (fs.existsSync(profilePath)) {
      return JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    }
    return {};
  }

  updateProfile(userId, profile) {
    const profilePath = this.getUserFilePath(userId);
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2), 'utf8');
    return true;
  }
}

export default new UserManager();
