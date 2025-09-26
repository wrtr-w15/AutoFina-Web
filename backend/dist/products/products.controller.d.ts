import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findPublic(): Promise<{
        success: boolean;
        data: import("./product.entity").Product[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findPublicOne(id: string): Promise<{
        success: boolean;
        data: import("./product.entity").Product;
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
        data: import("./product.entity").Product[];
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
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("./product.entity").Product;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    create(createProductDto: CreateProductDto): Promise<{
        success: boolean;
        message: string;
        data: import("./product.entity").Product;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        success: boolean;
        message: string;
        data: import("./product.entity").Product;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    replace(id: string, updateProductDto: UpdateProductDto): Promise<{
        success: boolean;
        message: string;
        data: import("./product.entity").Product;
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
