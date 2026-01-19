const axios = require("axios");

async function testAuth() {
  const baseUrl = "http://localhost:3000";
  const testUser = {
    username: "testuser_" + Date.now(),
    password: "password123",
    firstname: "Test",
    lastname: "User",
    fullname: "Test User",
    address: "123 Fake St",
    sex: "ชาย",
    birthday: "1990-01-01",
  };

  try {
    console.log("Testing Register...");
    const regRes = await axios.post(`${baseUrl}/register`, testUser);
    console.log("Register Response:", regRes.data);

    console.log("Testing Login...");
    const loginRes = await axios.post(`${baseUrl}/login`, {
      username: testUser.username,
      password: testUser.password,
    });
    console.log("Login Response:", loginRes.data);

    if (loginRes.data.token) {
      console.log("Auth Flow SUCCESS ✅");
    } else {
      console.log("Auth Flow FAILED ❌ (No token)");
    }
  } catch (err) {
    console.error("Auth Flow FAILED ❌");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testAuth();
