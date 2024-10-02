const express = require('express');
const router = express.Router();

// Sample in-memory storage for participants and their Secret Santa assignments
let participants = [];
let assignments = {};

// POST /secretsanta/assign: Assign Secret Santas to participants
router.post('/assign', (req, res) => {
  const { participantsList } = req.body;

  if (!participantsList || participantsList.length < 2) {
    return res.status(400).json({ message: 'At least two participants are required.' });
  }

  participants = participantsList;

  // Shuffle participants and assign Secret Santas
  const shuffled = shuffleArray([...participants]);
  assignments = {};

  for (let i = 0; i < participants.length; i++) {
    const giver = participants[i];
    const receiver = shuffled[(i + 1) % participants.length]; // Circular assignment
    assignments[giver] = receiver;
  }

  return res.status(201).json({ message: 'Secret Santa assignments completed!', assignments });
});

// GET /secretsanta/:name: Get the assigned recipient for a specific participant
router.get('/:name', (req, res) => {
  const { name } = req.params;

  if (!assignments[name]) {
    return res.status(404).json({ message: 'Participant not found or no assignment yet.' });
  }

  return res.status(200).json({ recipient: assignments[name] });
});

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = router;

