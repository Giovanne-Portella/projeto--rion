import Papa from 'papaparse';

/**
 * Parses a local CSV file object.
 * @param {File} file - The file object to parse.
 * @returns {Promise<object>} A promise that resolves with the parsed CSV data.
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Downloads and parses a remote CSV file from a URL.
 * @param {string} url - The URL of the CSV file to download and parse.
 * @returns {Promise<object>} A promise that resolves with the parsed CSV data.
 */
export const downloadAndParseCSV = (url) => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};