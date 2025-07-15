import { transformCVFullContentToCVData } from './cv-data-transformer';
import type { CVFullContentResponse } from '../types/cv.types';

// Sample API response data based on the user's example
const sampleApiResponse: CVFullContentResponse = {
  id: 'a1754ffd-4ce5-4153-807c-0025e73b7ef1',
  userId: '2e958cda-7227-4898-828c-bb8ffdf9db1c',
  title: 'Legacy Communications Officer',
  versionId: '26fa64ff-896a-489f-9eb8-28a0efa0059f',
  analysisId: null,
  createdAt: '2025-04-03T06:30:36.750661',
  updatedAt: '2025-07-15T12:48:55.16',
  jobDetail: {
    jobTitle: 'Regional Tactics Officer',
    companyName: 'Wolff, Pagac and Kunde',
    description: 'Human',
  },
  contact: {
    id: 'd9d04079-1e58-44a9-b37e-b5c86a193dbb',
    cvId: 'a1754ffd-4ce5-4153-807c-0025e73b7ef1',
    phoneNumber: '942-018-99',
    email: 'Arthur_Blick32@gmail.com',
    linkedInUrl: 'https://linkedin.com/in/Libby20',
    gitHubUrl: 'https://github.com/Gus79',
    personalWebsiteUrl: null,
    country: 'Palau',
    city: 'East Eleanorahaven',
  },
  summary: {
    id: '03e148e0-a48c-4e63-bc0b-bdfa47f98a27',
    cvId: 'a1754ffd-4ce5-4153-807c-0025e73b7ef1',
    context:
      'Versatile software engineer with experience in both frontend and backend development, skilled in modern development tools.',
  },
  skills: [
    {
      id: 'b44d3a33-a1b0-454c-946f-19734d1e49ae',
      category: 'Backend Development',
      description: 'Node.js',
      createdAt: '2025-05-19T12:08:54.7094656',
      updatedAt: '2025-06-25T04:09:50.4104658',
    },
    {
      id: '0a35a1c3-697b-4ac0-926f-393f2bbcbe67',
      category: 'Programming Languages',
      description: 'C#, Python, C++',
      createdAt: '2025-07-13T15:51:39.159265',
      updatedAt: null,
    },
  ],
  educations: [
    {
      id: 'd14c4648-207f-4902-648e-08ddc233c9eb',
      organization: 'Đại học FPT',
      degree: 'Doctor of Philosophy (PhD)',
      fieldOfStudy: 'Software Engineer',
      startDate: '2025-06-30',
      endDate: '2025-07-09',
      description: '',
      gpa: 3.8,
    },
  ],
  experiences: [
    {
      id: '94b6ae66-4b8f-4772-c651-08ddc3954a8c',
      cvId: 'a1754ffd-4ce5-4153-807c-0025e73b7ef1',
      jobTitleId: null,
      jobTitle: 'Backend engineer',
      employmentTypeId: '703c32de-f049-4715-b9e2-c7248e542fe7',
      employmentTypeName: 'Seasonal',
      organizationId: 'd07f757e-98a6-4b00-a13d-2de03307bc2c',
      organization: 'FPT Software',
      location: 'Ha noi',
      startDate: '2020-07-15',
      endDate: '2025-07-15',
      description: 'Super start',
      createdAt: '2025-07-15T11:46:52.460345',
      updatedAt: null,
    },
  ],
  projects: [
    {
      id: '4005c60f-7e4d-492b-a816-37a50a05f087',
      cvId: 'a1754ffd-4ce5-4153-807c-0025e73b7ef1',
      title: 'Koi Auction',
      description:
        'Itaque accusantium a voluptatem qui enim porro qui. Ut ab non sed odit doloribus aut.',
      link: 'http://elmore.org',
      startDate: '2025-06-29',
      endDate: '2025-07-15',
      createdAt: '2024-08-04T17:05:52.0364951',
      updatedAt: '2025-07-15T12:10:03.471655',
    },
  ],
  certifications: [
    {
      id: 'd0de4de9-3278-40ef-a780-168a97b06f9e',
      cvId: 'a1754ffd-4ce5-4153-807c-0025e73b7ef1',
      name: 'Azure software',
      organizationId: '44bd5c69-8948-4ea9-b9ff-1a277cf26fb5',
      organization: 'Microsoft',
      issuedDate: '2025-06-29',
      description: '',
    },
  ],
};

// Test the transformation function
export function testDataTransformation() {
  console.log('Testing CV data transformation...');

  try {
    const transformedData = transformCVFullContentToCVData(sampleApiResponse);

    console.log('✅ Transformation successful!');
    console.log('Transformed data:', {
      title: transformedData.Title,
      jobTitle: transformedData.JobDetail.JobTitle,
      contactEmail: transformedData.Contacts.Email,
      summary: transformedData.Summary,
      skillsCount: transformedData.Skills.length,
      experiencesCount: transformedData.Experiences.length,
      projectsCount: transformedData.Projects.length,
      certificationsCount: transformedData.Certifications.length,
      educationsCount: transformedData.Educations.length,
    });

    return transformedData;
  } catch (error) {
    console.error('❌ Transformation failed:', error);
    throw error;
  }
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).testCVTransformation = testDataTransformation;
}
