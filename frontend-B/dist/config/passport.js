"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error('Aucun email public trouvé sur GitHub. Rendez votre email public dans les paramètres GitHub.'));
        }
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { githubId: profile.id }
                ]
            }
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: profile.displayName || profile.username || email.split('@')[0],
                    password: '',
                    githubId: profile.id,
                },
            });
        }
        else if (!user.githubId) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { githubId: profile.id },
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.error('Erreur OAuth GitHub:', error);
        return done(error);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map