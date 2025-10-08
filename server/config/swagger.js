/**
 * Swagger configuration for API documentation
 * @module config/swagger
 */

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yuthukama API Documentation",
      version: "1.0.0",
      description: "Comprehensive API documentation for Yuthukama - A mentorship and community platform",
      contact: {
        name: "Yuthukama Team",
        email: "support@yuthukama.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://yuthukama-production.up.railway.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token in HTTP-only cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "User's username",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User's role",
            },
            profilePicture: {
              type: "string",
              description: "URL to user's profile picture",
            },
            isEmailVerified: {
              type: "boolean",
              description: "Whether email is verified",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Post ID",
            },
            title: {
              type: "string",
              description: "Post title",
            },
            description: {
              type: "string",
              description: "Post description/content",
            },
            image: {
              type: "string",
              description: "URL to post image",
            },
            user: {
              type: "object",
              description: "Post author",
            },
            likes: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs who liked the post",
            },
            comments: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Array of comments",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Post creation timestamp",
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Comment ID",
            },
            text: {
              type: "string",
              description: "Comment text",
            },
            user: {
              type: "object",
              description: "Comment author",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Comment creation timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                  },
                  message: {
                    type: "string",
                  },
                },
              },
              description: "Validation errors",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Not authorized, no token provided",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Validation failed",
                errors: [
                  {
                    field: "email",
                    message: "Please provide a valid email address",
                  },
                ],
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Resource not found",
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Internal server error",
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
