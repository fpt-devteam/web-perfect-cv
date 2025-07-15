import type { CVFullContentResponse, CVData } from '../types/cv.types';

export const transformCVFullContentToCVData = (apiData: CVFullContentResponse): CVData => {
  return {
    CVId: apiData.id,
    UserId: apiData.userId,
    Title: apiData.title,
    JobDetail: apiData.jobDetail
      ? {
          JobTitle: apiData.jobDetail.jobTitle || '',
          CompanyName: apiData.jobDetail.companyName || '',
          Description: apiData.jobDetail.description || '',
        }
      : {
          JobTitle: '',
          CompanyName: '',
          Description: '',
        },
    Contacts: apiData.contact
      ? {
          Id: apiData.contact.id || '',
          CVId: apiData.contact.cvId || apiData.id,
          PhoneNumber: apiData.contact.phoneNumber || '',
          Email: apiData.contact.email || '',
          LinkedInUrl: apiData.contact.linkedInUrl,
          GitHubUrl: apiData.contact.gitHubUrl,
          PersonalWebsiteUrl: apiData.contact.personalWebsiteUrl,
          Country: apiData.contact.country || '',
          City: apiData.contact.city || '',
        }
      : {
          Id: '',
          CVId: apiData.id,
          PhoneNumber: '',
          Email: '',
          LinkedInUrl: null,
          GitHubUrl: null,
          PersonalWebsiteUrl: null,
          Country: '',
          City: '',
        },
    Summary: apiData.summary?.context || null,
    Skills: (apiData.skills || []).map(skill => ({
      Id: skill.id,
      CVId: apiData.id,
      Name: skill.category || '', // Use category as the heading
      Level: 3, // Default level since API doesn't provide it
      Description: skill.description || '', // Use description as the content
    })),
    Educations: (apiData.educations || []).map(education => ({
      Organization: education.organization || '',
      Degree: education.degree || '',
      FieldOfStudy: education.fieldOfStudy || '',
      StartDate: education.startDate || '',
      EndDate: education.endDate || '',
      Description: education.description || '',
      Gpa: education.gpa || 0,
    })),
    Certifications: (apiData.certifications || []).map(certification => ({
      Id: certification.id,
      CVId: certification.cvId,
      Name: certification.name || '',
      OrganizationId: certification.organizationId || '',
      Organization: certification.organization || '',
      IssuedDate: certification.issuedDate || '',
      Description: certification.description || '',
    })),
    Experiences: (apiData.experiences || []).map(experience => ({
      Id: experience.id,
      CVId: experience.cvId,
      JobTitleId: experience.jobTitleId || '',
      JobTitle: experience.jobTitle || '',
      EmploymentTypeId: experience.employmentTypeId,
      EmploymentTypeName: experience.employmentTypeName || '',
      OrganizationId: experience.organizationId || '',
      Organization: experience.organization || '',
      Location: experience.location || '',
      StartDate: experience.startDate || '',
      EndDate: experience.endDate || '',
      Description: experience.description || '',
      CreatedAt: experience.createdAt || '',
      UpdatedAt: experience.updatedAt || '',
    })),
    Projects: (apiData.projects || []).map(project => ({
      Id: project.id,
      CVId: project.cvId,
      Title: project.title || '',
      Description: project.description || '',
      Link: project.link || '',
      StartDate: project.startDate || '',
      EndDate: project.endDate || '',
      CreatedAt: project.createdAt || '',
      UpdatedAt: project.updatedAt || '',
    })),
    lastEditedAt: apiData.updatedAt || '',
  };
};
