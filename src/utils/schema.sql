
-- Création de la table des voyages (trajets)
CREATE TABLE voyages (
  id SERIAL PRIMARY KEY,
  departure VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_seats INTEGER NOT NULL,
  duration VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_voyages_departure ON voyages(departure);
CREATE INDEX idx_voyages_destination ON voyages(destination);
CREATE INDEX idx_voyages_date ON voyages(date);

-- Trigger pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON voyages
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Insertion de quelques trajets prédéfinis
INSERT INTO voyages (departure, destination, date, time, price, available_seats, duration)
VALUES
  ('Tunis', 'Sousse', '2023-06-15', '08:00', 15.00, 40, '2h 30min'),
  ('Tunis', 'Sfax', '2023-06-15', '09:30', 25.00, 35, '4h 15min'),
  ('Sousse', 'Monastir', '2023-06-15', '10:00', 5.00, 45, '45min'),
  ('Sfax', 'Gabès', '2023-06-15', '11:15', 15.00, 38, '1h 45min'),
  ('Tunis', 'Bizerte', '2023-06-16', '07:30', 10.00, 42, '1h 15min');

-- Table pour les utilisateurs admin (simplifiée pour l'exemple)
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insertion d'un utilisateur admin par défaut (mot de passe: admin123)
-- En production, utilisez un hash sécurisé, pas un mot de passe en clair
INSERT INTO admin_users (username, password_hash, full_name, email)
VALUES ('admin', '$2a$10$rRyAUmQT9wNjZJzTZI5cY.j4X0q.PxSoH2VRgaaK4Pnz.Y7zUoD1e', 'Administrateur', 'admin@tunisbus.com');
