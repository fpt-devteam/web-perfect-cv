import type { AuthenResponse, LoginRequest } from "@/modules/auth/types/auth.type";
import type { CV } from "@/modules/cv/types/cv.types";
import type { User } from "@/shared/types/base.type";
import { ROLE } from "@/shared/types/base.enum";

const cvs: CV[] = [
  {
    cvId: "101",
    userId: "1",
    title: "Admin CV",
    createdAt: "2023-01-01T12:00:00Z"
  },
  {
    cvId: "102",
    userId: "2",
    title: "User CV",
    createdAt: "2022-06-01T12:00:00Z"
  },
  {
    cvId: "103",
    userId: "3",
    title: "Guest CV",
    createdAt: "2023-06-01T12:00:00Z"
  }
]

const users: User[] = [
  {
    id: "1",
    email: "philong@example.com",
    passwordHash: "hashedpassword123",
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-03-01T12:00:00Z",
    deletedAt: null,
    status: "Active",
    role: ROLE.USER,
    name: "Phi Long",
    avatarUrl: 'https://github.com/shadcn.png',
  },
  {
    id: "2",
    email: "user@example.com",
    passwordHash: "hashedpassword456",
    createdAt: "2022-06-01T12:00:00Z",
    updatedAt: null,
    deletedAt: "2023-01-01T12:00:00Z",
    status: "Inactive",
    role: ROLE.USER,
    name: "User",
    avatarUrl: "https://example.com/user.jpg",
  },
  {
    id: "3",
    email: "guest@example.com",
    passwordHash: "hashedpassword789",
    createdAt: "2023-06-01T12:00:00Z",
    updatedAt: null,
    deletedAt: null,
    status: "Undefined",
    role: ROLE.USER,
    name: "Undefined User",
    avatarUrl: "https://example.com/undefined.jpg",
  }
];

export const mockLoginApiCall = (
  loginReq: LoginRequest
): Promise<{ data: AuthenResponse }> => {

  return new Promise((resolve) => {
    setTimeout(() => {
      let res: AuthenResponse = {
        status: "fail",
        message: "Invalid login email",
        data: null
      };

      for (const user of users) {
        if (user.email === loginReq.username) {
          res = {
            status: "success",
            message: "Login successful",
            data: {
              accessToken: "access-token-xyz",
              expiresIn: 3600
            }
          };
          break;
        }
      }

      console.log(res);
      resolve({ data: res });
    }, 1000);
  });
};

export const mockCvApiCall = (id: string): Promise<{ data: CV[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(id);
      resolve({ data: cvs });
      // const cv = cvs.find((cv) => cv.cvId === id);
      // if (cv) {
      // } else {
      //   reject(new Error("CV not found"));
      // }
    }, 1000);
  });
};

export const mockCvByIdApiCall = (id: string): Promise<{ data: CV }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cv = cvs.find((cv) => cv.cvId === id);
      if (cv) {
        resolve({ data: cv });
      } else {
        reject(new Error("CV not found"));
      }
    }, 1000);
  });
};

export const mockGetMeApiCall = (): Promise<{ data: User }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: users[0] });
    }, 1000);
  });
};
