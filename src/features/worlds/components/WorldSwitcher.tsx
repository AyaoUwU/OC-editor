'use client'

import { useState } from 'react'
import { Check, ChevronDown, Globe2, Settings2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorlds } from '../hooks/useWorlds'
import { WorldPicker } from './WorldPicker'

/**
 * 顶栏/侧栏的世界观切换入口。切换后所有列表按新世界观重新加载。
 */
export function WorldSwitcher({
  variant = 'bar',
  iconOnly = false,
}: {
  variant?: 'bar' | 'sidebar'
  iconOnly?: boolean
}) {
  const { worlds, activeWorld, activeWorldId, selectWorld } = useWorlds()
  const [manageOpen, setManageOpen] = useState(false)

  const label = activeWorld?.name ?? '未选择世界观'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={
            variant === 'sidebar'
              ? 'flex w-full items-center gap-2 rounded-md border border-line bg-paper-card/50 px-2 py-2 text-left text-sm text-ink transition-colors hover:border-line-hover'
              : iconOnly
                ? 'flex h-10 w-10 items-center justify-center rounded-md text-ink-muted transition-colors hover:text-ink hover:bg-black/5 dark:hover:bg-white/5'
                : 'flex h-7 items-center gap-1.5 rounded-md border border-line bg-paper-card/50 px-2 text-xs text-ink-muted transition-colors hover:border-line-hover hover:text-ink'
          }
          title={`切换世界观（当前：${label}）`}
        >
          <Globe2 size={variant === 'sidebar' ? 15 : iconOnly ? 20 : 13} strokeWidth={2} className="shrink-0 text-ink-faint" />
          {iconOnly ? null : <span className="min-w-0 flex-1 truncate">{label}</span>}
          {iconOnly ? null : <ChevronDown size={12} strokeWidth={2} className="shrink-0 text-ink-faint" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px]">
          <DropdownMenuLabel>世界观</DropdownMenuLabel>
          {worlds.length === 0 ? (
            <DropdownMenuItem disabled>还没有世界观</DropdownMenuItem>
          ) : (
            worlds.map((world) => (
              <DropdownMenuItem
                key={world.id}
                onClick={() => {
                  if (world.id !== undefined) selectWorld(world.id)
                }}
              >
                <span className="flex w-full items-center gap-2">
                  <span className="min-w-0 flex-1 truncate">{world.name}</span>
                  {world.id === activeWorldId ? (
                    <Check size={13} strokeWidth={2} className="shrink-0 text-ink-muted" />
                  ) : null}
                </span>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setManageOpen(true)}>
            <span className="flex items-center gap-2">
              <Settings2 size={13} strokeWidth={2} />
              管理世界观…
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {manageOpen ? <WorldPicker mode="manage" onClose={() => setManageOpen(false)} /> : null}
    </>
  )
}
