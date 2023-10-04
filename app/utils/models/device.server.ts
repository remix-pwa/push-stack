import type { Device, User } from "@prisma/client";
import { prisma } from "../server/db.server";

type DevicePayload = {
  auth: Device['auth'];
  endpoint: Device['endpoint'];
  p256dh: Device['p256dh'];
} 

export const registerUserDevice = async (userId: User["id"], device: DevicePayload) => {
  const { auth, endpoint, p256dh } = device;

  const foundDevice = await prisma.device.findFirst({
    where: {
      userId,
      endpoint,
      auth,
    },
  })

  if (foundDevice) {
    return foundDevice;
  }

  const newDevice = await prisma.device.create({
    data: {
      userId,
      endpoint,
      auth,
      p256dh,
    },
  });

  return newDevice;
}

export const getAllUserDevices = async (userId: User["id"]) => {
  const devices = await prisma.device.findMany({
    where: { userId },
    select: {
      id: true,
      auth: true,
      endpoint: true,
      p256dh: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return devices;
}

export const getUserDevice = async (userId: User["id"], deviceId: User["id"]) => {
  const device = await prisma.device.findUnique({
    where: { id: deviceId, userId },
    select: {
      id: true,
      auth: true,
      endpoint: true,
      p256dh: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return device;
}

export const deleteUserDevice = async (userId: User["id"], deviceId: User["id"]) => {
  const device = await prisma.device.delete({
    where: { id: deviceId, userId },
  });

  return device;
}

export const deleteAllUserDevices = async (userId: User["id"]) => {
  const devices = await prisma.device.deleteMany({
    where: { userId },
  });

  return devices;
};