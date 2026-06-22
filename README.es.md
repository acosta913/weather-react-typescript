# Buscador de Clima

[English](./README.md)

Aplicación de una sola pantalla que consulta el clima actual de cualquier ciudad. Construida con React 19, TypeScript y Vite. El usuario elige un país, escribe el nombre de una ciudad y la aplicación se conecta a la API de OpenWeatherMap para mostrar la temperatura actual junto con la mínima y la máxima del día.

Hice este proyecto para practicar React con tipado fuerte: hooks personalizados, formularios controlados, validación en tiempo de ejecución de datos externos y una separación clara entre los componentes de UI y la lógica de obtención de datos.

## Qué hace

1. El usuario selecciona un país en un desplegable y escribe el nombre de una ciudad.
2. Al enviar el formulario, la aplicación llama al endpoint de geocodificación de OpenWeatherMap para traducir el par `(ciudad, país)` en coordenadas geográficas.
3. Con esas coordenadas consulta el endpoint del clima y muestra el resultado.
4. La respuesta de la API se valida en tiempo de ejecución con un esquema de Zod antes de llegar a la UI, así un payload mal formado nunca rompe el render.

La interfaz contempla cuatro estados visibles: inicial, cargando (spinner), datos listos y "ciudad no encontrada".

## Stack técnico

- **React 19** con el nuevo runtime de JSX
- **TypeScript** en modo estricto
- **Vite 7** con el plugin SWC para HMR rápido
- **Axios** para las llamadas HTTP
- **Zod** para validación en tiempo de ejecución del esquema de respuesta
- **CSS Modules** para estilos con scope, un archivo por componente
- **ESLint** (configuración flat) con los plugins de React Hooks y React Refresh

## Cómo empezar

### Requisitos

- Node.js 18 o superior
- Una API key de OpenWeatherMap (el plan gratuito funciona): https://openweathermap.org/api

### Instalación

```bash
git clone <url-del-repositorio>
cd weather-react-typescript-main
npm install
```

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_KEY=tu_api_key_de_openweathermap
VITE_API_URL_WEATHER=https://api.openweathermap.org/
```

La barra final en `VITE_API_URL_WEATHER` es necesaria porque el hook concatena las rutas de los endpoints directamente.

### Ejecutar

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

## Scripts disponibles

| Script            | Qué hace                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run dev`     | Levanta el servidor de desarrollo de Vite con recarga en caliente          |
| `npm run build`   | Verifica los tipos (`tsc -b`) y genera el bundle estático para producción  |
| `npm run preview` | Sirve localmente el build de producción                                    |
| `npm run lint`    | Ejecuta ESLint sobre el código                                             |

## Estructura del proyecto

```
src/
├── components/
│   ├── Alert/          Mensaje de error o validación en línea
│   ├── Form/           Formulario de país + ciudad con inputs controlados
│   ├── Spinner/        Indicador de carga
│   └── WeatherDetail/  Renderiza los datos del clima ya validados
├── data/
│   └── countries.ts    Lista estática de países (ISO 3166-1) para el <select>
├── hooks/
│   └── useWeather.ts   Concentra el estado y la lógica de las llamadas
├── types/
│   └── index.ts        Tipos compartidos de TypeScript
├── utils/
│   └── index.ts        Conversión Kelvin → Celsius
├── App.tsx             Compone los componentes según el estado del hook
└── main.tsx            Punto de entrada de la aplicación
```

## Notas de implementación

**Hook personalizado para los datos.** Toda la lógica asíncrona, los flags de carga y la validación viven dentro de `useWeather`. Los componentes se mantienen declarativos: reciben la acción y los flags derivados, y deciden qué renderizar. Eso hace que la UI sea fácil de leer y que el hook sea fácil de testear o reemplazar.

**Validación en tiempo de ejecución.** Los tipos de TypeScript desaparecen en runtime, así que no protegen a la aplicación de una respuesta inesperada. El hook define un esquema de Zod para el payload del clima y usa `safeParse` antes de guardar nada en el estado. El archivo conserva además dos alternativas comentadas (un type guard escrito a mano y un esquema de Valibot) como registro de los enfoques que comparé.

**Llamada en dos pasos.** Primero se consulta el endpoint de geocodificación; si devuelve un arreglo vacío se activa el flag `notFound` y se omite la segunda llamada, de modo que el usuario obtiene retroalimentación inmediata cuando escribe mal una ciudad sin desperdiciar una petición.

**Manejo de temperatura.** OpenWeatherMap devuelve grados Kelvin. Un único helper, `formatTemperature`, convierte a Celsius entero, y todas las temperaturas en la UI pasan por él.

## Posibles mejoras

- Guardar la última búsqueda exitosa en `localStorage`.
- Agregar un selector de unidades (Celsius / Fahrenheit).
- Mostrar el ícono del clima y una descripción corta tomados de la respuesta de la API.
- Añadir cobertura con Vitest y React Testing Library para el hook y el formulario.

## Autor

**Bryan Acosta**

Si estás revisando este proyecto como parte de un proceso de selección y quieres conversar sobre las decisiones detrás del código, con gusto lo recorremos juntos.

## Licencia

Publicado con fines de portafolio y aprendizaje. Eres libre de hacer fork y adaptarlo.
