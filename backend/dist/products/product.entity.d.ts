import { Category } from '../categories/category.entity';
export declare class Product {
    id: number;
    name: string;
    name_translations: {
        en: string;
        ru: string;
        uk: string;
    };
    short_description: string;
    short_description_translations: {
        en: string;
        ru: string;
        uk: string;
    };
    full_description: string;
    full_description_translations: {
        en: string;
        ru: string;
        uk: string;
    };
    description_blocks: Array<{
        title: string;
        content: string;
    }>;
    price: number;
    image_url: string;
    is_active: boolean;
    category_id: number;
    category: Category;
    created_at: Date;
    updated_at: Date;
}
