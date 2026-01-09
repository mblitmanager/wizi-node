import { CatalogueFormationService } from "./catalogue-formation.service";
export declare class CatalogueFormationController {
    private readonly catalogueService;
    constructor(catalogueService: CatalogueFormationService);
    getAllForParrainage(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAll(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllFormations(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getOne(id: number): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation>;
}
