const getAllVideos = {
  tags: ["Traffic Videos"],
  description: "get all the videos for the user to watch",
  security: [
    {
      token: [],
    },
  ],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          type: "object",
          example: {
            status: "success",
            data: [],
          },
        },
      },
    },
  },
};

const createVideo = {
  tags: ["Traffic Videos"],
  description: "create a video for the user to watch",
  security: [
    {
      token: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Ijambo ryahindura ubuzima",
            },
            video: {
              type: "string",
              example: "https://www.youtube.com/watch?v=pqedsKLdKBc",
            },
            date: {
              type: "string",
              example: "2023-05-15T08:30:00.000Z",
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "OK",
      content: {
        "application/json": {
          type: "object",
          example: {
            status: "success",
            data: [],
          },
        },
      },
    },
  },
};

export const trafficVideosDocs = {
  "/api/videos/get-all-videos": {
    get: getAllVideos,
  },
  "/api/videos/create-video": {
    post: createVideo,
  },
};
