import { MigrationInterface, QueryRunner } from "typeorm";

export class ApiKey1738120913416 implements MigrationInterface {
    name = 'ApiKey1738120913416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."api-key_type_enum" AS ENUM('SYSTEM', 'DEFAULT')`);
        await queryRunner.query(`CREATE TABLE "api-key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."api-key_type_enum" NOT NULL DEFAULT 'DEFAULT', "name" character varying NOT NULL, "key" character varying NOT NULL, "hash" character varying NOT NULL, "is_active" boolean NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_6aa260b22bc37327e007316bb77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "api-key"`);
        await queryRunner.query(`DROP TYPE "public"."api-key_type_enum"`);
    }

}
