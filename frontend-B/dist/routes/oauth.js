"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get('/auth/github', passport_1.default.authenticate('github', {
    scope: ['user:email'],
    session: false
}));
router.get('/auth/github/callback', passport_1.default.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=github_auth_failed`
}), (req, res) => {
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});
exports.default = router;
//# sourceMappingURL=oauth.js.map