export declare class Project {
    id: number;
    name: string;
    short_description: string;
    full_description: string;
    price: number;
    description_blocks: Array<{
        title: string;
        content: string;
    }>;
    created_at: Date;
    updated_at: Date;
}
