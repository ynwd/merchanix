import { router } from "../../app/routes.ts";
import { successHandler } from "./success.handler.tsx";

export const success = router.get("/success", successHandler).build()

