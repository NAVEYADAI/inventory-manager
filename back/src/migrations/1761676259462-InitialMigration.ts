import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1761676259462 implements MigrationInterface {
    name = 'InitialMigration1761676259462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" DROP CONSTRAINT "FK_dc877602e08545367e6f85b02e5"`);
        await queryRunner.query(`ALTER TABLE "password" ALTER COLUMN "date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "password" ADD CONSTRAINT "FK_dc877602e08545367e6f85b02e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" DROP CONSTRAINT "FK_dc877602e08545367e6f85b02e5"`);
        await queryRunner.query(`ALTER TABLE "password" ALTER COLUMN "date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "password" ADD CONSTRAINT "FK_dc877602e08545367e6f85b02e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
