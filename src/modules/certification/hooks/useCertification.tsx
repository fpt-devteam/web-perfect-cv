import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '@/modules/certification/services/certification.services';
import type {
  CreateCertificationRequest,
  UpdateCertificationRequest,
  CertificationResponse,
} from '@/modules/certification/types/certification.types';

const genCertificationsKey = (cvId: string) => ['certifications', cvId];

const genCertificationKey = (cvId: string, certificationId: string) => [
  'certification',
  cvId,
  certificationId,
];

export function useListCertifications({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genCertificationsKey(cvId),
    queryFn: () => listCertifications({ cvId }),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCertification({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificationData: CreateCertificationRequest) =>
      createCertification({ cvId, certificationData }),
    onMutate: async newCertification => {
      await queryClient.cancelQueries({ queryKey: genCertificationsKey(cvId) });

      const previousCertifications = queryClient.getQueryData<CertificationResponse[]>(
        genCertificationsKey(cvId)
      );

      if (previousCertifications) {
        const optimisticCertification: CertificationResponse = {
          id: `temp-${Date.now()}`,
          cvId: cvId,
          name: newCertification.name,
          issuedDate: newCertification.issuedDate,
          description: newCertification.description,
          organization: newCertification.organization,
          organizationId: null, // Will be set by backend if needed
        };

        queryClient.setQueryData<CertificationResponse[]>(genCertificationsKey(cvId), [
          ...previousCertifications,
          optimisticCertification,
        ]);
      }

      return { previousCertifications };
    },
    onError: (_, __, context) => {
      if (context?.previousCertifications) {
        queryClient.setQueryData(genCertificationsKey(cvId), context.previousCertifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: genCertificationsKey(cvId) });
    },
  });
}

export function useUpdateCertification({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificationId,
      certificationData,
    }: {
      certificationId: string;
      certificationData: UpdateCertificationRequest;
    }) => updateCertification({ cvId, certificationId, certificationData }),
    onMutate: async ({ certificationId, certificationData }) => {
      await queryClient.cancelQueries({ queryKey: genCertificationsKey(cvId) });

      const previousCertifications = queryClient.getQueryData<CertificationResponse[]>(
        genCertificationsKey(cvId)
      );

      if (previousCertifications) {
        queryClient.setQueryData<CertificationResponse[]>(
          genCertificationsKey(cvId),
          previousCertifications.map(cert =>
            cert.id === certificationId
              ? {
                  ...cert,
                  ...certificationData,
                }
              : cert
          )
        );
      }

      return { previousCertifications };
    },
    onError: (_, __, context) => {
      if (context?.previousCertifications) {
        queryClient.setQueryData(genCertificationsKey(cvId), context.previousCertifications);
      }
    },
    onSuccess: (_, { certificationId }) => {
      queryClient.invalidateQueries({ queryKey: genCertificationsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genCertificationKey(cvId, certificationId) });
    },
  });
}

export function useDeleteCertification({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificationId: string) => deleteCertification({ cvId, certificationId }),
    onMutate: async certificationId => {
      await queryClient.cancelQueries({ queryKey: genCertificationsKey(cvId) });

      const previousCertifications = queryClient.getQueryData<CertificationResponse[]>(
        genCertificationsKey(cvId)
      );

      if (previousCertifications) {
        queryClient.setQueryData<CertificationResponse[]>(
          genCertificationsKey(cvId),
          previousCertifications.filter(cert => cert.id !== certificationId)
        );
      }

      return { previousCertifications };
    },
    onError: (_, __, context) => {
      if (context?.previousCertifications) {
        queryClient.setQueryData(genCertificationsKey(cvId), context.previousCertifications);
      }
    },
    onSuccess: (_, certificationId) => {
      queryClient.invalidateQueries({ queryKey: genCertificationsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genCertificationKey(cvId, certificationId) });
    },
  });
}