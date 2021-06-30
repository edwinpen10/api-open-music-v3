const path = require("path");
const routes = (handler) => [
  {
    method: "POST",
    path: "/upload/pictures",
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        maxBytes: "500000",
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
  {
    method: "GET",
    path: "/upload/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file"),
      },
    },
  },
];

module.exports = routes;
