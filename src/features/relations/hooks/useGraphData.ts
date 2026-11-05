'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { liveQuery } from 'dexie'
import { buildGraphData, syncRelationsFromEntities } from '../services'
import type { GraphNode, GraphEdge } from '../types'

/**
 * Dexie liveQuery 直接观察 characters / countries / events / relations。
 * buildGraphData 会先把实体数组投影归一到 relations，再从唯一真相源建图。
 */
export function useGraphData() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  /** 防止同步与刷新互相触发（多关系场景曾因此无限刷屏）。 */
  const syncingRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const runSync = async (): Promise<void> => {
      if (syncingRef.current) return
      syncingRef.current = true
      try {
        await syncRelationsFromEntities()
      } catch (cause) {
        console.error('[useGraphData] 关系归一失败', cause)
      } finally {
        syncingRef.current = false
      }
    }

    // 写迁移必须在 liveQuery 外执行；liveQuery 只负责只读快照。
    void runSync()

    const subscription = liveQuery(() => buildGraphData()).subscribe({
      next: (data) => {
        if (cancelled) return
        setNodes(data.nodes)
        setEdges(data.edges)
        setError(null)
        setLoading(false)
      },
      error: (cause) => {
        console.error('[useGraphData] 聚合失败', cause)
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : '图谱数据加载失败')
        setLoading(false)
      },
    })

    let syncTimer: ReturnType<typeof setTimeout> | null = null
    const reloadFromDb = async (): Promise<void> => {
      try {
        // 面板保存后先归一再重建。除了 liveQuery，这里主动拉一次快照，
        // 避免某些 Dexie 批量更新/外部写入没有触发 observable 时图仍显示旧标签。
        await runSync()
        const data = await buildGraphData()
        if (cancelled) return
        setNodes(data.nodes)
        setEdges(data.edges)
        setError(null)
        setLoading(false)
      } catch (cause) {
        console.error('[useGraphData] 关系刷新失败', cause)
      }
    }
    const queueSync = (): void => {
      if (syncTimer) clearTimeout(syncTimer)
      syncTimer = setTimeout(() => {
        void reloadFromDb()
      }, 180)
    }
    window.addEventListener('data-updated', queueSync)
    window.addEventListener('oc-relations-changed', queueSync)

    return () => {
      cancelled = true
      subscription.unsubscribe()
      if (syncTimer) clearTimeout(syncTimer)
      window.removeEventListener('data-updated', queueSync)
      window.removeEventListener('oc-relations-changed', queueSync)
    }
  }, [reloadKey])

  const refresh = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  return { nodes, edges, loading, error, refresh }
}
