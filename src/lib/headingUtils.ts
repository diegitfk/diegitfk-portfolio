export interface HeadingItem {
  id: string
  text: string
  level: number
}

type RichTextNode = {
  type: string
  children?: RichTextNode[]
  tag?: string
  [key: string]: any
}

/**
 * Convierte un texto en un ID válido para usar como anchor en HTML
 * @param text - El texto del heading
 * @returns Un string que puede usarse como ID
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales excepto guiones y espacios
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
}

/**
 * Extrae todos los headings del contenido para la tabla de contenidos
 * Esta función puede ser usada tanto en servidor como en cliente
 */
export function extractHeadings(content: { root: { children: RichTextNode[] } }): HeadingItem[] {
  const headings: HeadingItem[] = []
  
  const processNode = (node: RichTextNode) => {
    if (node.type === 'heading' && node.children) {
      const text = node.children
        .filter((child: any) => child.type === 'text')
        .map((child: any) => child.text)
        .join('')
      
      if (text && node.tag) {
        const level = parseInt(node.tag.replace('h', ''))
        headings.push({
          id: generateHeadingId(text),
          text,
          level
        })
      }
    }
    
    // Procesar recursivamente los children
    if (node.children) {
      node.children.forEach(processNode)
    }
  }
  
  content.root.children.forEach(processNode)
  return headings
}
