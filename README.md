# Vertice Gastronomico

Sistema integral de consultoría gastronómica con 72 agentes de IA especializados.

## Descripcion

Plataforma empresarial para gestión de negocios gastronómicos que integra:
- **72 Agentes de IA** especializados por área (Finanzas, Marketing, Operaciones, RRHH, Legal, Tecnología)
- **Generador de Imágenes IA** con DALL-E 3 y Claude Vision
- **Análisis de Documentos** (PDF, Excel, Word, PowerPoint, Imágenes)
- **Gestión de Proyectos** con workflows automatizados
- **Mystery Shopper IA** con análisis fotográfico

## Tecnologías

| Frontend | Backend | IA |
|----------|---------|-----|
| React 19 | Express 5 | Claude (Anthropic) |
| Vite 7.2 | Node.js 22 | GPT-4o (OpenAI) |
| Tailwind CSS 4 | PostgreSQL | DALL-E 3 |
| Framer Motion | Redis | Gemini (Google) |

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/vertice-gastronomico.git
cd vertice-gastronomico

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Iniciar desarrollo
npm run dev:all
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia solo el frontend (Vite) |
| `npm run server` | Inicia solo el backend (Express) |
| `npm run dev:all` | Inicia frontend + backend en paralelo |
| `npm run build` | Compila para producción |
| `npm run test` | Ejecuta tests con Jest (default) |
| `npm run test:all` | Suite completa Jest + Vitest en paralelo (CI-ready) |
| `npm run test:jest` | Solo tests Jest (`*.jest.js`) |
| `npm run test:vitest` | Solo tests Vitest (`*.test.js`) |

## Testing

El proyecto usa un sistema dual de testing para máxima cobertura:

### Frameworks

| Framework | Archivos | Uso |
|-----------|----------|-----|
| **Jest** | `*.jest.js` | Tests unitarios, mocks complejos |
| **Vitest** | `*.test.js` | Tests de componentes React, integración |

### Comandos de Testing

```bash
# Suite completa (recomendado para CI/CD)
npm run test:all

# Solo Jest (64 tests)
npm run test:jest

# Solo Vitest (223 tests)
npm run test:vitest

# Default (Jest)
npm run test
```

### Cobertura Actual

- **Jest**: 64 tests en 2 suites
- **Vitest**: 223 tests en 6 archivos
- **Total**: 287 tests

## Estructura del Proyecto

```
vertice-gastronomico/
├── src/
│   └── App.jsx          # Aplicación principal (72 agentes)
├── server/
│   └── index.js         # API Express con endpoints IA
├── public/              # Archivos estáticos
├── scripts/             # Scripts de automatización
└── uploads/             # Archivos subidos por usuarios
```

## Configuración de APIs

### Variables de Entorno Requeridas

```env
# IA - Al menos una requerida
ANTHROPIC_API_KEY=sk-ant-...    # Claude (recomendado)
OPENAI_API_KEY=sk-proj-...      # GPT-4o y DALL-E 3
GEMINI_API_KEY=AIza...          # Gemini (opcional)

# Base de datos
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
REDIS_PORT=6379

# Autenticación
JWT_SECRET=tu-secret-seguro

# Servidor
PORT=3001
APP_URL=http://localhost:5173
```

## Funcionalidades Principales

### 1. Sistema Multi-Agente (72 Agentes)

Cada agente tiene:
- Herramientas específicas para su área
- System prompt especializado
- Capacidad de delegación a otros agentes
- Acceso a COMMON_TOOLS (análisis de documentos, imágenes, etc.)

### 2. Generador de Imágenes IA

```javascript
// Auto-generación inteligente
autoGenerateImage({
  concept: 'Restaurante mexicano moderno',
  style: 'modern',      // modern, industrial, rustic, luxury, tropical, minimalist
  type: 'interior',     // interior, exterior, kitchen, bar, terrace, floor_plan
  agentId: 48,          // Contexto del agente
  autoSave: true        // Guardar en documentos
});

// Generar proyecto completo (4 vistas)
autoGenerateProjectImages('Concepto del restaurante', 'modern');
```

### 3. Análisis de Imágenes

- Análisis automático al subir imágenes
- Detección de estilo, iluminación, materiales
- Evaluación gastronómica del espacio
- Recomendaciones de mejora

### 4. Análisis de Documentos

Formatos soportados:
- **Office**: .doc, .docx, .xls, .xlsx, .ppt, .pptx
- **PDF**: con OCR automático
- **Imágenes**: .png, .jpg, .jpeg, .gif, .webp, .svg
- **CAD/3D**: .dwg, .dxf, .skp, .obj, .fbx, .blend

### 5. Mystery Shopper IA

Evaluación automática con:
- 5 categorías de análisis
- Scoring por área
- Análisis fotográfico con IA
- Recomendaciones priorizadas

## API Endpoints

### Análisis

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/analyze-image` | POST | Analiza imagen con Claude/GPT-4o |
| `/api/generate-image` | POST | Genera imagen con DALL-E 3 |
| `/api/generate-prompt` | POST | Genera prompt optimizado con Claude |

### Agentes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/agents` | GET | Lista todos los agentes |
| `/api/agents/:id` | GET | Detalle de un agente |
| `/api/agent-audit/:id` | POST | Audita un agente específico |

## Seguridad

- Helmet.js para headers HTTP
- Rate limiting por endpoint
- Validación de entrada con express-validator
- CORS configurado por entorno
- JWT para autenticación

## Licencia

Propietario - Todos los derechos reservados

---

Desarrollado con Claude Code por Anthropic
