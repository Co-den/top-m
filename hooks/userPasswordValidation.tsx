// hooks/usePasswordValidation.ts
import { useState } from "react";
import toast from "react-hot-toast";

export function usePasswordValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    if (Object.keys(newErrors).length) {
      toast.error(Object.values(newErrors).join("\n"));
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  return { errors, setErrors, validate };
}
