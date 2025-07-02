import { prisma } from '../server.js';
import { User } from '@prisma/client';

export async function findUserByClerkId(clerkId: string): Promise<User | null> {
  if (!clerkId) return null;
  return prisma.user.findFirst({
    where: { clerkId, isDeleted: false },
  });
}

export async function findUserById(id: string): Promise<User | null> {
  if (!id) return null;
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
  });
}

type UserFromClerkData = {
  clerkId: string;
  email: string;
  fullName?: string;
};

export async function createOrUpdateUserFromClerk(
  data: UserFromClerkData,
): Promise<User> {
  const { clerkId, email, fullName } = data;

  if (!clerkId || !email) {
    throw new Error(
      'Clerk ID and Email are required to create or update user.',
    );
  }

  const existingUser = await findUserByClerkId(clerkId);
  if (existingUser?.isDeleted) {
    throw new Error(
      'User account was previously deleted and cannot be modified.',
    );
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      fullName: fullName ?? undefined,
    },
    create: {
      clerkId,
      email,
      fullName,
    },
  });

  return user;
}

export async function softDeleteUser(id: string): Promise<User | null> {
  const user = await findUserById(id);
  if (!user) {
    return null;
  }

  return prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
}
