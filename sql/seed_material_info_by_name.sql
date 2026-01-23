-- Seed material_info by matching material.nombre to avoid FK id mismatches
USE manosverdes;

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Botella PET transparente para bebidas. Fácil de compactar y reciclar.',
 'Reciclable en PET para fibra o envases',
 'Clasificar por color, limpiar y compactar antes de entrega',
 'Reutilizar como contenedores domésticos; donar a centros de acopio',
 'Baja contaminación si está vacía y enjuagada'
FROM material m
WHERE m.nombre = 'Botella PET transparente'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Botella PET de color, similar a PET transparente pero con pigmentos.',
 'Reciclable aunque el color afecta algunas vías de reciclaje',
 'Separar por color cuando sea posible; limpiar y compactar',
 'Usos en manualidades o proyectos de arquitectura con botellas',
 'Pigmentos pueden limitar usos en reciclaje de alta calidad'
FROM material m
WHERE m.nombre = 'Botella PET de color'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Bolsa HDPE (polietileno de alta densidad). Bolsas y film resistente.',
 'Alta tasa de reciclaje para productos plásticos y reciclados plásticos rígidos',
 'Limpiar de residuos y compactar en fardos',
 'Recolectar en puntos limpios para reciclaje industrial',
 'Si contiene residuos puede contaminar cargas'
FROM material m
WHERE m.nombre = 'Bolsa HDPE'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Tubería PVC usada en construcción y saneamiento.',
 'Material recuperable para procesos específicos de reciclaje de PVC',
 'Separar de otros materiales, cortar en tramos y llevar a reciclador especializado',
 'Reusar en obras pequeñas o en jardinería para riego',
 'PVC con aditivos puede liberar contaminantes si se quema'
FROM material m
WHERE m.nombre = 'Tubería PVC' OR m.nombre = 'Tubería PVC'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Botella de vidrio clara. Envases de beverages y frascos.',
 'Reciclable indefinidamente en nuevas botellas o vidrio triturado',
 'Separar por color cuando tienda lo pida; retirar tapas metálicas',
 'Reutilizar frascos como envases o decoración',
 'Vidrio roto puede causar riesgos físicos pero no contamina químicamente'
FROM material m
WHERE m.nombre = 'Botella clara' OR m.nombre = 'Botella de vidrio clara'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Frasco transparente de vidrio (uso doméstico y farmacéutico).',
 'Mismo tratamiento que botellas de vidrio; alto valor en reciclaje',
 'Lavar y clasificar por color; separar tapas',
 'Reutilizar como contenedor para alimentos secos',
 'Vidrio contaminado con residuos químicos requiere manejo especial'
FROM material m
WHERE m.nombre = 'Frasco transparente'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Botella verde de vidrio.',
 'Reciclable en corridas de vidrio verde; buen valor para recicladores',
 'Separar por color y limpiar',
 'Reutilizar en huertos o manualidades',
 'Vidrio sucio contamina cargas de reciclaje'
FROM material m
WHERE m.nombre = 'Botella verde'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Periódico impreso. Papel con tintas y anuncios.',
 'Reciclable para pasta de papel y cartón',
 'Quitar partes no papel (plásticos, metal); compactar',
 'Usar como compostador o material de embalaje',
 'Papel muy sucio reduce calidad de reciclaje'
FROM material m
WHERE m.nombre = 'Periódico'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Cartón corrugado. Cajas y embalajes.',
 'Alta reutilización y reciclaje; se convierte en nuevo cartón',
 'Desarmar cajas, quitar cintas y compactar',
 'Reusar cajas para mudanzas o almacenamiento',
 'Humedad y aceites degradan la fibra'
FROM material m
WHERE m.nombre = 'Cartón de caja' OR m.nombre = 'Cartón corrugado'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Papel de oficina blanco. Hojas y folletos.',
 'Reciclable en papel de oficina y cartón',
 'Separar de papel contaminado; empaquetar limpio',
 'Reutilizar para notas internas o donaciones',
 'Papel con soportes plásticos/metal contamina'
FROM material m
WHERE m.nombre = 'Papel de oficina' OR m.nombre = 'Papel blanco'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Lata de aluminio. Envase de bebidas y alimentos.',
 'Altamente reciclable y de alto valor económico',
 'Aplastar y separar de otros metales; llevar a centro de reciclaje',
 'Reutilizar para manualidades o pequeños recipientes',
 'Restos de alimentos pueden contaminar si no se limpian'
FROM material m
WHERE m.nombre = 'Lata de aluminio'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Papel aluminio. Láminas y envolturas.',
 'Reciclable si está limpio y separado de plásticos',
 'Limpiar restos y compactar en bola para facilitar reciclaje',
 'Reutilizar para cocinar o manualidades',
 'Restos de comida contaminan el flujo de reciclaje'
FROM material m
WHERE m.nombre = 'Papel aluminio'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Tubo de acero. Material estructural y de instalaciones.',
 'Acero 100% reciclable con amplio mercado',
 'Separar de otros metales y recubrimientos; entregar a chatarrería',
 'Reusar en estructuras o mobiliario',
 'Recubrimientos pueden requerir tratamiento previo'
FROM material m
WHERE m.nombre = 'Tubo de acero' OR m.nombre = 'Tubo de acero'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Cable de cobre. Conductores eléctricos con alto valor.',
 'Cobre tiene alto precio y valor de recuperación',
 'Retirar aislamiento cuando sea posible; entregar a chatarrería',
 'Reutilizar como conductor o vender a reciclador',
 'Aislamientos plásticos deben eliminarse para evitar contaminación'
FROM material m
WHERE m.nombre = 'Cable de cobre'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Gasas quirúrgicas contaminadas. Residuos biomédicos peligrosos.',
 'NO ACEPTAR para acopio; requieren gestión como residuo sanitario',
 'Manipular con EPP; disposición por gestor autorizado',
 'No reutilizar; enviar a tratamiento especializado (incineración o autoclave)',
 'Alta contaminación biológica, riesgo para salud'
FROM material m
WHERE m.nombre = 'Gasas quirúrgicas contaminadas'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Agujas y jeringas. Residuos punzocortantes y biológicos.',
 'NO ACEPTAR en acopios; manejar como residuo peligroso',
 'Utilizar contenedores puncture-proof y gestores autorizados',
 'No manipular; transporte y disposición por empresa autorizada',
 'Riesgo de infección y contaminación biológica'
FROM material m
WHERE m.nombre = 'Agujas y jeringas'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Sangre y fluidos corporales. Residuos clínicos peligrosos.',
 'NO ACEPTAR; gestionar como residuo hospitalario',
 'Recolección por sistema sanitario; tratamiento especializado',
 'N/A',
 'Alto riesgo biológico que requiere contención y tratamiento'
FROM material m
WHERE m.nombre = 'Sangre y fluidos corporales'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Ácido sulfúrico. Producto químico corrosivo y peligroso.',
 'NO ACEPTAR en acopios; gestiona por gestor de residuos químicos',
 'Almacenamiento en recipientes adecuados; transportar por empresa autorizada',
 'N/A',
 'Alta contaminación química y riesgo de corrosión'
FROM material m
WHERE m.nombre = 'Ácido sulfúrico' OR m.nombre = 'Ácido sulfúrico'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

INSERT INTO material_info (material_id, descripcion, beneficios, proceso, ideas, contaminacion)
SELECT m.id,
 'Pesticidas. Productos fitosanitarios tóxicos.',
 'NO ACEPTAR; tratamiento por gestor de residuos peligrosos',
 'No verter; devolver a puntos de recogida especializados',
 'N/A',
 'Contaminación química significativa del suelo y agua'
FROM material m
WHERE m.nombre = 'Pesticidas'
  AND NOT EXISTS (SELECT 1 FROM material_info mi WHERE mi.material_id = m.id);

-- End of seed by name
