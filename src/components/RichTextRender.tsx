'use client'

import React from 'react'

// Asegúrate de que las rutas a tus componentes sean correctas
import { CodeBlockRenderer } from './render-blocks/CodeBlock' 
import { FileTreeBlockComponent } from './render-blocks/FileTree'
import type { FileTreeBlockType } from '../payload-types' // Asumiendo que exportas este tipo desde FileTree.tsx
import { JSX } from 'react'
// --- Tipos para el Rich Text de PayloadCMS ---

type RichTextNode = {
  type: string
  children?: RichTextNode[]
  [key: string]: any
}

type TextNode = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

interface RichTextRenderProps {
  content: {
    root: {
      children: RichTextNode[]
    }
  }
}

// --- Funciones de Serialización ---

const serializeText = (nodes: RichTextNode[]): React.ReactNode => {
  return nodes.map((node, i) => {
    if (node.type === 'text') {
      const textNode = node as unknown as TextNode
      let text = <span key={i}>{textNode.text}</span>

      if (textNode.bold) {
        text = <strong key={i}>{text}</strong>
      }
      if (textNode.italic) {
        text = <em key={i} className="italic">{text}</em>
      }
      if (textNode.underline) {
        text = <u key={i}>{text}</u>
      }
      if (textNode.strikethrough) {
        text = <s key={i}>{text}</s>
      }
      if (textNode.code) {
        text = <code key={i} className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{text}</code>
      }
      
      return text
    }

    if (!node) {
      return null
    }

    if (node.type === 'linebreak') {
      return <br key={i} />
    }

    // Fallback para nodos inesperados
    return serializeNodes([node])
  })
}

const serializeNodes = (nodes: RichTextNode[]): React.ReactNode => {
  return nodes.map((node, i) => {
    if (!node) return null

    switch (node.type) {
      case 'heading':
        const Tag = node.tag as keyof JSX.IntrinsicElements
        const tagClasses: Record<string, string> = {
            h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6",
            h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10",
            h3: "scroll-m-20 text-2xl font-semibold tracking-tight mt-8",
            h4: "scroll-m-20 text-xl font-semibold tracking-tight mt-6",
            h5: "scroll-m-20 text-lg font-semibold tracking-tight mt-4",
            h6: "scroll-m-20 text-base font-semibold tracking-tight mt-2",
        }
        return <Tag key={i} className={tagClasses[node.tag] || ''}>{serializeText(node.children || [])}</Tag>

      case 'paragraph':
        return <p key={i} className="leading-7 [&:not(:first-child)]:mt-6">{serializeText(node.children || [])}</p>

      case 'quote':
        return <blockquote key={i} className="mt-6 border-l-2 pl-6 italic">{serializeText(node.children || [])}</blockquote>

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        const listClasses = node.listType === 'check' 
            ? 'my-6 ml-6 list-none [&>li]:pl-0' 
            : `my-6 ml-6 list-${node.listType === 'number' ? 'decimal' : 'disc'} [&>li]:mt-2`

        return <ListTag key={i} className={listClasses}>{serializeNodes(node.children || [])}</ListTag>

      case 'listitem':
        if (typeof node.checked === 'boolean') {
          return (
             <li key={i} className="flex items-center space-x-2 my-2">
                <input type="checkbox" checked={node.checked} readOnly className="form-checkbox h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <span>{serializeText(node.children || [])}</span>
            </li>
          )
        }
        return <li key={i}>{serializeText(node.children || [])}</li>

      case 'upload':
        const { value, relationTo } = node
        if (relationTo === 'media' && value?.url) {
            const imageUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL 
                ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${value.url}`
                : value.url
            return (
                <div key={i} className="my-8 flex justify-center">
                    <img
                        src={imageUrl}
                        alt={value.alt || 'Uploaded image'}
                        width={value.width || 500}
                        height={value.height || 300}
                        className="rounded-lg shadow-md object-contain"
                        style={{ maxWidth: value.width ? `${value.width}px` : '100%', height: 'auto' }}
                    />
                </div>
            )
        }
        return null

      case 'block':
        const { fields } = node
        if (fields?.blockType === 'codeBlock') {
          return (
            <div key={i} className="my-8">
              <CodeBlockRenderer code={fields.code} language={fields.language} />
            </div>
          )
        }
        if (fields?.blockType === 'fileTree') {
          // Casteamos `fields` al tipo esperado por `FileTreeBlockComponent`
          const fileTreeProps = fields as unknown as FileTreeBlockType
          return (
            <div key={i} className="my-8">
              <FileTreeBlockComponent
                blockTitle={fileTreeProps.blockTitle}
                initialSelectedId={fileTreeProps.initialSelectedId}
                showIndicator={fileTreeProps.showIndicator}
                rootNodes={fileTreeProps.rootNodes}
                blockType={fileTreeProps.blockType}
              />
            </div>
          )
        }
        return null
      
      case 'horizontalrule':
        return <hr key={i} className="my-8" />

      default:
        // Renderiza texto si es un nodo de texto en la raíz (poco común pero posible)
        if (node.type === 'text') {
            return serializeText([node])
        }
        return null
    }
  })
}


// --- Componente Principal ---

export const RichTextRender: React.FC<RichTextRenderProps> = ({ content }) => {
  if (!content?.root?.children) {
    return null
  }
  return <>{serializeNodes(content.root.children)}</>
}