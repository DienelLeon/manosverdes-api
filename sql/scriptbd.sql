DROP DATABASE IF EXISTS manosverdes;
CREATE DATABASE manosverdes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE manosverdes;

-- =========================
-- ROLES
-- =========================
CREATE TABLE rol (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(60) NOT NULL,
  descripcion VARCHAR(255),
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================
-- GEO PERÚ
-- =========================
CREATE TABLE departamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE provincia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departamento_id INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  UNIQUE KEY uq_provincia (departamento_id, nombre),
  FOREIGN KEY (departamento_id) REFERENCES departamento(id)
)ENGINE=InnoDB;

CREATE TABLE distrito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provincia_id INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  UNIQUE KEY uq_distrito (provincia_id, nombre),
  FOREIGN KEY (provincia_id) REFERENCES provincia(id)
)ENGINE=InnoDB; 

-- =========================
-- USUARIO
-- =========================
CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  apellido_paterno VARCHAR(120) NOT NULL,
  apellido_materno VARCHAR(120),
  email VARCHAR(180) NOT NULL UNIQUE,
  telefono VARCHAR(32),
  fecha_nacimiento DATE,
  avatar_key VARCHAR(600),
  estado ENUM('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  rol_id TINYINT UNSIGNED NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES rol(id),
  INDEX idx_usuario_rol (rol_id),
  INDEX idx_usuario_estado (estado)
) ENGINE=InnoDB;

-- =========================
-- AUTH
-- =========================
CREATE TABLE usuario_auth (
  usuario_id INT PRIMARY KEY,
  password_hash VARCHAR(255),
  email_verificado TINYINT NOT NULL DEFAULT 0,
  email_verificado_en DATETIME,
  intentos_fallidos TINYINT UNSIGNED NOT NULL DEFAULT 0,
  bloqueado_hasta DATETIME,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- OTP
-- =========================
CREATE TABLE codigo_otp (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('email_verificacion','password_reset') NOT NULL,
  codigo_hash CHAR(64) NOT NULL,
  expira_en DATETIME NOT NULL,
  usado TINYINT NOT NULL DEFAULT 0,
  usado_en DATETIME NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_otp_usuario_tipo (usuario_id, tipo),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- MATERIALES
-- =========================
CREATE TABLE material_categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  icono VARCHAR(600),
  activo TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE material_subcategoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  activo TINYINT NOT NULL DEFAULT 1,
  UNIQUE KEY uq_subcat (categoria_id,nombre),
  FOREIGN KEY (categoria_id) REFERENCES material_categoria(id)
) ENGINE=InnoDB;

CREATE TABLE material (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subcategoria_id INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  icono VARCHAR(1000),
  elegible TINYINT NOT NULL DEFAULT 1,
  activo TINYINT NOT NULL DEFAULT 1,
  UNIQUE KEY uq_material (subcategoria_id,nombre),
  FOREIGN KEY (subcategoria_id) REFERENCES material_subcategoria(id)
) ENGINE=InnoDB;

-- =========================
-- CENTRO
-- =========================
CREATE TABLE centro_tipo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;


CREATE TABLE centro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  direccion VARCHAR(255),
  distrito_id INT NOT NULL,
  tipo_id INT,
  telefono VARCHAR(32),
  horario VARCHAR(255),
  lat DECIMAL(10,6),
  lng DECIMAL(10,6),
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (distrito_id) REFERENCES distrito(id),
  FOREIGN KEY (tipo_id) REFERENCES centro_tipo(id)
) ENGINE=InnoDB;

CREATE TABLE centro_representante (
  centro_id INT PRIMARY KEY,
  ruc CHAR(11),
  razon_social VARCHAR(180),
  contacto_nombre VARCHAR(120),
  contacto_cargo VARCHAR(80),
  contacto_tel VARCHAR(32),
  contacto_email VARCHAR(180),
  web_url VARCHAR(255),
  FOREIGN KEY (centro_id) REFERENCES centro(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- CENTRO FOTOS (GCP)
-- =========================
CREATE TABLE centro_foto (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centro_id INT NOT NULL,
  foto_key VARCHAR(600) NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (centro_id) REFERENCES centro(id)
    ON DELETE CASCADE,
  INDEX idx_centro_foto (centro_id)
) ENGINE=InnoDB;

-- =========================
-- PRECIOS
-- =========================
CREATE TABLE centro_material_precio (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centro_id INT NOT NULL,
  material_id INT NOT NULL,
  precio_kg DECIMAL(10,2) NOT NULL,
  moneda CHAR(3) NOT NULL DEFAULT 'PEN',
  UNIQUE KEY uq_cmp (centro_id,material_id),
  FOREIGN KEY (centro_id) REFERENCES centro(id),
  FOREIGN KEY (material_id) REFERENCES material(id)
) ENGINE=InnoDB;

-- =========================
-- COMENTARIOS Y RATING
-- =========================
CREATE TABLE centro_comentario (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centro_id INT NOT NULL,
  usuario_id INT NOT NULL,
  texto VARCHAR(600) NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (centro_id) REFERENCES centro(id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

CREATE TABLE centro_rating (
  centro_id INT NOT NULL,
  usuario_id INT NOT NULL,
  estrellas TINYINT NOT NULL,
  PRIMARY KEY (centro_id,usuario_id),
  CHECK (estrellas BETWEEN 1 AND 5),
  FOREIGN KEY (centro_id) REFERENCES centro(id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB;
CREATE TABLE material_info (
  material_id INT PRIMARY KEY,
  descripcion TEXT,
  beneficios TEXT,
  proceso TEXT,
  ideas TEXT,
  contaminacion TEXT,
  FOREIGN KEY (material_id) REFERENCES material(id) ON DELETE CASCADE
) ENGINE=InnoDB;
