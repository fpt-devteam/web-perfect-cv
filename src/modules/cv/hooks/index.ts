export { useCreateCV } from './useCreateCV';
export { useUpdateCV } from './useUpdateCV';
export { useDeleteCV } from './useDeleteCV';
export { useCVData } from './useCVData';

// Analysis hooks

// Re-export section modules for backward compatibility
export { useListContacts, useUpsertContact } from '@/modules/contact';
export { useListExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience, useGetEmploymentType } from '@/modules/experience';
export { useGetSummary, useUpsertSummary } from '@/modules/summary';
export { useListCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification } from '@/modules/certification';
export { useListProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/modules/project';
export { useListEducations, useCreateEducation, useUpdateEducation, useDeleteEducation, useGetDegree } from '@/modules/education';
export { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/modules/skill';
