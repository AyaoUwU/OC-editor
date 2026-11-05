import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = process.env.INIT_CWD || process.cwd()

const nextConfig: NextConfig = {
  output: 'export',
  // pnpm 的 node_modules 位于工作区共享 store 时，Turbopack 的自动根目录推断
  // 可能落到 src/app；显式固定到项目根，保证静态导出可复现。
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    // 沙箱/无子进程环境（以及部分 CI）中禁用 webpack 构建 worker，
    // 避免 spawn EPERM；不影响产物。
    webpackBuildWorker: false,
    cpus: 1,
    workerThreads: true,
  },
  typescript: {
    // 类型检查由 `pnpm typecheck` / `tsc --noEmit` 独立执行。
    // 这里关闭 Next 内置的 worker 类型检查，避免在禁用子进程的沙箱中 EPERM。
    ignoreBuildErrors: true,
  },
  // Base UI / Floating UI 以 ESM + 子路径导出发布，pnpm 的虚拟目录下
  // webpack 直接消费时会出现“reexport 找不到”的解析问题；交给 Next 转译。
  transpilePackages: [
    '@base-ui/react',
    '@base-ui/utils',
    '@floating-ui/react-dom',
    '@floating-ui/dom',
    '@floating-ui/utils',
    '@floating-ui/core',
  ],
  // pnpm 虚拟目录（isolated）布局下，包内部会用子路径引用同级依赖
  // （例如 @base-ui/react 引用 @base-ui/utils/fastHooks，@base-ui/utils 引用 reselect）。
  // 把 pnpm 的公共 hoist 目录加入 webpack 解析路径，等价于 hoisted 布局。
  webpack: (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.symlinks = true
    const hoisted = path.resolve(process.cwd(), 'node_modules/.pnpm/node_modules')
    const modules = Array.isArray(config.resolve.modules)
      ? config.resolve.modules
      : ['node_modules']
    if (!modules.includes(hoisted)) config.resolve.modules = [hoisted, ...modules]
    return config
  },
};

export default nextConfig;
