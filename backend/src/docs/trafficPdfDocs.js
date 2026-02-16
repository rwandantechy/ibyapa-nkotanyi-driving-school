const getAllPdfs = {
  tags: ["Traffic pdf"],
  description: "get all the pdfs for the user to read",
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

const uploadPdf = {
  tags: ["Traffic pdf"],
  description: "create a pdf for the user to read",
  security: [
    {
      token: [],
    },
  ],
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "igicupuri",
            },
            location: {
              type: "string",
              example: "kigali",
            },
            file: {
              type: "file",
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

export const trafficPdfDocs = {
  "/api/pdf/get-all-pdf": {
    get: getAllPdfs,
  },
  "/api/pdf/upload-pdf": {
    post: uploadPdf,
  },
};
