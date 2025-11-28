import { readDb, writeDb } from "../../database/database.js";
import crypto, { randomUUID } from "node:crypto";

export default {
  async findAll() {
    let db = await readDb();
    return db.tips
  },

  async create({ title, userId }) {
    let db = await readDb();
    let newTip = {
      id: randomUUID(),
      title: title,
      userId: userId
    }
    db.tips.push(newTip);
    await writeDb(db);
    return newTip.id
  },

  async update({ id, title, userId }) {
    let db = await readDb();
    let tip = db.tips.find(tip => tip.id == id && tip.userId == userId)
    if (!tip) {
      return false
    }
    tip.title = title
    await writeDb(db)
    return true
  },

  async remove({ id, userId }) {
    let db = await readDb();
    let tip = db.tips.findIndex(tip => tip.userId == userId && tip.id == id)
    if (tip == -1) {
      return false
    }
    db.tips.splice(tip, 1);
    await writeDb(db);
    return true;
  },
};
