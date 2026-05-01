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

const submitBtn = document.getElementById('submit'); // Declared once here



let stream;

let capturedImageData = null; // Store image to send later



/* FILE UPLOAD */

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



            // Store the Base64 image data

            capturedImageData = canvas.toDataURL('image/jpeg');

            previewImg.src = capturedImageData;



            // Stop Camera

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



/* SUBMIT TO PI ZERO */

submitBtn.addEventListener('click', async () => {

    const enrollmentData = {

        firstName: document.getElementById('first').value,

        lastName: document.getElementById('last').value,

        email: document.getElementById('email').value,

        photo: capturedImageData, // Now sending the captured image!

        status: "ENROLLED",

        timestamp: new Date().toISOString()

    };



    statusText.innerText = "STATUS: TRANSMITTING...";



    try {

        const response = await fetch('http://192.168.4.1:5000/enroll', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            mode: 'cors', // Ensure CORS is handled

            body: JSON.stringify(enrollmentData)

        });



        if (response.ok) {

            statusText.innerText = "STATUS: SUCCESS - STORED ON PI";

            statusText.style.color = "#22c55e";

            badge.innerText = "VERIFIED";

            badge.style.color = "#00ff00";

        } else {

            throw new Error("Server refused data");

        }

    } catch (error) {

        console.error("Transmission Error:", error);

        statusText.innerText = "STATUS: ERROR - PI NOT FOUND";

        alert("Check Connection: Are you on the Pi's Private Wi-Fi?");

    }

});

