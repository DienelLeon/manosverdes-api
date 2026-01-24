DROP PROCEDURE IF EXISTS sp_admin_material_categoria_all;
DELIMITER //
CREATE PROCEDURE sp_admin_material_categoria_all()
BEGIN
  SELECT id, nombre
  FROM material_categoria
  WHERE activo = 1
  ORDER BY nombre;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_admin_material_subcategoria_all;
DELIMITER //
CREATE PROCEDURE sp_admin_material_subcategoria_all(IN p_categoria_id INT)
BEGIN
  SELECT id, categoria_id, nombre
  FROM material_subcategoria
  WHERE categoria_id = p_categoria_id AND activo = 1
  ORDER BY nombre;
END//
DELIMITER ;
