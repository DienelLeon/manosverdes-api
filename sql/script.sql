DROP DATABASE IF EXISTS manosverdes;
CREATE DATABASE manosverdes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE manosverdes;

CREATE TABLE rol (
  id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave       VARCHAR(20)  NOT NULL UNIQUE,
  nombre      VARCHAR(60)  NOT NULL,
  descripcion VARCHAR(255) NULL,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO rol (clave, nombre, descripcion) VALUES
('admin',  'Administrador', 'Acceso total al sistema'),
('centro', 'Centro de Reciclaje', 'Gestiona centros, materiales y contenido'),
('app',    'Usuario App', 'Usuario final de la aplicación');

CREATE TABLE usuario (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(120) NOT NULL,
  apellido_paterno VARCHAR(120) NOT NULL,
  apellido_materno VARCHAR(120) NULL,
  email            VARCHAR(180) NOT NULL UNIQUE,
  telefono         VARCHAR(32)  NULL,
  fecha_nacimiento DATE         NULL,
  avatar_key       VARCHAR(600) NULL,
  estado           ENUM('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  rol_id           TINYINT UNSIGNED NOT NULL,
  creado_en        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (rol_id) REFERENCES rol(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_usuario_rol (rol_id),
  INDEX idx_usuario_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE usuario_auth (
  usuario_id          INT PRIMARY KEY,
  password_hash       VARCHAR(255) NULL,
  email_verificado    TINYINT NOT NULL DEFAULT 0,
  email_verificado_en DATETIME NULL,
  intentos_fallidos   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ultimo_intento_en   DATETIME NULL,
  bloqueado_hasta     DATETIME NULL,
  actualizado_en      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ua_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  INDEX idx_ua_bloqueo (bloqueado_hasta),
  INDEX idx_ua_verificado (email_verificado)
) ENGINE=InnoDB;

CREATE TABLE sesion (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NOT NULL,
  token_hash  CHAR(64) NOT NULL UNIQUE,
  emitido_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_en   DATETIME NOT NULL,
  activo      TINYINT NOT NULL DEFAULT 1,
  cerrado_en  DATETIME NULL,
  ip          VARCHAR(64) NULL,
  user_agent  VARCHAR(255) NULL,
  creado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sesion_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  INDEX idx_sesion_usuario (usuario_id),
  INDEX idx_sesion_expira (expira_en),
  INDEX idx_sesion_activo (activo)
) ENGINE=InnoDB;


CREATE TABLE codigo_otp (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NOT NULL,
  tipo        ENUM('email_verificacion','password_reset') NOT NULL,
  codigo_hash CHAR(64) NOT NULL,
  expira_en   DATETIME NOT NULL,
  usado       TINYINT NOT NULL DEFAULT 0,
  usado_en DATETIME NULL AFTER usado;
  intentos    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  creado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_codigo_otp_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  UNIQUE KEY uq_otp_usuario_tipo (usuario_id, tipo),
  INDEX idx_otp_expira (expira_en),
  INDEX idx_otp_usado (usado)
) ENGINE=InnoDB;
