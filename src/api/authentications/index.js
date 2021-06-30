const AuthenticationsHandler = require("./handler");

const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "3.0.0",
  register: async (
    server,
    { authService, service, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authService,
      service,
      tokenManager,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
