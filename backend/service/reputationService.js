function calculateReputation(user) {
  const R = user.ratings.length
    ? user.ratings.reduce((a, b) => a + b, 0) / user.ratings.length
    : 0;

  const H = user.ratings.length; // completed helps
  const C = user.cancelledHelps || 0;

  const T = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24 * 30); // months

  const score =
    (R * 0.6) +
    (H * 0.25) -
    (C * 0.15) +
    (T * 0.05);

  return Math.max(score, 0); // never negative
}

module.exports = calculateReputation;