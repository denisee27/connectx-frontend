import api from "../../../core/api";

export const getQuestions = async () => {
  const res = await api.get("/profiling/questions");
  return res;
}

export const getCountries = async () => {
  const res = await api.get("/places/countries");
  return res;
}

export const getCities = async (countryId) => {
  const res = await api.get(`/places/cities/${countryId}`);
  return res;
}

export const postProfilling = async (payload) => {
  const res = await api.post("/profiling", payload);
  return res;
}
