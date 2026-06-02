const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const publicationRoutes = require('./routes/publication.routes');
const photoRoutes = require('./routes/photo.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const subscriptionAdminRoutes = require('./routes/subscription.admin.routes');

app.get('/', (req, res) => {
  res.json({ message: 'LogiCam API — En ligne !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api', photoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/subscriptions', subscriptionAdminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Base de données connectée');
  } catch (err) {
    console.error('Erreur BD :', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
