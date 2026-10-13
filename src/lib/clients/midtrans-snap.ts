import midtransClient from "midtrans-client";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, NODE_ENV } from "../get-env.js";

const isProduction = NODE_ENV === "production";

/** Client Midtrans Snap yang digunakan untuk membuat token pembayaran. */
const snap = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

/** Parameter transaksi yang dikirim ke Midtrans Snap. */
type CreateSnapTransactionParams = {
  /** ID order unik yang dikirim ke Midtrans. */
  orderId: string;
  /** Nilai total transaksi dalam rupiah. */
  grossAmount: number;
  /** Data customer yang ditampilkan pada transaksi Midtrans. */
  customer: {
    /** Nama depan customer. */
    firstName: string;
    /** Email customer. */
    email: string;
    /** Nomor telepon customer jika tersedia. */
    phone?: string;
  };
  /** Rincian item yang ditampilkan pada transaksi. */
  items?: Array<{
    /** ID item. */
    id: string;
    /** Nama item. */
    name: string;
    /** Harga per item dalam rupiah. */
    price: number;
    /** Jumlah item. */
    quantity: number;
  }>;
};

/**
 * Membuat transaksi Midtrans dengan metode pembayaran QRIS dan mengambil Snap token.
 *
 * @param params Detail order, customer, dan item transaksi.
 * @returns Snap token untuk proses pembayaran.
 */
export default async function createMidtransSnap(
  params: CreateSnapTransactionParams,
): Promise<string> {
  const parameter = {
    enabled_payments: ["qris"],
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: params.customer.firstName,
      email: params.customer.email,
      phone: params.customer?.phone,
    },
    item_details: params.items,
  };

  const transaction = await snap.createTransaction(parameter);

  return transaction.token;
}
