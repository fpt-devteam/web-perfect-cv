import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Code, Plus, Trash2, Edit3, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { useNotification } from '@/shared/hooks/useNotification';
import {
  useListSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from '@/modules/skill/hooks/useSkill';
import { SearchableInput } from '@/shared/components/ui/searchable-input';
import { searchSkillCategories } from '@/modules/skill/services/skill.services';
import { AIEvaluationCard } from '@/modules/cv/components/ai-evaluation';
import { useSectionScore } from '@/modules/cv/hooks/useCVSectionScores';
import { SectionType } from '@/modules/cv/types/ai-evaluation.types';
import type {
  SkillResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@/modules/skill/types/skill.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import type { SearchableItemResponse } from '@/modules/skill/types/skill.types';

const skillSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  cvId: string;
  onSuccess?: () => void;
}

export function SkillSection({ cvId }: { readonly cvId: string }) {
  return <SkillForm cvId={cvId} />;
}

export function SkillForm({ cvId, onSuccess }: SkillFormProps) {
  const { showError, showSuccess } = useNotification();
  const { data: skills, isLoading: isLoadingSkills } = useListSkills({ cvId });
  const { data: sectionScore, isLoading: isLoadingScore } = useSectionScore(cvId, SectionType.Skills);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const createSkill = useCreateSkill({ cvId });
  const updateSkill = useUpdateSkill({ cvId });
  const deleteSkill = useDeleteSkill({ cvId });

  const isAnyMutationInProgress =
    createSkill.isPending || updateSkill.isPending || deleteSkill.isPending;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category: '',
      content: '',
    },
  });

  const resetForm = () => {
    form.reset({
      category: '',
      content: '',
    });
    setIsCreating(false);
    setEditingSkill(null);
  };

  const onSubmit = async (data: SkillFormValues) => {
    setIsLoading(true);
    try {
      if (editingSkill) {
        const updateData: UpdateSkillRequest = {
          category: data.category,
          content: data.content,
        };
        await updateSkill.mutateAsync({
          skillId: editingSkill.id,
          skillData: updateData,
        });
        showSuccess('Skill updated successfully');
      } else {
        const createData: CreateSkillRequest = {
          category: data.category,
          content: data.content,
        };
        await createSkill.mutateAsync(createData);
        showSuccess('Skill added successfully');
      }
      resetForm();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (skill: SkillResponse) => {
    setEditingSkill(skill);
    form.reset({
      category: skill.category,
      content: skill.content,
    });
  };

  const handleDelete = async (skillId: string) => {
    if (deletingSkillId === skillId) return;
    setDeletingSkillId(skillId);
    try {
      await deleteSkill.mutateAsync(skillId);
      showSuccess('Skill deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setDeletingSkillId(null);
    }
  };

  const handleCategorySelect = (item: SearchableItemResponse) => {
    form.setValue('category', item.name);
  };

  // Group skills by category for better display
  const groupedSkills =
    skills?.reduce(
      (acc, skill) => {
        const category = skill.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      },
      {} as Record<string, SkillResponse[]>
    ) || {};

  return (
    <div className="space-y-6">
      {/* AI Evaluation Card */}
      <AIEvaluationCard
        sectionScore={sectionScore}
        sectionType={SectionType.Skills}
        isLoading={isLoadingScore}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills
              {isAnyMutationInProgress && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
              )}
            </CardTitle>
            <Button
              onClick={() => setIsCreating(true)}
              size="sm"
              className="flex items-center gap-2"
              disabled={isCreating || !!editingSkill || isAnyMutationInProgress}
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingSkills ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : skills && skills.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                      {category}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySkills.map(skill => (
                      <div
                        key={skill.id}
                        className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {skill.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(skill)}
                            className="h-6 w-6 p-0"
                            disabled={isCreating || !!editingSkill || isAnyMutationInProgress}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(skill.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={
                              deletingSkillId === skill.id ||
                              isCreating ||
                              !!editingSkill ||
                              isAnyMutationInProgress
                            }
                          >
                            {deletingSkillId === skill.id ? (
                              <div className="animate-spin h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No skills added yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Add your technical and soft skills to showcase your expertise
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {(isCreating || editingSkill) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SearchableInput
                          value={field.value}
                          onChange={(val: string) => {
                            field.onChange(val);
                          }}
                          onSearch={searchSkillCategories}
                          onSelect={handleCategorySelect}
                          placeholder="e.g. Programming Languages, Frameworks & Libraries"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Skill Content <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. React.js, JavaScript, Python, Project Management"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || isAnyMutationInProgress}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Code className="h-4 w-4" />
                    )}
                    {editingSkill ? 'Update Skill' : 'Add Skill'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading || isAnyMutationInProgress}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}