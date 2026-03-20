import express from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Initier l'authentification GitHub
router.get(
  '/auth/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })
);

// Callback GitHub
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=github_auth_failed`
  }),
  (req, res) => {
    const user = req.user as any;
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Stocker dans un cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    // Rediriger vers le dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

export default router;