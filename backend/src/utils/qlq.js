function computeQlqTotal(qlq = {}) {
  const totalScore = Array.from({ length: 30 }, (_, i) => i + 1).reduce((sum, n) => {
    return sum + Number(qlq[`q${n}`] ?? 0);
  }, 0);

  return { totalScore };
}

module.exports = { computeQlqTotal };