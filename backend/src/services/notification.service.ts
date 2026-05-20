import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

type NotificationInput = {
  userId: string;
  title: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
};

export const notificationService = {
  create(input: NotificationInput) {
    return prisma.notification.create({
      data: input
    });
  },

  listForUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  },

  markAsRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() }
    });
  }
};
