export declare const DEFAULT_AVATAR_LEVELS: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
};
export declare function setAvatarCache(avatars: Record<number, string>): void;
export declare function clearAvatarCache(): void;
export declare function getAvatarForLevel(level: number): string;
export declare function getLevelByCompletedModules(completedModulesCount: number): number;
