window.onload = function() {
    // --- 1. ELEMENTS ---
    const genBtn = document.getElementById('preview-btn');
    const fileInput = document.getElementById('file-input');
    const inputs = document.querySelectorAll('#application-form input[required]');
    const scanBtn = document.getElementById('scan-button');
    const video = document.getElementById('webcam-view');
    const status = document.getElementById('status-text');
    const laser = document.getElementById('laser');
    const photo = document.getElementById('user-photo');
    const canvas = document.getElementById('capture-canvas');
    
    let fileImageData = null;

    // --- 2. FORM VALIDATION ---
    function checkForm() {
        let allFilled = true;
        inputs.forEach(input => {
            if (!input.value.trim()) allFilled = false;
        });
        genBtn.disabled = !allFilled;
        genBtn.style.opacity = allFilled ? "1" : "0.3";
        genBtn.style.cursor = allFilled ? "pointer" : "not-allowed";
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkForm);
    });

    // --- 3. FILE PREVIEW ---
    fileInput.onchange = function() {
        const zoneText = document.getElementById('file-display-name');
        const zone = document.getElementById('file-preview-zone');
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            zoneText.innerText = "READY: " + file.name;
            zoneText.style.color = "#38bdf8";
            
            const reader = new FileReader();
            reader.onload = function(e) {
                fileImageData = e.target.result;
                zone.style.backgroundImage = `url(${fileImageData})`;
                zone.style.backgroundSize = 'contain';
                zone.style.backgroundRepeat = 'no-repeat';
                zone.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file); 
        }
    };

    // --- 4. CAMERA SCAN ---
    scanBtn.onclick = async function() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            status.innerText = "SYSTEM: SCANNING BIOMETRICS...";
            laser.style.display = "block";

            setTimeout(() => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                photo.src = canvas.toDataURL('image/png');
                
                laser.style.display = "none";
                status.innerText = "SYSTEM: VERIFIED";
                status.style.color = "#10b981";
                
                const badge = document.getElementById('badge');
                if(badge) {
                    badge.innerText = "VERIFIED";
                    badge.className = "verify-badge unlocked";
                }
                
                stream.getTracks().forEach(track => track.stop());
            }, 3000); 
        } catch (error) {
            status.innerText = "ERROR: CAMERA BLOCKED";
            status.style.color = "#ef4444";
        }
    };

    // --- 5. GENERATE CARD LOGIC ---
    genBtn.onclick = function() {
        // Sync User Info
        const first = document.getElementById('first-name-field').value;
        const last = document.getElementById('last-name-field').value;
        const email = document.getElementById('email-field').value;

        document.getElementById('preview-name').innerText = `${first} ${last}`.toUpperCase();
        document.getElementById('preview-email').innerText = email;

        // Sync Document Data to Card
        const cardThumb = document.getElementById('card-file-visual');
        const cardFileNameDisplay = document.getElementById('preview-file');

        if (fileInput.files.length > 0 && fileImageData) {
            // Update the small image on the card
            cardThumb.style.display = "block";
            cardThumb.style.backgroundImage = `url(${fileImageData})`;
            cardThumb.style.backgroundSize = "cover";
            
            // Update the file name text
            cardFileNameDisplay.innerText = fileInput.files[0].name;
            cardFileNameDisplay.style.color = "#38bdf8";
        }
        
        // Scroll to the card preview
        document.getElementById('card-preview-section').scrollIntoView({ behavior: 'smooth' });
    };
};