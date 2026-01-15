import bcrypt from 'bcryptjs';
import config from '../config';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

class UserStore {
  private users: Map<string, User> = new Map();

  constructor() {
    this.loadUsers();
  }

  private async loadUsers() {
    const users = config.mockUsers.split(',');
    for (const userStr of users) {
      const [username, password, id] = userStr.trim().split(':');
      if (username && password && id) {
        const passwordHash = await bcrypt.hash(password, 10);
        this.users.set(username, { id, username, passwordHash });
      }
    }
  }

  async validateUser(username: string, password: string): Promise<{ isValid: boolean; userId?: string }> {
    const user = this.users.get(username);
    if (!user) {
      return { isValid: false };
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return { isValid, userId: isValid ? user.id : undefined };
  }

  getUser(username: string): User | undefined {
    return this.users.get(username);
  }
}

export const userStore = new UserStore();