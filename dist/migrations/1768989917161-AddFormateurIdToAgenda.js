"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFormateurIdToAgenda1768989917161 = void 0;
class AddFormateurIdToAgenda1768989917161 {
    constructor() {
        this.name = "AddFormateurIdToAgenda1768989917161";
    }
    async up(queryRunner) {
        const table = await queryRunner.getTable("agendas");
        const hasColumn = table?.columns.some((col) => col.name === "formateur_id");
        if (!hasColumn) {
            await queryRunner.query(`ALTER TABLE \`agendas\` ADD \`formateur_id\` int NULL`);
        }
        try {
            await queryRunner.query(`ALTER TABLE \`agendas\` ADD CONSTRAINT \`FK_f2c889cc867cba3e68c2d042a9e\` FOREIGN KEY (\`formateur_id\`) REFERENCES \`formateurs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }
        catch (e) {
        }
    }
    async down(queryRunner) {
        try {
            await queryRunner.query(`ALTER TABLE \`agendas\` DROP FOREIGN KEY \`FK_f2c889cc867cba3e68c2d042a9e\``);
        }
        catch (e) { }
        try {
            await queryRunner.query(`ALTER TABLE \`agendas\` DROP COLUMN \`formateur_id\``);
        }
        catch (e) { }
    }
}
exports.AddFormateurIdToAgenda1768989917161 = AddFormateurIdToAgenda1768989917161;
//# sourceMappingURL=1768989917161-AddFormateurIdToAgenda.js.map