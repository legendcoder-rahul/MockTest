const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  async login(email, password) {
    await delay(500);
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    // Mock user payload matching the Stitch styling specifications
    return {
      name: email.split("@")[0] || "Rahul",
      email,
      targetExam: "SSC CGL",
      daysLeft: 47,
      overallProgress: 34
    };
  },

  async register(name, email, mobile, targetExam, password) {
    await delay(600);
    if (!name || !email || !targetExam || !password) {
      throw new Error("Please fill in all required registration fields.");
    }
    return {
      name,
      email,
      mobile,
      targetExam,
      daysLeft: 47,
      overallProgress: 0
    };
  }
};

export default authApi;
