'use client'

import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'next-themes'

// Interfaz para el bloque de Mermaid según la configuración de Payload
interface MermaidBlockProps {
  code: string
}

// Inicialización de Mermaid (se ejecuta una vez)
let mermaidInitialized = false

const initializeMermaid = (theme: string = 'default') => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'strict', // Seguridad máxima para contenido de usuarios
      fontFamily: 'inherit',
      suppressErrorRendering: true, // Evita que mermaid renderice errores en el DOM automáticamente
    })
    // Sobreescribir el manejador de errores para evitar que se cree el elemento HTML por defecto
    mermaid.parseError = (err) => {
      console.error('Mermaid Parse Error suppressed:', err) 
    }
    mermaidInitialized = true
  }
}

export const MermaidDiagram: React.FC<MermaidBlockProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = theme === 'system' ? resolvedTheme : theme

  useEffect(() => {
    // Inicializar Mermaid con el tema actual
    initializeMermaid(currentTheme)

    if (containerRef.current && code) {
      // Eliminar el atributo data-processed para forzar el re-renderizado
      containerRef.current.removeAttribute('data-processed')

      const renderDiagram = async () => {
        setIsLoading(true)
        setError(null)

        try {
          // Generar un ID único para cada renderizado
          const id = `mermaid-diagram-${Math.random().toString(36).substring(2, 11)}`
          
          // Renderizar el diagrama
          const { svg } = await mermaid.render(id, code)
          
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
            
            // Ajustar el SVG para que se comporte bien dentro del contenedor
            const svgElement = containerRef.current.querySelector('svg')
            if (svgElement) {
              // Permitir que el SVG tenga su tamaño natural pero no exceda el contenedor
              // y permitir scroll si es muy grande
              svgElement.style.maxWidth = '100%'
              svgElement.style.height = 'auto'
              svgElement.style.display = 'block'
              svgElement.style.margin = '0 auto' // Centrar si es más pequeño
              
              // Eliminar atributos de ancho/alto fijo si existen para permitir responsividad
              // pero manteniendo el viewBox
              // svgElement.removeAttribute('width') 
              // svgElement.removeAttribute('height')
            }
            
            setIsLoading(false)
          }
        } catch (e) {
          console.error('Error al renderizar el diagrama Mermaid:', e)
          const errorMessage = e instanceof Error ? e.message : 'Error de sintaxis en el diagrama'
          setError(errorMessage)
          setIsLoading(false)
          
          if (containerRef.current) {
            containerRef.current.innerHTML = '' // Limpiar en caso de error
          }
        }
      }

      renderDiagram()
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [code, currentTheme]) // Re-renderizar cuando cambie el código o el tema

  return (
    <div className="my-8 w-full">
      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <div className="flex items-start gap-2">
            <svg 
              className="mt-0.5 h-5 w-5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
            <div>
              <p className="font-semibold">Error en el diagrama Mermaid</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del diagrama simple */}
      <div 
        className="relative rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-x-auto min-h-[200px] flex items-center justify-center p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {/* Indicador de carga superpuesto */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 z-20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Renderizando...
              </span>
            </div>
          </div>
        )}

        <div 
          ref={containerRef} 
          className="w-full flex justify-center"
        />
      </div>
    </div>
  )
}

export default MermaidDiagram
