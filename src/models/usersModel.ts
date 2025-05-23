import db from "../database/database"

export class UsersModel {
  add(userID: number) {
    try {
      db.prepare("INSERT INTO users (user_id) VALUES (?)").run(userID);
      console.log(`пользователь ${userID} добавлен в бд`);
    } catch (error) {
      console.error(`ошибка при добавлении пользователя в бд: ${error}`);
    }
  }

  kill(userID: number) {
    try {
      db.prepare("UPDATE users SET dead = 1 WHERE user_id = ?").run(userID);
      console.log(`пользователь ${userID} умер`);
    } catch (error) {
      console.log(`ошибка при убийстве пользователя: ${error}`);
    }
  }

  addCgrs(userID: number, count: number, nextCgr: number) {
    try {
      db.prepare("UPDATE users SET cgrs_count = cgrs_count + ?, next_cgr = ? WHERE user_id = ?").run(count, nextCgr, userID);
      console.log(`количество скуренных сигарет у пользователя ${userID} увеличено на ${count}`);
    } catch (error) {
      console.error(`ошибка при увеличении количества сигарет: ${error}`);
    }
  }

  async cgrCount(userID: number): Promise<number | null> {
    try {
      const result = await db.prepare("SELECT cgrs_count FROM users WHERE user_id = ?").get(userID) as {cgrs_count: number};

      return result.cgrs_count;
    } catch (error) {
      console.log(`ошибка при получении количества скуренных сигарет: ${error}`);
      return null;
    }
  }

  async nextCgr(userID: number): Promise<number | null> {
    try {
      const result = await db.prepare("SELECT next_cgr FROM users WHERE user_id = ?").get(userID) as {next_cgr: number};

      return result.next_cgr;
    } catch (error) {
      console.error(`ошибка при получении времени следующей сигареты: ${error}`);
      return null;
    }
  }

  async checkIfUserExists(userID: number): Promise<boolean | null> {
    try {
      const result = await db.prepare("SELECT COUNT(*) AS count FROM users WHERE user_id = ?").get(userID) as { count: number };

      return result.count > 0;
    } catch (error) {
      console.error(`ошибка при проверке на наличие пользователя в бд: ${error}`);
      return null;
    }
  }
}
