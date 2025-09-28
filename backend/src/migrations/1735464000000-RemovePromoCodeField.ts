import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePromoCodeField1735464000000 implements MigrationInterface {
    name = 'RemovePromoCodeField1735464000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`promo_code\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`promo_code\` varchar(100) NULL`);
    }
}
