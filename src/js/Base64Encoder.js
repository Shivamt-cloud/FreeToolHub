/**
 * Base64 Encoder/Decoder
 * Professional Base64 encoding and decoding tool with text, image, and file support
 */

class Base64Encoder {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
    }

    /**
     * Encode text to Base64
     */
    encodeText(text, options = {}) {
        try {
            const {
                addLineBreaks = false,
                urlSafe = false,
                padding = true
            } = options;

            let encoded = '';
            
            if (urlSafe) {
                // URL-safe Base64 encoding
                encoded = btoa(unescape(encodeURIComponent(text)))
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_');
                
                if (!padding) {
                    encoded = encoded.replace(/=/g, '');
                }
            } else {
                // Standard Base64 encoding
                encoded = btoa(unescape(encodeURIComponent(text)));
                
                if (!padding) {
                    encoded = encoded.replace(/=/g, '');
                }
            }

            // Add line breaks every 76 characters if requested
            if (addLineBreaks) {
                encoded = encoded.replace(/.{76}/g, '$&\n');
            }

            this.addToHistory('encode', text, encoded, 'text');
            return {
                success: true,
                encoded: encoded,
                originalSize: text.length,
                encodedSize: encoded.length,
                compressionRatio: ((encoded.length - text.length) / text.length * 100).toFixed(1),
                type: 'text'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: text.length
            };
        }
    }

    /**
     * Decode Base64 to text
     */
    decodeText(base64String, options = {}) {
        try {
            const {
                urlSafe = false,
                strict = false
            } = options;

            // Clean the input
            let cleanBase64 = base64String.replace(/\s/g, '');
            
            if (urlSafe) {
                // Convert URL-safe Base64 to standard Base64
                cleanBase64 = cleanBase64.replace(/-/g, '+').replace(/_/g, '/');
            }

            // Add padding if needed
            while (cleanBase64.length % 4) {
                cleanBase64 += '=';
            }

            // Validate Base64 format
            if (strict && !/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                throw new Error('Invalid Base64 format');
            }

            const decoded = decodeURIComponent(escape(atob(cleanBase64)));

            this.addToHistory('decode', base64String, decoded, 'text');
            return {
                success: true,
                decoded: decoded,
                originalSize: base64String.length,
                decodedSize: decoded.length,
                type: 'text'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: base64String.length
            };
        }
    }

    /**
     * Encode file to Base64
     */
    encodeFile(file, options = {}) {
        return new Promise((resolve) => {
            try {
                const {
                    addLineBreaks = false,
                    urlSafe = false,
                    padding = true
                } = options;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const arrayBuffer = e.target.result;
                        const bytes = new Uint8Array(arrayBuffer);
                        let binary = '';
                        
                        for (let i = 0; i < bytes.length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }

                        let encoded = btoa(binary);
                        
                        if (urlSafe) {
                            encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
                            if (!padding) {
                                encoded = encoded.replace(/=/g, '');
                            }
                        } else if (!padding) {
                            encoded = encoded.replace(/=/g, '');
                        }

                        if (addLineBreaks) {
                            encoded = encoded.replace(/.{76}/g, '$&\n');
                        }

                        this.addToHistory('encode', file.name, encoded, 'file');
                        resolve({
                            success: true,
                            encoded: encoded,
                            originalSize: file.size,
                            encodedSize: encoded.length,
                            compressionRatio: ((encoded.length - file.size) / file.size * 100).toFixed(1),
                            fileName: file.name,
                            fileType: file.type,
                            type: 'file'
                        });
                    } catch (error) {
                        resolve({
                            success: false,
                            error: error.message,
                            originalSize: file.size
                        });
                    }
                };
                reader.onerror = () => {
                    resolve({
                        success: false,
                        error: 'Failed to read file',
                        originalSize: file.size
                    });
                };
                reader.readAsArrayBuffer(file);
            } catch (error) {
                resolve({
                    success: false,
                    error: error.message,
                    originalSize: file.size || 0
                });
            }
        });
    }

    /**
     * Decode Base64 to file
     */
    decodeToFile(base64String, fileName = 'decoded_file', mimeType = 'application/octet-stream', options = {}) {
        try {
            const {
                urlSafe = false
            } = options;

            // Clean the input
            let cleanBase64 = base64String.replace(/\s/g, '');
            
            if (urlSafe) {
                cleanBase64 = cleanBase64.replace(/-/g, '+').replace(/_/g, '/');
            }

            // Add padding if needed
            while (cleanBase64.length % 4) {
                cleanBase64 += '=';
            }

            const binaryString = atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);
            
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: mimeType });
            const file = new File([blob], fileName, { type: mimeType });

            this.addToHistory('decode', base64String, fileName, 'file');
            return {
                success: true,
                file: file,
                fileName: fileName,
                fileSize: file.size,
                mimeType: mimeType,
                type: 'file'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: base64String.length
            };
        }
    }

    /**
     * Encode image to Base64
     */
    encodeImage(file, options = {}) {
        return new Promise((resolve) => {
            try {
                const {
                    maxWidth = null,
                    maxHeight = null,
                    quality = 0.8,
                    format = 'jpeg'
                } = options;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const img = new Image();
                        img.onload = () => {
                            try {
                                const canvas = document.createElement('canvas');
                                let { width, height } = img;

                                // Resize if needed
                                if (maxWidth && maxHeight) {
                                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                                    width = width * ratio;
                                    height = height * ratio;
                                }

                                canvas.width = width;
                                canvas.height = height;

                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, width, height);

                                const dataURL = canvas.toDataURL(`image/${format}`, quality);
                                const base64 = dataURL.split(',')[1];

                                this.addToHistory('encode', file.name, base64, 'image');
                                resolve({
                                    success: true,
                                    encoded: base64,
                                    dataURL: dataURL,
                                    originalSize: file.size,
                                    encodedSize: base64.length,
                                    compressionRatio: ((base64.length - file.size) / file.size * 100).toFixed(1),
                                    fileName: file.name,
                                    dimensions: { width, height },
                                    format: format,
                                    type: 'image'
                                });
                            } catch (error) {
                                resolve({
                                    success: false,
                                    error: error.message,
                                    originalSize: file.size
                                });
                            }
                        };
                        img.src = e.target.result;
                    } catch (error) {
                        resolve({
                            success: false,
                            error: error.message,
                            originalSize: file.size
                        });
                    }
                };
                reader.onerror = () => {
                    resolve({
                        success: false,
                        error: 'Failed to read image file',
                        originalSize: file.size
                    });
                };
                reader.readAsDataURL(file);
            } catch (error) {
                resolve({
                    success: false,
                    error: error.message,
                    originalSize: file.size || 0
                });
            }
        });
    }

    /**
     * Validate Base64 string
     */
    validateBase64(base64String, options = {}) {
        try {
            const {
                urlSafe = false,
                strict = false
            } = options;

            // Clean the input
            let cleanBase64 = base64String.replace(/\s/g, '');
            
            if (urlSafe) {
                // URL-safe Base64 validation
                if (!/^[A-Za-z0-9\-_]*={0,2}$/.test(cleanBase64)) {
                    return {
                        success: false,
                        isValid: false,
                        error: 'Invalid URL-safe Base64 format'
                    };
                }
            } else {
                // Standard Base64 validation
                if (strict && !/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                    return {
                        success: false,
                        isValid: false,
                        error: 'Invalid Base64 format'
                    };
                }
            }

            // Check length
            if (cleanBase64.length % 4 !== 0) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Invalid Base64 length (must be multiple of 4)'
                };
            }

            // Try to decode to validate
            try {
                if (urlSafe) {
                    cleanBase64 = cleanBase64.replace(/-/g, '+').replace(/_/g, '/');
                }
                while (cleanBase64.length % 4) {
                    cleanBase64 += '=';
                }
                atob(cleanBase64);
            } catch (error) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Invalid Base64 data'
                };
            }

            return {
                success: true,
                isValid: true,
                size: base64String.length,
                cleanSize: cleanBase64.length,
                type: urlSafe ? 'url-safe' : 'standard'
            };
        } catch (error) {
            return {
                success: false,
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Get Base64 information
     */
    getBase64Info(base64String) {
        try {
            const cleanBase64 = base64String.replace(/\s/g, '');
            const originalSize = base64String.length;
            const cleanSize = cleanBase64.length;
            
            // Estimate decoded size
            const estimatedDecodedSize = Math.floor(cleanSize * 3 / 4);
            
            // Check for padding
            const paddingCount = (cleanBase64.match(/=/g) || []).length;
            
            // Check for line breaks
            const lineBreakCount = (base64String.match(/\n/g) || []).length;
            
            // Determine type
            let type = 'standard';
            if (/^[A-Za-z0-9\-_]*={0,2}$/.test(cleanBase64)) {
                type = 'url-safe';
            }

            return {
                success: true,
                originalSize: originalSize,
                cleanSize: cleanSize,
                estimatedDecodedSize: estimatedDecodedSize,
                paddingCount: paddingCount,
                lineBreakCount: lineBreakCount,
                type: type,
                compressionRatio: ((cleanSize - estimatedDecodedSize) / estimatedDecodedSize * 100).toFixed(1)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add to history
     */
    addToHistory(action, input, output, type) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            input: typeof input === 'string' ? input.substring(0, 100) + (input.length > 100 ? '...' : '') : input,
            output: typeof output === 'string' ? output.substring(0, 100) + (output.length > 100 ? '...' : '') : output,
            type
        };
        
        this.history.unshift(entry);
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
    }

    /**
     * Get history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }
}
