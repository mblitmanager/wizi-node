import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Setting } from "../entities/setting.entity";

@Controller("admin/settings")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminSettingsController {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>
  ) {}

  @Get()
  async getSettings() {
    const settings = await this.settingRepository.find();
    
    // Convert array of settings to object
    const settingsObject: any = {};
    settings.forEach((setting) => {
      settingsObject[setting.key] = isNaN(Number(setting.value))
        ? setting.value === "true"
          ? true
          : setting.value === "false"
          ? false
          : setting.value
        : Number(setting.value);
    });

    return {
      data: settingsObject,
    };
  }

  @Post()
  async updateSettings(@Body() body: any) {
    for (const [key, value] of Object.entries(body)) {
      let setting = await this.settingRepository.findOne({
        where: { key },
      });

      if (setting) {
        setting.value = String(value);
        await this.settingRepository.save(setting);
      } else {
        const newSetting = this.settingRepository.create({
          key,
          value: String(value),
        });
        await this.settingRepository.save(newSetting);
      }
    }

    return {
      data: body,
      message: "Paramètres mis à jour avec succès",
    };
  }
}
