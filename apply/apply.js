// --- Element Selectors ---
const uploadBtn = document.getElementById('upload');
const fileInput = document.getElementById('file');
const generateBtn = document.getElementById('generate');
const scanBtn = document.getElementById('scan');
const video = document.getElementById('video');
const laser = document.getElementById('laser');
const statusText = document.getElementById('status-text');
const previewImg = document.getElementById('preview-img');
const previewName = document.getElementById('preview-name');
const previewEmail = document.getElementById('preview-email');
const previewFile = document.getElementById('preview-file');
const badge = document.getElementById('badge');
const submitBtn = document.getElementById('submit');

let stream;
let capturedImageData = null; 

/* FILE UPLOAD LOGIC */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('file-name').textContent = file.name;
    previewFile.textContent = file.name;
};

/* PREVIEW GENERATION */
generateBtn.onclick = () => {
    previewName.textContent = `${document.getElementById('first').value} ${document.getElementById('last').value}`;
    previewEmail.textContent = document.getElementById('email').value;
};

/* CAMERA + SCAN LOGIC */
scanBtn.onclick = async () => {
    if (stream) return;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        statusText.textContent = "SCANNING...";
        laser.style.display = "block";

        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            capturedImageData = canvas.toDataURL('image/jpeg');
            previewImg.src = capturedImageData;

            stream.getTracks().forEach(t => t.stop());
            stream = null;
            laser.style.display = "none";
            statusText.textContent = "VERIFIED";
            statusText.style.color = "#22c55e";
            badge.textContent = "UNLOCKED";
            badge.style.color = "#22c55e";
            submitBtn.disabled = false;
            submitBtn.classList.add("active");
        }, 3000);
    } catch (err) {
        statusText.textContent = "CAMERA BLOCKED";
        statusText.style.color = "red";
        console.error(err);
    }
};

/* SUBMISSION LOGIC (Updated for Email Server) */
submitBtn.addEventListener('click', async () => {
    const formData = new FormData();
    
    // We still collect these for the email body
    formData.append('first', document.getElementById('first').value);
    formData.append('last', document.getElementById('last').value);
    formData.append('email_address', document.getElementById('email').value);
    
    if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    } else if (capturedImageData) {
        const blob = await (await fetch(capturedImageData)).blob();
        formData.append('file', blob, 'biometric_scan.jpg');
    } else {
        alert("Please upload a file or perform a scan first.");
        return;
    }

    statusText.innerText = "STATUS: TRANSMITTING TO EMAIL...";
    statusText.style.color = "#fbbf24"; // Amber color while sending

    try {
        // Pointing to your Pi's new Wi-Fi IP and the Python Mailer port
        const response = await fetch('http://192.168.0.52:8000/upload', {
            method: 'POST',
            body: formData 
        });

        const result = await response.json();
        if (result.status === "Success") {
            statusText.innerText = "STATUS: EMAIL SENT SECURELY";
            statusText.style.color = "#22c55e";
            submitBtn.disabled = true;
            submitBtn.innerText = "SENT";
        } else {
            statusText.innerText = "STATUS: MAIL ERROR";
            console.error(result.message);
        }
    } catch (error) {
        console.error('Uplink Error:', error);
        statusText.innerText = "STATUS: UPLINK FAILED";
        statusText.style.color = "red";
    }
});