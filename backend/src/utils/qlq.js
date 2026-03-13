function computeQlqTotal(qlq = {}) {
  const totalScore = Array.from({ length: 30 }, (_, i) => i + 1).reduce(
    (sum, n) => sum + Number(qlq[`q${n}`] ?? 0),
    0
  );

  return { totalScore };
}

export { computeQlqTotal };