import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

declare module "express-session" {
  interface SessionData {
    messages?: string[];
  }
}

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
    /* FIX ME: 😭 failureMsg needed when login fails */
  })
);

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function (req, res) {
    res.redirect('/dashboard');
  });

router.get('/login', (req, res) => { res.render('login', { messages: req.session.messages }) });

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
