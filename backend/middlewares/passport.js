import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import pool from '../config.js'; // Adjust as per your configuration
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'new_secret_key',
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const userQuery = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await pool.query(userQuery, [jwt_payload.sub]);
            const user = rows[0];

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport;