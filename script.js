// Geometry Input elements
const sodInput = document.getElementById('sod');
const sddInput = document.getElementById('sdd');
const detectorPixelInput = document.getElementById('detectorPixel');
const detectorWidthInput = document.getElementById('detectorWidth');
const objectWidthInput = document.getElementById('objectWidth');

// Scan Input elements
const exposureTimeInput = document.getElementById('exposureTime');
const numScansInput = document.getElementById('numScans');
const angularDistanceInput = document.getElementById('angularDistance');
const projectionSizeInput = document.getElementById('projectionSize');

// Geometry Result elements
const magnificationResult = document.getElementById('magnification');
const pixelSizeResult = document.getElementById('pixelSize');
const fovResult = document.getElementById('fov');
const objectCoverageResult = document.getElementById('objectCoverage');

// Scan Result elements
const scanTimeResult = document.getElementById('scanTime');
const dataSizeResult = document.getElementById('dataSize');
const angularStepResult = document.getElementById('angularStep');

// Diagram elements
const sourcePoint = document.getElementById('sourcePoint');
const objectCenter = document.getElementById('objectCenter');
const objectRect = document.getElementById('objectRect');
const detectorRect = document.getElementById('detectorRect');
const fovRect = document.getElementById('fovRect');
const sodLine = document.getElementById('sodLine');
const sodLabel = document.getElementById('sodLabel');
const sddLine = document.getElementById('sddLine');
const sddLabel = document.getElementById('sddLabel');
const coneUpper = document.getElementById('coneUpper');
const coneLower = document.getElementById('coneLower');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// Get button
const resetBtn = document.getElementById('resetBtn');

// Add event listeners for real-time calculation
sodInput.addEventListener('input', calculate);
sddInput.addEventListener('input', calculate);
detectorPixelInput.addEventListener('input', calculate);
detectorWidthInput.addEventListener('input', calculate);
objectWidthInput.addEventListener('input', calculate);
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
    const objectWidth = parseFloat(objectWidthInput.value);

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

            // Calculate object coverage
            if (!isNaN(objectWidth) && objectWidth > 0) {
                const coverage = (fov / objectWidth) * 100;
                objectCoverageResult.textContent = coverage.toFixed(1);
                
                // Update status indicator
                if (coverage >= 100) {
                    statusIndicator.setAttribute('fill', '#4ECDC4'); // Green - fits
                    statusText.textContent = 'Fits ✓';
                } else {
                    statusIndicator.setAttribute('fill', '#FF6B6B'); // Red - doesn't fit
                    statusText.textContent = 'Too Small ✗';
                }
            } else {
                objectCoverageResult.textContent = '-';
                statusIndicator.setAttribute('fill', '#999');
                statusText.textContent = '-';
            }
        } else {
            fovResult.textContent = '-';
            objectCoverageResult.textContent = '-';
            statusIndicator.setAttribute('fill', '#999');
            statusText.textContent = '-';
        }

        // Update diagram
        updateDiagram(sod, sdd, detectorPixel, detectorWidth, objectWidth, magnification);
    } else {
        // Reset geometry results if inputs are invalid
        magnificationResult.textContent = '-';
        pixelSizeResult.textContent = '-';
        fovResult.textContent = '-';
        objectCoverageResult.textContent = '-';
        statusIndicator.setAttribute('fill', '#999');
        statusText.textContent = '-';
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

function updateDiagram(sod, sdd, detectorPixel, detectorWidth, objectWidth, magnification) {
    // Scale factor for diagram (viewBox is 800 wide, 0-40 is source, 40-150 is SOD, 150-510 is OD)
    // Max diagram distance is 470 units (510-40)
    const maxDiagramDistance = 470;
    const totalDistance = sdd;
    const scale = maxDiagramDistance / totalDistance;
    
    const sourceX = 40;
    const objectX = sourceX + (sod * scale);
    const detectorX = sourceX + (sdd * scale);
    const detectorY = 200;
    
    // Update source and object positions
    sourcePoint.setAttribute('cx', sourceX);
    objectCenter.setAttribute('cx', objectX);
    objectRect.setAttribute('x', objectX - 10);
    
    // Update detector position
    detectorRect.setAttribute('x', detectorX);
    
    // Update distance lines
    sodLine.setAttribute('x2', objectX);
    sddLine.setAttribute('x2', detectorX);
    
    // Update labels with actual values
    const midSOD = sourceX + (objectX - sourceX) / 2;
    sodLabel.setAttribute('x', midSOD - 15);
    sodLabel.textContent = sod.toFixed(1) + 'mm';
    
    const midSDD = sourceX + (detectorX - sourceX) / 2;
    sddLabel.setAttribute('x', midSDD - 20);
    sddLabel.textContent = sdd.toFixed(1) + 'mm';
    
    // Calculate cone angles based on magnification
    // FOV at detector determines cone angle
    let fovMm = 0;
    if (!isNaN(detectorPixel) && detectorPixel > 0 && !isNaN(detectorWidth) && detectorWidth > 0 && !isNaN(magnification) && magnification > 0) {
        fovMm = (detectorWidth * detectorPixel) / magnification;
    }
    
    const fovAtDetector = fovMm * magnification / detectorPixel * detectorPixel; // In mm at detector
    const coneAngleRad = Math.atan2(fovAtDetector / 2, sdd - sod);
    
    const detectorHeight = 200;
    const coneUpperY = detectorY - (Math.tan(coneAngleRad) * (detectorX - sourceX));
    const coneLowerY = detectorY + (Math.tan(coneAngleRad) * (detectorX - sourceX));
    
    coneUpper.setAttribute('x2', detectorX);
    coneUpper.setAttribute('y2', Math.max(50, coneUpperY)); // Clamp to diagram bounds
    
    coneLower.setAttribute('x2', detectorX);
    coneLower.setAttribute('y2', Math.min(350, coneLowerY)); // Clamp to diagram bounds
    
    // Update FOV visualization on detector
    if (!isNaN(fovMm) && fovMm > 0 && !isNaN(detectorPixel) && detectorPixel > 0) {
        const fovHeightPixels = fovMm / detectorPixel;
        const detectorHeightPixels = detectorWidth; // Assuming square sensor
        const fovHeightDiagram = (fovHeightPixels / detectorHeightPixels) * 200;
        const fovTopY = detectorY - fovHeightDiagram / 2;
        
        fovRect.setAttribute('y', fovTopY);
        fovRect.setAttribute('height', fovHeightDiagram);
    }
    
    // Update object representation size
    if (!isNaN(objectWidth) && objectWidth > 0 && !isNaN(magnification) && magnification > 0) {
        // Object width is magnified on detector
        const magnifiedWidth = objectWidth * magnification;
        const objectHeightDiagram = (magnifiedWidth / (detectorWidth * detectorPixel)) * 200;
        
        objectRect.setAttribute('y', detectorY - objectHeightDiagram / 2);
        objectRect.setAttribute('height', Math.max(5, objectHeightDiagram));
        objectRect.setAttribute('width', 20);
    }
}

function reset() {
    // Clear all geometry inputs
    sodInput.value = '';
    sddInput.value = '';
    detectorPixelInput.value = '';
    detectorWidthInput.value = '';
    objectWidthInput.value = '';

    // Clear all scan inputs
    exposureTimeInput.value = '';
    numScansInput.value = '';
    angularDistanceInput.value = '';
    projectionSizeInput.value = '';

    // Reset all results
    magnificationResult.textContent = '-';
    pixelSizeResult.textContent = '-';
    fovResult.textContent = '-';
    objectCoverageResult.textContent = '-';
    scanTimeResult.textContent = '-';
    dataSizeResult.textContent = '-';
    angularStepResult.textContent = '-';
    statusIndicator.setAttribute('fill', '#999');
    statusText.textContent = '-';

    // Focus on first input
    sodInput.focus();
}

// Initial calculation on page load
calculate();
