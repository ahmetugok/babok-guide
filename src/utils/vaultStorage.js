import { DEFAULT_PROJECT } from '../constants/index.js';

export async function openVault() {
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'documents' });
    localStorage.setItem('babok_vault_name', handle.name);
    return handle;
  } catch { return null; }
}

export async function writeProjectFile(handle, project) {
  if (!handle) return;
  try {
    const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
    const fileHandle = await handle.getFileHandle(`${safeName}.babok.json`, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(project, null, 2));
    await writable.close();
  } catch (err) { console.warn('Dosya yazılamadı:', err); }
}

export async function readAllProjectFiles(handle) {
  if (!handle) return [];
  const ps = [];
  try {
    for await (const entry of handle.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.babok.json')) {
        try {
          const file = await entry.getFile();
          const data = JSON.parse(await file.text());
          if (data?.name) ps.push({ ...DEFAULT_PROJECT, ...data });
        } catch { /* skip invalid */ }
      }
    }
  } catch (err) { console.warn('Vault okunamadı:', err); }
  return ps;
}

export async function deleteProjectFile(handle, project) {
  if (!handle) return;
  try {
    const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
    await handle.removeEntry(`${safeName}.babok.json`);
  } catch { /* file may not exist */ }
}
