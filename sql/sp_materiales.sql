 use manosverdes;
DROP PROCEDURE IF EXISTS sp_admin_material_all;
DELIMITER //
CREATE PROCEDURE sp_admin_material_all()
BEGIN
  SELECT
    m.id,
    m.subcategoria_id,
    s.nombre AS subcategoria_nombre,
    s.categoria_id,
    c.nombre AS categoria_nombre,
    m.nombre,
    m.icono,
    m.elegible,
    m.activo
  FROM material m
  INNER JOIN material_subcategoria s ON s.id = m.subcategoria_id
  INNER JOIN material_categoria c ON c.id = s.categoria_id
  WHERE m.activo = 1
    AND s.activo = 1
    AND c.activo = 1
  ORDER BY c.nombre ASC, s.nombre ASC, m.nombre ASC;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_subcategoria_all;
DELIMITER //
CREATE PROCEDURE sp_admin_material_subcategoria_all()
BEGIN
  SELECT
    s.id,
    s.categoria_id,
    c.nombre AS categoria_nombre,
    s.nombre
  FROM material_subcategoria s
  INNER JOIN material_categoria c ON c.id = s.categoria_id
  WHERE s.activo = 1
    AND c.activo = 1
  ORDER BY c.nombre ASC, s.nombre ASC;
END//
DELIMITER ;
