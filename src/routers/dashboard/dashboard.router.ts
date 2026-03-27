import express from "express";
import { getDashboard } from "./dashboard.controller";

const router = express.Router();

router.get("/", getDashboard);

export { router as dashboardRouter };
