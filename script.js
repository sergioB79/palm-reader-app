document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const dominantHandRadios = document.querySelectorAll('input[name="dominantHand"]');
    const dominantHandSection = document.getElementById('dominantHandSection');
    const dominantHandUploadSection = document.getElementById('dominantHandUploadSection');
    const otherHandUploadSection = document.getElementById('otherHandUploadSection');
    const dominantHandLabel = document.getElementById('dominantHandLabel');
    const otherHandLabel = document.getElementById('otherHandLabel');

    const dominantHandUploadBtn = document.getElementById('dominantHandUploadBtn');
    const dominantHandCaptureBtn = document.getElementById('dominantHandCaptureBtn');
    const dominantHandInput = document.getElementById('dominantHandInput');
    const dominantHandPreview = document.getElementById('dominantHandPreview');
    const dominantHandRetakeBtn = document.getElementById('dominantHandRetakeBtn');

    const otherHandUploadBtn = document.getElementById('otherHandUploadBtn');
    const otherHandCaptureBtn = document.getElementById('otherHandCaptureBtn');
    const otherHandInput = document.getElementById('otherHandInput');
    const otherHandPreview = document.getElementById('otherHandPreview');
    const otherHandRetakeBtn = document.getElementById('otherHandRetakeBtn');

    const getBriefReadingButton = document.getElementById('getBriefReadingButton');
    const unlockDetailedReadingButton = document.getElementById('unlockDetailedReadingButton');
    const loadingSpinner = document.getElementById('loadingSpinner');

    const briefReadingDisplay = document.getElementById('briefReadingDisplay');
    const briefReadingContent = document.getElementById('briefReadingContent');
    const detailedReadingDisplay = document.getElementById('detailedReadingDisplay');
    const detailedReadingContent = document.getElementById('detailedReadingContent');

    const messageBox = document.getElementById('messageBox');
    const messageTitle = document.getElementById('messageTitle');
    const messageContent = document.getElementById('messageContent');
    const messageCloseButton = document.getElementById('messageCloseButton');
    const overlay = document.getElementById('overlay');
    const radioLeft = document.getElementById('radioLeft');
    const radioRight = document.getElementById('radioRight');

    // Camera Modal Elements
    const cameraModal = document.getElementById('cameraModal');
    const cameraFeed = document.getElementById('cameraFeed');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const captureButton = document.getElementById('captureButton');
    const cancelCameraButton = document.getElementById('cancelCameraButton');
    let currentStream;
    let currentHandForCapture;

    let dominantHandChoice = '';
    let dominantHandBase64 = null;
    let otherHandBase64 = null;

    // --- Functions ---

    function showMessageBox(title, message) {
        messageTitle.textContent = title;
        messageContent.textContent = message;
        messageBox.style.display = 'block';
        overlay.style.display = 'block';
    }

    function hideMessageBox() {
        messageBox.style.display = 'none';
        overlay.style.display = 'none';
    }

    function updateButtonState() {
        getBriefReadingButton.disabled = !(dominantHandBase64 && otherHandBase64 && dominantHandChoice);
    }

    function handleImageUpload(inputElement, previewElement, base64VarSetter, retakeButton) {
        const file = inputElement.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
                retakeButton.classList.remove('hidden');
                const base64Data = e.target.result.split(',')[1];
                base64VarSetter(base64Data);
                updateButtonState();
            };
            reader.onerror = () => showMessageBox('Error', 'Failed to read the image file.');
            reader.readAsDataURL(file);
        }
    }

    async function startCamera(hand) {
        currentHandForCapture = hand;
        try {
            currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            cameraFeed.srcObject = currentStream;
            cameraModal.classList.remove('hidden');
            overlay.style.display = 'block';
        } catch (err) {
            showMessageBox('Camera Error', 'Could not access your camera. Please grant permission and try again.');
        }
    }

    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        cameraModal.classList.add('hidden');
        overlay.style.display = 'none';
    }

    function capturePhoto() {
        const context = cameraCanvas.getContext('2d');
        cameraCanvas.width = cameraFeed.videoWidth;
        cameraCanvas.height = cameraFeed.videoHeight;
        context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);
        const imageDataURL = cameraCanvas.toDataURL('image/jpeg');
        const base64Data = imageDataURL.split(',')[1];

        if (currentHandForCapture === 'dominant') {
            dominantHandBase64 = base64Data;
            dominantHandPreview.src = imageDataURL;
            dominantHandPreview.style.display = 'block';
            dominantHandRetakeBtn.classList.remove('hidden');
        } else {
            otherHandBase64 = base64Data;
            otherHandPreview.src = imageDataURL;
            otherHandPreview.style.display = 'block';
            otherHandRetakeBtn.classList.remove('hidden');
        }
        stopCamera();
        updateButtonState();
    }

    async function getAIReading(type) {
        loadingSpinner.style.display = 'block';
        getBriefReadingButton.disabled = true;
        unlockDetailedReadingButton.disabled = true;

        try {
            const formData = new FormData();
            formData.append('dominantHandChoice', dominantHandChoice);
            formData.append('dominantHand', dominantHandBase64);
            formData.append('otherHand', otherHandBase64);
            formData.append('readingType', type);

            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Analysis failed.');
            }

            const result = await response.json();

            if (type === 'brief') {
                briefReadingContent.textContent = result.reading;
                briefReadingDisplay.classList.remove('hidden');
                unlockDetailedReadingButton.disabled = false;
            } else {
                detailedReadingContent.textContent = result.reading;
                detailedReadingDisplay.classList.remove('hidden');
            }
        } catch (error) {
            showMessageBox('Error', `Failed to get reading: ${error.message}`);
        } finally {
            loadingSpinner.style.display = 'none';
            getBriefReadingButton.disabled = false;
        }
    }

    // --- Event Listeners ---

    messageCloseButton.addEventListener('click', hideMessageBox);

    dominantHandRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            dominantHandChoice = event.target.value;
            dominantHandLabel.textContent = dominantHandChoice;
            otherHandLabel.textContent = dominantHandChoice === 'left' ? 'right' : 'left';
            radioLeft.classList.toggle('selected', dominantHandChoice === 'left');
            radioRight.classList.toggle('selected', dominantHandChoice === 'right');
            dominantHandSection.classList.add('hidden');
            dominantHandUploadSection.classList.remove('hidden');
            otherHandUploadSection.classList.remove('hidden');
        });
    });

    dominantHandUploadBtn.addEventListener('click', () => dominantHandInput.click());
    otherHandUploadBtn.addEventListener('click', () => otherHandInput.click());

    dominantHandInput.addEventListener('change', () => handleImageUpload(dominantHandInput, dominantHandPreview, (data) => dominantHandBase64 = data, dominantHandRetakeBtn));
    otherHandInput.addEventListener('change', () => handleImageUpload(otherHandInput, otherHandPreview, (data) => otherHandBase64 = data, otherHandRetakeBtn));

    dominantHandRetakeBtn.addEventListener('click', () => {
        dominantHandInput.value = '';
        dominantHandPreview.style.display = 'none';
        dominantHandRetakeBtn.classList.add('hidden');
        dominantHandBase64 = null;
        updateButtonState();
    });

    otherHandRetakeBtn.addEventListener('click', () => {
        otherHandInput.value = '';
        otherHandPreview.style.display = 'none';
        otherHandRetakeBtn.classList.add('hidden');
        otherHandBase64 = null;
        updateButtonState();
    });

    dominantHandCaptureBtn.addEventListener('click', () => startCamera('dominant'));
    otherHandCaptureBtn.addEventListener('click', () => startCamera('other'));
    captureButton.addEventListener('click', capturePhoto);
    cancelCameraButton.addEventListener('click', stopCamera);

    getBriefReadingButton.addEventListener('click', () => getAIReading('brief'));

    unlockDetailedReadingButton.addEventListener('click', async () => {
        showMessageBox('Processing Payment', 'Simulating payment of $9.99...');
        unlockDetailedReadingButton.disabled = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideMessageBox();
        showMessageBox('Payment Successful!', 'Generating your detailed reading...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        hideMessageBox();
        await getAIReading('detailed');
    });
});