import fs from 'fs/promises'; // Switch to async file system methods
// import * as pdfParse from 'pdf-parse';
// import pdfParse from 'pdf-parse/lib/pdf-parse.js';
// import pkg from 'pdf-parse'
import pdf from 'pdf-parse-fork'
import mammoth from 'mammoth';

// const pdfParser = pkg;

export const extractResume = async (filePath) => {
    try {
        // Normalize the path to lowercase so we catch .PDF, .DOCX, etc.
        const lowerPath = filePath.toLowerCase();

        // 1. Handle PDFs
        if (lowerPath.endsWith('.pdf')) {
            const dataBuffer = await fs.readFile(filePath); // Non-blocking read
            const data = await pdf(dataBuffer);
            return data.text || '';
        }

        // 2. Handle DOCX
        if (lowerPath.endsWith('.docx')) {
            // Mammoth natively supports buffers, which works perfectly with fs/promises
            const dataBuffer = await fs.readFile(filePath);
            const result = await mammoth.extractRawText({ buffer: dataBuffer });
            return result.value || '';
        }

        // Log if an unsupported file type slips through
        console.warn(`Unsupported file format for path: ${filePath}`);
        return '';

    } catch (error) {
        // Prevent server crashes if a file is corrupted or unreadable
        console.error(`Error extracting text from ${filePath}:`, error);
        throw new Error(`Failed to extract text from resume: ${error.message}`);
    }
};