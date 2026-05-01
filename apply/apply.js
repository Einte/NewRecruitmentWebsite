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

/* FILE */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('file-name').textContent = file.name;
    previewFile.textContent = file.name;
};

/* GENERATE */
generateBtn.onclick = () => {
    previewName.textContent = document.getElementById('first').value + " " + document.getElementById('last').value;
    previewEmail.textContent = document.getElementById('email').value;
};

/* CAMERA + SCAN */
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

            previewImg.src = canvas.toDataURL();

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
    }
};

const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', async () => {
    // 1. Gather the data from your UI
    const enrollmentData = {
        firstName: document.getElementById('first').value,
        lastName: document.getElementById('last').value,
        email: document.getElementById('email').value,
        status: "ENROLLED",
        timestamp: new Date().toISOString()
    };

    // Update Status
    const statusText = document.getElementById('status-text');
    statusText.innerText = "STATUS: TRANSMITTING...";

    try {
        // 2. Send to the Pi Zero (Replace with your Pi's actual Local IP)
        const response = await fetch('http://192.168.4.1:5000/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrollmentData)
        });

        if (response.ok) {
            statusText.innerText = "STATUS: SUCCESS - STORED ON PI";
            document.getElementById('badge').innerText = "VERIFIED";
            document.getElementById('badge').style.color = "#00ff00";
        } else {
            throw new Error("Server refused data");
        }
    } catch (error) {
        console.error(error);
        statusText.innerText = "STATUS: ERROR - PI NOT FOUND";
        alert("Check Connection: Are you on the Pi's Private Wi-Fi?");
    }
});

