import type {
  CreateCVRequest,
  UpdateCVRequest,
  CVListQuery,
  CVListResponse,
  CVResponse,
  CVContact,
  UpSertContactRequest,
  CVExperience,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  CVSummary,
  UpSertSummaryRequest,
  CVCertificationResponse,
  CreateCVCertificationRequest,
  UpdateCVCertificationRequest,
  CVProjectResponse,
  CreateCVProjectRequest,
  UpdateCVProjectRequest,
  CVEducationResponse,
  CreateCVEducationRequest,
  UpdateCVEducationRequest,
  CVSkillResponse,
  CreateCVSkillRequest,
  UpdateCVSkillRequest,
  CVFullContentResponse,
} from '@/modules/cv/types/cv.types';
import {
  GET_CVS_ENDPOINT,
  CREATE_CV_ENDPOINT,
  UPDATE_CV_ENDPOINT,
  DELETE_CV_ENDPOINT,
  GET_CV_FULL_CONTENT_ENDPOINT,
  UPSERT_CONTACT_ENDPOINT,
  LIST_CONTACTS_ENDPOINT,
  LIST_EXPERIENCES_ENDPOINT,
  CREATE_EXPERIENCE_ENDPOINT,
  UPDATE_EXPERIENCE_ENDPOINT,
  DELETE_EXPERIENCE_ENDPOINT,
  GET_SUMMARY_ENDPOINT,
  UPSERT_SUMMARY_ENDPOINT,
  LIST_CERTIFICATIONS_ENDPOINT,
  CREATE_CERTIFICATION_ENDPOINT,
  UPDATE_CERTIFICATION_ENDPOINT,
  DELETE_CERTIFICATION_ENDPOINT,
  LIST_PROJECTS_ENDPOINT,
  CREATE_PROJECT_ENDPOINT,
  UPDATE_PROJECT_ENDPOINT,
  DELETE_PROJECT_ENDPOINT,
  LIST_EDUCATIONS_ENDPOINT,
  CREATE_EDUCATION_ENDPOINT,
  UPDATE_EDUCATION_ENDPOINT,
  DELETE_EDUCATION_ENDPOINT,
  LIST_SKILLS_ENDPOINT,
  CREATE_SKILL_ENDPOINT,
  UPDATE_SKILL_ENDPOINT,
  DELETE_SKILL_ENDPOINT,
} from '@/modules/cv/constants/cv-endpoint.constant';
import { authClient } from '@/modules/auth/services/client.service';

export const listCVs = async (query: CVListQuery) => {
  const { data } = await authClient<CVListResponse>({
    method: 'GET',
    url: GET_CVS_ENDPOINT,
    params: query,
  });
  return data;
};

export const createCV = async (request: CreateCVRequest) => {
  const { data } = await authClient<CVResponse>({
    method: 'POST',
    url: CREATE_CV_ENDPOINT,
    data: request,
  });
  return data;
};

export const updateCV = async ({ cvId, request }: { cvId: string; request: UpdateCVRequest }) => {
  const { data } = await authClient<CVResponse>({
    method: 'PUT',
    url: UPDATE_CV_ENDPOINT(cvId),
    data: request,
  });
  return data;
};

export const deleteCV = async ({ cvId }: { cvId: string }) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_CV_ENDPOINT(cvId),
  });
  return data;
};

export const listContacts = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVContact>({
    method: 'GET',
    url: LIST_CONTACTS_ENDPOINT(cvId),
  });
  return data;
};

export const upsertContact = async ({
  cvId,
  contactData,
}: {
  readonly cvId: string;
  readonly contactData: UpSertContactRequest;
}) => {
  const { data } = await authClient<CVContact>({
    method: 'POST',
    url: UPSERT_CONTACT_ENDPOINT(cvId),
    data: contactData,
  });
  return data;
};

export const listExperiences = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVExperience[]>({
    method: 'GET',
    url: LIST_EXPERIENCES_ENDPOINT(cvId),
  });
  return data;
};

export const createExperience = async ({
  cvId,
  experienceData,
}: {
  readonly cvId: string;
  readonly experienceData: CreateExperienceRequest;
}) => {
  const { data } = await authClient<CVExperience>({
    method: 'POST',
    url: CREATE_EXPERIENCE_ENDPOINT(cvId),
    data: experienceData,
  });
  return data;
};

export const updateExperience = async ({
  cvId,
  experienceId,
  experienceData,
}: {
  readonly cvId: string;
  readonly experienceId: string;
  readonly experienceData: UpdateExperienceRequest;
}) => {
  const { data } = await authClient<CVExperience>({
    method: 'PUT',
    url: UPDATE_EXPERIENCE_ENDPOINT(cvId, experienceId),
    data: experienceData,
  });
  return data;
};

export const deleteExperience = async ({
  cvId,
  experienceId,
}: {
  readonly cvId: string;
  readonly experienceId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_EXPERIENCE_ENDPOINT(cvId, experienceId),
  });
  return data;
};

export const getSummary = async ({ cvId }: { readonly cvId: string }) => {
  try {
    const { data } = await authClient<CVSummary>({
      method: 'GET',
      url: GET_SUMMARY_ENDPOINT(cvId),
    });

    // Handle case where API returns null or empty data
    if (!data) {
      return {
        id: '',
        cvId,
        context: null,
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
};

export const upsertSummary = async ({
  cvId,
  summaryData,
}: {
  readonly cvId: string;
  readonly summaryData: UpSertSummaryRequest;
}) => {
  const { data } = await authClient<CVSummary>({
    method: 'POST',
    url: UPSERT_SUMMARY_ENDPOINT(cvId),
    data: summaryData,
  });
  return data;
};

export const listCertifications = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVCertificationResponse[]>({
    method: 'GET',
    url: LIST_CERTIFICATIONS_ENDPOINT(cvId),
  });
  return data;
};

export const createCertification = async ({
  cvId,
  certificationData,
}: {
  readonly cvId: string;
  readonly certificationData: CreateCVCertificationRequest;
}) => {
  const { data } = await authClient<CVCertificationResponse>({
    method: 'POST',
    url: CREATE_CERTIFICATION_ENDPOINT(cvId),
    data: certificationData,
  });
  return data;
};

export const updateCertification = async ({
  cvId,
  certificationId,
  certificationData,
}: {
  readonly cvId: string;
  readonly certificationId: string;
  readonly certificationData: UpdateCVCertificationRequest;
}) => {
  const { data } = await authClient<CVCertificationResponse>({
    method: 'PUT',
    url: UPDATE_CERTIFICATION_ENDPOINT(cvId, certificationId),
    data: certificationData,
  });
  return data;
};

export const deleteCertification = async ({
  cvId,
  certificationId,
}: {
  readonly cvId: string;
  readonly certificationId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_CERTIFICATION_ENDPOINT(cvId, certificationId),
  });
  return data;
};

export const listProjects = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVProjectResponse[]>({
    method: 'GET',
    url: LIST_PROJECTS_ENDPOINT(cvId),
  });
  return data;
};

export const createProject = async ({
  cvId,
  projectData,
}: {
  readonly cvId: string;
  readonly projectData: CreateCVProjectRequest;
}) => {
  const { data } = await authClient<CVProjectResponse>({
    method: 'POST',
    url: CREATE_PROJECT_ENDPOINT(cvId),
    data: projectData,
  });
  return data;
};

export const updateProject = async ({
  cvId,
  projectId,
  projectData,
}: {
  readonly cvId: string;
  readonly projectId: string;
  readonly projectData: UpdateCVProjectRequest;
}) => {
  const { data } = await authClient<CVProjectResponse>({
    method: 'PUT',
    url: UPDATE_PROJECT_ENDPOINT(cvId, projectId),
    data: projectData,
  });
  return data;
};

export const deleteProject = async ({
  cvId,
  projectId,
}: {
  readonly cvId: string;
  readonly projectId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_PROJECT_ENDPOINT(cvId, projectId),
  });
  return data;
};

export const listEducations = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVEducationResponse[]>({
    method: 'GET',
    url: LIST_EDUCATIONS_ENDPOINT(cvId),
  });
  return data;
};

export const createEducation = async ({
  cvId,
  educationData,
}: {
  readonly cvId: string;
  readonly educationData: CreateCVEducationRequest;
}) => {
  const { data } = await authClient<CVEducationResponse>({
    method: 'POST',
    url: CREATE_EDUCATION_ENDPOINT(cvId),
    data: educationData,
  });
  return data;
};

export const updateEducation = async ({
  cvId,
  educationId,
  educationData,
}: {
  readonly cvId: string;
  readonly educationId: string;
  readonly educationData: UpdateCVEducationRequest;
}) => {
  const { data } = await authClient<CVEducationResponse>({
    method: 'PUT',
    url: UPDATE_EDUCATION_ENDPOINT(cvId, educationId),
    data: educationData,
  });
  return data;
};

export const deleteEducation = async ({
  cvId,
  educationId,
}: {
  readonly cvId: string;
  readonly educationId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_EDUCATION_ENDPOINT(cvId, educationId),
  });
  return data;
};

export const listSkills = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVSkillResponse[]>({
    method: 'GET',
    url: LIST_SKILLS_ENDPOINT(cvId),
  });
  return data;
};

export const createSkill = async ({
  cvId,
  skillData,
}: {
  readonly cvId: string;
  readonly skillData: CreateCVSkillRequest;
}) => {
  const { data } = await authClient<CVSkillResponse>({
    method: 'POST',
    url: CREATE_SKILL_ENDPOINT(cvId),
    data: skillData,
  });
  return data;
};

export const updateSkill = async ({
  cvId,
  skillId,
  skillData,
}: {
  readonly cvId: string;
  readonly skillId: string;
  readonly skillData: UpdateCVSkillRequest;
}) => {
  const { data } = await authClient<CVSkillResponse>({
    method: 'PUT',
    url: UPDATE_SKILL_ENDPOINT(cvId, skillId),
    data: skillData,
  });
  return data;
};

export const deleteSkill = async ({
  cvId,
  skillId,
}: {
  readonly cvId: string;
  readonly skillId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_SKILL_ENDPOINT(cvId, skillId),
  });
  return data;
};

export const getCVFullContent = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVFullContentResponse>({
    method: 'GET',
    url: GET_CV_FULL_CONTENT_ENDPOINT(cvId),
  });
  return data;
};
