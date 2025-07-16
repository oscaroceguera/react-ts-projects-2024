"use server";

import { prisma } from "@/lib/prisma";
import { OrderIdSchema } from "@/schema";
import { revalidatePath } from "next/cache";

export async function completeOrder(formdata: FormData) {
  const data = {
    orderId: formdata.get("order_id"),
  };
  const result = OrderIdSchema.safeParse(data);

  if (result.success) {
    try {
      await prisma.order.update({
        where: {
          id: result.data.orderId,
        },
        data: {
          status: true,
          orderReadyAt: new Date(Date.now()),
        },
      });
      revalidatePath("/admin/orders");
    } catch (error) {
      console.log(error);
    }
  }
}
