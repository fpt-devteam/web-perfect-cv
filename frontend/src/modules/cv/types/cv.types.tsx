type CvRequest = {
  cvId: string
  userId: string
}

type CvResponse = {
  status: string,
  message: string,
  data: CV
}

type CV = {
  userId: string,
  cvId: string;
  title: string;
  createdAt: string;
}

export type { CvRequest, CvResponse, CV }