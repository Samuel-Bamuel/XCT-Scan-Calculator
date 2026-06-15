// Get input elements
const sodInput = document.getElementById('sod');
const sddInput = document.getElementById('sdd');
const detectorPixelInput = document.getElementById('detectorPixel');
const detectorWidthInput = document.getElementById('detectorWidth');

// Get result elements
const magnificationResult = document.getElementById('magnification');
const pixelSizeResult = document.getElementById('pixelSize');
const fovResult = document.getElementById('fov');

// Get button
const resetBtn = document.getElementById('resetBtn');

// Add event listeners for real-time calculation
sodInput.addEventListener('input', calculate);
sddInput.addEventListener('input', calculate);
detectorPixelInput.addEventListener('input', calculate);
detectorWidthInput.addEventListener('input', calculate);
resetBtn.addEventListener('click', reset);

function calculate() {
    // Get input values
    const sod = parseFloat(sodInput.value);
    const sdd = parseFloat(sddInput.value);
    const detectorPixel = parseFloat(detectorPixelInput.value);
    const detectorWidth = parseFloat(detectorWidthInput.value);

    // Check if all required inputs are valid numbers
    if (!isNaN(sod) && !isNaN(sdd) && sod > 0 && sdd > 0) {
        // Calculate magnification
        const magnification = sdd / sod;
        magnificationResult.textContent = magnification.toFixed(3);

        // Calculate effective pixel size (convert mm to µm)
        if (!isNaN(detectorPixel) && detectorPixel > 0) {
            const effectivePixelSize = (detectorPixel / magnification) * 1000; // Convert mm to µm
            pixelSizeResult.textContent = effectivePixelSize.toFixed(3);
        } else {
            pixelSizeResult.textContent = '-';
        }

        // Calculate field of view
        if (!isNaN(detectorWidth) && detectorWidth > 0) {
            const fov = detectorWidth / magnification;
            fovResult.textContent = fov.toFixed(3);
        } else {
            fovResult.textContent = '-';
        }
    } else {
        // Reset results if inputs are invalid
        magnificationResult.textContent = '-';
        pixelSizeResult.textContent = '-';
        fovResult.textContent = '-';
    }
}

function reset() {
    // Clear all inputs
    sodInput.value = '';
    sddInput.value = '';
    detectorPixelInput.value = '';
    detectorWidthInput.value = '';

    // Reset results
    magnificationResult.textContent = '-';
    pixelSizeResult.textContent = '-';
    fovResult.textContent = '-';

    // Focus on first input
    sodInput.focus();
}

// Initial calculation on page load
calculate();
