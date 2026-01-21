"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGoogleCalendarTables1768899000000 = void 0;
class CreateGoogleCalendarTables1768899000000 {
    constructor() {
        this.name = "CreateGoogleCalendarTables1768899000000";
    }
    async up(queryRunner) {
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`google_calendar_events\` DROP FOREIGN KEY \`FK_google_calendar_events_google_calendar_id\``);
        await queryRunner.query(`ALTER TABLE \`google_calendars\` DROP FOREIGN KEY \`FK_google_calendars_user_id\``);
        await queryRunner.query(`DROP TABLE \`google_calendar_events\``);
        await queryRunner.query(`DROP TABLE \`google_calendars\``);
    }
}
exports.CreateGoogleCalendarTables1768899000000 = CreateGoogleCalendarTables1768899000000;
//# sourceMappingURL=1768899000000-CreateGoogleCalendarTables.js.map