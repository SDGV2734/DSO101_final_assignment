import { BookingStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const dashboardService = {
  async getStudentDashboard(userId: string) {
    const now = new Date();

    const [upcomingLaundry, pastLaundry, upcomingGround, pastGround, notifications] =
      await prisma.$transaction([
        prisma.laundryBooking.findMany({
          where: {
            userId,
            status: BookingStatus.ACTIVE,
            startsAt: { gte: now }
          },
          orderBy: { startsAt: "asc" },
          take: 20
        }),
        prisma.laundryBooking.findMany({
          where: {
            userId,
            OR: [{ startsAt: { lt: now } }, { status: { not: BookingStatus.ACTIVE } }]
          },
          orderBy: { startsAt: "desc" },
          take: 20
        }),
        prisma.groundBooking.findMany({
          where: {
            userId,
            status: BookingStatus.ACTIVE,
            startsAt: { gte: now }
          },
          orderBy: { startsAt: "asc" },
          take: 20
        }),
        prisma.groundBooking.findMany({
          where: {
            userId,
            OR: [{ startsAt: { lt: now } }, { status: { not: BookingStatus.ACTIVE } }]
          },
          orderBy: { startsAt: "desc" },
          take: 20
        }),
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 10
        })
      ]);

    return {
      upcoming: {
        laundry: upcomingLaundry,
        ground: upcomingGround
      },
      past: {
        laundry: pastLaundry,
        ground: pastGround
      },
      notifications
    };
  }
};
