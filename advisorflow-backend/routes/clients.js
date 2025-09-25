import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { BlobServiceClient } from '@azure/storage-blob';
import db from '../db.js'; // Assuming you have a db connection module
import { encrypt, decrypt } from '../utils/crypto.js'; // Import our security functions

const router = express.Router();

// --- Blob Storage Setup (from before) ---
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const upload = multer({ storage: multer.memoryStorage() });

// --- Client Management Routes ---

/**
 * @route   POST /api/clients
 * @desc    Create a new client profile
 * @access  Private (requires authentication)
 */
router.post('/', async (req, res) => {
    // NOTE: This assumes you have auth middleware that adds `req.user.id`
    const userId = req.user.id; 
    const { firstName, lastName, email, clientType } = req.body;

    try {
        const { rows } = await db.query(
            'INSERT INTO clients (user_id, first_name, last_name, email, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, firstName, lastName, email, clientType]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating client.' });
    }
});

/**
 * @route   GET /api/clients
 * @desc    Get all clients for the logged-in user
 * @access  Private
 */
router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const { rows } = await db.query('SELECT * FROM clients WHERE user_id = $1 ORDER BY last_name, first_name', [userId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching clients.' });
    }
});

/**
 * @route   GET /api/clients/:id
 * @desc    Get a single client's full details
 * @access  Private
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const { rows } = await db.query('SELECT * FROM clients WHERE id = $1 AND user_id = $2', [id, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client not found.' });
        }

        const client = rows[0];

        // **DECRYPTION STEP**: Decrypt sensitive data before sending it to the frontend.
        // We check if the data exists before trying to decrypt it.
        if (client.id_number) client.id_number = decrypt(client.id_number);
        if (client.tax_number) client.tax_number = decrypt(client.tax_number);

        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching client details.' });
    }
});


/**
 * @route   PUT /api/clients/:id
 * @desc    Update a client's details (after AI extraction/manual review)
 * @access  Private
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { id_number, tax_number, street_address, suburb, city, postal_code } = req.body;

    // **ENCRYPTION STEP**: Encrypt sensitive data before saving it to the database.
    const encryptedIdNumber = id_number ? encrypt(id_number) : null;
    const encryptedTaxNumber = tax_number ? encrypt(tax_number) : null;

    try {
        const { rows } = await db.query(
            `UPDATE clients 
             SET id_number = $1, tax_number = $2, street_address = $3, suburb = $4, city = $5, postal_code = $6
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [encryptedIdNumber, encryptedTaxNumber, street_address, suburb, city, postal_code, id, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client not found or you do not have permission to edit.' });
        }
        
        // Decrypt the data again before sending it back in the response
        const updatedClient = rows[0];
        if (updatedClient.id_number) updatedClient.id_number = decrypt(updatedClient.id_number);
        if (updatedClient.tax_number) updatedClient.tax_number = decrypt(updatedClient.tax_number);

        res.json(updatedClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating client.' });
    }
});


// --- Document Upload Route (from before) ---

/**
 * @route   POST /api/clients/:clientId/documents
 * @desc    Upload a document for a specific client
 * @access  Private
 */
router.post('/:clientId/documents', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    // Details from the request
    const { clientId } = req.params;
    const { documentType, issueDate } = req.body; // e.g., 'IDENTITY', '2025-08-15'
    const containerName = 'client-documents';

    // 1. Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // 2. Create a unique name for the blob
    const blobName = `${uuidv4()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // 3. Upload the file buffer to Azure Blob Storage
    await blockBlobClient.upload(req.file.buffer, req.file.size);

    // 4. *** NEW: Save metadata to your PostgreSQL database ***
    const newDocument = {
        clientId: clientId,
        originalName: req.file.originalname,
        blobName: blobName,
        blobUrl: blockBlobClient.url,
        documentType: documentType, // The type from the frontend
        issueDate: issueDate || null // The issue date from the frontend
    };

    await db.query(
        `INSERT INTO documents (client_id, original_name, blob_name, blob_url, type, issue_date) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            newDocument.clientId, 
            newDocument.originalName, 
            newDocument.blobName, 
            newDocument.blobUrl, 
            newDocument.documentType, 
            newDocument.issueDate
        ]
    );

    res.status(201).json({ 
      message: 'File uploaded and record created successfully',
      document: newDocument
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file.', error: error.message });
  }
});

export default router;