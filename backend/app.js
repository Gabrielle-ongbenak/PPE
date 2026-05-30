const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();

const app = express();
app.use(express.json());

const publicationRoutes = require('./routes/publication.routes');
const photoRoutes = require('./routes/photo.routes');

app.use('/api/publications', publicationRoutes);
app.use('/api', photoRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: ' LogiCam API — En ligne !' });
});

sequelize.sync({ alter: false })
  .then(() => console.log(' Base de données connectée'))
  .catch(err => console.error(' Erreur BD :', err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});