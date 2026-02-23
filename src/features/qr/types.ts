export interface QrPaymentInfo {
  /** Tổng số tiền cần thanh toán (đơn vị: nhỏ nhất, ví dụ VND) */
  amount: number;
  /** Chủ tài khoản nhận tiền */
  accountName: string;
  /** Số tài khoản hoặc số ví */
  accountNumber: string;
  /** Ngân hàng hoặc nhà cung cấp dịch vụ thanh toán */
  bankName?: string;
  /** Mã đơn hàng dùng làm nội dung chuyển khoản */
  orderCode: string;
}

export interface QrPaymentCardProps {
  className?: string;
  info: QrPaymentInfo;
}
