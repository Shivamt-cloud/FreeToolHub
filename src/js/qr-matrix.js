/**
 * Advanced QR Code Generator - Matrix Generation
 * Handles QR matrix creation, function patterns, data placement, and masking
 */

import { ALIGNMENT_PATTERN_COORDS, FORMAT_INFO, VERSION_INFO } from './qr-constants.js';

/**
 * Represents a QR Code matrix with all modules
 */
export class QRMatrix {
    constructor(size) {
        this.size = size;
        this.matrix = new Array(size);
        for (let i = 0; i < size; i++) {
            this.matrix[i] = new Array(size).fill(null);
        }
        this.reserved = new Array(size);
        for (let i = 0; i < size; i++) {
            this.reserved[i] = new Array(size).fill(false);
        }
    }

    /**
     * Set a module value
     */
    set(row, col, value) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            this.matrix[row][col] = value;
        }
    }

    /**
     * Get a module value
     */
    get(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.matrix[row][col];
        }
        return null;
    }

    /**
     * Mark a module as reserved
     */
    reserve(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            this.reserved[row][col] = true;
        }
    }

    /**
     * Check if a module is reserved
     */
    isReserved(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.reserved[row][col];
        }
        return false;
    }

    /**
     * Check if a module is available for data
     */
    isAvailable(row, col) {
        return !this.isReserved(row, col) && this.get(row, col) === null;
    }

    /**
     * Get a copy of the matrix
     */
    copy() {
        const copy = new QRMatrix(this.size);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                copy.matrix[row][col] = this.matrix[row][col];
                copy.reserved[row][col] = this.reserved[row][col];
            }
        }
        return copy;
    }

    /**
     * Apply mask pattern to data modules
     */
    applyMask(maskPattern) {
        const masked = this.copy();
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (masked.isAvailable(row, col) && masked.get(row, col) !== null) {
                    const shouldFlip = maskPattern(row, col);
                    if (shouldFlip) {
                        masked.set(row, col, !masked.get(row, col));
                    }
                }
            }
        }
        return masked;
    }

    /**
     * Calculate penalty score for mask evaluation
     */
    calculatePenalty() {
        let penalty = 0;
        
        // Rule 1: Penalty for adjacent modules of the same color
        penalty += this.calculateAdjacentPenalty();
        
        // Rule 2: Penalty for 2x2 blocks of the same color
        penalty += this.calculateBlockPenalty();
        
        // Rule 3: Penalty for finder-like patterns
        penalty += this.calculateFinderPenalty();
        
        // Rule 4: Penalty for dark module proportion
        penalty += this.calculateProportionPenalty();
        
        return penalty;
    }

    /**
     * Calculate penalty for adjacent modules
     */
    calculateAdjacentPenalty() {
        let penalty = 0;
        
        // Check horizontal runs
        for (let row = 0; row < this.size; row++) {
            let currentRun = 1;
            let currentValue = this.get(row, 0);
            
            for (let col = 1; col < this.size; col++) {
                const value = this.get(row, col);
                if (value === currentValue) {
                    currentRun++;
                } else {
                    if (currentRun >= 5) {
                        penalty += currentRun - 2;
                    }
                    currentRun = 1;
                    currentValue = value;
                }
            }
            if (currentRun >= 5) {
                penalty += currentRun - 2;
            }
        }
        
        // Check vertical runs
        for (let col = 0; col < this.size; col++) {
            let currentRun = 1;
            let currentValue = this.get(0, col);
            
            for (let row = 1; row < this.size; row++) {
                const value = this.get(row, col);
                if (value === currentValue) {
                    currentRun++;
                } else {
                    if (currentRun >= 5) {
                        penalty += currentRun - 2;
                    }
                    currentRun = 1;
                    currentValue = value;
                }
            }
            if (currentRun >= 5) {
                penalty += currentRun - 2;
            }
        }
        
        return penalty;
    }

    /**
     * Calculate penalty for 2x2 blocks
     */
    calculateBlockPenalty() {
        let penalty = 0;
        
        for (let row = 0; row < this.size - 1; row++) {
            for (let col = 0; col < this.size - 1; col++) {
                const value = this.get(row, col);
                if (value === this.get(row, col + 1) &&
                    value === this.get(row + 1, col) &&
                    value === this.get(row + 1, col + 1)) {
                    penalty += 3;
                }
            }
        }
        
        return penalty;
    }

    /**
     * Calculate penalty for finder-like patterns
     */
    calculateFinderPenalty() {
        let penalty = 0;
        
        // Pattern: 1:1:3:1:1 (dark:light:dark:light:dark)
        const pattern = [true, false, true, true, true, false, true];
        
        // Check horizontal patterns
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col <= this.size - 7; col++) {
                let matches = true;
                for (let i = 0; i < 7; i++) {
                    if (this.get(row, col + i) !== pattern[i]) {
                        matches = false;
                        break;
                    }
                }
                if (matches) penalty += 40;
            }
        }
        
        // Check vertical patterns
        for (let col = 0; col < this.size; col++) {
            for (let row = 0; row <= this.size - 7; row++) {
                let matches = true;
                for (let i = 0; i < 7; i++) {
                    if (this.get(row + i, col) !== pattern[i]) {
                        matches = false;
                        break;
                    }
                }
                if (matches) penalty += 40;
            }
        }
        
        return penalty;
    }

    /**
     * Calculate penalty for dark module proportion
     */
    calculateProportionPenalty() {
        let darkModules = 0;
        let totalModules = 0;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.get(row, col) !== null) {
                    totalModules++;
                    if (this.get(row, col)) {
                        darkModules++;
                    }
                }
            }
        }
        
        if (totalModules === 0) return 0;
        
        const proportion = darkModules / totalModules;
        const percentage = Math.round(proportion * 100);
        
        // Penalty for deviation from 50%
        const lower = Math.floor(percentage / 5) * 5;
        const upper = lower + 5;
        const lowerDiff = Math.abs(percentage - lower);
        const upperDiff = Math.abs(percentage - upper);
        
        return Math.min(lowerDiff, upperDiff) * 10;
    }
}

/**
 * Handles placement of function patterns in QR matrix
 */
export class FunctionPatternPlacer {
    /**
     * Place finder patterns (position detection patterns)
     */
    static placeFinderPatterns(matrix) {
        // Top-left finder pattern
        this.placeFinderPattern(matrix, 0, 0);
        
        // Top-right finder pattern
        this.placeFinderPattern(matrix, 0, matrix.size - 7);
        
        // Bottom-left finder pattern
        this.placeFinderPattern(matrix, matrix.size - 7, 0);
    }

    /**
     * Place a single finder pattern
     */
    static placeFinderPattern(matrix, startRow, startCol) {
        // 7x7 finder pattern
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                const isDark = this.isFinderPatternDark(row, col);
                matrix.set(startRow + row, startCol + col, isDark);
                matrix.reserve(startRow + row, startCol + col);
            }
        }
    }

    /**
     * Determine if a position in finder pattern should be dark
     */
    static isFinderPatternDark(row, col) {
        // Outer square
        if (row === 0 || row === 6 || col === 0 || col === 6) {
            return true;
        }
        
        // Inner square
        if (row === 2 && col >= 2 && col <= 4) {
            return true;
        }
        if (col === 2 && row >= 2 && row <= 4) {
            return true;
        }
        
        // Center dot
        if (row === 3 && col === 3) {
            return true;
        }
        
        return false;
    }

    /**
     * Place separator patterns around finder patterns
     */
    static placeSeparators(matrix) {
        // Top-left separator
        for (let i = 0; i < 8; i++) {
            matrix.set(7, i, false);
            matrix.set(i, 7, false);
            matrix.reserve(7, i);
            matrix.reserve(i, 7);
        }
        
        // Top-right separator
        for (let i = 0; i < 8; i++) {
            matrix.set(7, matrix.size - 1 - i, false);
            matrix.set(i, matrix.size - 8, false);
            matrix.reserve(7, matrix.size - 1 - i);
            matrix.reserve(i, matrix.size - 8);
        }
        
        // Bottom-left separator
        for (let i = 0; i < 8; i++) {
            matrix.set(matrix.size - 1 - i, 7, false);
            matrix.set(matrix.size - 8, i, false);
            matrix.reserve(matrix.size - 1 - i, 7);
            matrix.reserve(matrix.size - 8, i);
        }
    }

    /**
     * Place timing patterns
     */
    static placeTimingPatterns(matrix) {
        // Horizontal timing pattern
        for (let i = 8; i < matrix.size - 8; i++) {
            const isDark = i % 2 === 0;
            matrix.set(6, i, isDark);
            matrix.reserve(6, i);
        }
        
        // Vertical timing pattern
        for (let i = 8; i < matrix.size - 8; i++) {
            const isDark = i % 2 === 0;
            matrix.set(i, 6, isDark);
            matrix.reserve(i, 6);
        }
    }

    /**
     * Place alignment patterns
     */
    static placeAlignmentPatterns(matrix) {
        const version = Math.floor((matrix.size - 21) / 4) + 1;
        const coords = ALIGNMENT_PATTERN_COORDS[version];
        
        if (!coords) return;
        
        for (const coord of coords) {
            this.placeAlignmentPattern(matrix, coord, coord);
        }
    }

    /**
     * Place a single alignment pattern
     */
    static placeAlignmentPattern(matrix, centerRow, centerCol) {
        // Skip if overlapping with finder patterns
        if ((centerRow <= 7 && centerCol <= 7) ||
            (centerRow <= 7 && centerCol >= matrix.size - 8) ||
            (centerRow >= matrix.size - 8 && centerCol <= 7)) {
            return;
        }
        
        // 5x5 alignment pattern
        for (let row = -2; row <= 2; row++) {
            for (let col = -2; col <= 2; col++) {
                const isDark = this.isAlignmentPatternDark(row, col);
                matrix.set(centerRow + row, centerCol + col, isDark);
                matrix.reserve(centerRow + row, centerCol + col);
            }
        }
    }

    /**
     * Determine if a position in alignment pattern should be dark
     */
    static isAlignmentPatternDark(row, col) {
        // Outer square
        if (Math.abs(row) === 2 || Math.abs(col) === 2) {
            return true;
        }
        
        // Inner square
        if (Math.abs(row) === 1 || Math.abs(col) === 1) {
            return false;
        }
        
        // Center dot
        return true;
    }

    /**
     * Reserve format information areas
     */
    static reserveFormatAreas(matrix) {
        // Top-left format area
        for (let i = 0; i < 9; i++) {
            if (i !== 6) { // Skip timing pattern
                matrix.reserve(8, i);
            }
        }
        for (let i = 0; i < 8; i++) {
            matrix.reserve(i, 8);
        }
        
        // Top-right format area
        for (let i = matrix.size - 8; i < matrix.size; i++) {
            matrix.reserve(8, i);
        }
        
        // Bottom-left format area
        for (let i = matrix.size - 8; i < matrix.size; i++) {
            matrix.reserve(i, 8);
        }
    }

    /**
     * Reserve version information areas (for versions 7+)
     */
    static reserveVersionAreas(matrix) {
        const version = Math.floor((matrix.size - 21) / 4) + 1;
        if (version < 7) return;
        
        // Top-right version area
        for (let row = 0; row < 6; row++) {
            for (let col = matrix.size - 11; col < matrix.size - 8; col++) {
                matrix.reserve(row, col);
            }
        }
        
        // Bottom-left version area
        for (let row = matrix.size - 11; row < matrix.size - 8; row++) {
            for (let col = 0; col < 6; col++) {
                matrix.reserve(row, col);
            }
        }
    }

    /**
     * Place all function patterns
     */
    static placeAllPatterns(matrix) {
        this.placeFinderPatterns(matrix);
        this.placeSeparators(matrix);
        this.placeTimingPatterns(matrix);
        this.placeAlignmentPatterns(matrix);
        this.reserveFormatAreas(matrix);
        this.reserveVersionAreas(matrix);
    }
}

/**
 * Handles data placement in QR matrix
 */
export class DataPlacer {
    /**
     * Place data bits in zigzag pattern
     */
    static placeData(matrix, dataBits) {
        let bitIndex = 0;
        let direction = -1; // Start going up
        let col = matrix.size - 1;
        let placedBits = 0;
        
        console.log(`Starting data placement with ${dataBits.length} bits`);
        
        // Process columns in pairs from right to left
        while (col >= 0) {
            // Process two columns at a time
            for (let row = 0; row < matrix.size; row++) {
                const currentRow = direction === 1 ? row : matrix.size - 1 - row;
                
                // Place bit in right column
                if (col >= 0 && matrix.isAvailable(currentRow, col)) {
                    if (bitIndex < dataBits.length) {
                        matrix.set(currentRow, col, dataBits[bitIndex]);
                        bitIndex++;
                        placedBits++;
                    } else {
                        // Fill remaining data modules with 0 (light)
                        matrix.set(currentRow, col, false);
                    }
                }
                
                // Place bit in left column
                if (col - 1 >= 0 && matrix.isAvailable(currentRow, col - 1)) {
                    if (bitIndex < dataBits.length) {
                        matrix.set(currentRow, col - 1, dataBits[bitIndex]);
                        bitIndex++;
                        placedBits++;
                    } else {
                        // Fill remaining data modules with 0 (light)
                        matrix.set(currentRow, col - 1, false);
                    }
                }
            }
            
            // Move to next pair of columns and reverse direction
            col -= 2;
            direction *= -1;
        }
        
        console.log(`Placed ${placedBits} data bits out of ${dataBits.length} total bits`);
        
        // Ensure all data modules are filled (not null)
        this.fillRemainingDataModules(matrix);
    }
    
    /**
     * Fill any remaining null data modules with false (light)
     */
    static fillRemainingDataModules(matrix) {
        for (let row = 0; row < matrix.size; row++) {
            for (let col = 0; col < matrix.size; col++) {
                if (matrix.get(row, col) === null && !matrix.isReserved(row, col)) {
                    matrix.set(row, col, false);
                }
            }
        }
    }
}

/**
 * Handles format and version information placement
 */
export class InformationPlacer {
    /**
     * Place format information
     */
    static placeFormatInfo(matrix, eccLevel, maskPattern) {
        const formatBits = this.encodeFormatInfo(eccLevel, maskPattern);
        
        // Top-left format area
        let bitIndex = 0;
        for (let i = 0; i < 9; i++) {
            if (i !== 6) { // Skip timing pattern
                matrix.set(8, i, formatBits[bitIndex]);
                bitIndex++;
            }
        }
        for (let i = 0; i < 8; i++) {
            matrix.set(i, 8, formatBits[bitIndex]);
            bitIndex++;
        }
        
        // Top-right format area
        bitIndex = 0;
        for (let i = matrix.size - 8; i < matrix.size; i++) {
            matrix.set(8, i, formatBits[bitIndex]);
            bitIndex++;
        }
        
        // Bottom-left format area
        bitIndex = 0;
        for (let i = matrix.size - 8; i < matrix.size; i++) {
            matrix.set(i, 8, formatBits[bitIndex]);
            bitIndex++;
        }
    }

    /**
     * Encode format information
     */
    static encodeFormatInfo(eccLevel, maskPattern) {
        const formatValue = FORMAT_INFO[eccLevel][maskPattern];
        const bits = [];
        
        for (let i = 14; i >= 0; i--) {
            bits.push((formatValue >> i) & 1);
        }
        
        return bits;
    }

    /**
     * Place version information (for versions 7+)
     */
    static placeVersionInfo(matrix, version) {
        if (version < 7) return;
        
        const versionBits = this.encodeVersionInfo(version);
        
        // Top-right version area
        let bitIndex = 0;
        for (let row = 0; row < 6; row++) {
            for (let col = matrix.size - 11; col < matrix.size - 8; col++) {
                matrix.set(row, col, versionBits[bitIndex]);
                bitIndex++;
            }
        }
        
        // Bottom-left version area
        bitIndex = 0;
        for (let row = matrix.size - 11; row < matrix.size - 8; row++) {
            for (let col = 0; col < 6; col++) {
                matrix.set(row, col, versionBits[bitIndex]);
                bitIndex++;
            }
        }
    }

    /**
     * Encode version information
     */
    static encodeVersionInfo(version) {
        const versionValue = VERSION_INFO[version];
        const bits = [];
        
        for (let i = 17; i >= 0; i--) {
            bits.push((versionValue >> i) & 1);
        }
        
        return bits;
    }
}
