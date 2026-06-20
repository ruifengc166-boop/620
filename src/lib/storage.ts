export interface SavedMaterial {
  id: string;
  title: string;
  materialType: string;
  content: string;
  riskLevel: string;
  savedAt: string;
}

const STORAGE_KEY = "banhui_saved_materials";

export function loadSavedMaterials(): SavedMaterial[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveMaterial(material: SavedMaterial): void {
  const existing = loadSavedMaterials();
  existing.unshift(material);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function deleteMaterial(id: string): void {
  const existing = loadSavedMaterials();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter(m => m.id !== id)));
}

export function clearAllMaterials(): void {
  localStorage.removeItem(STORAGE_KEY);
}
