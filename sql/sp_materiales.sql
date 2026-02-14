USE manosverdes;

-- =========================
-- MATERIALES - CATEGORIAS
-- =========================

DROP PROCEDURE IF EXISTS sp_admin_categoria_list;
DELIMITER $$
CREATE PROCEDURE sp_admin_categoria_list()
BEGIN
  SELECT id, nombre, icono, activo
    FROM material_categoria
   ORDER BY id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_categoria_get;
DELIMITER $$
CREATE PROCEDURE sp_admin_categoria_get(IN p_id INT)
BEGIN
  SELECT id, nombre, icono, activo
    FROM material_categoria
   WHERE id = p_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_categoria_create;
DELIMITER $$
CREATE PROCEDURE sp_admin_categoria_create(
  IN p_nombre VARCHAR(80),
  IN p_icono VARCHAR(600),
  IN p_activo TINYINT
)
BEGIN
  INSERT INTO material_categoria(nombre, icono, activo)
  VALUES (TRIM(p_nombre), p_icono, IFNULL(p_activo, 1));

  SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_categoria_update;
DELIMITER $$
CREATE PROCEDURE sp_admin_categoria_update(
  IN p_id INT,
  IN p_nombre VARCHAR(80),
  IN p_icono VARCHAR(600),
  IN p_activo TINYINT
)
BEGIN
  UPDATE material_categoria
     SET nombre = TRIM(p_nombre),
         icono = p_icono,
         activo = IFNULL(p_activo, activo)
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_categoria_delete;
DELIMITER $$
CREATE PROCEDURE sp_admin_categoria_delete(IN p_id INT)
BEGIN
  -- Impedir borrar si tiene subcategorías
  IF EXISTS (SELECT 1 FROM material_subcategoria WHERE categoria_id = p_id LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar: categoría tiene subcategorías';
  END IF;

  DELETE FROM material_categoria WHERE id = p_id LIMIT 1;
  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

-- =========================
-- MATERIALES - SUBCATEGORIAS
-- =========================

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_list;
DELIMITER $$
CREATE PROCEDURE sp_admin_subcategoria_list(IN p_categoria_id INT)
BEGIN
  SELECT id, categoria_id, nombre, activo
    FROM material_subcategoria
   WHERE (p_categoria_id IS NULL OR categoria_id = p_categoria_id)
   ORDER BY id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_get;
DELIMITER $$
CREATE PROCEDURE sp_admin_subcategoria_get(IN p_id INT)
BEGIN
  SELECT id, categoria_id, nombre, activo
    FROM material_subcategoria
   WHERE id = p_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_create;
DELIMITER $$
CREATE PROCEDURE sp_admin_subcategoria_create(
  IN p_categoria_id INT,
  IN p_nombre VARCHAR(120),
  IN p_activo TINYINT
)
BEGIN
  INSERT INTO material_subcategoria(categoria_id, nombre, activo)
  VALUES (p_categoria_id, TRIM(p_nombre), IFNULL(p_activo, 1));

  SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_update;
DELIMITER $$
CREATE PROCEDURE sp_admin_subcategoria_update(
  IN p_id INT,
  IN p_categoria_id INT,
  IN p_nombre VARCHAR(120),
  IN p_activo TINYINT
)
BEGIN
  UPDATE material_subcategoria
     SET categoria_id = p_categoria_id,
         nombre = TRIM(p_nombre),
         activo = IFNULL(p_activo, activo)
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_delete;
DELIMITER $$
CREATE PROCEDURE sp_admin_subcategoria_delete(IN p_id INT)
BEGIN
  -- Impedir borrar si tiene materiales
  IF EXISTS (SELECT 1 FROM material WHERE subcategoria_id = p_id LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar: subcategoría tiene materiales';
  END IF;

  DELETE FROM material_subcategoria WHERE id = p_id LIMIT 1;
  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

-- =========================
-- MATERIALES
-- =========================

DROP PROCEDURE IF EXISTS sp_admin_material_list;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_list(
  IN p_subcategoria_id INT,
  IN p_activo TINYINT,
  IN p_elegible TINYINT
)
BEGIN
  SELECT id, subcategoria_id, nombre, icono, elegible, activo
    FROM material
   WHERE (p_subcategoria_id IS NULL OR subcategoria_id = p_subcategoria_id)
     AND (p_activo IS NULL OR activo = p_activo)
     AND (p_elegible IS NULL OR elegible = p_elegible)
   ORDER BY id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_get;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_get(IN p_id INT)
BEGIN
  SELECT id, subcategoria_id, nombre, icono, elegible, activo
    FROM material
   WHERE id = p_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_create;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_create(
  IN p_subcategoria_id INT,
  IN p_nombre VARCHAR(120),
  IN p_icono VARCHAR(1000),
  IN p_elegible TINYINT,
  IN p_activo TINYINT
)
BEGIN
  INSERT INTO material(subcategoria_id, nombre, icono, elegible, activo)
  VALUES (p_subcategoria_id, TRIM(p_nombre), p_icono, IFNULL(p_elegible, 1), IFNULL(p_activo, 1));

  SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_update;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_update(
  IN p_id INT,
  IN p_subcategoria_id INT,
  IN p_nombre VARCHAR(120),
  IN p_icono VARCHAR(1000),
  IN p_elegible TINYINT,
  IN p_activo TINYINT
)
BEGIN
  UPDATE material
     SET subcategoria_id = p_subcategoria_id,
         nombre = TRIM(p_nombre),
         icono = p_icono,
         elegible = IFNULL(p_elegible, elegible),
         activo = IFNULL(p_activo, activo)
   WHERE id = p_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_delete;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_delete(IN p_id INT)
BEGIN
  DELETE FROM material WHERE id = p_id LIMIT 1;
  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

-- =========================
-- MATERIAL INFO
-- =========================

DROP PROCEDURE IF EXISTS sp_admin_material_info_get;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_info_get(IN p_material_id INT)
BEGIN
  SELECT material_id, descripcion, beneficios, proceso, ideas, contaminacion
    FROM material_info
   WHERE material_id = p_material_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_info_upsert;
DELIMITER $$
CREATE PROCEDURE sp_admin_material_info_upsert(
  IN p_material_id INT,
  IN p_descripcion TEXT,
  IN p_beneficios TEXT,
  IN p_proceso TEXT,
  IN p_ideas TEXT,
  IN p_contaminacion TEXT
)
BEGIN
  INSERT INTO material_info(material_id, descripcion, beneficios, proceso, ideas, contaminacion)
  VALUES (p_material_id, p_descripcion, p_beneficios, p_proceso, p_ideas, p_contaminacion)
  ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    beneficios = VALUES(beneficios),
    proceso = VALUES(proceso),
    ideas = VALUES(ideas),
    contaminacion = VALUES(contaminacion);
END$$
DELIMITER ;

-- =========================
-- MASTER TABLE (Hierarchical view)
-- =========================

DROP PROCEDURE IF EXISTS sp_admin_materiales_master;
DELIMITER $$
CREATE PROCEDURE sp_admin_materiales_master()
BEGIN
  SELECT 
    c.id AS categoria_id,
    c.nombre AS categoria_nombre,
    c.icono AS categoria_icono,
    c.activo AS categoria_activo,
    s.id AS subcategoria_id,
    s.nombre AS subcategoria_nombre,
    s.activo AS subcategoria_activo,
    m.id AS material_id,
    m.nombre AS material_nombre,
    m.icono AS material_icono,
    m.elegible AS material_elegible,
    m.activo AS material_activo
  FROM material_categoria c
  LEFT JOIN material_subcategoria s ON s.categoria_id = c.id
  LEFT JOIN material m ON m.subcategoria_id = s.id
  ORDER BY c.id, s.id, m.id;
END$$
DELIMITER ;
