import { MigrationInterface, QueryRunner } from "typeorm";

export class ApiKeyDate1738122063687 implements MigrationInterface {
    name = 'ApiKeyDate1738122063687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api-key" ALTER COLUMN "start_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api-key" ALTER COLUMN "end_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api-key" ALTER COLUMN "end_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api-key" ALTER COLUMN "start_date" SET NOT NULL`);
    }

}
