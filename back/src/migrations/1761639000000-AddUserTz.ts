import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTz1761639000000 implements MigrationInterface {
    name = 'AddUserTz1761639000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "tz" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tz"`);
    }
}
