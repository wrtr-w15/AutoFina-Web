declare class TranslationDto {
    en: string;
    ru: string;
    uk: string;
}
export declare class CreateCategoryDto {
    name: string;
    name_translations?: TranslationDto;
    description?: string;
    description_translations?: TranslationDto;
    color?: string;
    is_active?: boolean;
}
export {};
