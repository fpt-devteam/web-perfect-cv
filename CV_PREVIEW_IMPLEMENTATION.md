# CV Preview Implementation

## Tổng quan
Đã implement thành công tính năng preview CV với API integration. Khi user click vào "Finish & Preview", hệ thống sẽ:

1. Gọi API `/api/cvs/{cvId}/full-content` để lấy dữ liệu CV
2. Transform dữ liệu API response thành format phù hợp với components
3. Hiển thị CV trong HTML preview và cho phép download PDF

## Các thay đổi đã thực hiện

### 1. Types & Interfaces
- **File**: `src/modules/cv/types/cv.types.ts`
- **Thêm**: `CVFullContentResponse` interface để match với API response

### 2. API Endpoint
- **File**: `src/modules/cv/constants/cv-endpoint.constant.ts`
- **Thêm**: `GET_CV_FULL_CONTENT_ENDPOINT` constant

### 3. Service Layer
- **File**: `src/modules/cv/services/cv.services.ts`
- **Thêm**: `getCVFullContent` function để gọi API

### 4. Data Hook
- **File**: `src/modules/cv/hooks/useCVData.ts`
- **Cập nhật**: Sử dụng real API thay vì mock data

### 5. Data Transformer
- **File**: `src/modules/cv/utils/cv-data-transformer.ts`
- **Mới**: Transform API response thành CVData format

### 6. UI Components
- **File**: `src/modules/cv/components/CVHTMLPreview.tsx`
  - Cải thiện Technical Skills section với layout đẹp hơn
  - Sửa lỗi hiển thị chữ "O" trong education
  - Xử lý null/empty values tốt hơn

- **File**: `src/modules/cv/components/HarvardCVDocument.tsx`
  - Thêm support cho tiếng Việt với Google Fonts
  - Cải thiện Skills section trong PDF
  - Sửa lỗi education dates

## Cách test

### 1. Chạy ứng dụng
```bash
npm run dev
```

### 2. Navigate đến CV preview
- Đăng nhập vào hệ thống
- Tạo hoặc chọn một CV
- Click vào "FINISH UP & PREVIEW" trong navigation

### 3. Kiểm tra Console
Mở Developer Tools (F12) và xem Console để thấy:
- `🔍 API Response`: Dữ liệu thô từ API
- `🔄 Transformed Data`: Dữ liệu đã được transform

### 4. Test các tính năng
- **HTML Preview**: Xem CV trong HTML format
- **PDF Download**: Click nút download để tải PDF
- **Vietnamese Support**: Kiểm tra hiển thị tiếng Việt trong PDF

## Cấu trúc dữ liệu

### API Response Format
```typescript
interface CVFullContentResponse {
  id: string;
  userId: string;
  title: string;
  jobDetail: { jobTitle: string; companyName: string; description: string; };
  contact: { /* contact info */ };
  summary: { context: string | null; };
  skills: Array<{ category: string; description: string; }>;
  educations: Array<{ /* education info */ }>;
  experiences: Array<{ /* experience info */ }>;
  projects: Array<{ /* project info */ }>;
  certifications: Array<{ /* certification info */ }>;
}
```

### Transformed Data Format
```typescript
interface CVData {
  CVId: string;
  Title: string;
  JobDetail: { JobTitle: string; CompanyName: string; Description: string; };
  Contacts: { /* contact info */ };
  Summary: string | null;
  Skills: Array<{ Name: string; Level: number; }>;
  Educations: Array<{ /* education info */ }>;
  Experiences: Array<{ /* experience info */ }>;
  Projects: Array<{ /* project info */ }>;
  Certifications: Array<{ /* certification info */ }>;
}
```

## Troubleshooting

### 1. API không trả về dữ liệu
- Kiểm tra network tab trong Developer Tools
- Đảm bảo authentication token hợp lệ
- Kiểm tra API endpoint có đúng không

### 2. PDF không hiển thị tiếng Việt
- Đảm bảo internet connection để load Google Fonts
- Kiểm tra font registration trong HarvardCVDocument.tsx

### 3. Skills section không đẹp
- Kiểm tra CSS classes trong CVHTMLPreview.tsx
- Đảm bảo Tailwind CSS được load đúng

### 4. Education hiển thị chữ "O"
- Đã fix trong code, kiểm tra data transformer
- Đảm bảo API trả về dates đúng format

## Performance Notes

- **Caching**: Data được cache trong 5 phút với React Query
- **Font Loading**: Google Fonts được load async cho PDF
- **Error Handling**: Fallback về mock data nếu API fail
- **Loading States**: Hiển thị loading spinner khi đang fetch data

## Future Improvements

1. **Skills Level**: API chưa cung cấp skill level, có thể cần backend update
2. **Font Optimization**: Có thể bundle fonts locally thay vì load từ Google
3. **PDF Templates**: Thêm nhiều template PDF khác nhau
4. **Real-time Updates**: Auto-refresh khi data thay đổi 