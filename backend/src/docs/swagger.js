import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { userRouteDocs } from "./userDocs.js";
import { trafficQuestionsDocs } from "./trafficQuestionsDocs.js";
import { trafficVideosDocs } from "./trafficVideosDocs.js";
import { trafficPdfDocs } from "./trafficPdfDocs.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Traffic signs Api",
      description:
        "Traffic sign api for the users to do the exams for traning of temporary driving license",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://dead-blue-nightingale-kit.cyclic.app/",
        description: "Production server",
      },
    ],
    tags: [
      { name: "User", description: "User Routes" },
      { name: "Traffic Questions", description: "Traffic Questions Routes" },
      { name: "Traffic pdf", description: "Traffic pdf Questions Routes" },
      { name: "Traffic Videos", description: "Traffic Videos Routes" },
    ],
    components: {
      securitySchemes: {
        token: {
          type: "apiKey",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "token",
          in: "header",
        },
      },
      responses: {
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'number',
                    description: 'status code of response',
                    example: 500
                  },
                  error: {
                    type: 'string',
                    example: 'SERVER_ERROR',
                  },
                  message: {
                    type: 'string',
                    description: 'Server errors',
                    example: 'error connection timeout',
                  }
                },
              },
            },

          }
        },
        BadRequest: {
          description: 'BAD_REQUEST',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'number',
                    description: 'Status code of Error',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    description: 'validation error',
                    example: 'BAD_REQUEST',
                  },
                  message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid request body',
                  }
                },
              },
            },
          },
        },
        UnprocessableContent: {
          description: 'Unprocessable Content',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'number',
                    example: 422,
                  },
                  message: {
                    type: 'string',
                    description: 'Invalid data input',
                    example: 'Your inputs must be Valid',
                  },
                  error: {
                    type: 'string',
                    example: 'Unprocessable Content',
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: 'Authentication error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'number',
                    description: 'Status code of Error',
                    example: 401,
                  },
                  error: {
                    type: 'string',
                    description: 'authentication error',
                    example: 'UNAUTHORIZED',
                  },
                  message: {
                    type: 'string',
                    description: 'Error message',
                    example: "You don't have access to do that action",
                  }
                }
              }
            }
          }
        },
        AlreadyExists: {
          description: 'Record Already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'number',
                    example: 409,
                  },
                  error: {
                    type: 'string',
                    example: 'ALREADY_EXISTS',
                  },
                  message: {
                    type: 'string',
                    description: 'Register existing record',
                    example: 'The record already registred',
                  }
                },
              },
            },
          },
        },
        NotFound: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'number',
                    example: 404,
                  },
                  message: {
                    type: 'string',
                    description: 'Record not Found',
                    example: 'Resource not found',
                  },
                  error: {
                    type: 'string',
                    description: 'Resource not found',
                    example: 'NOT_FOUND',
                  },
                },
              },
            },
          },
        }
      }
    },
    paths: {
      ...userRouteDocs,
      ...trafficQuestionsDocs,
      ...trafficPdfDocs,
      ...trafficVideosDocs,
    },
  },
  apis: ["../src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;
