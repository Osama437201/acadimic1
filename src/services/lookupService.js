import api from "./api";

// دالة مساعدة موحدة لفك تغليف رد السيرفر أياً كان شكله
function unwrap(response) {
  return response?.data?.data ?? response?.data ?? [];
}

export async function getCountries() {
  const res = await api.get("/countries");
  return unwrap(res);
}

export const getCurriculums = async () => {
  const res = await api.get("/curriculums/");
  return unwrap(res);
};

export const getStagesByCurriculum = async (curriculumId) => {
  const res = await api.get(`/stages/curriculum/${curriculumId}`);
  return unwrap(res);
};

export const getGradesByStage = async (stageId) => {
  const res = await api.get(`/grades?stage=${stageId}`);
  return unwrap(res);
};

export const getSubjectsByGrade = async (gradeId) => {
  const res = await api.get(`/subjects/?grade=${gradeId}`);
  return unwrap(res);
};