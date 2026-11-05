'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** 出错时显示的区域名称。 */
  label?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * 局部错误边界：单个面板（例如关系图）渲染崩溃时只替换该面板，
 * 不会让整个应用变成空白页。
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[ErrorBoundary] ${this.props.label ?? '面板'}渲染失败`, error, info)
  }

  private handleReset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertTriangle size={22} strokeWidth={2} className="text-warning" />
        <p className="text-sm text-ink">
          {this.props.label ?? '这个面板'}渲染时出错，其他内容不受影响。
        </p>
        <p className="max-w-md break-all text-[11px] text-ink-faint">{error.message}</p>
        <button
          type="button"
          onClick={this.handleReset}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-ink-muted transition-colors hover:border-line-hover hover:text-ink"
        >
          <RotateCcw size={13} strokeWidth={2} />
          重试
        </button>
      </div>
    )
  }
}
