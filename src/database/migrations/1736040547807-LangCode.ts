import { MigrationInterface, QueryRunner } from "typeorm";

export class LangCode1736040547807 implements MigrationInterface {
    name = 'LangCode1736040547807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."post_translations_language_code_enum" RENAME TO "post_translations_language_code_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."post_translations_language_code_enum" AS ENUM('en', 'ar')`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "language_code" TYPE "public"."post_translations_language_code_enum" USING "language_code"::"text"::"public"."post_translations_language_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."post_translations_language_code_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."post_translations_language_code_enum_old" AS ENUM('en_US', 'ru_RU')`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "language_code" TYPE "public"."post_translations_language_code_enum_old" USING "language_code"::"text"::"public"."post_translations_language_code_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."post_translations_language_code_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."post_translations_language_code_enum_old" RENAME TO "post_translations_language_code_enum"`);
    }

}
