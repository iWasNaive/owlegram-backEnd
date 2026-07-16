const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Owlegram API",
      version: "1.0.0",
      description: "API documentation for Owlegram backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "carrot",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            profile: { type: "string", nullable: true },
          },
        },
        Channel: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            username: { type: "string", nullable: true },
            is_private: { type: "boolean" },
            private_link: { type: "string", nullable: true },
            photo: { type: "string", nullable: true },
            bio: { type: "string", nullable: true },
            creator_id: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        ChannelMember: {
          type: "object",
          properties: {
            channel_id: { type: "integer" },
            channel_name: { type: "string" },
            channel_username: { type: "string", nullable: true },
            channel_photo: { type: "string", nullable: true },
            channel_bio: { type: "string", nullable: true },
            is_private: { type: "boolean" },
            role: { type: "string", enum: ["owner", "admin", "member"], nullable: true },
          },
        },
        AdminChannel: {
          type: "object",
          properties: {
            channel_id: { type: "integer" },
            channel_name: { type: "string" },
            channel_username: { type: "string", nullable: true },
            channel_photo: { type: "string", nullable: true },
            channel_bio: { type: "string", nullable: true },
            is_private: { type: "boolean" },
            last_message: { type: "string", nullable: true },
            last_message_photo: { type: "array", items: { type: "string" }, nullable: true },
            last_message_time: { type: "string", format: "date-time", nullable: true },
            is_admin: { type: "boolean" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
