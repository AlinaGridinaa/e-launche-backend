import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { UserDocument } from '../schemas/user.schema';
export declare class ModulesService {
    private moduleModel;
    private userModel;
    constructor(moduleModel: Model<ModuleDocument>, userModel: Model<UserDocument>);
    private getMaxModulesByTariff;
    findAll(): Promise<Module[]>;
    findAllWithUserProgress(userId: string): Promise<Module[]>;
    findById(id: string): Promise<Module | null>;
    findByIdWithUserProgress(id: string, userId: string): Promise<Module | null>;
    findByNumber(number: number): Promise<Module | null>;
    create(moduleData: Partial<Module>): Promise<Module>;
    update(id: string, moduleData: Partial<Module>): Promise<Module | null>;
    delete(id: string): Promise<Module | null>;
    updateLessonCompletion(moduleId: string, lessonNumber: number, isCompleted: boolean): Promise<Module>;
    deleteAll(): Promise<void>;
    createMany(modules: Partial<Module>[]): Promise<any[]>;
}
