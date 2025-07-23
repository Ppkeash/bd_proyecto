# Base de Destinatarios (Frontend)

Este proyecto es una demostración en React que simula el flujo de gestión de solicitudes de material POP y actualización de puntos de venta (PDV).

Actualmente todos los datos se encuentran en archivos **mock** y se persisten temporalmente en `localStorage` para efectos de pruebas. El objetivo de esta documentación es guiar a un desarrollador en la estructura del código y señalar dónde se deben conectar las APIs reales.

## Estructura principal

- **src/App.js** – Componente principal que maneja la navegación entre pantallas y controla el estado global.
- **src/components/** – Conjunto de componentes para cada vista (selección de canal, formularios, listados, etc.).
- **src/mock/** – Datos estáticos de ejemplo (canales, ubicaciones y materiales).
- **src/utils/storage.js** – Utilidades para leer y escribir en `localStorage`.
- **src/mock/campaigns.js** – Campañas de ejemplo usadas en el selector.
- **src/components/HomeMenu.js** – Pantalla de inicio mejorada con bienvenida.
- **src/assets/TigoLogo.js** – Representación SVG del logo usada en el encabezado.
- El logo en el encabezado funciona como botón para volver al menú principal.
- **src/components/CampaignsMenu.js** – Acceso a la creación y gestión de campañas.
- **src/components/CreateCampaignForm.js** – Formulario para parametrizar campañas.
- **src/components/ManageCampaigns.js** – Panel para editar campañas existentes.

## Conexión con backend

1. **Carga de datos**: Los archivos de `src/mock` deben sustituirse por peticiones HTTP. Cada componente indica en sus comentarios dónde realizar esas llamadas.
2. **Envío de solicitudes**: Las funciones `handleConfirmRequest` y `handleUpdateConfirm` dentro de `App.js` son los puntos principales para enviar información al servidor.
3. **Históricos**: `PreviousRequests` y `ChannelRequests` leen datos del almacenamiento local; reemplazar por consultas al backend que filtren por PDV o canal.

## Gestión de campañas

El menú **Campañas** permite crear campañas asignando prioridad, canales y materiales a partir de los archivos de `src/mock`. Las campañas se almacenan en `localStorage` para efectos de prueba. Desde el backend se deberá implementar la persistencia y actualización real de estos datos.

## Puesta en marcha

```bash
npm install
npm start
```

La aplicación se iniciará en modo de desarrollo. A partir de este punto se pueden adaptar las funciones indicadas para conectarse a los servicios que provea el backend.


## Launcher offline de TECNILAND Nexus

Se agreg\u00f3 un launcher b\u00e1sico para Minecraft. Para utilizarlo:

1. Ejecuta `npm run server` para levantar el servicio local que lanza el juego.
2. En otra consola ejecuta `npm start` para iniciar la interfaz web.
3. Ingresa un nombre de usuario y presiona **Iniciar sesi\u00f3n**. El nombre se guardar\u00e1 en `localStorage`.
4. Selecciona la versi\u00f3n deseada y pulsa **JUGAR**. El servidor abrir\u00e1 Minecraft con el nombre indicado.

El servidor utiliza `minecraft-launcher-core` en modo offline, por lo que no se requiere autenticaci\u00f3n en l\u00ednea.
