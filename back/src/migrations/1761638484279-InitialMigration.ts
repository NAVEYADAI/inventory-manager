import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1761638484279 implements MigrationInterface {
    name = 'InitialMigration1761638484279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" ADD "hash" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" DROP COLUMN "hash"`);
    }

}
