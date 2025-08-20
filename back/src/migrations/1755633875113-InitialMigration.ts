import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1755633875113 implements MigrationInterface {
    name = 'InitialMigration1755633875113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password" ("id" SERIAL NOT NULL, "password" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_permission" ("id" SERIAL NOT NULL, "userId" integer, "companyId" integer, CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password" ADD CONSTRAINT "FK_dc877602e08545367e6f85b02e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_permission" ADD CONSTRAINT "FK_deb59c09715314aed1866e18a81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_permission" ADD CONSTRAINT "FK_0d29211425edc0483a2a7718e27" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permission" DROP CONSTRAINT "FK_0d29211425edc0483a2a7718e27"`);
        await queryRunner.query(`ALTER TABLE "user_permission" DROP CONSTRAINT "FK_deb59c09715314aed1866e18a81"`);
        await queryRunner.query(`ALTER TABLE "password" DROP CONSTRAINT "FK_dc877602e08545367e6f85b02e5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_permission"`);
        await queryRunner.query(`DROP TABLE "password"`);
    }

}
