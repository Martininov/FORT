/**
 * Minimal utility functions converted from Python utils.py
 * These are simple helpers; extend them if you need full feature parity.
 */

function filterByPositions(data, positions = []) {
  if (!positions || positions.length === 0) return data;
  return data.filter(item => positions.includes(item.position));
}

function toLeagueName(code) {
  // simple mapping; expand as needed
  const map = { 'EPL': 'English Premier League', 'LaLiga': 'La Liga' };
  return map[code] || code;
}

module.exports = {
  filterByPositions,
  toLeagueName
};
