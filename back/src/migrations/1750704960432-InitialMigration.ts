import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750704960432 implements MigrationInterface {
    name = 'InitialMigration1750704960432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "create_product" ("id" SERIAL NOT NULL, "batche_count" integer NOT NULL, "created_time" TIMESTAMP NOT NULL, "updated_time" TIMESTAMP NOT NULL, "recipeId" integer, CONSTRAINT "PK_d8eacaf0478415472136e521154" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "is_deleted" boolean NOT NULL, "sum_on_kg" integer NOT NULL, "subscriptionId" integer, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_product" ("id" SERIAL NOT NULL, "volume" integer NOT NULL, "recipeId" integer, "rawMaterialId" integer, CONSTRAINT "PK_0289e1df82bce5b0ebbf092fd87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "raw_material" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "priceIsOnUnit" boolean NOT NULL, "subscriptionId" integer, CONSTRAINT "PK_78620c6a699438f30545519c86b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invetory" ("id" SERIAL NOT NULL, "price" integer NOT NULL, "date" TIMESTAMP NOT NULL, "subscriptionId" integer, "rawMaterialId" integer, "supplierId" integer, CONSTRAINT "PK_c4004776fc2cd3ba74ba94366cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier" ("id" SERIAL NOT NULL, "companyId" integer, CONSTRAINT "REL_860a390e2874a2150121f36ae9" UNIQUE ("companyId"), CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "identifier" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "is_raw_material" boolean NOT NULL, "available" boolean NOT NULL, "platoonId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platoon" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "subscriptionId" integer, CONSTRAINT "PK_590f069caa9a60c437ac975ddb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "companyId" integer, CONSTRAINT "REL_e551738d8623ccafbc57a6e8e6" UNIQUE ("companyId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "create_product" ADD CONSTRAINT "FK_b8891c9f175f168533aed4ab49c" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_62c3de331c8008ba841d45de7a8" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_product" ADD CONSTRAINT "FK_ea06e10e6c4facd2dae16afd891" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_product" ADD CONSTRAINT "FK_27207c1b879400416096402d278" FOREIGN KEY ("rawMaterialId") REFERENCES "raw_material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "raw_material" ADD CONSTRAINT "FK_4e6e09e34982db114fa4aadd09e" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invetory" ADD CONSTRAINT "FK_f9cee61204d3370c1f7764517d2" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invetory" ADD CONSTRAINT "FK_08a9c02c50d89f52396d6befefe" FOREIGN KEY ("rawMaterialId") REFERENCES "raw_material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invetory" ADD CONSTRAINT "FK_b1944fb8047d357d13a97750739" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier" ADD CONSTRAINT "FK_860a390e2874a2150121f36ae9d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_464ce4ea468edd80f0ac9a2343a" FOREIGN KEY ("platoonId") REFERENCES "platoon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platoon" ADD CONSTRAINT "FK_0421f270d3f4c1f4d3950eb988f" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_e551738d8623ccafbc57a6e8e6d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_e551738d8623ccafbc57a6e8e6d"`);
        await queryRunner.query(`ALTER TABLE "platoon" DROP CONSTRAINT "FK_0421f270d3f4c1f4d3950eb988f"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_464ce4ea468edd80f0ac9a2343a"`);
        await queryRunner.query(`ALTER TABLE "supplier" DROP CONSTRAINT "FK_860a390e2874a2150121f36ae9d"`);
        await queryRunner.query(`ALTER TABLE "invetory" DROP CONSTRAINT "FK_b1944fb8047d357d13a97750739"`);
        await queryRunner.query(`ALTER TABLE "invetory" DROP CONSTRAINT "FK_08a9c02c50d89f52396d6befefe"`);
        await queryRunner.query(`ALTER TABLE "invetory" DROP CONSTRAINT "FK_f9cee61204d3370c1f7764517d2"`);
        await queryRunner.query(`ALTER TABLE "raw_material" DROP CONSTRAINT "FK_4e6e09e34982db114fa4aadd09e"`);
        await queryRunner.query(`ALTER TABLE "recipe_product" DROP CONSTRAINT "FK_27207c1b879400416096402d278"`);
        await queryRunner.query(`ALTER TABLE "recipe_product" DROP CONSTRAINT "FK_ea06e10e6c4facd2dae16afd891"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_62c3de331c8008ba841d45de7a8"`);
        await queryRunner.query(`ALTER TABLE "create_product" DROP CONSTRAINT "FK_b8891c9f175f168533aed4ab49c"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "platoon"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
        await queryRunner.query(`DROP TABLE "invetory"`);
        await queryRunner.query(`DROP TABLE "raw_material"`);
        await queryRunner.query(`DROP TABLE "recipe_product"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "create_product"`);
    }

}
