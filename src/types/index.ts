export type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type LessonType = 'video' | 'text' | 'pdf' | 'resource' | 'live_class' | 'quiz';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';
export type SubmissionStatus = 'submitted' | 'reviewed' | 'approved' | 'revision_requested';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type QuestionType = 'multiple_choice' | 'true_false' | 'multiple_answer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  category_id: string | null;
  category?: Category;
  instructor_id: string | null;
  instructor?: Profile;
  status: CourseStatus;
  price: number | null;
  currency: string;
  duration_text: string | null;
  difficulty_level: DifficultyLevel | null;
  mode: string;
  learning_objectives: string[] | null;
  requirements: string[] | null;
  target_audience: string | null;
  is_featured: boolean;
  total_lessons: number;
  total_duration_minutes: number;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  modules?: Module[];
  enrolment_count?: number;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  description: string | null;
  type: LessonType;
  content: string | null;
  video_cf_uid: string | null;
  video_duration_seconds: number | null;
  is_preview: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  resources?: LessonResource[];
  progress?: LessonProgress;
}

export interface LessonResource {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  file_size_bytes: number | null;
  is_downloadable: boolean;
  sort_order: number;
  created_at: string;
}

export interface Enrolment {
  id: string;
  student_id: string;
  course_id: string;
  payment_id: string | null;
  enrolled_at: string;
  expires_at: string | null;
  is_active: boolean;
  enrolled_by: string | null;
  notes: string | null;
  course?: Course;
  student?: Profile;
  payment?: Payment;
}

export interface Payment {
  id: string;
  student_id: string;
  course_id: string;
  payment_reference: string;
  paystack_transaction_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, unknown> | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
  student?: Profile;
}

export interface LessonProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at: string | null;
  watch_duration_seconds: number;
  last_position_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface CourseCompletion {
  id: string;
  student_id: string;
  course_id: string;
  completed_at: string;
  score: number | null;
}

export interface Assessment {
  id: string;
  lesson_id: string | null;
  course_id: string;
  title: string;
  description: string | null;
  pass_mark: number;
  time_limit_minutes: number | null;
  max_attempts: number | null;
  show_answers_after_submit: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  questions?: Question[];
  course?: Course;
}

export interface Question {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: QuestionType;
  explanation: string | null;
  marks: number;
  sort_order: number;
  created_at: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  student_id: string;
  score: number | null;
  passed: boolean | null;
  started_at: string;
  submitted_at: string | null;
  time_taken_seconds: number | null;
  assessment?: Assessment;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_ids: string[];
  is_correct: boolean | null;
  marks_awarded: number;
}

export interface Assignment {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  deadline: string | null;
  max_marks: number | null;
  allowed_file_types: string[] | null;
  max_file_size_mb: number;
  is_published: boolean;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string | null;
  notes: string | null;
  status: SubmissionStatus;
  marks_awarded: number | null;
  feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface Announcement {
  id: string;
  author_id: string;
  title: string;
  body: string;
  course_id: string | null;
  is_global: boolean;
  published_at: string | null;
  created_at: string;
  author?: Profile;
  course?: Course;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PlatformSettings {
  id: number;
  certificates_enabled: boolean;
  quizzes_enabled: boolean;
  assignments_enabled: boolean;
  discussions_enabled: boolean;
  live_classes_enabled: boolean;
  reviews_enabled: boolean;
  ratings_enabled: boolean;
  coupons_enabled: boolean;
  prerequisites_enabled: boolean;
  drip_content_enabled: boolean;
  announcements_enabled: boolean;
  instructor_accounts_enabled: boolean;
  maintenance_mode: boolean;
  academy_name: string;
  academy_description: string | null;
  support_email: string | null;
  support_phone: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface Certificate {
  id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
  is_valid: boolean;
  metadata: Record<string, unknown> | null;
  student?: Profile;
  course?: Course;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: Profile;
}

export interface VideoAccessLog {
  id: string;
  student_id: string;
  lesson_id: string;
  token_issued_at: string;
  token_expires_at: string | null;
  ip_address: string | null;
}
