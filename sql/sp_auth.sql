USE manosverdes;

DROP PROCEDURE IF EXISTS sp_auth_usuario_obtener_por_email;
DELIMITER $$
CREATE PROCEDURE sp_auth_usuario_obtener_por_email(IN p_email VARCHAR(180))
BEGIN
  SELECT
    u.id, u.nombre, u.apellido_paterno, u.apellido_materno,
    u.email, u.telefono, u.fecha_nacimiento, u.avatar_key,
    u.estado, u.rol_id,
    r.clave AS rol_clave,
    ua.password_hash, ua.email_verificado, ua.email_verificado_en,
    ua.intentos_fallidos, ua.bloqueado_hasta
  FROM usuario u
  JOIN rol r ON r.id = u.rol_id
  LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
  WHERE u.email = p_email
  LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_usuario_crear;
DELIMITER $$
CREATE PROCEDURE sp_auth_usuario_crear(
  IN p_nombre VARCHAR(120),
  IN p_apellido_paterno VARCHAR(120),
  IN p_apellido_materno VARCHAR(120),
  IN p_email VARCHAR(180),
  IN p_telefono VARCHAR(32),
  IN p_fecha_nacimiento DATE,
  IN p_avatar_key VARCHAR(600),
  IN p_password_hash VARCHAR(255),
  IN p_rol_clave VARCHAR(20)
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
    (p_nombre, p_apellido_paterno, NULLIF(p_apellido_materno,''), p_email, p_telefono, p_fecha_nacimiento, p_avatar_key, 'activo', v_rol_id);

  INSERT INTO usuario_auth
    (usuario_id, password_hash, email_verificado, intentos_fallidos, bloqueado_hasta)
  VALUES
    (LAST_INSERT_ID(), p_password_hash, 0, 0, NULL);

  COMMIT;

  SELECT LAST_INSERT_ID() AS usuario_id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_email_verificar;
DELIMITER $$
CREATE PROCEDURE sp_auth_email_verificar(IN p_usuario_id INT)
BEGIN
  UPDATE usuario_auth
     SET email_verificado = 1,
         email_verificado_en = NOW(),
         actualizado_en = NOW()
   WHERE usuario_id = p_usuario_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_password_actualizar;
DELIMITER $$
CREATE PROCEDURE sp_auth_password_actualizar(
  IN p_usuario_id INT,
  IN p_password_hash VARCHAR(255)
)
BEGIN
  UPDATE usuario_auth
     SET password_hash = p_password_hash,
         actualizado_en = NOW()
   WHERE usuario_id = p_usuario_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_intentos_reset;
DELIMITER $$
CREATE PROCEDURE sp_auth_intentos_reset(IN p_usuario_id INT)
BEGIN
  UPDATE usuario_auth
     SET intentos_fallidos = 0,
         bloqueado_hasta = NULL,
         actualizado_en = NOW()
   WHERE usuario_id = p_usuario_id
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_intento_fallido;
DELIMITER $$
CREATE PROCEDURE sp_auth_intento_fallido(
  IN p_usuario_id INT,
  IN p_max_fails INT,
  IN p_lock_minutes INT
)
BEGIN
  UPDATE usuario_auth
     SET intentos_fallidos = LEAST(intentos_fallidos + 1, 255),
         bloqueado_hasta = CASE
           WHEN (intentos_fallidos + 1) >= p_max_fails
             THEN DATE_ADD(NOW(), INTERVAL p_lock_minutes MINUTE)
           ELSE bloqueado_hasta
         END,
         actualizado_en = NOW()
   WHERE usuario_id = p_usuario_id
   LIMIT 1;

  SELECT intentos_fallidos, bloqueado_hasta
    FROM usuario_auth
   WHERE usuario_id = p_usuario_id
   LIMIT 1;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_otp_upsert;
DELIMITER $$
CREATE PROCEDURE sp_auth_otp_upsert(
  IN p_usuario_id INT,
  IN p_tipo VARCHAR(30),
  IN p_codigo_hash CHAR(64),
  IN p_expira_en DATETIME
)
BEGIN
  INSERT INTO codigo_otp (usuario_id, tipo, codigo_hash, expira_en, usado, creado_en)
  VALUES (p_usuario_id, p_tipo, p_codigo_hash, p_expira_en, 0, NOW())
  ON DUPLICATE KEY UPDATE
    codigo_hash = VALUES(codigo_hash),
    expira_en   = VALUES(expira_en),
    usado       = 0,
    creado_en   = NOW();

  SELECT 1 AS ok;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_auth_otp_usar_si_valido;
DELIMITER $$
CREATE PROCEDURE sp_auth_otp_usar_si_valido(
  IN p_usuario_id INT,
  IN p_tipo VARCHAR(30),
  IN p_codigo_hash CHAR(64)
)
BEGIN
  UPDATE codigo_otp
     SET usado = 1,
         usado_en = NOW()
   WHERE usuario_id = p_usuario_id
     AND tipo = p_tipo
     AND codigo_hash = p_codigo_hash
     AND usado = 0
     AND expira_en > NOW()
   LIMIT 1;

  SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_usuario_obtener_por_id;
DELIMITER $$
CREATE PROCEDURE sp_usuario_obtener_por_id(IN p_id INT)
BEGIN
  SELECT 
    u.idusuario,
    u.nombre,
    u.apellido,
    u.email,
    u.numero,
    u.fecha_nac,
    u.avatar_url,
    u.estado,
    u.role_id,
    r.clave AS rol,
    u.creado_en
  FROM usuarios u
  JOIN roles r ON r.idrol = u.role_id
  WHERE u.idusuario = p_id
  LIMIT 1;
END$$
DELIMITER ;