import {
  requireApiAuth,
  apiError,
  apiSuccess,
  AuthenticationError,
} from "@/lib/api-auth";
import { ahpService } from "@/services/ahp.service";

export async function GET() {
  try {
    const user = await requireApiAuth();
    const result = await ahpService.getLastResults(user.id);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal memuat skor akhir", 500);
  }
}
