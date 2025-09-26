declare class TranslationDto {
    en: string;
    ru: string;
    uk: string;
}
export declare class DescriptionBlockDto {
    title: string;
    content: string;
}
export declare class CreateProductDto {
    name: string;
    name_translations?: TranslationDto;
    short_description: string;
    short_description_translations?: TranslationDto;
    full_description: string;
    full_description_translations?: TranslationDto;
    price: number;
    image_url?: string;
    description_blocks: DescriptionBlockDto[];
    is_active?: boolean;
}
export {};
