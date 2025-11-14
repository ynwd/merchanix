import { router } from "../../app/routes.ts";
import { rootHandler } from "./index.handler.tsx";

export const index = router.get("/", rootHandler).build();
