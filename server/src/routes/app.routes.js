import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import workspaceRouter from "./workspace.routes.js";
import documentRouter from "./document.routes.js";
import uploadRouter from "./upload.routes.js";
import invitationRouter from "./invitation.routes.js";
import aiRouter from "./ai.routes.js";
import assistantRouter from "./assistant.route.js";

function allRoutes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/workspaces", workspaceRouter);
  app.use("/api/documents", documentRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/invitations", invitationRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/assistant", assistantRouter);
}

export default allRoutes;
