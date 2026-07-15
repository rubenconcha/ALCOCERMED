-- =============================================================================
-- ALCOCERMED - Lista virtual 2026
-- =============================================================================
--
-- Este archivo NO crea contrasenas.
-- Cada alumno crea su propia contrasena desde:
--
--   https://alcocermed.com/juegos/?virtual=1
--
-- En Supabase revisa:
-- Authentication > Providers > Email
--   [x] Enable Email provider
--   [x] Enable sign ups
--   [ ] Confirm email
--
-- Confirm email debe estar desactivado porque estos usuarios @prepa.com son
-- internos y no reciben correos reales.
--
-- Usuarios asignados:

SELECT *
FROM (
    VALUES
    ('Yhanneth Vargas Mollo', 'yhanneth@prepa.com'),
    ('Maylin Kenia Quispe Vallejos', 'maylin@prepa.com'),
    ('Maylin Kenia Quispe Vallejos - alternativo', 'maylinquispe@prepa.com'),
    ('Paola Andrea Flores Cruz', 'paolaandrea@prepa.com'),
    ('Stephania Guizada', 'stephania@prepa.com'),
    ('Avril Ara Rocha', 'avril@prepa.com'),
    ('Camila Belen Adrian Garcia', 'camilabelen@prepa.com'),
    ('Camila Belen Adrian Garcia - alternativo', 'camilaadrian@prepa.com'),
    ('Abigail Nataly Barreto Atahuichi', 'abigail@prepa.com'),
    ('Luiz Miguel Vallejos Toroya', 'luiz@prepa.com'),
    ('Daniel Covarrubias Ortiz', 'daniel@prepa.com'),
    ('Mary Alejandra Cruz', 'mary@prepa.com'),
    ('Lia Rojas Rocha', 'lia@prepa.com'),
    ('Mariana Rosario Orellana Ferrufino', 'mariana@prepa.com'),
    ('Liz Gisela Calizaya Poma', 'liz@prepa.com'),
    ('Liz Gisela Calizaya Poma - alternativo', 'lizgisela@prepa.com'),
    ('Deysi Vasquez Torrico', 'deysi@prepa.com'),
    ('Ahinoa Alexandra Choque Escalera', 'ahinoa@prepa.com'),
    ('Russ Bania Choque Poma', 'russ@prepa.com'),
    ('Jhonatan Jose Vidaurre Nunez', 'jhonatan@prepa.com'),
    ('Paola Ramirez Fernandez', 'paolaramirez@prepa.com'),
    ('Jhina Moreiro Diego', 'jhina@prepa.com'),
    ('Jhina Moreiro Diego - alternativo', 'jhinamoreiro@prepa.com'),
    ('Luz Neyda Soliz Flores', 'luz@prepa.com'),
    ('Santiago Encinas', 'santiago@prepa.com'),
    ('Camila Solis Candida', 'camilasolis@prepa.com'),
    ('Camila Solis Candida - alternativo', 'camilacandida@prepa.com'),
    ('Camila Solis Candida - alternativo 2', 'camilasoliz@prepa.com')
) AS usuarios(estudiante, usuario)
ORDER BY estudiante;
