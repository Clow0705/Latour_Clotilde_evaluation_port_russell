const router = require('express').Router();
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupérer tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste de tous les catways
 */
router.get('/', auth, async (req, res) => {
  const catways = await Catway.find();
  res.json(catways);
});

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupérer un catway par son numéro
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Détails du catway
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:id', auth, async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) return res.status(404).json({ message: 'Non trouvé' });
  res.json(catway);
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Créer un nouveau catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: number
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *               catwayState:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catway créé
 */
router.post('/', auth, async (req, res) => {
  try {
    const catway = new Catway(req.body);
    await catway.save();
    res.redirect('/page-catways');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Modifier l'état d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catway modifié
 */
router.put('/:id', auth, async (req, res) => {
  try {
    await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true }
    );
    res.redirect('/page-catways');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Catway supprimé
 */
router.delete('/:id', auth, async (req, res) => {
  await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  res.redirect('/page-catways');
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'un catway
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get('/:id/reservations', auth, async (req, res) => {
  const reservations = await Reservation.find({ catwayNumber: req.params.id });
  res.json(reservations);
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réservation
 */
router.get('/:id/reservations/:idReservation', auth, async (req, res) => {
  const reservation = await Reservation.findById(req.params.idReservation);
  if (!reservation) return res.status(404).json({ message: 'Non trouvé' });
  res.json(reservation);
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Créer une réservation pour un catway
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 */
router.post('/:id/reservations', auth, async (req, res) => {
  try {
    const reservation = new Reservation({
      ...req.body,
      catwayNumber: req.body.catwayNumber || req.params.id
    });
    await reservation.save();
    res.redirect('/page-reservations');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Modifier une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation modifiée
 */
router.put('/:id/reservations/:idReservation', auth, async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(
      req.params.idReservation,
      req.body,
      { new: true }
    );
    res.redirect('/page-reservations');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée
 */
router.delete('/:id/reservations/:idReservation', auth, async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.idReservation);
  res.redirect('/page-reservations');
});

module.exports = router;