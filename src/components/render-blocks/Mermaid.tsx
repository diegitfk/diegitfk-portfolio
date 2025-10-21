'use client'

import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'next-themes'
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

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
    })
    mermaidInitialized = true
  }
}

export const MermaidDiagram: React.FC<MermaidBlockProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    // Para iOS, usar visualViewport si está disponible, sino window.innerWidth
    const viewportWidth = window.visualViewport?.width || window.innerWidth
    return viewportWidth - 48
  })
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = theme === 'system' ? resolvedTheme : theme

  // Hook para calcular el ancho del contenedor en mobile
  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth
        // Solo actualizar si el cambio es mayor a 20px para evitar renders innecesarios
        setContainerWidth((prevWidth) => {
          const diff = Math.abs(width - prevWidth)
          return diff > 20 ? width : prevWidth
        })
      }
    }

    // Calcular ancho inicial con un pequeño delay para iOS
    const initialTimeout = setTimeout(updateWidth, 100)

    // Debounce para el resize
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateWidth, 150)
    }

    // Actualizar ancho cuando cambie el tamaño de la ventana
    window.addEventListener('resize', handleResize)
    // Eventos específicos para iOS
    window.addEventListener('orientationchange', handleResize)
    
    // Listener específico para visualViewport en iOS
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
      clearTimeout(timeoutId)
      clearTimeout(initialTimeout)
    }
  }, [])

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
            
            // Ajustar el SVG para que use todo el espacio disponible
            const svgElement = containerRef.current.querySelector('svg')
            if (svgElement) {
              // Eliminar restricciones de tamaño
              svgElement.style.maxWidth = 'none'
              svgElement.style.width = '100%'
              svgElement.style.height = '100%'
              svgElement.style.display = 'block'
              // Preservar el aspect ratio y centrar el contenido
              svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
              
              // Estilos específicos para iOS
              svgElement.style.webkitTransform = 'translateZ(0)'
              svgElement.style.transform = 'translateZ(0)'
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
  }, [code, currentTheme, containerWidth]) // Re-renderizar cuando cambie el código, el tema o el ancho del contenedor

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

      {/* Contenedor del diagrama con zoom y pan */}
      <div 
        ref={wrapperRef}
        className="relative rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-hidden min-h-[500px]"
        style={{
          WebkitOverflowScrolling: 'touch',
          WebkitTransform: 'translate3d(0,0,0)'
        }}
      >
        {/* Indicador de carga superpuesto */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 z-20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Renderizando diagrama...
              </span>
            </div>
          </div>
        )}

        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          centerZoomedOut={false}
          limitToBounds={false}
          wheel={{ step: 0.1 }}
          doubleClick={{ mode: 'zoomIn' }}
          panning={{ 
            disabled: false,
            velocityDisabled: true,
            excluded: []
          }}
          alignmentAnimation={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              {/* Controles de Zoom - Solo visibles cuando no está cargando */}
              {!isLoading && (
                <div className="absolute top-4 right-4 z-10 flex flex-row gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                  {/* Zoom In */}
                  <button
                    onClick={() => zoomIn()}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 group"
                    title="Acercar (Zoom In)"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </button>

                  {/* Zoom Out */}
                  <button
                    onClick={() => zoomOut()}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    title="Alejar (Zoom Out)"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>

                  {/* Centrar */}
                  <button
                    onClick={() => centerView()}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    title="Centrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </button>

                  {/* Reset */}
                  <button
                    onClick={() => resetTransform()}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    title="Restablecer Vista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Indicador de instrucciones - Solo visible cuando no está cargando */}
              {!isLoading && (
                <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Arrastra para mover • Scroll para zoom • Doble clic para acercar</span>
                    <span className="inline sm:hidden">Arrastra • Scroll • Doble clic</span>
                  </p>
                </div>
              )}

              {/* Componente transformable con el diagrama */}
              <TransformComponent
                wrapperClass="w-full h-full"
                contentClass="w-full h-full flex items-center justify-center"
              >
                <div 
                  ref={containerRef} 
                  className="mermaid-container sm:w-[580px] md:w-[700px] lg:w-[900px] xl:w-[1100px] 2xl:w-[1200px] h-full min-h-[400px]"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: containerWidth > 0 && containerWidth < 640 ? `${containerWidth}px` : undefined,
                    WebkitTransform: 'translateZ(0)',
                    transform: 'translateZ(0)',
                    minHeight: containerWidth > 0 && containerWidth < 640 ? '450px' : '400px'
                  }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  )
}

export default MermaidDiagram
