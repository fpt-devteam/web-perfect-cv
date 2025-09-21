export type SkillResponse = {
  id: string;
  cvId: string;
  description: string;
  category: string;
};

export type CreateSkillRequest = {
  description: string;
  categoryName: string;
};

export type UpdateSkillRequest = {
  description: string;
  categoryName: string;
};

export type SearchableItemResponse = {
  id: string;
  name: string;
};

export type SearchableItemListResponse = SearchableItemResponse[];
export type SkillCategoryResponse = SearchableItemResponse;
export type SkillCategoryListResponse = SkillCategoryResponse[];