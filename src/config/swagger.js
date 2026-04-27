//
// Purpose
//    Sets up Swagger documentation so anyone can
//    see and test the API endpoints from a browser. Render will
//    serve this at /api-docs.
//
// How it works
//    - swaggerJsdoc reads JSDoc comments from our route files
//      and turns them into an OpenAPI spec
//    - We define the base info (title, version, description)
//      and the JWT security scheme here
//    - The apis array tells swagger where to find the route
//      files with the @swagger comments
//

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Club API",
      version: "1.0.0",
      description:
        "REST API for managing book clubs, books, and reading lists. Built with Node.js, Express, and PostgreSQL.",
    },
    servers: [
      {
        url: "/api",
        description: "API base path",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Swagger will scan these files for @swagger JSDoc comments
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
