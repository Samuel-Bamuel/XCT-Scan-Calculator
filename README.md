# XCT Scan Calculator

A simple web-based calculator for XCT (X-ray Computed Tomography) scan parameters.

## Features

- **Magnification Factor Calculation**: M = SDD / SOD
- **Effective Pixel Size**: Calculates the effective pixel size in micrometers
- **Field of View (FOV)**: Calculates the maximum viewable area
- **Visual Geometry Diagram**: Shows the relationship between source, object, and detector
- **Real-time Calculations**: Results update as you type

## How to Use

1. Enter the SOD (Source-to-Object Distance) in mm
2. Enter the SDD (Source-to-Detector Distance) in mm
3. Enter the Detector Pixel Size in mm
4. Enter the Detector Width in mm
5. Results will calculate automatically

## Formulas

- **Magnification**: M = SDD / SOD
- **Effective Pixel Size (µm)**: (Detector Pixel Size / M) × 1000
- **Field of View (mm)**: Detector Width / M

## Hosting

This calculator is a static website with no server-side dependencies, making it easy to host and maintain.
