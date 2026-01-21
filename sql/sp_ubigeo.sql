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
