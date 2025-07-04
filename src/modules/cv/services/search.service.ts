import type {
  EmploymentTypeListResponse,
  JobTitleListResponse,
  OrganizationListResponse,
} from '../types/cv.types';

const JOB_TITLE_LIST_RESPONSE: JobTitleListResponse = {
  total: 30,
  items: [
    { id: '0643ed8d-728d-4acf-95ad-15ddfd7d31e6', name: 'Cybersecurity Analyst' },
    { id: '3f9a882d-36d4-4902-9697-1798c071df13', name: 'Security Engineer' },
    { id: 'a186a7e7-3bc4-4909-8eb7-1becbdc8a5d0', name: 'Data Scientist' },
    { id: 'b381508a-47c3-4eca-8c37-21eee0522c8a', name: 'Mobile Developer' },
    { id: '9ec646fb-f340-4674-a8af-22539f9ed719', name: 'IT Support Specialist' },
    { id: '1a11181c-0ce8-43e5-b4ca-25227f3ae033', name: 'Machine Learning Engineer' },
    { id: 'afe7ae4f-19ae-4392-bfab-28d9a927741c', name: 'Frontend Developer' },
    { id: '7e472c78-0f8f-4cd6-af61-2b4a925cd73e', name: 'Backend Developer' },
    { id: '372a73d4-5173-423d-b251-2d727778c79c', name: 'Graphic Designer' },
    { id: '7f67c876-0326-448b-9d8d-47cd92ff5c2e', name: 'Scrum Master' },
    { id: '3ac87e39-4f67-461e-883d-496c4a4732f7', name: 'Network Engineer' },
    { id: '7d752290-21c1-46f3-a32d-4f4aa7adbdea', name: 'Project Manager' },
    { id: '93b06bd9-f383-42e3-ba0c-53d0d816b1c9', name: 'Technical Writer' },
    { id: 'e69e0e3c-1cd7-4da4-9cea-56b8de0c67ff', name: 'DevOps Engineer' },
    { id: '8bfc0a57-0d52-4aec-a817-5c594b3ae4e6', name: 'Blockchain Developer' },
    { id: '0410a36a-c018-417d-a367-63c937f7d7b5', name: 'Game Developer' },
    { id: '283f96b6-1418-4cf8-9550-769806f19c25', name: 'Solution Architect' },
    { id: '1371b067-74dc-4de4-8b28-831504504743', name: 'Fullstack Developer' },
    { id: '4f0e5305-86f8-46ba-b2dd-8d0f3f2b4be0', name: 'Software Engineer' },
    { id: '7130741b-d8c3-4e54-82a2-a9502f9fd085', name: 'Quality Assurance Engineer' },
    { id: 'ac2b61b0-1dc8-467f-80d9-af4362424b57', name: 'Cloud Engineer' },
    { id: 'fc84e31a-eb73-41f8-ab95-c14568aa8256', name: 'Site Reliability Engineer' },
    { id: '33f3c160-ed55-407f-96c7-c830ec4dcfdc', name: 'Business Analyst' },
    { id: '249a2221-90dd-404f-ab59-d7e702cd267a', name: 'Database Administrator' },
    { id: '4f0993e8-4e28-40b4-a125-d826f62628f5', name: 'AI Engineer' },
    { id: '69ff7355-93de-417c-bbd0-de24a69f8727', name: 'System Administrator' },
    { id: '4cb002e2-3308-4add-a590-e683ddd35aa8', name: 'Embedded Systems Engineer' },
    { id: '575a9557-2b75-4273-bf71-f6509cb5326a', name: 'Technical Lead' },
    { id: '9cb6e02e-308b-4cbc-af51-f6aa271264f4', name: 'UX Designer' },
    { id: 'd5d5b564-a861-4988-9f78-f890088183b7', name: 'Product Manager' },
  ],
};

const MOCK_ORGANIZATION_LIST: OrganizationListResponse = {
  total: 50,
  items: [
    { id: 'a7e34541-35bd-454a-a220-0055f321403e', name: 'Đại học RMIT Việt Nam' },
    { id: '9cff6df3-9dfe-4109-b33a-00cb95fe1375', name: 'Đại học Nha Trang' },
    { id: 'b2b3fbdc-8b89-4c43-a5f0-0143053c5acb', name: 'Đại học CNTT&TT Thái Nguyên' },
    { id: '0f686c1e-8cba-41f7-b44d-01ab1de8c052', name: 'Đại học Hàng hải Việt Nam' },
    { id: '3550f033-9177-433a-a98d-02011a4e4d38', name: 'Activision Blizzard' },
    { id: '34049acf-3a74-4e4d-be3e-0220a3309755', name: 'Appota AI' },
    {
      id: 'b9aa0ae9-6cce-4aab-b351-0257b8102fe8',
      name: 'Hiệp hội các Trường Đại học, Cao đẳng Việt Nam',
    },
    { id: 'a120570d-979c-4ae8-b091-0298b38de10f', name: 'Đại học Huế' },
    { id: '208a2894-b9b5-4a28-91a5-02c5f40d4043', name: 'Đại học Đà Lạt' },
    { id: 'e5b7590a-9799-4feb-9090-033c89ce255c', name: 'THPT Chuyên Lam Sơn (Thanh Hóa)' },
    { id: '1a79a386-ecf6-4f89-b625-0392dcb29e54', name: 'Bitbucket' },
    { id: 'b9521aa6-2d0e-4a81-bdba-03a7aaea9e35', name: 'Đại học CNTT&TT Việt – Hàn (VKU)' },
    { id: '3224c216-9eb9-4559-91ee-05be34ccf843', name: 'THPT Chuyên Phan Ngọc Hiển (Cà Mau)' },
    { id: '664b4b16-9d7d-4084-935a-05e4bccd3a53', name: 'Hội Thư viện Việt Nam' },
    { id: '3172be2e-aad3-4188-b021-0650bf4a1c77', name: 'Emobi Games' },
    { id: 'b21021ff-42b1-49da-ba25-072deffd472b', name: 'TikiNGON' },
    { id: '45cc8f1c-bb9e-4b4b-8e01-077bdea2c7e1', name: 'OpenBank' },
    { id: '54e215a9-7122-4e8a-b232-0869a32315c6', name: 'Uber' },
    { id: '4f33110c-fd0c-4e36-8bac-08870a0db4a0', name: 'THPT Chuyên Bạc Liêu' },
    { id: '21d6235a-dac6-4d2d-8477-088771caa992', name: 'SHB' },
  ],
};

const MOCK_EMPLOYMENT_TYPES: EmploymentTypeListResponse = {
  total: 8,
  items: [
    { id: '6e81996a-f9e6-45a7-a55d-190982795894', name: 'Full-time' },
    { id: '8b677902-f267-4bdd-bb60-5afb3a4fc794', name: 'Freelance' },
    { id: 'b7c17331-b3f4-4a51-8abe-669ca9d4ae88', name: 'Self-employed' },
    { id: 'd08d8ed7-4a66-4c08-a4b2-71ede68863fb', name: 'Internship' },
    { id: '827b11b3-7728-4ad5-af09-b8937d86c99b', name: 'Contract' },
    { id: '22afee52-a7a5-481f-a12b-b99fd0a30365', name: 'Seasonal' },
    { id: 'ef4bc3de-eb8a-467e-bc55-dc02fef8f3ad', name: 'Apprenticeship' },
    { id: '222993ba-0717-42ff-b85c-fcf5bb37bfd0', name: 'Part-time' },
  ],
};

export const searchOrganizations = async (query: string) => {
  // const { data } = await authClient<OrganizationListResponse>({
  //   method: 'GET',
  //   url: GET_ORGANIZATION_ENDPOINT(),
  //   params: { query },
  // });

  const data = MOCK_ORGANIZATION_LIST.items
    .filter(company => company.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  return data;
};

export const searchJobTitles = async (query: string) => {
  // const { data } = await authClient<JobTitleListResponse>({
  //   method: 'GET',
  //   url: GET_JOB_TITLES_ENDPOINT(),
  //   params: { query },
  // });

  const data = JOB_TITLE_LIST_RESPONSE.items
    .filter(title => title.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  return data;
};

export const getEmploymentTypes = async () => {
  // const { data } = await authClient<EmploymentTypeListResponse>({
  //   method: 'GET',
  //   url: GET_EMPLOYMENT_TYPE_ENDPOINT(),
  // });

  return MOCK_EMPLOYMENT_TYPES;
};
