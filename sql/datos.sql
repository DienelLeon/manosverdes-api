USE manosverdes;

INSERT IGNORE INTO rol (clave, nombre) VALUES
('admin','Administrador'),
('centro','Centro'),
('app','Usuario');

INSERT IGNORE INTO usuario (nombre, apellido_paterno, apellido_materno, email, telefono, fecha_nacimiento, avatar_key, estado, rol_id)
VALUES ('Admin', 'Manos', 'Verdes', 'admin@manosverdes.online', NULL, NULL, NULL, 'activo',
        (SELECT id FROM rol WHERE clave='admin' LIMIT 1));

INSERT IGNORE INTO usuario_auth (usuario_id, password_hash, email_verificado, email_verificado_en)
VALUES (
  (SELECT id FROM usuario WHERE email='admin@manosverdes.online' LIMIT 1),
  '$2a$12$8rnltzOABUcpHIs3ExoaI.8fr.//h6n18N6H/St/M4f7kh02ZbaNm',
  1,
  NOW()
);

-- Insertar padre en master_table: Tipo de Centro (id=100, ordering=0)
INSERT IGNORE INTO master_table (id_master_table, id_master_table_parent, value, description, name, ordering, user_now, state) VALUES
(100, NULL, 'TIPO_CENTRO', 'Clasificación de tipos de centros de acopio', 'Tipo de Centro', 0, 1, 'activo');

-- Insertar hijos en master_table: Tipos de centro específicos (id=101-105, parent=100, ordering=1-5)
INSERT IGNORE INTO master_table (id_master_table, id_master_table_parent, value, description, name, ordering, user_now, state) VALUES
(101, 100, 'CENTRO_ACOPIO', 'Centro de acopio de materiales reciclables', 'Centro de acopio', 1, 1, 'activo'),
(102, 100, 'RECICLADORA_INDUSTRIAL', 'Recicladora industrial', 'Recicladora industrial', 2, 1, 'activo'),
(103, 100, 'MUNICIPAL', 'Centro municipal de reciclaje', 'Municipal', 3, 1, 'activo'),
(104, 100, 'EMPRESA_PRIVADA', 'Empresa privada de reciclaje', 'Empresa privada', 4, 1, 'activo'),
(105, 100, 'ASOCIACION_ONG', 'Asociación u Organización No Gubernamental', 'Asociación / ONG', 5, 1, 'activo');

INSERT IGNORE INTO departamento (nombre) VALUES ('Lima');

INSERT IGNORE INTO provincia (departamento_id, nombre) VALUES (1, 'Lima');

INSERT IGNORE INTO distrito (provincia_id, nombre) VALUES
(1,'Ancón'),
(1,'Ate'),
(1,'Barranco'),
(1,'Breña'),
(1,'Carabayllo'),
(1,'Chaclacayo'),
(1,'Chorrillos'),
(1,'Cieneguilla'),
(1,'Comas'),
(1,'El Agustino'),
(1,'Independencia'),
(1,'Jesús María'),
(1,'La Molina'),
(1,'La Victoria'),
(1,'Lima'),
(1,'Lince'),
(1,'Los Olivos'),
(1,'Lurigancho'),
(1,'Lurín'),
(1,'Magdalena del Mar'),
(1,'Miraflores'),
(1,'Pachacámac'),
(1,'Pucusana'),
(1,'Pueblo Libre'),
(1,'Puente Piedra'),
(1,'Punta Hermosa'),
(1,'Punta Negra'),
(1,'Rímac'),
(1,'San Bartolo'),
(1,'San Borja'),
(1,'San Isidro'),
(1,'San Juan de Lurigancho'),
(1,'San Juan de Miraflores'),
(1,'San Luis'),
(1,'San Martín de Porres'),
(1,'San Miguel'),
(1,'Santa Anita'),
(1,'Santa María del Mar'),
(1,'Santa Rosa'),
(1,'Santiago de Surco'),
(1,'Surquillo'),
(1,'Villa El Salvador'),
(1,'Villa María del Triunfo');



