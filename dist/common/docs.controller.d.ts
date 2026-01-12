export declare class DocsController {
    getRootContext(req: any): Promise<{
        "@context": {
            "@vocab": string;
            hydra: string;
            error: {
                "@id": string;
                "@type": string;
            };
            validationError: {
                "@id": string;
                "@type": string;
            };
            agenda: {
                "@id": string;
                "@type": string;
            };
            catalogueFormation: {
                "@id": string;
                "@type": string;
            };
            challenge: {
                "@id": string;
                "@type": string;
            };
            classement: {
                "@id": string;
                "@type": string;
            };
            commercial: {
                "@id": string;
                "@type": string;
            };
            formateur: {
                "@id": string;
                "@type": string;
            };
            formation: {
                "@id": string;
                "@type": string;
            };
            media: {
                "@id": string;
                "@type": string;
            };
            participation: {
                "@id": string;
                "@type": string;
            };
            poleRelationClient: {
                "@id": string;
                "@type": string;
            };
            progression: {
                "@id": string;
                "@type": string;
            };
            questions: {
                "@id": string;
                "@type": string;
            };
            quiz: {
                "@id": string;
                "@type": string;
            };
            reponse: {
                "@id": string;
                "@type": string;
            };
            stagiaire: {
                "@id": string;
                "@type": string;
            };
            user: {
                "@id": string;
                "@type": string;
            };
        };
    }>;
    getResourceContext(resource: string, req: any): Promise<{
        "@context": {
            "@vocab": string;
            hydra: string;
            "@id": string;
        };
    }>;
}
export declare class DocsLdController {
    getDocsLd(req: any): Promise<{
        "@context": {
            hydra: string;
            rdf: string;
            rdfs: string;
            xmls: string;
            owl: string;
            schema: string;
            domain: {
                "@id": string;
                "@type": string;
            };
            range: {
                "@id": string;
                "@type": string;
            };
            subClassOf: any;
            ": { ": any;
            ": ": any;
            ", ": any;
            " },": any;
        };
    }>;
    "@id": "/api/docs.jsonld";
    "@type": "hydra:ApiDocumentation";
    "hydra:title": "Wizi Learn API";
    "hydra:description": "API Documentation for Wizi Learn";
    "hydra:entrypoint": "/api";
}
