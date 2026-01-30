USE manosverdes;

--  CRUD PARA ADMINISTRAR USUARIOS ---

DROP PROCEDURE IF EXISTS sp_admin_usuario_list;
DELIMITER $$
CREATE PROCEDURE sp_admin_usuario_list(
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  SELECT 
    u.id,
    u.nombre,
    u.apellido_paterno,
    u.apellido_materno,
    u.email,
    u.telefono,
    u.fecha_nacimiento,
    u.avatar_key,
    u.estado,
    r.clave AS rol_clave,
    ua.email_verificado,
    ua.intentos_fallidos,
    ua.bloqueado_hasta,
    u.creado_en,
    u.actualizado_en
  FROM usuario u
  JOIN rol r ON r.id = u.rol_id
  LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
  ORDER BY u.id DESC
  LIMIT p_limit OFFSET p_offset;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_usuario_get;
DELIMITER $$
CREATE PROCEDURE sp_admin_usuario_get(IN p_id INT)
BEGIN
  SELECT 
    u.id,
    u.nombre,
    u.apellido_paterno,
    u.apellido_materno,
    u.email,
    u.telefono,
    u.fecha_nacimiento,
    u.avatar_key,
    u.estado,
    r.clave AS rol_clave,
    ua.email_verificado,
    ua.intentos_fallidos,
    ua.bloqueado_hasta,
    u.creado_en,
    u.actualizado_en
  FROM usuario u
  JOIN rol r ON r.id = u.rol_id
  LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
  WHERE u.id = p_id
  LIMIT 1;
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_admin_usuario_get_by_email;
DELIMITER $$
CREATE PROCEDURE sp_admin_usuario_get_by_email(IN p_email VARCHAR(180))
BEGIN
  SELECT u.id, u.email
  FROM usuario u
  WHERE u.email = p_email
  LIMIT 1;
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_admin_usuario_create;
DELIMITER $$
CREATE PROCEDURE sp_admin_usuario_create(
  IN p_nombre VARCHAR(120),
  IN p_apellido_paterno VARCHAR(120),
  IN p_apellido_materno VARCHAR(120),
  IN p_email VARCHAR(180),
  IN p_telefono VARCHAR(32),
  IN p_fecha_nacimiento DATE,
  IN p_estado VARCHAR(20),
  IN p_rol_clave VARCHAR(20),
  IN p_password_hash VARCHAR(255),
  IN p_email_verificado TINYINT
)
BEGIN
  DECLARE v_rol_id TINYINT UNSIGNED;

  SELECT id INTO v_rol_id
  FROM rol
  WHERE clave = p_rol_clave
  LIMIT 1;

  IF v_rol_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol inválido';
  END IF;

  START TRANSACTION;

  INSERT INTO usuario
    (nombre, apellido_paterno, apellido_materno, email, telefono, fecha_nacimiento, avatar_key, estado, rol_id)
  VALUES
    (p_nombre, p_apellido_paterno, NULLIF(p_apellido_materno,''), p_email, p_telefono, p_fecha_nacimiento, NULL, p_estado, v_rol_id);

  INSERT INTO usuario_auth
    (usuario_id, password_hash, email_verificado, email_verificado_en, intentos_fallidos, bloqueado_hasta)
  VALUES
    (LAST_INSERT_ID(),
     p_password_hash,
     IFNULL(p_email_verificado,0),
     CASE WHEN IFNULL(p_email_verificado,0)=1 THEN NOW() ELSE NULL END,
     0,
     NULL);

  COMMIT;

  SELECT LAST_INSERT_ID() AS usuario_id;
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_admin_usuario_update;
DELIMITER $$
CREATE PROCEDURE sp_admin_usuario_update(
  IN p_id INT,
  IN p_nombre VARCHAR(120),
  IN p_apellido_paterno VARCHAR(120),
  IN p_apellido_materno VARCHAR(120),
  IN p_telefono VARCHAR(32),
  IN p_fecha_nacimiento DATE,
  IN p_estado VARCHAR(20),
  IN p_rol_clave VARCHAR(20)
)
BEGIN
  DECLARE v_rol_id TINYINT UNSIGNED;

  IF p_rol_clave IS NOT NULL THEN
    SELECT id INTO v_rol_id
    FROM rol
    WHERE clave = p_rol_clave
    LIMIT 1;

    IF v_rol_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol inválido';
    END IF;
  END IF;

  UPDATE usuario
     SET nombre = COALESCE(p_nombre, nombre),
         apellido_paterno = COALESCE(p_apellido_paterno, apellido_paterno),
         apellido_materno = CASE WHEN p_apellido_materno IS NULL THEN apellido_materno ELSE p_apellido_materno END,
         telefono = CASE WHEN p_telefono IS NULL THEN telefono ELSE p_telefono END,
         fecha_nacimiento = CASE WHEN p_fecha_nacimiento IS NULL THEN fecha_nacimiento ELSE p_fecha_nacimiento END,
         estado = COALESCE(p_estado, estado),
         rol_id = COALESCE(v_rol_id, rol_id),
         actualizado_en = NOW()
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_usuario_set_estado;
DELIMITER $$
CREATE PROCEDURE sp_admin_usuario_set_estado(
  IN p_id INT,
  IN p_estado VARCHAR(20)
)
BEGIN
  UPDATE usuario
     SET estado = p_estado,
         actualizado_en = NOW()
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

USE manosverdes;

DROP PROCEDURE IF EXISTS sp_admin_usuario_centro_search;
DELIMITER $$

CREATE PROCEDURE sp_admin_usuario_centro_search(
  IN p_q VARCHAR(180),
  IN p_limit INT
)
BEGIN
  DECLARE v_limit INT DEFAULT 20;

  SET v_limit = IFNULL(p_limit, 20);

  SELECT
    u.id,
    u.email,
    u.nombre,
    u.apellido_paterno,
    u.apellido_materno,
    u.telefono,
    u.estado,
    u.creado_en
  FROM usuario u
  JOIN rol r ON r.id = u.rol_id
  WHERE r.clave = 'centro'
    AND (
      p_q IS NULL OR TRIM(p_q) = '' OR
      u.email LIKE CONCAT('%', TRIM(p_q), '%')
    )
  ORDER BY u.id DESC
  LIMIT v_limit;
END$$

DELIMITER ;

USE manosverdes;

-- =========================
-- DEPARTAMENTO
-- =========================

DROP PROCEDURE IF EXISTS sp_ubigeo_departamento_list;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_departamento_list()
BEGIN
  SELECT id, nombre
    FROM departamento
   ORDER BY nombre;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_departamento_get;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_departamento_get(IN p_id INT)
BEGIN
  SELECT id, nombre
    FROM departamento
   WHERE id = p_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_departamento_create;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_departamento_create(IN p_nombre VARCHAR(120))
BEGIN
  INSERT INTO departamento(nombre)
  VALUES (TRIM(p_nombre));

  SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_departamento_update;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_departamento_update(
  IN p_id INT,
  IN p_nombre VARCHAR(120)
)
BEGIN
  UPDATE departamento
     SET nombre = TRIM(p_nombre)
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_departamento_delete;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_departamento_delete(IN p_id INT)
BEGIN
  -- Impedir borrar si tiene provincias
  IF EXISTS (SELECT 1 FROM provincia WHERE departamento_id = p_id LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar: departamento tiene provincias';
  END IF;

  DELETE FROM departamento WHERE id = p_id LIMIT 1;
  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;


-- =========================
-- PROVINCIA
-- =========================

DROP PROCEDURE IF EXISTS sp_ubigeo_provincia_list;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_provincia_list(IN p_departamento_id INT)
BEGIN
  SELECT id, departamento_id, nombre
    FROM provincia
   WHERE (p_departamento_id IS NULL OR departamento_id = p_departamento_id)
   ORDER BY nombre;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_provincia_get;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_provincia_get(IN p_id INT)
BEGIN
  SELECT id, departamento_id, nombre
    FROM provincia
   WHERE id = p_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_provincia_create;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_provincia_create(
  IN p_departamento_id INT,
  IN p_nombre VARCHAR(120)
)
BEGIN
  INSERT INTO provincia(departamento_id, nombre)
  VALUES (p_departamento_id, TRIM(p_nombre));

  SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_provincia_update;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_provincia_update(
  IN p_id INT,
  IN p_departamento_id INT,
  IN p_nombre VARCHAR(120)
)
BEGIN
  UPDATE provincia
     SET departamento_id = p_departamento_id,
         nombre = TRIM(p_nombre)
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_provincia_delete;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_provincia_delete(IN p_id INT)
BEGIN
  -- Impedir borrar si tiene distritos
  IF EXISTS (SELECT 1 FROM distrito WHERE provincia_id = p_id LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar: provincia tiene distritos';
  END IF;

  DELETE FROM provincia WHERE id = p_id LIMIT 1;
  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;


-- =========================
-- DISTRITO
-- =========================

DROP PROCEDURE IF EXISTS sp_ubigeo_distrito_list;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_distrito_list(IN p_provincia_id INT)
BEGIN
  SELECT id, provincia_id, nombre
    FROM distrito
   WHERE (p_provincia_id IS NULL OR provincia_id = p_provincia_id)
   ORDER BY nombre;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_distrito_get;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_distrito_get(IN p_id INT)
BEGIN
  SELECT id, provincia_id, nombre
    FROM distrito
   WHERE id = p_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_distrito_create;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_distrito_create(
  IN p_provincia_id INT,
  IN p_nombre VARCHAR(120)
)
BEGIN
  INSERT INTO distrito(provincia_id, nombre)
  VALUES (p_provincia_id, TRIM(p_nombre));

  SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_distrito_update;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_distrito_update(
  IN p_id INT,
  IN p_provincia_id INT,
  IN p_nombre VARCHAR(120)
)
BEGIN
  UPDATE distrito
     SET provincia_id = p_provincia_id,
         nombre = TRIM(p_nombre)
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ubigeo_distrito_delete;
DELIMITER $$
CREATE PROCEDURE sp_ubigeo_distrito_delete(IN p_id INT)
BEGIN
  -- Impedir borrar si está usado por un centro
  IF EXISTS (SELECT 1 FROM centro WHERE distrito_id = p_id LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar: distrito está usado por centros';
  END IF;

  DELETE FROM distrito WHERE id = p_id LIMIT 1;
  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;


