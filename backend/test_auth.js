const BASE_URL = "http://localhost:5000/api";

const testAuth = async () => {
    const email = `test_${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test User";
    const roleName = "EMPLOYER";

    try {
        // Register
        console.log("Registering...");
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, roleName })
        });
        const regData = await regRes.json();
        console.log("Register Response:", JSON.stringify(regData, null, 2));

        // Login
        console.log("Logging in...");
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        console.log("Login Response:", JSON.stringify(loginData, null, 2));

    } catch (error) {
        console.error("Error:", error.message);
    }
};

testAuth();
