import { Controller, Get, Param, Request } from "@nestjs/common";

@Controller("contexts")
export class DocsController {
  @Get()
  async getRootContext(@Request() req: any) {
    const protocol = req.protocol;
    const host = req.get("host");
    const baseUrl = `${protocol}://${host}`;

    return {
      "@context": {
        "@vocab": `${baseUrl}/api/docs.jsonld#`,
        hydra: "http://www.w3.org/ns/hydra/core#",
        error: {
          "@id": "Entrypoint/error",
          "@type": "@id",
        },
        validationError: {
          "@id": "Entrypoint/validationError",
          "@type": "@id",
        },
        agenda: {
          "@id": "Entrypoint/agenda",
          "@type": "@id",
        },
        catalogueFormation: {
          "@id": "Entrypoint/catalogueFormation",
          "@type": "@id",
        },
        challenge: {
          "@id": "Entrypoint/challenge",
          "@type": "@id",
        },
        classement: {
          "@id": "Entrypoint/classement",
          "@type": "@id",
        },
        commercial: {
          "@id": "Entrypoint/commercial",
          "@type": "@id",
        },
        formateur: {
          "@id": "Entrypoint/formateur",
          "@type": "@id",
        },
        formation: {
          "@id": "Entrypoint/formation",
          "@type": "@id",
        },
        media: {
          "@id": "Entrypoint/media",
          "@type": "@id",
        },
        participation: {
          "@id": "Entrypoint/participation",
          "@type": "@id",
        },
        poleRelationClient: {
          "@id": "Entrypoint/poleRelationClient",
          "@type": "@id",
        },
        progression: {
          "@id": "Entrypoint/progression",
          "@type": "@id",
        },
        questions: {
          "@id": "Entrypoint/questions",
          "@type": "@id",
        },
        quiz: {
          "@id": "Entrypoint/quiz",
          "@type": "@id",
        },
        reponse: {
          "@id": "Entrypoint/reponse",
          "@type": "@id",
        },
        stagiaire: {
          "@id": "Entrypoint/stagiaire",
          "@type": "@id",
        },
        user: {
          "@id": "Entrypoint/user",
          "@type": "@id",
        },
      },
    };
  }

  @Get(":resource")
  async getResourceContext(@Param("resource") resource: string, @Request() req: any) {
    const protocol = req.protocol;
    const host = req.get("host");
    const baseUrl = `${protocol}://${host}`;

    return {
      "@context": {
        "@vocab": `${baseUrl}/api/docs.jsonld#`,
        hydra: "http://www.w3.org/ns/hydra/core#",
        "@id": resource,
      },
    };
  }
}

@Controller("docs.jsonld")
export class DocsLdController {
  @Get()
  async getDocsLd(@Request() req: any) {
    return {
      "@context": {
        hydra: "http://www.w3.org/ns/hydra/core#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        xmls: "http://www.w3.org/2001/XMLSchema#",
        owl: "http://www.w3.org/2002/07/owl#",
        schema: "http://schema.org/",
        domain: { "@id": "rdfs:domain", "@type": "@id" },
        range: { "@id": "rdfs:range", "@type": "@id" },
        subClassOf": { "@id": "rdfs:subClassOf", "@type": "@id" },
        expects: { "@id": "hydra:expects", "@type": "@id" },
        returns: { "@id": "hydra:returns", "@type": "@id" },
      },
      "@id": "/api/docs.jsonld",
      "@type": "hydra:ApiDocumentation",
      "hydra:title": "Wizi Learn API",
      "hydra:description": "API Documentation for Wizi Learn",
      "hydra:entrypoint": "/api",
    };
  }
}
