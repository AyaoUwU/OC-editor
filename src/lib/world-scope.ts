/**
 * 当前世界观的全局只读作用域。
 *
 * 数据层（Dexie）里每条创作实体都带 `worldId`；所有列表查询统一经过这里过滤，
 * 新建记录由 `db.ts` 的 creating hook 自动打上当前世界观。
 *
 * 该模块不依赖 React，服务层与 Dexie hook 可以直接同步读取。
 */

const ACTIVE_WORLD_KEY = 'oc-editor-active-world-id'
/** 旧版本（OC Studio 时期）的键名；layout 的内联脚本会先迁移，这里再兜底读一次。 */
const LEGACY_ACTIVE_WORLD_KEY = 'oc-studio-active-world-id'

export const WORLD_CHANGED_EVENT = 'oc-world-changed'

let activeWorldId: number | null = null
/** 最早创建的世界观：旧数据（没有 worldId）默认归属它。 */
let legacyWorldId: number | null = null
/** 世界观列表是否已经加载完成。 */
let scopeReady = false

function readStoredWorldId(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw =
      window.localStorage.getItem(ACTIVE_WORLD_KEY) ??
      window.localStorage.getItem(LEGACY_ACTIVE_WORLD_KEY)
    if (!raw) return null
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

// 模块初始化时同步恢复上次选择，避免首帧把所有世界观的数据都查出来。
activeWorldId = readStoredWorldId()

export function getActiveWorldId(): number | null {
  return activeWorldId
}

export function getLegacyWorldId(): number | null {
  return legacyWorldId
}

export function setLegacyWorldId(id: number | null): void {
  legacyWorldId = id
}

export function isWorldScopeReady(): boolean {
  return scopeReady
}

export function markWorldScopeReady(): void {
  scopeReady = true
}

/**
 * 切换当前世界观。会持久化选择并广播事件，让所有列表重新加载。
 */
export function setActiveWorldId(id: number | null): void {
  if (activeWorldId === id) return
  activeWorldId = id
  if (typeof window !== 'undefined') {
    try {
      if (id === null) window.localStorage.removeItem(ACTIVE_WORLD_KEY)
      else window.localStorage.setItem(ACTIVE_WORLD_KEY, String(id))
    } catch {
      // 忽略隐私模式下的写入失败
    }
    window.dispatchEvent(new Event(WORLD_CHANGED_EVENT))
    // 复用已有的刷新通道，让列表 hook 立即重新查询。
    window.dispatchEvent(new Event('data-updated'))
  }
}

type MaybeScoped = { worldId?: number | null }

/**
 * 记录是否属于当前世界观。
 * 没有 `worldId` 的历史数据归属于最早创建的世界观。
 */
export function belongsToActiveWorld(record: MaybeScoped | null | undefined): boolean {
  if (!record) return false
  if (activeWorldId === null) return false
  if (record.worldId === activeWorldId) return true
  const unscoped = record.worldId === undefined || record.worldId === null
  return unscoped && legacyWorldId !== null && legacyWorldId === activeWorldId
}

export function filterByActiveWorld<T extends MaybeScoped>(rows: T[]): T[] {
  if (activeWorldId === null) return []
  return rows.filter((row) => belongsToActiveWorld(row))
}

/** 新建记录时写入的世界观 id；没有选中世界观时返回 undefined。 */
export function activeWorldIdForWrite(): number | undefined {
  return activeWorldId ?? undefined
}

/** 该世界观 id 是否为当前作用域（供按 id 归属判断）。 */
export function isActiveWorld(worldId: number | null | undefined): boolean {
  if (worldId === activeWorldId) return true
  const unscoped = worldId === undefined || worldId === null
  return unscoped && legacyWorldId !== null && legacyWorldId === activeWorldId
}
