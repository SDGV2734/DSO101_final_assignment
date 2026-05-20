import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/config/prisma.js";

describe("database integration", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("connects to PostgreSQL and can write/read a student user", async () => {
    const email = `integration-${Date.now()}@cst.local`;

    const user = await prisma.user.create({
      data: {
        name: "Integration Student",
        email,
        studentId: `INT-${Date.now()}`,
        passwordHash: "not-a-real-password-hash"
      }
    });

    const found = await prisma.user.findUnique({
      where: { email }
    });

    expect(found?.id).toBe(user.id);

    await prisma.user.delete({
      where: { id: user.id }
    });
  });
});
