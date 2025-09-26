import { Product } from '../products/product.entity';
export declare class Category {
    id: number;
    name: string;
    name_translations: {
        en: string;
        ru: string;
        uk: string;
    };
    description: string;
    description_translations: {
        en: string;
        ru: string;
        uk: string;
    };
    color: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    products: Product[];
}
