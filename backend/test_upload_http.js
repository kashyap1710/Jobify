import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFile = async () => {
    const userId = "3e031651-ef3e-4165-ba1b-4c196dfd3164"; // ram's ID
    const filePath = path.join(__dirname, 'dummy.pdf');
    
    // Use native fetch with FormData
    // Node.js v18+ supports global fetch and FormData
    
    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' });
    formData.append('resume', fileBlob, 'dummy.pdf');

    try {
        console.log(`Uploading to http://localhost:5000/api/upload-resume/${userId}`);
        const response = await fetch(`http://localhost:5000/api/upload-resume/${userId}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
        } else {
            const data = await response.json();
            console.log("Success:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

uploadFile();
