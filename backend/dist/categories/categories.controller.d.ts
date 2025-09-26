import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findPublic(): Promise<{
        success: boolean;
        data: import("./category.entity").Category[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./category.entity").Category[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./category.entity").Category;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    create(createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        message: string;
        data: import("./category.entity").Category;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        success: boolean;
        message: string;
        data: import("./category.entity").Category;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
