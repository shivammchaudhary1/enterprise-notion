import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

function allRoutes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
}

export default allRoutes;
