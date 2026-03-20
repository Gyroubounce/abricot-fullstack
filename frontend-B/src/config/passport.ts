import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email'],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Récupérer l'email (peut être null si privé)
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error('Aucun email public trouvé sur GitHub. Rendez votre email public dans les paramètres GitHub.'));
        }

        // Chercher l'utilisateur par email ou githubId
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email },
              { githubId: profile.id }
            ]
          }
        });

        if (!user) {
          // Créer un nouveau compte
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || profile.username || email.split('@')[0],
              password: '', // Pas de mot de passe pour OAuth
              githubId: profile.id,
            },
          });
        } else if (!user.githubId) {
          // Lier GitHub à un compte existant
          user = await prisma.user.update({
            where: { id: user.id },
            data: { githubId: profile.id },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Erreur OAuth GitHub:', error);
        return done(error);
      }
    }
  )
);

export default passport;