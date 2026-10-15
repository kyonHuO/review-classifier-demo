import { onRequestGet as __api_jobs__id__csv_js_onRequestGet } from "/tmp/opencode/review-classifier-demo/functions/api/jobs/[id]/csv.js"
import { onRequestPost as __api_auth_login_js_onRequestPost } from "/tmp/opencode/review-classifier-demo/functions/api/auth/login.js"
import { onRequestPost as __api_auth_logout_js_onRequestPost } from "/tmp/opencode/review-classifier-demo/functions/api/auth/logout.js"
import { onRequestGet as __api_auth_me_js_onRequestGet } from "/tmp/opencode/review-classifier-demo/functions/api/auth/me.js"
import { onRequestPost as __api_auth_register_js_onRequestPost } from "/tmp/opencode/review-classifier-demo/functions/api/auth/register.js"
import { onRequestGet as __api_jobs__id__js_onRequestGet } from "/tmp/opencode/review-classifier-demo/functions/api/jobs/[id].js"
import { onRequestGet as __api_jobs_index_js_onRequestGet } from "/tmp/opencode/review-classifier-demo/functions/api/jobs/index.js"
import { onRequestPost as __api_jobs_index_js_onRequestPost } from "/tmp/opencode/review-classifier-demo/functions/api/jobs/index.js"
import { onRequest as ___middleware_js_onRequest } from "/tmp/opencode/review-classifier-demo/functions/_middleware.js"

export const routes = [
    {
      routePath: "/api/jobs/:id/csv",
      mountPath: "/api/jobs/:id",
      method: "GET",
      middlewares: [],
      modules: [__api_jobs__id__csv_js_onRequestGet],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestGet],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_js_onRequestPost],
    },
  {
      routePath: "/api/jobs/:id",
      mountPath: "/api/jobs",
      method: "GET",
      middlewares: [],
      modules: [__api_jobs__id__js_onRequestGet],
    },
  {
      routePath: "/api/jobs",
      mountPath: "/api/jobs",
      method: "GET",
      middlewares: [],
      modules: [__api_jobs_index_js_onRequestGet],
    },
  {
      routePath: "/api/jobs",
      mountPath: "/api/jobs",
      method: "POST",
      middlewares: [],
      modules: [__api_jobs_index_js_onRequestPost],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]