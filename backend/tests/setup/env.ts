process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.PORT = process.env.PORT ?? "4000";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/cst_booking_system?schema=public";
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? "test-secret-for-ci-contract-and-integration-runs";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
process.env.COOKIE_SECURE = process.env.COOKIE_SECURE ?? "false";
process.env.LAUNDRY_RESOURCE_COUNT = process.env.LAUNDRY_RESOURCE_COUNT ?? "4";
process.env.GROUND_RESOURCE_NAME = process.env.GROUND_RESOURCE_NAME ?? "CST Football Ground";
