'use client'

import React from 'react'
import Image from 'next/image'

// Asegúrate de que las rutas a tus componentes sean correctas
import { CodeBlockRenderer } from './render-blocks/CodeBlock' 
import { FileTreeBlockComponent } from './render-blocks/FileTree'
import { TabsAnimatedComponent } from './render-blocks/TabsAnimated'
import { MermaidDiagram } from './render-blocks/Mermaid'
import { AnimatedSection, AnimatedBlock, AnimatedListItem } from './AnimatedSection'
import type { FileTreeBlockType, AnimatedTabsBlock } from '../payload-types' // Asumiendo que exportas este tipo desde FileTree.tsx
import { JSX } from 'react'
import { generateHeadingId } from '@/lib/headingUtils'
// --- Tipos para el Rich Text de PayloadCMS ---

type RichTextNode = {
  type: string
  children?: RichTextNode[]
  [key: string]: any
}

type TextNode = {
  text: string
  format?: number  // Flag de formato: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code
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

// Contador global para animaciones secuenciales
let animationCounter = 0
const resetAnimationCounter = () => { animationCounter = 0 }
const getNextDelay = (increment: number = 0.08) => {
  const delay = animationCounter * increment
  animationCounter++
  return delay
}

// --- Funciones de Serialización ---

const serializeText = (nodes: RichTextNode[], skipAnimation = false): React.ReactNode => {
  return nodes.map((node, i) => {
    if (node.type === 'text') {
      const textNode = node as unknown as TextNode
      let text = <span key={i}>{textNode.text}</span>

      // Soporte para el campo format (número con flags de bits)
      const format = textNode.format || 0
      const isBold = textNode.bold || (format & 1) === 1
      const isItalic = textNode.italic || (format & 2) === 2
      const isStrikethrough = textNode.strikethrough || (format & 4) === 4
      const isUnderline = textNode.underline || (format & 8) === 8
      const isCode = textNode.code || (format & 16) === 16

      if (isBold) {
        text = <strong key={i}>{text}</strong>
      }
      if (isItalic) {
        text = <em key={i} className="italic">{text}</em>
      }
      if (isUnderline) {
        text = <u key={i}>{text}</u>
      }
      if (isStrikethrough) {
        text = <s key={i}>{text}</s>
      }
      if (isCode) {
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

const serializeNodes = (nodes: RichTextNode[], skipAnimation = false): React.ReactNode => {
  return nodes.map((node, i) => {
    if (!node) return null

    switch (node.type) {
      case 'heading':
        const Tag = node.tag as keyof JSX.IntrinsicElements
        const tagClasses: Record<string, string> = {
            h1: "scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-6 sm:mt-8 mb-4 sm:mb-6",
            h2: "scroll-m-20 border-b pb-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6",
            h3: "scroll-m-20 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mt-6 sm:mt-8 md:mt-10 mb-3 sm:mb-4",
            h4: "scroll-m-20 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight mt-6 sm:mt-7 md:mt-8 mb-3 sm:mb-4",
            h5: "scroll-m-20 text-base sm:text-lg md:text-xl font-semibold tracking-tight mt-4 sm:mt-5 md:mt-6 mb-2 sm:mb-3",
            h6: "scroll-m-20 text-sm sm:text-base md:text-lg font-semibold tracking-tight mt-3 sm:mt-4 mb-2",
        }
        // Generar ID para el heading
        const headingText = node.children
          ?.filter((child: any) => child.type === 'text')
          .map((child: any) => child.text)
          .join('') || ''
        const headingId = generateHeadingId(headingText)
        const headingDelay = getNextDelay()
        return (
          <AnimatedSection key={i} delay={headingDelay}>
            <Tag id={headingId} className={tagClasses[node.tag] || ''}>{serializeText(node.children || [], true)}</Tag>
          </AnimatedSection>
        )

      case 'paragraph':
        const paragraphDelay = getNextDelay()
        return (
          <AnimatedSection key={i} delay={paragraphDelay} duration={0.4}>
            <p className="text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 mb-3 sm:mb-4">{serializeText(node.children || [], true)}</p>
          </AnimatedSection>
        )

      case 'quote':
        const quoteDelay = getNextDelay()
        return (
          <AnimatedSection key={i} delay={quoteDelay}>
            <blockquote className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6 mb-3 sm:mb-4 border-l-2 pl-4 sm:pl-6 italic leading-6 sm:leading-7">{serializeText(node.children || [], true)}</blockquote>
          </AnimatedSection>
        )

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        const listClasses = node.listType === 'check' 
            ? 'my-4 sm:my-6 ml-4 sm:ml-6 list-none space-y-2 text-sm sm:text-base md:text-lg' 
            : node.listType === 'number'
            ? 'my-4 sm:my-6 ml-4 sm:ml-6 list-decimal space-y-2 marker:text-muted-foreground text-sm sm:text-base md:text-lg'
            : 'my-4 sm:my-6 ml-4 sm:ml-6 list-disc space-y-2 marker:text-foreground text-sm sm:text-base md:text-lg'

        const listDelay = getNextDelay()
        return (
          <AnimatedSection key={i} delay={listDelay}>
            <ListTag className={listClasses}>{serializeNodes(node.children || [], true)}</ListTag>
          </AnimatedSection>
        )

      case 'listitem':
        if (typeof node.checked === 'boolean') {
          return (
            <AnimatedListItem key={i} index={i}>
              <li className="flex items-start space-x-2">
                <input type="checkbox" checked={node.checked} readOnly className="form-checkbox h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1 flex-shrink-0" />
                <span className="leading-7">{serializeText(node.children || [], true)}</span>
              </li>
            </AnimatedListItem>
          )
        }
        return (
          <AnimatedListItem key={i} index={i}>
            <li className="leading-6 sm:leading-7 md:leading-8">{serializeText(node.children || [], true)}</li>
          </AnimatedListItem>
        )

      case 'upload':
        const { value, relationTo } = node
        if (relationTo === 'media' && value?.url) {
            const imageUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL 
                ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${value.url}`
                : value.url
            const uploadDelay = getNextDelay()
            const imageWidth = value?.width || 800
            const imageHeight = value?.height || 600
            
            return (
                <AnimatedBlock key={i} delay={uploadDelay}>
                  <div className="my-4 sm:my-6 md:my-8 flex justify-center px-4 sm:px-0">
                    <div className="relative w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-3xl" 
                         style={{ maxWidth: value.width ? `min(${value.width}px, 100%)` : '100%' }}>
                      <Image
                          src={imageUrl}
                          alt={value.alt || 'Uploaded image'}
                          width={imageWidth}
                          height={imageHeight}
                          className="w-full h-auto rounded-lg shadow-md object-contain"
                      />
                    </div>
                  </div>
                </AnimatedBlock>
            )
        }
        return null

      case 'block':
        const { fields } = node
        const blockDelay = getNextDelay()
        if (fields?.blockType === 'codeBlock') {
          return (
            <AnimatedBlock key={i} delay={blockDelay}>
              <div className="my-8">
                <CodeBlockRenderer code={fields.code} language={fields.language} filename={fields.filename} iconReference={fields.iconReference}/>
              </div>
            </AnimatedBlock>
          )
        }
        if (fields?.blockType === 'fileTree') {
          // Casteamos `fields` al tipo esperado por `FileTreeBlockComponent`
          const fileTreeProps = fields as unknown as FileTreeBlockType
          return (
            <AnimatedBlock key={i} delay={blockDelay}>
              <div className="my-8 w-full h-full">
                <FileTreeBlockComponent
                  initialSelectedId={fileTreeProps.initialSelectedId}
                  showIndicator={fileTreeProps.showIndicator}
                  rootNodes={fileTreeProps.rootNodes}
                  blockType={fileTreeProps.blockType}
                />
              </div>
            </AnimatedBlock>
          )
        }
        if (fields?.blockType === 'animatedTabs') {
          // Casteamos `fields` al tipo esperado por `TabsAnimatedComponent`
          const animatedTabsProps = fields as unknown as AnimatedTabsBlock
          return (
            <AnimatedBlock key={i} delay={blockDelay}>
              <div className="my-8 w-full">
                <TabsAnimatedComponent
                  tabs={animatedTabsProps.tabs}
                  blockType={animatedTabsProps.blockType}
                />
              </div>
            </AnimatedBlock>
          )
        }
        if (fields?.blockType === 'mermaid-block') {
          return (
            <AnimatedBlock key={i} delay={blockDelay}>
              <div className="my-8 w-full">
                <MermaidDiagram code={fields.code} />
              </div>
            </AnimatedBlock>
          )
        }
        return null
      
      case 'horizontalrule':
        const hrDelay = getNextDelay()
        return (
          <AnimatedSection key={i} delay={hrDelay} duration={0.4}>
            <hr className="my-8" />
          </AnimatedSection>
        )

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
  // Resetear el contador de animaciones al renderizar
  resetAnimationCounter()
  return <>{serializeNodes(content.root.children)}</>
}