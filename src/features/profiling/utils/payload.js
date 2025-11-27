export function buildProfilingPayload(profile, answers) {
  const normalizedAnswers = (answers || [])
    .filter(Boolean)
    .map((a) => ({ id: a.id, answer: a.answer, category: a.category, type: a.type, question: a.statement }));
  return {
    profile: {
      name: profile.name,
      gender: profile.gender,
      city: profile.city,
      country: profile.country,
      occupation: profile.occupation,
      phoneNumber: profile.phoneNumber,
      bornDate: profile.bornDate,
      email: profile.email,
    },
    answers: normalizedAnswers,
  };
}