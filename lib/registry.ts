/**
 * Global Asset Registry Client
 * Fetch dari gateway /api/v1/assets/registry
 * Single source of truth untuk NPC, Object, Theme, Style
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

let registryCache: any = null
let registryPromise: Promise<any> | null = null

export async function getRegistry(): Promise<any> {
  if (registryCache) return registryCache
  if (registryPromise) return registryPromise

  registryPromise = fetch(`${API}/api/v1/assets/registry`)
    .then(r => r.json())
    .then(data => {
      if (data.ok && data.data) {
        registryCache = data.data
        return registryCache
      }
      throw new Error(data.error || 'Failed to load registry')
    })
    .catch(err => {
      console.warn('[Registry] Failed to load:', err.message)
      return null
    })

  return registryPromise
}

export async function getThemes(): Promise<Record<string, ThemePreset>> {
  const reg = await getRegistry()
  return reg?.themePresets || {}
}

export async function getTierConfig(): Promise<Record<string, TierConfig>> {
  const reg = await getRegistry()
  return reg?.tierConfig || {}
}

export async function getNpcTemplates(): Promise<Record<string, NpcTemplate>> {
  const reg = await getRegistry()
  return reg?.npcTemplates || {}
}

export async function getObjectTemplates(): Promise<Record<string, ObjectTemplate>> {
  const reg = await getRegistry()
  return reg?.objectTemplates || {}
}

export async function getStyleTokens(): Promise<StyleTokens> {
  const reg = await getRegistry()
  return reg?.styleTokens || {}
}

// Types
export interface ThemePreset {
  id: string
  label: string
  icon: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    floor: string
    wall: string
    accent: string
  }
  lighting: {
    ambient: number
    directional: number
    color: string
    bg: string
  }
  floorType: string
  font: string
}

export interface TierConfig {
  maxRooms: number
  maxNpcs: number
  maxObjects: number
  maxWorkflows: number
  subdomain: boolean
  price: number
}

export interface NpcTemplate {
  id: string
  name: string
  role: string
  color: string
  hairColor: string
  gender: string
  archetype: string
  icon: string
  catchphrase: string
  portraitPrompt: string
  skills: string[]
  defaultPosition: { x: number; y: number }
  wanderRadius: number
}

export interface ObjectTemplate {
  id: string
  name: string
  category: string
  icon: string
  price: number
  rarity: string
  godType: string
  defaultColor: string
  defaultScale: { x: number; y: number; z: number }
  description: string
}

export interface StyleTokens {
  colors: Record<string, string>
  spacing: Record<string, number>
  borderRadius: Record<string, number>
  shadows: Record<string, string>
}
