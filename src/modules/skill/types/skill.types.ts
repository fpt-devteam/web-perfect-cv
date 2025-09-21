export type SkillResponse = {
  id: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSkillRequest = {
  category: string;
  content: string;
};

export type UpdateSkillRequest = {
  category: string;
  content: string;
};

export type SearchableItemResponse = {
  id: string;
  name: string;
};

export type SearchableItemListResponse = SearchableItemResponse[];
export type SkillCategoryResponse = SearchableItemResponse;
export type SkillCategoryListResponse = SkillCategoryResponse[];