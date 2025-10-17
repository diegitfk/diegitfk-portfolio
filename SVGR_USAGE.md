# SVGR - Guía de Uso

## Instalación Completada ✅

SVGR ha sido instalado y configurado en este proyecto. Ahora puedes importar archivos SVG como componentes React.

## Uso

### Importar SVG como Componente React (Predeterminado)

```tsx
import Logo from '@/assets/logo.svg';

export default function MyComponent() {
  return (
    <div>
      <Logo className="w-10 h-10 text-blue-500" />
    </div>
  );
}
```

### Importar SVG como URL

Si necesitas la URL del archivo SVG (por ejemplo, para usarlo en una etiqueta `<img>` o como `background-image`):

```tsx
import logoUrl from '@/assets/logo.svg?url';

export default function MyComponent() {
  return (
    <div>
      <img src={logoUrl} alt="Logo" />
    </div>
  );
}
```

## Props del Componente SVG

Los componentes SVG importados aceptan todas las props estándar de SVG:

```tsx
import Icon from '@/assets/icon.svg';

<Icon 
  width={24}
  height={24}
  className="text-red-500"
  fill="currentColor"
  stroke="currentColor"
  aria-label="Descripción del icono"
/>
```

## Ejemplo Práctico para Iconos de Tecnologías

Para renderizar iconos en el bloque de código según el campo `icon-reference`:

```tsx
// Crear un componente de mapeo de iconos
import ReactIcon from '@/assets/icons/react.svg';
import NextJsIcon from '@/assets/icons/nextjs.svg';
import TypeScriptIcon from '@/assets/icons/typescript.svg';
import DockerIcon from '@/assets/icons/docker.svg';
// ... más iconos

const techIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  react: ReactIcon,
  nextjs: NextJsIcon,
  typescript: TypeScriptIcon,
  docker: DockerIcon,
  // ... más mapeos
};

// Usar en el componente
interface CodeBlockHeaderProps {
  filename: string;
  iconReference: string;
}

export function CodeBlockHeader({ filename, iconReference }: CodeBlockHeaderProps) {
  const Icon = techIcons[iconReference];
  
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5" />}
      <span>{filename}</span>
    </div>
  );
}
```

## Ventajas de SVGR

- ✅ **Escalabilidad**: Los SVGs se escalan sin pérdida de calidad
- ✅ **Personalización**: Puedes modificar colores, tamaños y estilos con CSS/Tailwind
- ✅ **Tree-shaking**: Solo se incluyen los SVGs que realmente uses
- ✅ **TypeScript**: Soporte completo con tipos para todas las props SVG
- ✅ **Accesibilidad**: Puedes agregar fácilmente `aria-label` y otros atributos

## Recomendaciones

1. Organiza tus SVGs en un directorio dedicado (ej: `src/assets/icons/`)
2. Usa nombres descriptivos para los archivos SVG
3. Optimiza tus SVGs antes de agregarlos (usa herramientas como SVGO)
4. Usa `currentColor` en tus SVGs para que hereden el color del texto padre
