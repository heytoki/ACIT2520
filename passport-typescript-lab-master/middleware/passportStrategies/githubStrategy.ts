import { Strategy as GitHubStrategy } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { PassportStrategy } from '../../interfaces/index';
import fs from "node:fs/promises";
import { Request } from 'express';
import passport, { Profile } from 'passport';
import dotenv from "dotenv"
dotenv.config();

interface accountsList {
    accounts: Express.User[]
}

const githubStrategy: GitHubStrategy = new GitHubStrategy({
    clientID: process.env.CLIENTID!,
    clientSecret: process.env.CLIENTSECRET!,
    callbackURL: "http://localhost:8000/auth/auth/github/callback",
    passReqToCallback: true
},

    /* FIX ME 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        let data: accountsList = { accounts: [] };
        try {
            const file = await fs.readFile('database.json');
            data = JSON.parse(file.toString())
        }
        catch {
            data = { accounts: [] }
        }
        let user = data.accounts.find(acc => acc.id + "git" === profile.id);

        if (!user) {
            const userProfile = {
                id: profile.id + "git",
                name: profile.username,
                role: "user"
            }
            data.accounts.push(userProfile)
            await fs.writeFile('database.json', JSON.stringify(data))
            user = userProfile
        }
        return done(null, user)
    }
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;

