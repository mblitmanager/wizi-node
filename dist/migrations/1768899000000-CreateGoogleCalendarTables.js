"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGoogleCalendarTables1768899000000 = void 0;
class CreateGoogleCalendarTables1768899000000 {
    constructor() {
        this.name = "CreateGoogleCalendarTables1768899000000";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`google_calendars\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`google_id\` varchar(255) NOT NULL,
                \`summary\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`background_color\` varchar(255) NULL,
                \`foreground_color\` varchar(255) NULL,
                \`access_role\` varchar(255) NULL,
                \`time_zone\` varchar(255) NULL,
                \`synced_at\` timestamp NULL,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_google_calendars_google_id\` (\`google_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`google_calendar_events\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`google_calendar_id\` int NOT NULL,
                \`google_id\` varchar(255) NOT NULL,
                \`summary\` varchar(255) NULL,
                \`description\` text NULL,
                \`location\` varchar(255) NULL,
                \`start\` timestamp NOT NULL,
                \`end\` timestamp NOT NULL,
                \`html_link\` varchar(255) NULL,
                \`hangout_link\` varchar(255) NULL,
                \`organizer\` json NULL,
                \`attendees\` json NULL,
                \`status\` varchar(255) NULL,
                \`recurrence\` json NULL,
                \`event_type\` varchar(255) NULL,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_google_calendar_events_google_id\` (\`google_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        try {
            await queryRunner.query(`
                ALTER TABLE \`google_calendars\` 
                ADD CONSTRAINT \`FK_google_calendars_user_id\` 
                FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
                ON DELETE CASCADE ON UPDATE NO ACTION
            `);
        }
        catch (e) { }
        try {
            await queryRunner.query(`
                ALTER TABLE \`google_calendar_events\` 
                ADD CONSTRAINT \`FK_google_calendar_events_google_calendar_id\` 
                FOREIGN KEY (\`google_calendar_id\`) REFERENCES \`google_calendars\`(\`id\`) 
                ON DELETE CASCADE ON UPDATE NO ACTION
            `);
        }
        catch (e) { }
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