import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { NavigationProvider } from "@/components/layout/NavigationContext";
import { WordCountProvider } from "@/components/layout/WordCountContext";
import { EntityNavigateProvider } from "@/components/layout/EntityNavigateContext";
import { NavigationSourceProvider } from "@/components/layout/NavigationSourceContext";
import { SettingsProvider } from "@/lib/settings";
import { ActiveEditorProvider } from "@/lib/editor-context";
import { Providers } from "./providers";
import { SeedData } from "@/components/shared/SeedData";
import { OverlayRoot } from "@/components/layout/OverlayRoot";
import { KeyboardProvider } from "@/lib/KeyboardContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "OC editor",
  description: "原创角色与世界观创作工作台",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{
var legacy={'oc-studio-settings':'oc-editor-settings','oc-studio-custom-sections':'oc-editor-custom-sections','oc-studio-relation-edge-controls':'oc-editor-relation-edge-controls','oc-studio-timeline-hidden-events':'oc-editor-timeline-hidden-events','oc-studio-active-map-id':'oc-editor-active-map-id','oc-studio-trash-retention-days':'oc-editor-trash-retention-days','oc-studio-active-world-id':'oc-editor-active-world-id','oc-studio-external-seed-v1':'oc-editor-external-seed-v1'};
for(var k in legacy){if(!localStorage.getItem(legacy[k])&&localStorage.getItem(k)){localStorage.setItem(legacy[k],localStorage.getItem(k))}}
var s=JSON.parse(localStorage.getItem('oc-editor-settings')||'{}');var t=s.theme||'auto';var d=t==='auto'?window.matchMedia('(prefers-color-scheme:dark)').matches:t==='dark';if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark')}if(window.__TAURI__||window.__TAURI_INTERNALS__){document.documentElement.classList.add('tauri-mica')}}catch(e){}})()`,
            }}
          />
        </head>
        <body className="flex flex-col h-screen overflow-hidden">
        <Providers>
          <SeedData />
          <KeyboardProvider>
          <SettingsProvider>
            <ActiveEditorProvider>
            <EntityNavigateProvider>
              <WordCountProvider>
                <NavigationProvider>
                  <NavigationSourceProvider>
                  <AppShell>
                    {children}
                  </AppShell>
                  </NavigationSourceProvider>
                </NavigationProvider>
              </WordCountProvider>
            </EntityNavigateProvider>
            </ActiveEditorProvider>
          </SettingsProvider>
          </KeyboardProvider>
        </Providers>
      <OverlayRoot />
      </body>
    </html>
  );
}
