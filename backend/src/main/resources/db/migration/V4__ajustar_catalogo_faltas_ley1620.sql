-- V4: Precision juridica en el catalogo de faltas segun Decreto 1965 de 2013 (Art. 40) reglamentario de la Ley 1620

UPDATE catalogo_faltas
SET descripcion = 'Conflictos cotidianos manejados inadecuadamente, discusiones esporadicas, uso indebido de dispositivos o faltas al clima pedagogico sin dano fisico ni mental.'
WHERE codigo = 'ART-101-T1';

UPDATE catalogo_faltas
SET descripcion = 'Agresion fisica (golpes, empujones, pelea o rinon entre estudiantes), agresion verbal reiterada, dano intencional a bienes ajenos o acoso escolar (bullying) que no revistan caracteristicas de delito penal ni generen incapacidad medica.'
WHERE codigo = 'ART-201-T2';

UPDATE catalogo_faltas
SET descripcion = 'Presuntos delitos penales bajo el Codigo Penal colombiano: porte o uso de armas, sustancias psicoactivas, agresion contra la libertad sexual, o lesiones fisicas graves con incapacidad medica certificada.'
WHERE codigo = 'ART-301-T3';
