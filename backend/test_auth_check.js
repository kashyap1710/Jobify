const BASE_URL = "http://localhost:5000/api";

const testLogin = async () => {
    const email = "abc@gmail.com";
    const password = "password123";

    try {
        console.log(`Logging in as ${email}...`);
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

testLogin();
