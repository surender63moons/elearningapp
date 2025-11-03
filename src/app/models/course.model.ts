export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: {
    id: number;
    name: string;
    email: string;
  };
  price: number;
  category: string;
  thumbnailUrl: string;
  rating: number;
  totalStudents: number;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  moduleOrder: number;
  contents: CourseContent[];
}

export interface CourseContent {
  id: number;
  title: string;
  contentType: 'VIDEO' | 'PDF' | 'QUIZ' | 'VIDEO_URL';
  contentUrl: string;
  duration: number;
  fileSize: number;
  contentOrder: number;
  isCompleted?: boolean;
  progress?: number;
}
