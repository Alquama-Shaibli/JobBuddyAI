import fs      from 'fs/promises';
import pdf     from 'pdf-parse-fork';
import mammoth from 'mammoth';

export const extractResume = async (filePath) => {
    const lowerPath = filePath.toLowerCase();

    if (lowerPath.endsWith('.pdf')) {
        const buffer = await fs.readFile(filePath);
        const data   = await pdf(buffer);
        return data.text || '';
    }

    if (lowerPath.endsWith('.docx')) {
        const buffer = await fs.readFile(filePath);
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
    }

    // Unsupported format — return empty string, don't crash
    return '';
};