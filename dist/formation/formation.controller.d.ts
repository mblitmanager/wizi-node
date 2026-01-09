import { FormationService } from "./formation.service";
export declare class FormationController {
    private formationService;
    constructor(formationService: FormationService);
    getAllFormations(): Promise<import("../entities/formation.entity").Formation[]>;
    getAllCatalogue(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllFormationsAlias(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
}
