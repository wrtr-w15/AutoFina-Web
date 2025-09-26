export declare class DescriptionBlockDto {
    title: string;
    content: string;
}
export declare class CreateProjectDto {
    name: string;
    short_description: string;
    full_description: string;
    price: number;
    description_blocks: DescriptionBlockDto[];
}
