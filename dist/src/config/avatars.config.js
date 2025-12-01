"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AVATAR_LEVELS = void 0;
exports.setAvatarCache = setAvatarCache;
exports.clearAvatarCache = clearAvatarCache;
exports.getAvatarForLevel = getAvatarForLevel;
exports.getLevelByCompletedModules = getLevelByCompletedModules;
exports.DEFAULT_AVATAR_LEVELS = {
    0: '/avatars/level-0.png',
    1: '/avatars/level-1.png',
    2: '/avatars/level-2.png',
    3: '/avatars/level-3.png',
    4: '/avatars/level-4.png',
    5: '/avatars/level-5.png',
    6: '/avatars/level-6.png',
    7: '/avatars/level-7.png',
    8: '/avatars/level-8.png',
    9: '/avatars/level-9.png',
    10: '/avatars/level-10.png',
};
let avatarCache = null;
function setAvatarCache(avatars) {
    avatarCache = avatars;
}
function clearAvatarCache() {
    avatarCache = null;
}
function getAvatarForLevel(level) {
    if (avatarCache && avatarCache[level]) {
        return avatarCache[level];
    }
    const maxLevel = Object.keys(exports.DEFAULT_AVATAR_LEVELS).length - 1;
    const actualLevel = Math.min(level, maxLevel);
    return exports.DEFAULT_AVATAR_LEVELS[actualLevel] || exports.DEFAULT_AVATAR_LEVELS[0];
}
function getLevelByCompletedModules(completedModulesCount) {
    return completedModulesCount;
}
//# sourceMappingURL=avatars.config.js.map