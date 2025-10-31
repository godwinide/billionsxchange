const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');
const layouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

// Load env vars
dotenv.config();

// Passport config
require('../config/passport')(passport);

// Cache the Express app globally to prevent re-initialization
// Use global object to persist across serverless function invocations
global.app = global.app || null;

const createApp = async () => {
    if (global.app) {
        return global.app;
    }

    // Connect to database once
    await connectDB();

    const app = express();

    // View engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    app.set('layout', 'layout');
    app.use(layouts);

    // Static files
    app.use(express.static(path.join(__dirname, '../public')));

    // Body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // CORS
    app.use(cors());

    // Session with MongoDB store
    app.use(session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            touchAfter: 24 * 3600,
            crypto: {
                secret: process.env.SESSION_SECRET || 'secret'
            }
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        }
    }));

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Flash messages
    app.use(flash());

    // Global variables
    app.use(function (req, res, next) {
        res.locals.siteName = "Billions Xchange";
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });

    // Routes
    app.use('/', require('../routes/index'));
    app.use('/', require('../routes/auth'));
    app.use('/', require('../routes/user'));
    app.use('/admin', require('../routes/admin/auth'));
    app.use('/admin', require('../routes/admin/index'));

    // Cache the app globally
    global.app = app;
    
    return app;
};

// Export for Vercel serverless
module.exports = async (req, res) => {
    const expressApp = await createApp();
    expressApp(req, res);
};