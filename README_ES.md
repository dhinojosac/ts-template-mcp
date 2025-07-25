# Template de Servidor MCP en TypeScript

Un template completo y listo para producción para crear servidores MCP (Model Context Protocol) usando TypeScript, Fastify y Docker.

## 🎯 **¿Qué es este proyecto?**

Este es un **template de servidor MCP** que proporciona una base sólida para construir servidores que implementan el protocolo MCP (Model Context Protocol). Está diseñado para ser usado como punto de partida para proyectos que necesitan integrar herramientas y recursos con modelos de IA.

### **Características principales:**
- ✅ **TypeScript** - Tipado estricto y seguridad de tipos
- ✅ **Fastify** - Framework web de alto rendimiento
- ✅ **Docker** - Containerización lista para producción
- ✅ **Validación con Zod** - Validación de datos en tiempo de ejecución
- ✅ **Logging estructurado** - Logs organizados con Pino
- ✅ **Arquitectura de plugins** - Sistema modular y extensible
- ✅ **Documentación completa** - Guías detalladas en español

## 🚀 **Inicio Rápido**

### **Requisitos previos:**
- Node.js 20 o superior
- npm 8 o superior
- Docker (opcional, para containerización)

### **Instalación y ejecución:**

```bash
# 1. Clonar el repositorio
git clone https://github.com/dhinojosac/ts-template-mcp.git
cd ts-template-mcp

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Probar el servidor
curl http://localhost:3000/health
```

### **Con Docker (recomendado para producción):**

```bash
# 1. Construir y ejecutar con Docker Compose
docker-compose up -d

# 2. Verificar que está funcionando
curl http://localhost:3000/health

# 3. Ver logs
docker-compose logs mcp-server
```

## 📁 **Estructura del Proyecto**

```
ts-template-mcp/
├── src/
│   ├── server.ts              # Punto de entrada principal del servidor MCP
│   ├── config/
│   │   └── constants.ts       # Configuración centralizada
│   ├── utils/
│   │   ├── errorHandler.ts    # Manejo de errores
│   │   └── logger.ts          # Sistema de logging
│   ├── schemas/
│   │   ├── toolSchemas.ts     # Esquemas de validación para herramientas
│   │   └── commonSchemas.ts   # Esquemas comunes reutilizables
│   └── plugins/
│       ├── helloPlugin.ts     # Plugin de ejemplo con endpoint REST
│       └── weatherPlugin.ts   # Implementación de herramientas de clima
├── Dockerfile                 # Configuración de Docker multi-etapa
├── docker-compose.yml         # Orquestación de servicios
├── package.json               # Dependencias y scripts
└── README_ES.md              # Esta documentación
```

## 🔧 **Comandos Disponibles**

### **Desarrollo:**
```bash
npm run dev              # Iniciar servidor de desarrollo
npm run dev:stdio        # Modo STDIO para clientes CLI
npm run dev:debug        # Modo debug con logs detallados
npm run build           # Construir para producción
npm run start           # Ejecutar versión de producción
npm run start:prod      # Ejecutar en modo producción
```

### **Calidad de código:**
```bash
npm run lint            # Verificar estilo de código
npm run lint:fix        # Corregir problemas de estilo automáticamente
npm run format          # Formatear código con Prettier
npm run type-check      # Verificar tipos de TypeScript
npm run validate        # Validación completa (tipos + lint)
```

### **Docker:**
```bash
docker-compose up -d    # Iniciar servicios en segundo plano
docker-compose down     # Detener servicios
docker-compose logs     # Ver logs de los servicios
docker build -t app .   # Construir imagen Docker
```

## 🛠️ **Cómo Usar el Servidor MCP**

### **Modo HTTP (para aplicaciones web):**
El servidor expone endpoints HTTP en el puerto 3000:

```bash
# Verificar estado del servidor
curl http://localhost:3000/health

# Llamar herramienta de clima
curl -X POST http://localhost:3000/tools/weather \
  -H "Content-Type: application/json" \
  -d '{"city": "Santiago", "units": "metric"}'
```

### **Modo STDIO (para clientes CLI):**
Para usar con clientes de línea de comandos:

```bash
# Ejecutar en modo STDIO
npm run dev:stdio

# O desde Docker
docker run --rm -i ts-template-mcp npm run start:stdio
```

## 🔌 **Herramientas MCP Incluidas**

### **1. Herramienta de Saludo (Hello)**
- **Nombre:** `hello`
- **Descripción:** Saluda al usuario con un mensaje personalizado
- **Parámetros:**
  - `name` (string): Nombre de la persona a saludar
- **Ejemplo:**
```json
{
  "name": "hello",
  "arguments": {
    "name": "María"
  }
}
```

### **2. Herramienta de Clima (Weather)**
- **Nombre:** `weather`
- **Descripción:** Obtiene información del clima para una ciudad
- **Parámetros:**
  - `city` (string): Nombre de la ciudad
  - `units` (string, opcional): Unidades ("metric" o "imperial")
- **Ejemplo:**
```json
{
  "name": "weather",
  "arguments": {
    "city": "Santiago",
    "units": "metric"
  }
}
```

## 🐳 **Docker y Despliegue**

### **Configuración de Docker:**
El proyecto incluye una configuración Docker optimizada:

- **Multi-etapa:** Construcción eficiente con etapas separadas
- **Seguridad:** Ejecuta como usuario no-root
- **Optimización:** Imagen mínima basada en Alpine Linux
- **Healthcheck:** Monitoreo automático de salud del servicio

### **Variables de entorno:**
```bash
NODE_ENV=production    # Entorno de ejecución
PORT=3000             # Puerto del servidor
HOST=0.0.0.0          # Host de binding
```

### **Despliegue en producción:**
```bash
# 1. Construir imagen
docker build -t mcp-server .

# 2. Ejecutar contenedor
docker run -d \
  --name mcp-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  mcp-server

# 3. Verificar funcionamiento
curl http://localhost:3000/health
```

## 🔧 **Desarrollo y Extensión**

### **Agregar una nueva herramienta MCP:**

1. **Crear esquema de validación:**
```typescript
// src/schemas/toolSchemas.ts
export const calculatorSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  a: z.number(),
  b: z.number()
})
```

2. **Implementar la herramienta:**
```typescript
// src/plugins/calculatorPlugin.ts
export async function registerCalculatorPlugin(fastify: FastifyInstance) {
  // Registrar herramienta MCP
  fastify.mcp.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'calculator') {
      const params = calculatorSchema.parse(request.params.arguments)
      // Lógica de la calculadora aquí
      return { result: calculate(params) }
    }
  })

  // Agregar endpoint REST
  fastify.post('/tools/calculator', async (request, reply) => {
    const params = calculatorSchema.parse(request.body)
    return { result: calculate(params) }
  })
}
```

3. **Registrar en el servidor:**
```typescript
// src/server.ts
import { registerCalculatorPlugin } from './plugins/calculatorPlugin'

// En la función de inicialización
await registerCalculatorPlugin(fastify)
```

### **Patrones de desarrollo:**
- **Validación primero:** Siempre usar esquemas Zod
- **Manejo de errores:** Usar el sistema centralizado de errores
- **Logging:** Usar el logger estructurado
- **Tipos estrictos:** Evitar `any` y usar tipos específicos

## 🧪 **Testing**

### **Ejecutar tests:**
```bash
npm test               # Ejecutar todos los tests
npm run test:watch     # Modo watch para desarrollo
```

### **Cobertura de tests:**
- Tests unitarios para herramientas individuales
- Tests de integración para endpoints MCP
- Tests de validación de esquemas
- Tests de manejo de errores

## 📚 **Documentación Adicional**

### **Archivos de documentación:**
- **`AI_GUIDELINES.md`** - Guías para asistencia con IA
- **`AI_PROMPT_EXAMPLES.md`** - Ejemplos de prompts para IA
- **`AI_QUICK_START.md`** - Inicio rápido para IA
- **`DOCKER_BEST_PRACTICES.md`** - Mejores prácticas de Docker
- **`DOCKER_TROUBLESHOOTING.md`** - Solución de problemas de Docker
- **`CHANGELOG.md`** - Historial de versiones

### **Recursos externos:**
- [Documentación oficial de MCP](https://modelcontextprotocol.io/)
- [SDK de TypeScript para MCP](https://github.com/modelcontextprotocol/sdk-typescript)
- [Documentación de Fastify](https://www.fastify.io/docs/)

## 🚨 **Solución de Problemas**

### **Problemas comunes:**

#### **1. Error de puerto en uso:**
```bash
# Cambiar puerto en constants.ts
export const DEFAULT_PORT = 3001

# O usar variable de entorno
PORT=3001 npm run dev
```

#### **2. Error de tipos de TypeScript:**
```bash
# Verificar tipos
npm run type-check

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### **3. Problemas con Docker:**
```bash
# Limpiar contenedores e imágenes
docker-compose down
docker system prune -f

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up -d
```

#### **4. Error de permisos en Docker:**
```bash
# Verificar que el usuario no-root esté configurado
docker-compose logs mcp-server

# Si hay problemas, verificar el Dockerfile
```

### **Logs y debugging:**
```bash
# Ver logs del servidor
npm run dev:debug

# Ver logs de Docker
docker-compose logs -f mcp-server

# Verificar estado de servicios
docker-compose ps
```

## 🤝 **Contribuir**

### **Cómo contribuir:**
1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-herramienta`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva herramienta'`)
4. **Push** a la rama (`git push origin feature/nueva-herramienta`)
5. **Crear** un Pull Request

### **Estándares de código:**
- Seguir las convenciones de TypeScript
- Usar ESLint y Prettier
- Agregar tests para nuevas funcionalidades
- Actualizar documentación
- Mantener compatibilidad con versiones anteriores

## 📄 **Licencia**

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 **Autor**

**Diego Hinojosa Córdova**
- 📧 Email: d.hinojosa.cordova@gmail.com
- 💼 LinkedIn: [dhinojosac](https://www.linkedin.com/in/dhinojosac/)
- 🐙 GitHub: [dhinojosac](https://github.com/dhinojosac)

## 🙏 **Agradecimientos**

- [Model Context Protocol](https://modelcontextprotocol.io/) por el protocolo
- [Fastify](https://www.fastify.io/) por el framework web
- [Zod](https://zod.dev/) por la validación de esquemas
- [Docker](https://www.docker.com/) por la containerización

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al autor directamente. 