// import type { CV } from '@/modules/cv/types/cv.types';

// const cvs: CV[] = [
//   {
//     cvId: '101',
//     userId: '1',
//     title: 'BE_Intern_Resume',
//     createdAt: '2023-01-01T12:00:00Z',
//     url: '/cvPdf/BE_Intern_Resume.pdf',
//   },
//   {
//     cvId: '102',
//     userId: '2',
//     title: 'FE_Intern_Resume',
//     createdAt: '2022-06-01T12:00:00Z',
//     url: '/cvPdf/FE_Intern_Resume.pdf',
//   },
//   {
//     cvId: '103',
//     userId: '3',
//     title: 'SE_Fresher_Resume',
//     createdAt: '2023-06-01T12:00:00Z',
//     url: '/cvPdf/SE_Fresher_Resume.pdf',
//   },
//   {
//     cvId: '104',
//     userId: '3',
//     title: 'SE_Intern_CPP_Resume',
//     createdAt: '2023-01-01T12:00:00Z',
//     url: '/cvPdf/SE_Intern_CPP_Resume.pdf',
//   },
//   {
//     cvId: '105',
//     userId: '3',
//     title: 'SE_Intern_WorldQuant_Resume',
//     createdAt: '2022-06-01T12:00:00Z',
//     url: '/cvPdf/SE_Intern_WorldQuant_Resume.pdf',
//   },
// ];

// const users: User[] = [
//   {
//     id: '1',
//     email: 'philongBE@example.com',
//     passwordHash: 'hashedpassword123',
//     createdAt: '2023-01-01T12:00:00Z',
//     updatedAt: '2023-03-01T12:00:00Z',
//     deletedAt: null,
//     status: 'Active',
//     role: ROLE.USER,
//     name: 'Phi Long',
//     avatarUrl: 'https://github.com/shadcn.png',
//   },
//   {
//     id: '2',
//     email: 'philongFE@example.com',
//     passwordHash: 'hashedpassword456',
//     createdAt: '2022-06-01T12:00:00Z',
//     updatedAt: null,
//     deletedAt: '2023-01-01T12:00:00Z',
//     status: 'Active',
//     role: ROLE.USER,
//     name: 'Phi Long FE',
//     avatarUrl: 'https://example.com/user.jpg',
//   },
//   {
//     id: '3',
//     email: 'philongSE@example.com',
//     passwordHash: 'hashedpassword789',
//     createdAt: '2023-06-01T12:00:00Z',
//     updatedAt: null,
//     deletedAt: null,
//     status: 'Active',
//     role: ROLE.USER,
//     name: 'Phi Long SE',
//     avatarUrl: 'https://example.com/undefined.jpg',
//   },
// ];

// export const mockLoginApiCall = (loginReq: LoginRequest): Promise<{ data: AuthenResponse }> => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       let res: AuthenResponse = {
//         status: 'fail',
//         message: 'Invalid login email',
//         data: null,
//       };

//       for (const user of users) {
//         if (user.email === loginReq.username) {
//           res = {
//             status: 'success',
//             message: 'Login successful',
//             data: {
//               accessToken: 'access-token-' + user.email,
//               expiresIn: 3600,
//             },
//           };
//           break;
//         }
//       }

//       resolve({ data: res });
//     }, 1000);
//   });
// };

// export const mockCvApiCall = (id: string): Promise<{ data: CV[] }> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const cvList: CV[] = [];
//       for (const cv of cvs) {
//         if (cv.userId === id) {
//           cvList.push(cv);
//         }
//       }
//       if (cvList.length > 0) {
//         resolve({ data: cvList });
//       } else {
//         reject(new Error('CV not found'));
//       }
//     }, 1000);
//   });
// };

// export const mockCvByIdApiCall = (id: string): Promise<{ data: CV }> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const cv = cvs.find(cv => cv.cvId === id);
//       if (cv) {
//         resolve({ data: cv });
//       } else {
//         reject(new Error('CV not found'));
//       }
//     }, 1000);
//   });
// };

// export const mockGetMeApiCall = (): Promise<{ data: User | null }> => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const accessToken = authService.getData()?.accessToken;

//       for (const user of users) {
//         if ('access-token-' + user.email === accessToken) {
//           resolve({ data: user });
//           break;
//         }
//       }

//       resolve({ data: null });
//     }, 1000);
//   });
// };
