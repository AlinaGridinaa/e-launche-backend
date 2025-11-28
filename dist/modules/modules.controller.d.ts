import { ModulesService } from './modules.service';
import { Module } from '../schemas/module.schema';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    findAll(): Promise<Module[]>;
    findById(id: string): Promise<Module | null>;
    findByNumber(number: string): Promise<Module | null>;
    create(moduleData: Partial<Module>): Promise<Module>;
    update(id: string, moduleData: Partial<Module>): Promise<Module | null>;
    delete(id: string): Promise<Module | null>;
    markLessonComplete(id: string, lessonNumber: string, isCompleted: boolean): Promise<Module>;
}
