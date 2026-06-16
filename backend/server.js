const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development with images
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes, réessayez plus tard.'
});
app.use('/api/auth/', limiter);

// CORS configuration robuste
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origin non autorisée par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const authRoutes = require('./routes/auth');
const publicationRoutes = require('./routes/publication.routes');
const photoRoutes = require('./routes/photo.routes');
const aiRoutes = require('./routes/ai.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const subscriptionAdminRoutes = require('./routes/subscription.admin.routes');
const messageRoutes = require('./routes/message.routes');

app.get('/', (req, res) => {
  res.json({ message: 'Logitech API — En ligne !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api', photoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/subscriptions', subscriptionAdminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/messages', messageRoutes);

const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    // Synchronisation de la base de données après authentification
    await sequelize.sync({ alter: false });
    console.log('Base de données connectée et synchronisée');
  } catch (err) {
    console.error('Erreur BD :', err.message);
  }

  // Handler pour les routes non trouvées
  app.use(notFoundHandler);

  // Gestionnaire d'erreurs global
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
