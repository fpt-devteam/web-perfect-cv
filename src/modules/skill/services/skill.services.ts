import { authClient } from '@/modules/auth/services/client.service';
import {
  LIST_SKILLS_ENDPOINT,
  CREATE_SKILL_ENDPOINT,
  UPDATE_SKILL_ENDPOINT,
  DELETE_SKILL_ENDPOINT,
  LIST_CATEGORIES_ENDPOINT,
} from '@/modules/cv/constants/cv-endpoint.constant';
import type {
  SkillResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillCategoryListResponse,
} from '@/modules/skill/types/skill.types';

// Skill CRUD operations
export const listSkills = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<SkillResponse[]>({
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
  readonly skillData: CreateSkillRequest;
}) => {
  const { data } = await authClient<SkillResponse>({
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
  readonly skillData: UpdateSkillRequest;
}) => {
  const { data } = await authClient<SkillResponse>({
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

// Search operations
export const searchSkillCategories = async (query: string) => {
  const { data } = await authClient<SkillCategoryListResponse>({
    method: 'GET',
    url: LIST_CATEGORIES_ENDPOINT(),
    params: {
      SearchTerm: query,
    },
  });

  return data;
};