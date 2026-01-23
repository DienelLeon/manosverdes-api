DELIMITER //

-- CATEGORÍA
DROP PROCEDURE IF EXISTS sp_admin_categoria_list;//
CREATE PROCEDURE sp_admin_categoria_list()
BEGIN
  SELECT id, nombre, icono, activo FROM material_categoria ORDER BY nombre;
END;//

DROP PROCEDURE IF EXISTS sp_admin_categoria_get;//
CREATE PROCEDURE sp_admin_categoria_get(IN p_id INT)
BEGIN
  SELECT id, nombre, icono, activo FROM material_categoria WHERE id = p_id LIMIT 1;
END;//

DROP PROCEDURE IF EXISTS sp_admin_categoria_create;//
CREATE PROCEDURE sp_admin_categoria_create(
  IN p_nombre VARCHAR(80), IN p_icono VARCHAR(600), IN p_activo TINYINT)
BEGIN
  INSERT INTO material_categoria (nombre, icono, activo) VALUES (p_nombre, p_icono, p_activo);
  SELECT LAST_INSERT_ID() AS id;
END;//

DROP PROCEDURE IF EXISTS sp_admin_categoria_update;//
CREATE PROCEDURE sp_admin_categoria_update(
  IN p_id INT, IN p_nombre VARCHAR(80), IN p_icono VARCHAR(600), IN p_activo TINYINT)
BEGIN
  UPDATE material_categoria SET nombre = p_nombre, icono = p_icono, activo = p_activo WHERE id = p_id;
  SELECT ROW_COUNT() AS affected;
END;//

DROP PROCEDURE IF EXISTS sp_admin_categoria_delete;//
CREATE PROCEDURE sp_admin_categoria_delete(IN p_id INT)
BEGIN
  DELETE FROM material_categoria WHERE id = p_id;
  SELECT ROW_COUNT() AS affected;
END;//

-- SUBCATEGORÍA
DROP PROCEDURE IF EXISTS sp_admin_subcategoria_list;//
CREATE PROCEDURE sp_admin_subcategoria_list(IN p_categoria_id INT)
BEGIN
  SELECT id, categoria_id, nombre, activo FROM material_subcategoria
    WHERE (p_categoria_id IS NULL OR categoria_id = p_categoria_id)
    ORDER BY nombre;
END;//

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_get;//
CREATE PROCEDURE sp_admin_subcategoria_get(IN p_id INT)
BEGIN
  SELECT id, categoria_id, nombre, activo FROM material_subcategoria WHERE id = p_id LIMIT 1;
END;//

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_create;//
CREATE PROCEDURE sp_admin_subcategoria_create(
  IN p_categoria_id INT, IN p_nombre VARCHAR(120), IN p_activo TINYINT)
BEGIN
  INSERT INTO material_subcategoria (categoria_id, nombre, activo) VALUES (p_categoria_id, p_nombre, p_activo);
  SELECT LAST_INSERT_ID() AS id;
END;//

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_update;//
CREATE PROCEDURE sp_admin_subcategoria_update(
  IN p_id INT, IN p_categoria_id INT, IN p_nombre VARCHAR(120), IN p_activo TINYINT)
BEGIN
  UPDATE material_subcategoria SET categoria_id = p_categoria_id, nombre = p_nombre, activo = p_activo WHERE id = p_id;
  SELECT ROW_COUNT() AS affected;
END;//

DROP PROCEDURE IF EXISTS sp_admin_subcategoria_delete;//
CREATE PROCEDURE sp_admin_subcategoria_delete(IN p_id INT)
BEGIN
  DELETE FROM material_subcategoria WHERE id = p_id;
  SELECT ROW_COUNT() AS affected;
END;//

-- MATERIAL
DROP PROCEDURE IF EXISTS sp_admin_material_list;//
CREATE PROCEDURE sp_admin_material_list(
  IN p_subcategoria_id INT, IN p_activo TINYINT, IN p_elegible TINYINT, IN p_q VARCHAR(255))
BEGIN
  SELECT m.id,
         m.subcategoria_id,
         s.nombre AS subcategoria_nombre,
         s.categoria_id,
         c.nombre AS categoria_nombre,
         m.nombre,
         m.icono,
         m.elegible,
         m.activo
  FROM material m
  LEFT JOIN material_subcategoria s ON s.id = m.subcategoria_id
  LEFT JOIN material_categoria c ON c.id = s.categoria_id
  WHERE (p_subcategoria_id IS NULL OR m.subcategoria_id = p_subcategoria_id)
    AND (p_activo IS NULL OR m.activo = p_activo)
    AND (p_elegible IS NULL OR m.elegible = p_elegible)
    AND (
      p_q IS NULL OR p_q = ''
      OR (p_q REGEXP '^[0-9]+$' AND m.id = CAST(p_q AS UNSIGNED))
      OR m.nombre LIKE CONCAT('%', p_q, '%')
      OR s.nombre LIKE CONCAT('%', p_q, '%')
      OR c.nombre LIKE CONCAT('%', p_q, '%')
    )
  ORDER BY m.nombre;
END;//

DROP PROCEDURE IF EXISTS sp_admin_material_get;//
CREATE PROCEDURE sp_admin_material_get(IN p_id INT)
BEGIN
  SELECT m.id,
         m.subcategoria_id,
         s.nombre AS subcategoria_nombre,
         s.categoria_id,
         c.nombre AS categoria_nombre,
         m.nombre,
         m.icono,
         m.elegible,
         m.activo
  FROM material m
  LEFT JOIN material_subcategoria s ON s.id = m.subcategoria_id
  LEFT JOIN material_categoria c ON c.id = s.categoria_id
  WHERE m.id = p_id
  LIMIT 1;
END;//

DROP PROCEDURE IF EXISTS sp_admin_material_create;//
CREATE PROCEDURE sp_admin_material_create(
  IN p_subcategoria_id INT, IN p_nombre VARCHAR(120), IN p_icono VARCHAR(1000), IN p_elegible TINYINT, IN p_activo TINYINT)
BEGIN
  INSERT INTO material (subcategoria_id, nombre, icono, elegible, activo) VALUES (p_subcategoria_id, p_nombre, p_icono, p_elegible, p_activo);
  SELECT LAST_INSERT_ID() AS id;
END;//

DROP PROCEDURE IF EXISTS sp_admin_material_update;//
CREATE PROCEDURE sp_admin_material_update(
  IN p_id INT, IN p_subcategoria_id INT, IN p_nombre VARCHAR(120), IN p_icono VARCHAR(1000), IN p_elegible TINYINT, IN p_activo TINYINT)
BEGIN
  UPDATE material SET subcategoria_id = p_subcategoria_id, nombre = p_nombre, icono = p_icono, elegible = p_elegible, activo = p_activo WHERE id = p_id;
  SELECT ROW_COUNT() AS affected;
END;//

DROP PROCEDURE IF EXISTS sp_admin_material_delete;//
CREATE PROCEDURE sp_admin_material_delete(IN p_id INT)
BEGIN
  DELETE FROM material WHERE id = p_id;
  SELECT ROW_COUNT() AS affected;
END;//

-- MATERIAL INFO
DROP PROCEDURE IF EXISTS sp_admin_material_info_get;//
CREATE PROCEDURE sp_admin_material_info_get(IN p_material_id INT)
BEGIN
  SELECT material_id, descripcion, beneficios, proceso, ideas, contaminacion FROM material_info WHERE material_id = p_material_id LIMIT 1;
END;//

DROP PROCEDURE IF EXISTS sp_admin_material_info_upsert;//
CREATE PROCEDURE sp_admin_material_info_upsert(
  IN p_material_id INT, IN p_descripcion TEXT, IN p_beneficios TEXT, IN p_proceso TEXT, IN p_ideas TEXT, IN p_contaminacion TEXT)
BEGIN
  IF EXISTS (SELECT 1 FROM material_info WHERE material_id = p_material_id) THEN
    UPDATE material_info SET descripcion = p_descripcion, beneficios = p_beneficios, proceso = p_proceso, ideas = p_ideas, contaminacion = p_contaminacion WHERE material_id = p_material_id;
  ELSE
    INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion) VALUES (p_material_id, p_descripcion, p_beneficios, p_proceso, p_ideas, p_contaminacion);
  END IF;
END;//

DROP PROCEDURE IF EXISTS sp_admin_material_info_list;//
CREATE PROCEDURE sp_admin_material_info_list()
BEGIN
  SELECT mi.material_id,
         m.nombre AS material_nombre,
         m.icono AS material_icono,
         s.id AS subcategoria_id,
         s.nombre AS subcategoria_nombre,
         c.id AS categoria_id,
         c.nombre AS categoria_nombre,
         mi.descripcion,
         mi.beneficios,
         mi.proceso,
         mi.ideas,
         mi.contaminacion
  FROM material_info mi
  INNER JOIN material m ON m.id = mi.material_id
  LEFT JOIN material_subcategoria s ON s.id = m.subcategoria_id
  LEFT JOIN material_categoria c ON c.id = s.categoria_id
  ORDER BY m.nombre;
END;//

DELIMITER ;
