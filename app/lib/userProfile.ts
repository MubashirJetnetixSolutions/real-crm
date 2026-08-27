export const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD2M0sdI_M0PpZqj2lxyAns4KVtqCOeVWxE2ewGMSMWi0Gy8xUhmo1GqjRc7UyvF-aFbUg1Pn-F_qwwFvnDE4m8HyRKceqWS6Ry9C7Ebf1INkU-o5DthzEqjhYnaRzSmwsserBWUM50KO_en6dY5i8qTcK7xmnxK1hpCoFnmEYgfFYcaALPErg9PcnE9PB-9R-Fa64-DTlUVzGA5zn08lCFtQHxlixOL0IFx5D4ngCWWfVbhP5vCULy1U9BcjnWzrHNd3mBCojBT4CF";

const AVATAR_KEY = "drImpact_user_avatar";

export function getStoredAvatar(): string {
  if (typeof window === "undefined") return DEFAULT_AVATAR;
  return localStorage.getItem(AVATAR_KEY) || DEFAULT_AVATAR;
}

export function setStoredAvatar(dataUrl: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AVATAR_KEY, dataUrl);
  window.dispatchEvent(new Event("drImpact-avatar-change"));
}

export function clearStoredAvatar() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AVATAR_KEY);
  window.dispatchEvent(new Event("drImpact-avatar-change"));
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
