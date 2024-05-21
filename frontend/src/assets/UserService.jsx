const API_URL = "http://localhost:8081";

class UserService {
  async saveUser(user) {
    return await fetch(API_URL + "/customer/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to register, please change credentials");
      }
      return response;
    });
  }

  async fetchUserData(email) {
    return await fetch(API_URL + "/customer/userData/" + email, {
      method: "GET",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    });
  }
}

export default new UserService();
