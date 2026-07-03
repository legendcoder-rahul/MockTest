import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
            return cb(new Error("No email returned from Google"));
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            // Generate unique username from email prefix
            const emailPrefix = email.split('@')[0];
            const randomStr = Math.floor(100 + Math.random() * 900).toString();
            const username = `${emailPrefix}_${randomStr}`;

            // Generate a random dummy password
            const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);

            user = await userModel.create({
                username,
                email,
                password: dummyPassword,
                targetExam: 'SSC CGL' // Required field in schema
            });
        }
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
  }
));

export default passport;
