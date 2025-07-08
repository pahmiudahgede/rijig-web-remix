export function generateDeviceId(prefix: string = ""): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const deviceId = `${prefix}${timestamp}${random}`;
  return Buffer.from(deviceId).toString("base64");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/`~]).{8,}$/;
  return passwordRegex.test(password);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^62\d{8,14}$/;
  return phoneRegex.test(phone);
}

export function validatePin(pin: string): boolean {
  const pinRegex = /^\d{6}$/;
  return pinRegex.test(pin);
}

export function validateOtp(otp: string): boolean {
  const otpRegex = /^\d{4}$/;
  return otpRegex.test(otp);
}

export function formatDateToDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function parseDateFromDDMMYYYY(dateString: string): Date | null {
  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}

export function getRemainingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function extractResetTokenFromUrl(
  url: string
): { token: string; email: string } | null {
  try {
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get("token");
    const email = urlObj.searchParams.get("email");

    if (!token || !email) return null;

    return { token, email };
  } catch {
    return null;
  }
}
