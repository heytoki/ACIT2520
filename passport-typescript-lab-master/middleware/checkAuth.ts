import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";

/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/dashboard");
}

export async function getAllSessions(req: Request): Promise<{ sid: string, userId?: string }[]> {
  return new Promise((res, rej) => {
    const store = req.sessionStore;
    if (store?.all) {
      store.all((err, sessions) => {
        if (err) {
          return rej(err);
        }
        if (!sessions) {
          return res([]);
        }
        const allSessions = Object.entries(sessions).map(([sid, session]: [string, any]) => {
          const uid = session.passport?.user;
          return { sid, uid }
        })
        res(allSessions)
      }) // sorry chatgpt'd the mapping part
    }
  })
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if(req.user?.role !== 'admin'){
    return res.redirect("/dashboard");
  }
  return next()
}