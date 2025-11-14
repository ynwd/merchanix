import { router } from "../../app/routes.ts";
import { notifyHandler } from "./notify.handler.ts";

export const notify = router.post("/notify", notifyHandler).build();