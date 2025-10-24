import express from "express";
const router = express.Router();
import { checkAdmin, ensureAuthenticated, getAllSessions } from "../middleware/checkAuth";


router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", checkAdmin, async (req, res) => {
  const sessions = await getAllSessions(req);
  res.render("admin", { sessions });
})

router.post("/admin/revoke/:sid", checkAdmin, (req, res) => {
  const sid = req.params.sid
  req.sessionStore.destroy(sid, (err) => {
    if(err){
      console.log(err)
    }
    res.redirect("/admin")
  })
})

export default router;
