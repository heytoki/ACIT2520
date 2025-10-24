import passport from "passport";
import { checkAdmin } from "../middleware/checkAuth";
import fs from "node:fs";

function newDB(){
  const file = fs.readFileSync("database.json")
  let data = JSON.parse(file.toString())["accounts"]
  return data
}

let database: Express.User[] = newDB()

const userModel = {

  /* FIX ME (types) 😭 */
  findOne: (email: string) => {
    database = newDB()
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    return null;
  },
  /* FIX ME (types) 😭 */
  findById: (id: number | string) => {
    database = newDB()
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
};

export { database, userModel };
