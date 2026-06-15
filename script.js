// Geometry Input elements
const sodInput = document.getElementById('sod');
const sddInput = document.getElementById('sdd');
const detectorPixelInput = document.getElementById('detectorPixel');
const detectorWidthInput = document.getElementById('detectorWidth');

// Scan Input elements
const exposureTimeInput = document.getElementById('exposureTime');
const numScansInput = document.getElementById('numScans');
const angularDistanceInput = document.getElementById('angularDistance');
const projectionSizeInput = document.getElementById('projectionSize');

// Geometry Result elements
const magnificationResult = document.getElementById('magnification');
const pixelSizeResult = document.getElementById('pixelSize');
const fovResult = document.getElementById('fov');

// Scan Result elements
const scanTimeResult = document.getElementById('scanTime');
const dataSizeResult = document.getElementById('dataSize');
const angularStepResult = document.getElementById('angularStep');

// Get button
const resetBtn = document.getElementById('resetBtn');

// Add event listeners for real-time calculation
sodInput.addEventListener('input', calculate);
sddInput.addEventListener('input', calculate);
detectorPixelInput.addEventListener('input', calculate);
detectorWidthInput.addEventListener('input', calculate);
exposureTimeInput.addEventListener('input', calculate);
numScansInput.addEventListener('input', calculate);
angularDistanceInput.addEventListener('input', calculate);
projectionSizeInput.addEventListener('input', calculate);
resetBtn.addEventListener('click', reset);

function calculate() {
    // Get geometry input values
    const sod = parseFloat(sodInput.value);
    const sdd = parseFloat(sddInput.value);
    const detectorPixel = parseFloat(detectorPixelInput.value);
    const detectorWidth = parseFloat(detectorWidthInput.value);

    // Get scan input values
    const exposureTime = parseFloat(exposureTimeInput.value);
    const numScans = parseFloat(numScansInput.value);
    const angularDistance = parseFloat(angularDistanceInput.value);
    const projectionSize = parseFloat(projectionSizeInput.value);

    // Calculate geometry parameters
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

        // Calculate field of view (width in pixels × pixel size / magnification)
        if (!isNaN(detectorWidth) && detectorWidth > 0) {
            const fov = (detectorWidth * detectorPixel) / magnification;
            fovResult.textContent = fov.toFixed(3);
        } else {
            fovResult.textContent = '-';
        }
    } else {
        // Reset geometry results if inputs are invalid
        magnificationResult.textContent = '-';
        pixelSizeResult.textContent = '-';
        fovResult.textContent = '-';
    }

    // Calculate scan parameters
    if (!isNaN(exposureTime) && !isNaN(numScans) && exposureTime > 0 && numScans > 0) {
        // Calculate total scan time (convert ms to hours)
        const totalScanTime = (exposureTime * numScans) / 3600000;
        scanTimeResult.textContent = totalScanTime.toFixed(2);
    } else {
        scanTimeResult.textContent = '-';
    }

    if (!isNaN(numScans) && !isNaN(projectionSize) && numScans > 0 && projectionSize > 0) {
        // Calculate total data size (convert KB to GB)
        const totalDataSize = (numScans * projectionSize) / 1000000;
        dataSizeResult.textContent = totalDataSize.toFixed(3);
    } else {
        dataSizeResult.textContent = '-';
    }

    if (!isNaN(angularDistance) && !isNaN(numScans) && numScans > 0) {
        // Calculate angular step size
        const angularStep = angularDistance / numScans;
        angularStepResult.textContent = angularStep.toFixed(4);
    } else {
        angularStepResult.textContent = '-';
    }
}

function reset() {
    // Clear all geometry inputs
    sodInput.value = '';
    sddInput.value = '';
    detectorPixelInput.value = '';
    detectorWidthInput.value = '';

    // Clear all scan inputs
    exposureTimeInput.value = '';
    numScansInput.value = '';
    angularDistanceInput.value = '';
    projectionSizeInput.value = '';

    // Reset all results
    magnificationResult.textContent = '-';
    pixelSizeResult.textContent = '-';
    fovResult.textContent = '-';
    scanTimeResult.textContent = '-';
    dataSizeResult.textContent = '-';
    angularStepResult.textContent = '-';

    // Focus on first input
    sodInput.focus();
}

// Initial calculation on page load
calculate();
