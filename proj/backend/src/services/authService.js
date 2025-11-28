import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { readDb, writeDb } from "../../database/database.js";

const JWT_SECRET = "secret";

export default {
  async register({ username, password, profilePicture }) {
    let db = await readDb();
    if (db.users.some(user => user.username == username)) {
      let err = new Error("Username already taken");
      err.statusCode = 400;
      throw err;
    }
    let newUser = {
      id: crypto.randomUUID(),
      username: username,
      password: password,
      profilePicture: profilePicture
    }
    db.users.push(newUser);
    await writeDb(db);
    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        profilePicture: newUser.profilePicture
      }
    };
  },

  async login({ username, password }) {
    let db = await readDb();
    let user = db.users.find(user => user.username == username && user.password == password)
    if (!user) {
      let err = new Error("Invalid username or password");
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" })
    return {
      token: token,
      user: {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
      }
    };
  },
};
