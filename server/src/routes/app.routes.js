import authRouter from "./auth.routes.js";

function allRoutes(app) {
  app.use("/api/auth", authRouter);
}

export default allRoutes;
