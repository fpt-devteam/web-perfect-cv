# Skill Module

This module provides complete skill management functionality extracted from the CV module.

## Structure

- `types/skill.types.ts` - Type definitions for skills
- `services/skill.services.ts` - API service functions for skill operations
- `hooks/useSkill.tsx` - React Query hooks for skill management
- `components/SkillSection.tsx` - UI components for skill display and management
- `index.ts` - Barrel export file

## Usage

### Basic Import
```typescript
import {
  SkillSection,
  useListSkills,
  createSkill,
  SkillResponse
} from '@/modules/skill';
```

### Using in Components
```typescript
// Use the complete skill section component
function CVBuilder({ cvId }: { cvId: string }) {
  return (
    <div>
      <SkillSection cvId={cvId} />
    </div>
  );
}

// Or use individual hooks for custom UI
function CustomSkillsList({ cvId }: { cvId: string }) {
  const { data: skills, isLoading } = useListSkills({ cvId });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {skills?.map(skill => (
        <li key={skill.id}>
          {skill.description} ({skill.category})
        </li>
      ))}
    </ul>
  );
}
```

## Migration from CV Module

Replace these imports:
```typescript
// OLD
import { useListSkills } from '@/modules/skill';
import { SkillSection } from '@/modules/skill';
import type { SkillResponse } from '@/modules/skill/types/skill.types';

// NEW
import { useListSkills, SkillSection } from '@/modules/skill';
import type { SkillResponse } from '@/modules/skill';
```

## API

### Types
- `SkillResponse` - Skill data structure
- `CreateSkillRequest` - Create skill request payload
- `UpdateSkillRequest` - Update skill request payload
- `SkillCategoryResponse` - Skill category data

### Services
- `listSkills({ cvId })` - Fetch all skills for a CV
- `createSkill({ cvId, skillData })` - Create a new skill
- `updateSkill({ cvId, skillId, skillData })` - Update existing skill
- `deleteSkill({ cvId, skillId })` - Delete a skill
- `searchSkillCategories(query)` - Search skill categories

### Hooks
- `useListSkills({ cvId })` - Query hook for listing skills
- `useCreateSkill({ cvId })` - Mutation hook for creating skills
- `useUpdateSkill({ cvId })` - Mutation hook for updating skills
- `useDeleteSkill({ cvId })` - Mutation hook for deleting skills

### Components
- `SkillSection` - Complete skill management section
- `SkillForm` - Skill creation/editing form