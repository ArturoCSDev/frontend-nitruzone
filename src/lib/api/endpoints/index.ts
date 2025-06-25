import { AUTH } from "./auth";
import { STORAGE } from "./storage";

export const API_ENDPOINTS = {
  AUTH,
  STORAGE,
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
