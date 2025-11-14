import { router } from "../../app/routes.ts";
import { ssrHandler } from "./ssr.handler.tsx";

export const ssr = router.get("/ssr", ssrHandler).build()

