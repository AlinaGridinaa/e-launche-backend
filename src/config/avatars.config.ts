// Дефолтні аватари для різних рівнів (якщо в базі немає налаштувань)
export const DEFAULT_AVATAR_LEVELS = {
  0: '/avatars/level-0.png', // Початковий аватар (новачок)
  1: '/avatars/level-1.png', // Після 1 модуля
  2: '/avatars/level-2.png', // Після 2 модуля
  3: '/avatars/level-3.png', // Після 3 модуля
  4: '/avatars/level-4.png', // Після 4 модуля
  5: '/avatars/level-5.png', // Після 5 модуля
  6: '/avatars/level-6.png', // Після 6 модуля
  7: '/avatars/level-7.png', // Після 7 модуля
  8: '/avatars/level-8.png', // Після 8 модуля
  9: '/avatars/level-9.png', // Після 9 модуля
  10: '/avatars/level-10.png', // Після 10 модуля (випускник)
};

// Кеш для аватарів з бази даних
let avatarCache: Record<number, string> | null = null;

export function setAvatarCache(avatars: Record<number, string>) {
  avatarCache = avatars;
}

export function clearAvatarCache() {
  avatarCache = null;
}

// Функція для отримання аватара за рівнем
export function getAvatarForLevel(level: number): string {
  // Спочатку перевіряємо кеш з бази даних
  if (avatarCache && avatarCache[level]) {
    return avatarCache[level];
  }
  
  // Якщо немає в кеші, використовуємо дефолтні
  const maxLevel = Object.keys(DEFAULT_AVATAR_LEVELS).length - 1;
  const actualLevel = Math.min(level, maxLevel);
  return DEFAULT_AVATAR_LEVELS[actualLevel] || DEFAULT_AVATAR_LEVELS[0];
}

// Функція для визначення рівня за кількістю завершених модулів
export function getLevelByCompletedModules(completedModulesCount: number): number {
  // Рівень = кількість завершених модулів
  return completedModulesCount;
}
