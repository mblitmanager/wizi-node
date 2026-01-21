import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormateurIdToAgenda1768989917161 implements MigrationInterface {
  name = "AddFormateurIdToAgenda1768989917161";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only focus on adding formateur_id to agendas if it doesn't exist
    const table = await queryRunner.getTable("agendas");
    const hasColumn = table?.columns.some((col) => col.name === "formateur_id");

    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE \`agendas\` ADD \`formateur_id\` int NULL`,
      );
    }

    // Add foreign key if it doesn't exist
    // Note: we might want to check the constraint existence too, but try/catch is simpler for raw SQL
    try {
      await queryRunner.query(
        `ALTER TABLE \`agendas\` ADD CONSTRAINT \`FK_f2c889cc867cba3e68c2d042a9e\` FOREIGN KEY (\`formateur_id\`) REFERENCES \`formateurs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    } catch (e) {
      // Silently ignore if constraint already exists
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE \`agendas\` DROP FOREIGN KEY \`FK_f2c889cc867cba3e68c2d042a9e\``,
      );
    } catch (e) {}
    try {
      await queryRunner.query(
        `ALTER TABLE \`agendas\` DROP COLUMN \`formateur_id\``,
      );
    } catch (e) {}
  }
}
