const sequelize = require('./config/database');

async function updateSchema() {
    try {
        await sequelize.query("ALTER TABLE types_logement MODIFY COLUMN nom ENUM('chambre','studio','appartement','villa','duplex') NOT NULL;");
        await sequelize.query("INSERT IGNORE INTO types_logement (nom) VALUES ('villa'), ('duplex');");
        await sequelize.query("ALTER TABLE logements ADD COLUMN publication_status ENUM('en_attente', 'valide', 'rejete') DEFAULT 'en_attente';");
        await sequelize.query("ALTER TABLE logements ADD COLUMN amenities TEXT;");
        await sequelize.query("ALTER TABLE logements ADD COLUMN note_avis DECIMAL(2,1) DEFAULT 0.0;");
        console.log('Schema updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
