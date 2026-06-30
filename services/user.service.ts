import { userRepository } from "@/repositories/user.repository";
import { hashPassword, verifyPassword } from "@/lib/utils/password";

export const userService = {
  async list() {
    return userRepository.findMany();
  },

  async getById(id: string) {
    return userRepository.findById(id);
  },

  async getProfile(id: string) {
    return userRepository.findProfile(id);
  },

  async getByEmail(email: string) {
    return userRepository.findByEmail(email.toLowerCase());
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
  }) {
    const hashed = await hashPassword(data.password);
    return userRepository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      role: data.role,
    });
  },

  async update(
    id: string,
    data: { name?: string; email?: string; role?: "ADMIN" | "USER" },
  ) {
    const updateData: Record<string, string> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.role) updateData.role = data.role;
    return userRepository.update(id, updateData);
  },

  async delete(id: string) {
    return userRepository.delete(id);
  },

  async resetPassword(id: string, newPassword: string) {
    const hashed = await hashPassword(newPassword);
    return userRepository.update(id, { password: hashed });
  },

  async verifyCredentials(email: string, password: string) {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) return null;
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async verifyCurrentPassword(id: string, password: string) {
    const user = await userRepository.findPassword(id);
    if (!user) return false;
    return verifyPassword(password, user.password);
  },

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const valid = await this.verifyCurrentPassword(id, currentPassword);
    if (!valid) return false;
    const hashed = await hashPassword(newPassword);
    await userRepository.update(id, { password: hashed });
    return true;
  },

  async isEmailTaken(email: string, excludeId?: string) {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) return false;
    if (excludeId && user.id === excludeId) return false;
    return true;
  },
};
