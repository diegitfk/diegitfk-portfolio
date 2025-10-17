'use client'

import React, { useCallback, useMemo } from 'react'
import { File, Folder, Tree, type TreeViewElement } from '@/components/ui/file-tree'
import type { FileTreeBlockType, TreeNode } from '@/payload-types'

interface FileTreeBlockProps extends FileTreeBlockType {}

// Helper para filtrar nodos populados
const isPopulatedTreeNode = (node: number | TreeNode): node is TreeNode => {
  return typeof node === 'object' && node !== null && 'id' in node
}

// Helper para filtrar y mapear nodos populados
const getPopulatedNodes = (rootNodes?: (number | TreeNode)[] | null): TreeNode[] => {
  if (!rootNodes) return []
  return rootNodes.filter(isPopulatedTreeNode)
}

const buildElementsArray = (nodes: TreeNode[]): TreeViewElement[] => {
  return nodes.map((node) => ({
    id: String(node.id), // Convertir number a string para el componente UI
    name: node.name,
    isSelectable: node.isSelectable ?? true,
    children: node.children ? buildElementsArray(getPopulatedNodes(node.children)) : undefined,
  }))
}

const getAllFolderIds = (nodes: TreeNode[]): string[] => {
  const ids: string[] = []
  const traverse = (node: TreeNode) => {
    if (node.type === 'folder') {
      ids.push(String(node.id)) // Convertir number a string
      const populatedChildren = getPopulatedNodes(node.children)
      populatedChildren.forEach(traverse)
    }
  }
  nodes.forEach(traverse)
  return ids
}

export const FileTreeBlockComponent: React.FC<FileTreeBlockProps> = ({
  blockTitle,
  initialSelectedId,
  showIndicator,
  rootNodes,
}) => {

  // Obtener nodos populados
  const populatedRootNodes = useMemo(() => getPopulatedNodes(rootNodes), [rootNodes])

  const elements = useMemo(
    () => buildElementsArray(populatedRootNodes),
    [populatedRootNodes]
  )
  
  const initialExpandedItems = useMemo(
    () => getAllFolderIds(populatedRootNodes),
    [populatedRootNodes]
  )

  const renderTreeNodes = useCallback((nodes: TreeNode[]): React.ReactNode => {
    return nodes.map((node) => {
      if (node.type === 'folder') {
        const populatedChildren = getPopulatedNodes(node.children)
        return (
          <Folder
            key={node.id}
            value={String(node.id)}
            element={node.name}
            isSelectable={node.isSelectable ?? true}
          >
            {populatedChildren.length > 0 && renderTreeNodes(populatedChildren)}
          </Folder>
        )
      }

      return (
        <File
          key={node.id}
          value={String(node.id)}
          isSelectable={node.isSelectable ?? true}
        >
          <p>{node.name}</p>
        </File>
      )
    })
  }, [])

  // Si no hay nodos, mostrar mensaje
  if (!populatedRootNodes || populatedRootNodes.length === 0) {
    return (
      <section className="my-12 w-full">
        {blockTitle && <h2 className="mb-6 text-2xl font-bold">{blockTitle}</h2>}
        <div className="relative flex min-h-[200px] flex-col overflow-hidden rounded-lg border bg-background">
          <div className="border-b bg-muted/40 px-4 py-2">
            <p className="text-sm font-medium">Explorador de archivos</p>
          </div>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>No hay nodos de árbol configurados para este bloque.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {blockTitle && <h2 className="mb-6 text-2xl font-bold">{blockTitle}</h2>}

      <section className="flex flex-col items-center w-full">
        <div className="relative flex min-h-[200px] w-1/2 flex-col overflow-hidden rounded-lg border bg-background">
          <div className="border-b bg-muted/40 px-4 py-2">
            <p className="text-sm font-medium">Estructura de directorios</p>
          </div>
          <Tree
            className="flex-1 overflow-auto p-2"
            initialSelectedId={initialSelectedId ?? undefined}
            initialExpandedItems={initialExpandedItems}
            elements={elements}
            indicator={showIndicator ?? true}
          >
            {renderTreeNodes(populatedRootNodes)}
          </Tree>
        </div>
      </section>
    </>
  )
}