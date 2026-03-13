function computeEsas(values) {
  const keys = [
    "pain",
    "tiredness",
    "drowsiness",
    "nausea",
    "appetite",
    "shortnessOfBreath",
    "depression",
    "anxiety",
    "wellbeing",
    "otherProblem"
  ];

  const scores = keys.map((key) => Number(values?.[key] ?? 0));

  const totalScore = scores.reduce((sum, value) => sum + value, 0);

  const activeSymptomCount = scores.filter((value) => value > 0).length;

  const maxScore = Math.max(...scores);

  let severity = "";

  if (maxScore >= 1 && maxScore <= 3) severity = "Mild";
  else if (maxScore >= 4 && maxScore <= 6) severity = "Moderate";
  else if (maxScore >= 7) severity = "Severe";

  return {
    totalScore,
    severity,
    activeSymptomCount
  };
}

export { computeEsas };