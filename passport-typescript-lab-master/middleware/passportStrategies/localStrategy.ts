import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

declare global{
    namespace Express{
        interface User{
            id: number | string,
            name: string | undefined,
            email?: string,
            password?: string,
            role?: string
        }
    }
}

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
        message: "Your login details are not valid. Please try again",
      });
  }
);

/*
FIX ME (types) 😭
*/
passport.serializeUser(function (user: Express.User, done: (err: any, id: number | string) => void) {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (id: number | string, done: (err: any, user?: Express.User | false | null) => void) {

  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(new Error( "User not found" ), null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
