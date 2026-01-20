/**
 * Rutas de Upload - Vértice Gastronómico
 * Gestión de archivos e imágenes
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Directorio de uploads
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
};

// Crear directorios si no existen
const directories = ['images', 'documents', 'temp'];
directories.forEach(dir => {
  const fullPath = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'temp';
    if (ALLOWED_TYPES.image.includes(file.mimetype)) {
      folder = 'images';
    } else if ([...ALLOWED_TYPES.document, ...ALLOWED_TYPES.spreadsheet].includes(file.mimetype)) {
      folder = 'documents';
    }
    cb(null, path.join(UPLOAD_DIR, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allAllowed = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document, ...ALLOWED_TYPES.spreadsheet];
  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.use(authenticateToken);

/**
 * POST /api/upload/image
 * Subir imagen (logo, foto de producto, etc)
 */
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó imagen' });
    }

    if (!ALLOWED_TYPES.image.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'
      });
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      },
      message: 'Imagen subida exitosamente'
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/document
 * Subir documento (PDF, Excel, etc)
 */
router.post('/document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó documento' });
    }

    const allowedDocs = [...ALLOWED_TYPES.document, ...ALLOWED_TYPES.spreadsheet];
    if (!allowedDocs.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Tipo de documento no permitido'
      });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      },
      message: 'Documento subido exitosamente'
    });
  } catch (error) {
    console.error('Error subiendo documento:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/menu-image/:restaurantId/:itemId
 * Subir imagen de item del menú
 */
router.post('/menu-image/:restaurantId/:itemId', upload.single('image'), async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó imagen' });
    }

    // Verificar permisos
    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, restaurantId },
      include: { Restaurant: true }
    });

    if (!item || item.Restaurant.ownerId !== req.user.id) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    // Eliminar imagen anterior si existe
    if (item.image) {
      const oldPath = path.join(UPLOAD_DIR, item.image.replace('/uploads/', ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    // Actualizar item
    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: { image: fileUrl }
    });

    res.json({
      success: true,
      data: {
        itemId: updated.id,
        image: fileUrl
      },
      message: 'Imagen del menú actualizada'
    });
  } catch (error) {
    console.error('Error subiendo imagen de menú:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/restaurant-logo/:restaurantId
 * Subir logo del restaurante
 */
router.post('/restaurant-logo/:restaurantId', upload.single('logo'), async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó imagen' });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Eliminar logo anterior
    if (restaurant.logo) {
      const oldPath = path.join(UPLOAD_DIR, restaurant.logo.replace('/uploads/', ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { logo: fileUrl }
    });

    res.json({
      success: true,
      data: {
        restaurantId: updated.id,
        logo: fileUrl
      },
      message: 'Logo actualizado'
    });
  } catch (error) {
    console.error('Error subiendo logo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/restaurant-cover/:restaurantId
 * Subir imagen de portada del restaurante
 */
router.post('/restaurant-cover/:restaurantId', upload.single('cover'), async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó imagen' });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Eliminar portada anterior
    if (restaurant.coverImage) {
      const oldPath = path.join(UPLOAD_DIR, restaurant.coverImage.replace('/uploads/', ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { coverImage: fileUrl }
    });

    res.json({
      success: true,
      data: {
        restaurantId: updated.id,
        coverImage: fileUrl
      },
      message: 'Imagen de portada actualizada'
    });
  } catch (error) {
    console.error('Error subiendo portada:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/import-inventory/:restaurantId
 * Importar inventario desde Excel/CSV
 */
router.post('/import-inventory/:restaurantId', upload.single('file'), async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó archivo' });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Aquí iría la lógica de parsing del archivo
    // Por ahora retornamos info del archivo recibido
    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        status: 'pending_processing'
      },
      message: 'Archivo recibido. El procesamiento se realizará en segundo plano.'
    });
  } catch (error) {
    console.error('Error importando inventario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/import-menu/:restaurantId
 * Importar menú desde Excel/CSV
 */
router.post('/import-menu/:restaurantId', upload.single('file'), async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó archivo' });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        status: 'pending_processing'
      },
      message: 'Archivo recibido. El procesamiento se realizará en segundo plano.'
    });
  } catch (error) {
    console.error('Error importando menú:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/upload/:type/:filename
 * Eliminar archivo
 */
router.delete('/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;

    if (!['images', 'documents'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Tipo inválido' });
    }

    const filePath = path.join(UPLOAD_DIR, type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Archivo no encontrado' });
    }

    fs.unlinkSync(filePath);

    res.json({ success: true, message: 'Archivo eliminado' });
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/upload/list/:restaurantId
 * Listar archivos del restaurante
 */
router.get('/list/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { type = 'all' } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Obtener imágenes del menú
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId, image: { not: null } },
      select: { id: true, name: true, image: true }
    });

    const files = {
      restaurantLogo: restaurant.logo,
      restaurantCover: restaurant.coverImage,
      menuImages: menuItems.map(item => ({
        itemId: item.id,
        name: item.name,
        url: item.image
      }))
    };

    res.json({ success: true, data: files });
  } catch (error) {
    console.error('Error listando archivos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware de manejo de errores de Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo excede el tamaño máximo permitido (10MB)'
      });
    }
    return res.status(400).json({ success: false, error: error.message });
  }
  next(error);
});

export default router;
