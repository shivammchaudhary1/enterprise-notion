import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import workspaceRouter from "./workspace.routes.js";
import documentRouter from "./document.routes.js";
import uploadRouter from "./upload.routes.js";
import invitationRouter from "./invitation.routes.js";

function allRoutes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/workspaces", workspaceRouter);
  app.use("/api/documents", documentRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/invitations", invitationRouter);
}

export default allRoutes;
