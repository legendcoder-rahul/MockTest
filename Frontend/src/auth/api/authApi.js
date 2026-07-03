const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const authApi = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to log in.");
    }

    return {
      name: data.user.username,
      email: data.user.email,
      mobile: data.user.contact,
      targetExam: data.user.targetExam,
      daysLeft: 47,
      overallProgress: 34
    };
  },

  async register(name, email, mobile, targetExam, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: name,
        email,
        contact: mobile ? Number(mobile) : undefined,
        targetExam,
        password
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to register.");
    }

    return {
      name: data.user.username,
      email: data.user.email,
      mobile: data.user.contact,
      targetExam: data.user.targetExam,
      daysLeft: 47,
      overallProgress: 0
    };
  },

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Session expired.");
    }

    return {
      name: data.user.username,
      email: data.user.email,
      mobile: data.user.contact,
      targetExam: data.user.targetExam,
      daysLeft: 47,
      overallProgress: 34
    };
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to logout.");
    }
    return data;
  },

  async forgetPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to request OTP.");
    }
    return data;
  },

  async resetPassword(email, otp, newPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to reset password.");
    }
    return data;
  }
};

export default authApi;
