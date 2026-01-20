# CLAUDE.md - Instrucciones para Claude Code en Vértice Gastronómico

## ⚠️ REGLA #0 - ANTES DE CUALQUIER RESPUESTA FINAL ⚠️

```
┌─────────────────────────────────────────────────────────────┐
│  ANTES DE ENTREGAR CUALQUIER RESPUESTA DEBO:               │
│                                                             │
│  1. EJECUTAR el script de verificación PVT                  │
│  2. MOSTRAR los resultados al usuario                       │
│  3. CORREGIR cualquier error ANTES de declarar "listo"      │
│  4. NO HAY EXCEPCIONES - SIEMPRE ejecutar verificación      │
│                                                             │
│  Si no ejecuté verificación = RESPUESTA INVÁLIDA            │
└─────────────────────────────────────────────────────────────┘
```

### FORMATO OBLIGATORIO DE ENTREGA:

Cada vez que complete una tarea, DEBO incluir esta sección:

```
═══════════════════════════════════════════
         PVT - VERIFICACIÓN AUTOMÁTICA
═══════════════════════════════════════════
✅/❌ COMPLETITUD: [resultado de verificación]
✅/❌ EXACTITUD: [resultado de verificación]
✅/❌ PRODUCCIÓN: [resultado de verificación]
═══════════════════════════════════════════
```

Si alguna verificación falla, DEBO corregirla ANTES de entregar.

---

## PROTOCOLO DE VERIFICACIÓN TRIPLE (PVT) - NIVEL ARQUITECTO SENIOR - OBLIGATORIO

Antes de entregar CUALQUIER respuesta, debo verificar con el mismo rigor que el Agente 71:

### VERIFICACIÓN 1: COMPLETITUD ARQUITECTÓNICA
- [ ] ¿Entendí completamente el problema/requerimiento del usuario?
- [ ] ¿El código/solución está COMPLETO (no parcial)?
- [ ] ¿Incluí manejo de errores y casos edge?
- [ ] ¿Hay documentación técnica y comentarios donde es necesario?
- [ ] ¿Leí y analicé el código existente ANTES de proponer cambios?
- [ ] ¿Consideré todas las dependencias y efectos colaterales?
- [ ] ¿La arquitectura escala para el futuro?
- [ ] ¿Usé TodoWrite para planificar tareas complejas (más de 2 pasos)?

### VERIFICACIÓN 2: EXACTITUD TÉCNICA
- [ ] ¿El código compila/funciona sin errores de sintaxis?
- [ ] ¿No introduje bugs, memory leaks o race conditions?
- [ ] ¿Usé los nombres de variables/funciones/clases correctos del código existente?
- [ ] ¿Seguí los patrones de diseño apropiados (SOLID, DRY, KISS)?
- [ ] ¿El código es type-safe donde aplica?
- [ ] ¿Los algoritmos son eficientes (Big O considerado)?
- [ ] ¿Respeté el estilo de código del proyecto?
- [ ] ¿Verifiqué que el servidor reinicie correctamente después de cambios?

### VERIFICACIÓN 3: PRODUCCIÓN-READY
- [ ] ¿La solución es implementable HOY en producción?
- [ ] ¿Consideré seguridad (OWASP top 10, inyección, XSS, CSRF)?
- [ ] ¿Es mantenible y legible para otros desarrolladores?
- [ ] ¿Incluí tests o sugerí cómo testear?
- [ ] ¿Documenté los cambios con ubicación exacta (archivo:línea)?
- [ ] ¿El sistema puede recuperarse de fallos (resiliencia)?
- [ ] ¿Expliqué el "por qué" de las decisiones arquitectónicas?
- [ ] ¿El usuario puede usar el resultado inmediatamente?

## NO ENTREGAR HASTA QUE LAS 3 VERIFICACIONES PASEN
## MI ESTÁNDAR ES EXCELENCIA - CÓDIGO/TRABAJO MEDIOCRE NO ES ACEPTABLE

---

## Errores que NO debo cometer NUNCA MÁS

### Errores de Código/Implementación
1. **Entregar soluciones parciales** - Si no está completo, no lo entrego
2. **Modificar código sin leerlo primero** - SIEMPRE Read antes de Edit
3. **Olvidar imports** - SIEMPRE verificar que todos los módulos estén importados (fs, path, etc.)
4. **No verificar que el servidor funcione** - Siempre confirmar que corre sin errores después de cambios

### Errores de Proceso/Metodología
5. **Arreglar síntomas, no causas raíz** - Cuando hay un error, buscar la CAUSA SISTÉMICA, no parchar
6. **No pensar en escalabilidad** - Las soluciones deben aplicar a TODOS los agentes, no solo al que falló
7. **Soluciones hardcodeadas** - Preferir soluciones DINÁMICAS que puedan crecer (archivos JSON, APIs)
8. **No limpiar procesos background** - Matar shells anteriores antes de crear nuevos

### Errores de Comunicación
9. **Inventar datos** - Usar SOLO datos reales de los documentos/código
10. **Entregar estrategias cuando piden documentos** - El producto final es lo que el usuario necesita
11. **Repetir información sin agregar valor** - Si algo ya se explicó, avanzar al siguiente paso
12. **No escuchar feedback del usuario** - El usuario siempre tiene razón sobre lo que necesita

### Meta-Aprendizaje
13. **Ignorar el PVT** - Es lo que GARANTIZA calidad, no es redundante
14. **No aprender de errores pasados** - SIEMPRE revisar historial y lecciones antes de actuar
15. **No documentar aprendizajes** - Cada error corregido debe quedar registrado para el futuro
16. **No ejecutar verificación automática** - SIEMPRE ejecutar script/verificación ANTES de declarar "listo"
17. **Contradecirme** - Si digo "no hardcodear", debo verificar que NO hardcodeé. Si digo "PVT aplicado", debo MOSTRAR evidencia

---

## Contexto del Proyecto

**Vértice Gastronómico** es una plataforma de gestión empresarial con:
- 72 agentes de IA especializados
- 99 workflows automatizados
- Sistema de documentos adjuntos
- PVTs específicos por categoría de agente

### Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `server/index.js` | Backend principal, definición de agentes, PVTs (líneas 52-218) |
| `src/App.jsx` | Frontend React, definición de AGENTS y WORKFLOWS |
| `logs/auto-sync.log` | Log del auto-sync a GitHub |

### Categorías de Agentes y sus PVTs

- `financial` - Verificación de cálculos y métricas
- `legal` - Verificación de documentos judiciales
- `marketing` - Verificación de estrategias
- `operational` - Verificación de procesos
- `strategy` - Verificación de análisis estratégico
- `hr` - Verificación de gestión laboral
- `technology` - Verificación de código (PVT nivel Arquitecto Senior)
- `customer` - Verificación de atención al cliente

### Agentes Especiales

**Agente 71** (Arquitecto de Software & IA Senior): PVT más riguroso, estándar de excelencia
**Agente 72** (Abogado Familiar): SystemPrompt con ejemplo REAL de escrito judicial

---

## Comandos Útiles

```bash
# Iniciar servidor
npm run dev:all

# Ver logs de auto-sync
tail -f logs/auto-sync.log

# Reiniciar servidor
pkill -f "node.*server" && pkill -f "vite" && npm run dev:all
```

---

## Reglas de Trabajo ABSOLUTAS

1. **SIEMPRE leer antes de modificar** - No proponer cambios a código que no he leído
2. **SIEMPRE usar TodoWrite** - Para tareas con más de 2 pasos
3. **SIEMPRE reiniciar servidor** - Después de cambios en server/index.js
4. **SIEMPRE aplicar PVT** - A mí mismo antes de entregar CUALQUIER respuesta
5. **SIEMPRE documentar** - Qué cambié y en qué líneas
6. **NUNCA entregar trabajo incompleto** - Mejor preguntar que asumir
7. **NUNCA inventar datos** - Solo usar información real de los documentos

---

## CAMBIO CRÍTICO: TODOS LOS AGENTES EN TEXTO LIBRE (2025-12-02)

**TODOS los 72 agentes ahora responden en TEXTO LIBRE profesional**, no en JSON.

### ¿Por qué?
- El cliente necesita documentos LEGIBLES y USABLES inmediatamente
- JSON es para sistemas internos, TEXTO es para clientes
- Un cliente no puede leer `{"response": "...", "analisis": {...}}`

### Cambios realizados en `server/index.js`:
1. **Líneas 7704-7755**: Nuevo systemPrompt con instrucciones de TEXTO LIBRE
2. **Líneas 8126-8145**: Anthropic siempre devuelve texto libre
3. **Líneas 8168-8184**: OpenAI siempre devuelve texto libre
4. **Líneas 8198-8213**: Gemini siempre devuelve texto libre
5. **Líneas 8229-8244**: Ollama siempre devuelve texto libre

### Estructura de respuesta esperada:
```
RESUMEN EJECUTIVO
[2-3 párrafos con hallazgos y métricas]

ANÁLISIS DETALLADO
[Contexto, métricas, benchmarks]

HALLAZGOS Y OBSERVACIONES
• Hallazgo 1 con impacto
• Hallazgo 2 con impacto

RECOMENDACIONES PRIORITARIAS
1. ALTA: [acción] - Impacto: [resultado]
2. MEDIA: [acción] - Impacto: [resultado]

KPIs Y SEGUIMIENTO
• Indicador a monitorear
• Meta sugerida
```
