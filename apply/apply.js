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

