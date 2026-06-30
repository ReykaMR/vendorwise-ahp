import prisma from "@/lib/prisma";
import { Prisma, Role } from "@/app/generated/prisma/client";

type UserPublic = Pick<
  Prisma.UserModel,
  "id" | "name" | "email" | "role" | "createdAt"
>;

type UserProfile = Pick<Prisma.UserModel, "name" | "email">;

type UserWithPassword = Pick<Prisma.UserModel, "password">;

export const userRepository = {
  async findMany(): Promise<UserPublic[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string): Promise<UserPublic | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  async findProfile(id: string): Promise<UserProfile | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findPassword(id: string): Promise<UserWithPassword | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) {
    return prisma.user.create({ data });
  },

  async update(
    id: string,
    data: { name?: string; email?: string; role?: Role; password?: string },
  ) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
