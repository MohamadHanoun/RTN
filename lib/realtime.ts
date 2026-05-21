import { prisma } from "@/lib/prisma";

type CreateRealtimeEventInput = {
  type: string;
  audience?: "public" | "admin";
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
};

export async function createRealtimeEvent({
  type,
  audience = "public",
  entityType,
  entityId,
  payload = {},
}: CreateRealtimeEventInput) {
  try {
    await prisma.realtimeEvent.create({
      data: {
        type,
        audience,
        entityType,
        entityId,
        payload,
      },
    });
  } catch (error) {
    console.error("[RealtimeEvent] Failed to create event:", error);
  }
}
