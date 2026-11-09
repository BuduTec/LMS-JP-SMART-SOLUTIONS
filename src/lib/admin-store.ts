import {
  Course,
  Category,
  Profile,
  Enrolment,
  Payment,
  Assessment,
  PlatformSettings,
  AuditLog,
  UserRole,
} from '@/types';
import { SEEDED_COURSES, COURSE_CATEGORIES } from './constants';
import { generateSlug } from './utils';

export interface AdminStudentRecord extends Profile {
  enrolment_count: number;
}

interface AdminStoreState {
  courses: Course[];
  categories: Category[];
  students: AdminStudentRecord[];
  enrolments: Enrolment[];
  payments: Payment[];
  assessments: Assessment[];
  platformSettings: PlatformSettings;
  auditLogs: AuditLog[];
}

const INITIAL_CATEGORIES: Category[] = COURSE_CATEGORIES.map((cat, idx) => ({
  id: `cat-${idx + 1}`,
  name: cat.name,
  slug: cat.slug,
  description: `Specialized engineering training modules in ${cat.name}.`,
  sort_order: idx + 1,
  created_at: '2026-10-01T08:00:00Z',
}));

const INITIAL_STUDENTS: AdminStudentRecord[] = [
  {
    id: 'stu-1',
    email: 'chukwuemeka.okafor@nnpc-eng.ng',
    full_name: 'Engr. Chukwuemeka Okafor',
    avatar_url: null,
    role: 'student',
    bio: 'Senior Substation & Protection Engineer in Port Harcourt',
    phone: '+234 803 451 9920',
    is_active: true,
    email_verified: true,
    created_at: '2026-10-12T09:15:00Z',
    updated_at: '2026-10-12T09:15:00Z',
    enrolment_count: 2,
  },
  {
    id: 'stu-2',
    email: 'amina.bello@gridworks.com.ng',
    full_name: 'Engr. Amina Bello',
    avatar_url: null,
    role: 'student',
    bio: 'Power Systems Planning Analyst',
    phone: '+234 809 214 6601',
    is_active: true,
    email_verified: true,
    created_at: '2026-10-15T14:30:00Z',
    updated_at: '2026-10-15T14:30:00Z',
    enrolment_count: 2,
  },
  {
    id: 'stu-3',
    email: 'tunde.adeyemi@solarepc.ng',
    full_name: 'Engr. Babatunde Adeyemi',
    avatar_url: null,
    role: 'student',
    bio: 'Lead C&I Solar PV System Designer',
    phone: '+234 706 882 3419',
    is_active: true,
    email_verified: true,
    created_at: '2026-10-20T11:00:00Z',
    updated_at: '2026-10-20T11:00:00Z',
    enrolment_count: 1,
  },
  {
    id: 'stu-4',
    email: 'ibiso.tamuno@ph-energy.com',
    full_name: 'Engr. Ibiso Tamuno',
    avatar_url: null,
    role: 'student',
    bio: 'Electrical Commissioning & Relay Testing Engineer',
    phone: '+234 812 553 7784',
    is_active: true,
    email_verified: true,
    created_at: '2026-10-25T16:45:00Z',
    updated_at: '2026-10-25T16:45:00Z',
    enrolment_count: 1,
  },
  {
    id: 'stu-5',
    email: 'osaze.igbinovia@epc-nigeria.com',
    full_name: 'Engr. Osaze Igbinovia',
    avatar_url: null,
    role: 'student',
    bio: 'Industrial Electrical Maintenance Lead',
    phone: '+234 902 118 4092',
    is_active: false,
    email_verified: true,
    created_at: '2026-10-28T10:10:00Z',
    updated_at: '2026-10-28T10:10:00Z',
    enrolment_count: 0,
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    student_id: 'stu-1',
    course_id: 'seed-course-1',
    payment_reference: 'JP_1730112001_ETAP01',
    paystack_transaction_id: '409182731',
    amount: 85000,
    currency: 'NGN',
    status: 'successful',
    metadata: null,
    verified_at: '2026-10-12T09:20:00Z',
    created_at: '2026-10-12T09:18:00Z',
    updated_at: '2026-10-12T09:20:00Z',
    student: INITIAL_STUDENTS[0],
    course: SEEDED_COURSES[0],
  },
  {
    id: 'pay-2',
    student_id: 'stu-1',
    course_id: 'seed-course-6',
    payment_reference: 'JP_1730198402_PROT06',
    paystack_transaction_id: '409188912',
    amount: 90000,
    currency: 'NGN',
    status: 'successful',
    metadata: null,
    verified_at: '2026-10-14T11:05:00Z',
    created_at: '2026-10-14T11:02:00Z',
    updated_at: '2026-10-14T11:05:00Z',
    student: INITIAL_STUDENTS[0],
    course: SEEDED_COURSES[5],
  },
  {
    id: 'pay-3',
    student_id: 'stu-2',
    course_id: 'seed-course-2',
    payment_reference: 'JP_1730284803_ETAP02',
    paystack_transaction_id: '409195400',
    amount: 75000,
    currency: 'NGN',
    status: 'successful',
    metadata: null,
    verified_at: '2026-10-16T15:12:00Z',
    created_at: '2026-10-16T15:10:00Z',
    updated_at: '2026-10-16T15:12:00Z',
    student: INITIAL_STUDENTS[1],
    course: SEEDED_COURSES[1],
  },
  {
    id: 'pay-4',
    student_id: 'stu-3',
    course_id: 'seed-course-8',
    payment_reference: 'JP_1730371204_SOLAR8',
    paystack_transaction_id: '409204118',
    amount: 95000,
    currency: 'NGN',
    status: 'successful',
    metadata: null,
    verified_at: '2026-10-21T10:30:00Z',
    created_at: '2026-10-21T10:28:00Z',
    updated_at: '2026-10-21T10:30:00Z',
    student: INITIAL_STUDENTS[2],
    course: SEEDED_COURSES[7],
  },
  {
    id: 'pay-5',
    student_id: 'stu-4',
    course_id: 'seed-course-3',
    payment_reference: 'JP_1730457605_PSA003',
    paystack_transaction_id: '409219884',
    amount: 80000,
    currency: 'NGN',
    status: 'successful',
    metadata: null,
    verified_at: '2026-10-26T13:45:00Z',
    created_at: '2026-10-26T13:42:00Z',
    updated_at: '2026-10-26T13:45:00Z',
    student: INITIAL_STUDENTS[3],
    course: SEEDED_COURSES[2],
  },
];

const INITIAL_ENROLMENTS: Enrolment[] = [
  {
    id: 'enr-1',
    student_id: 'stu-1',
    course_id: 'seed-course-1',
    payment_id: 'pay-1',
    enrolled_at: '2026-10-12T09:20:00Z',
    expires_at: null,
    is_active: true,
    enrolled_by: null,
    notes: 'Paystack verified checkout',
    student: INITIAL_STUDENTS[0],
    course: SEEDED_COURSES[0],
  },
  {
    id: 'enr-2',
    student_id: 'stu-1',
    course_id: 'seed-course-6',
    payment_id: 'pay-2',
    enrolled_at: '2026-10-14T11:05:00Z',
    expires_at: null,
    is_active: true,
    enrolled_by: null,
    notes: 'Paystack verified checkout',
    student: INITIAL_STUDENTS[0],
    course: SEEDED_COURSES[5],
  },
  {
    id: 'enr-3',
    student_id: 'stu-2',
    course_id: 'seed-course-2',
    payment_id: 'pay-3',
    enrolled_at: '2026-10-16T15:12:00Z',
    expires_at: null,
    is_active: true,
    enrolled_by: null,
    notes: 'Paystack verified checkout',
    student: INITIAL_STUDENTS[1],
    course: SEEDED_COURSES[1],
  },
  {
    id: 'enr-4',
    student_id: 'stu-2',
    course_id: 'seed-course-4',
    payment_id: null,
    enrolled_at: '2026-10-18T09:00:00Z',
    expires_at: null,
    is_active: true,
    enrolled_by: 'admin-1',
    notes: 'Corporate group sponsorship (GridWorks NG)',
    student: INITIAL_STUDENTS[1],
    course: SEEDED_COURSES[3],
  },
  {
    id: 'enr-5',
    student_id: 'stu-3',
    course_id: 'seed-course-8',
    payment_id: 'pay-4',
    enrolled_at: '2026-10-21T10:30:00Z',
    expires_at: null,
    is_active: true,
    enrolled_by: null,
    notes: 'Paystack verified checkout',
    student: INITIAL_STUDENTS[2],
    course: SEEDED_COURSES[7],
  },
  {
    id: 'enr-6',
    student_id: 'stu-4',
    course_id: 'seed-course-3',
    payment_id: 'pay-5',
    enrolled_at: '2026-10-26T13:45:00Z',
    expires_at: null,
    is_active: true,
    enrolled_by: null,
    notes: 'Paystack verified checkout',
    student: INITIAL_STUDENTS[3],
    course: SEEDED_COURSES[2],
  },
];

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-1',
    lesson_id: null,
    course_id: 'seed-course-1',
    title: 'ETAP Optimal Power Flow & Capacitor Placement Exam',
    description: 'Graded technical evaluation on Newton-Raphson load flow and reactive power compensation.',
    pass_mark: 70,
    time_limit_minutes: 45,
    max_attempts: 3,
    show_answers_after_submit: true,
    is_published: true,
    created_at: '2026-10-10T10:00:00Z',
    updated_at: '2026-10-10T10:00:00Z',
    course: SEEDED_COURSES[0],
  },
  {
    id: 'assess-2',
    lesson_id: null,
    course_id: 'seed-course-2',
    title: 'ETAP Single-Line Diagram & IEC 60909 Short-Circuit Quiz',
    description: 'Verification quiz covering SLD connectivity, bus fault levels, and equipment ratings.',
    pass_mark: 70,
    time_limit_minutes: 30,
    max_attempts: 3,
    show_answers_after_submit: true,
    is_published: true,
    created_at: '2026-10-12T10:00:00Z',
    updated_at: '2026-10-12T10:00:00Z',
    course: SEEDED_COURSES[1],
  },
  {
    id: 'assess-3',
    lesson_id: null,
    course_id: 'seed-course-6',
    title: 'IDMT Overcurrent & Earth Fault Relay Coordination Assessment',
    description: 'Practical relay grading, CT sizing, and Star TCC coordination exam.',
    pass_mark: 75,
    time_limit_minutes: 60,
    max_attempts: 2,
    show_answers_after_submit: true,
    is_published: true,
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
    course: SEEDED_COURSES[5],
  },
  {
    id: 'assess-4',
    lesson_id: null,
    course_id: 'seed-course-8',
    title: 'Utility & C&I Solar PV String Sizing and Hybrid BESS Certification Test',
    description: 'Final certification exam on MPPT voltage windows, inverter sizing, and grid integration.',
    pass_mark: 70,
    time_limit_minutes: 45,
    max_attempts: 3,
    show_answers_after_submit: true,
    is_published: true,
    created_at: '2026-10-22T10:00:00Z',
    updated_at: '2026-10-22T10:00:00Z',
    course: SEEDED_COURSES[7],
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  id: 1,
  certificates_enabled: true,
  quizzes_enabled: true,
  assignments_enabled: true,
  discussions_enabled: false,
  live_classes_enabled: false,
  reviews_enabled: true,
  ratings_enabled: true,
  coupons_enabled: false,
  prerequisites_enabled: false,
  drip_content_enabled: false,
  announcements_enabled: true,
  instructor_accounts_enabled: true,
  maintenance_mode: false,
  academy_name: 'JP Smart Solutions Academy',
  academy_description:
    'Premier engineering and technical training academy specializing in ETAP, Power System Analysis & Protection, and Solar PV Systems.',
  support_email: 'support@jpsmartsolutions.com',
  support_phone: '+234 906 737 4854',
  updated_at: '2026-11-01T12:00:00Z',
  updated_by: 'admin-1',
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user_id: 'admin-1',
    action: 'publish_course',
    resource_type: 'course',
    resource_id: 'seed-course-1',
    details: { title: 'Power System Optimization Using ETAP Software', status: 'published' },
    ip_address: '102.89.42.18',
    created_at: '2026-10-28T09:15:00Z',
    user: {
      id: 'admin-1',
      email: 'admin@jpsmartsolutions.com',
      full_name: 'Engr. Emmanuel Elubuduka',
      avatar_url: null,
      role: 'super_admin',
      bio: null,
      phone: null,
      is_active: true,
      email_verified: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
  },
  {
    id: 'log-2',
    user_id: 'admin-1',
    action: 'manual_enrolment',
    resource_type: 'enrolment',
    resource_id: 'enr-4',
    details: { studentId: 'stu-2', courseId: 'seed-course-4', notes: 'Corporate group sponsorship' },
    ip_address: '102.89.42.18',
    created_at: '2026-10-29T14:22:00Z',
    user: {
      id: 'admin-1',
      email: 'admin@jpsmartsolutions.com',
      full_name: 'Engr. Emmanuel Elubuduka',
      avatar_url: null,
      role: 'super_admin',
      bio: null,
      phone: null,
      is_active: true,
      email_verified: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
  },
  {
    id: 'log-3',
    user_id: 'admin-1',
    action: 'update_platform_settings',
    resource_type: 'platform_settings',
    resource_id: '1',
    details: { certificates_enabled: true, quizzes_enabled: true },
    ip_address: '102.89.42.18',
    created_at: '2026-11-01T12:00:00Z',
    user: {
      id: 'admin-1',
      email: 'admin@jpsmartsolutions.com',
      full_name: 'Engr. Emmanuel Elubuduka',
      avatar_url: null,
      role: 'super_admin',
      bio: null,
      phone: null,
      is_active: true,
      email_verified: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
  },
];

// Persist across Next.js route invocations in globalThis
const globalForAdminStore = globalThis as unknown as {
  __jpAdminStore?: AdminStoreState;
};

function getState(): AdminStoreState {
  if (!globalForAdminStore.__jpAdminStore) {
    globalForAdminStore.__jpAdminStore = {
      courses: SEEDED_COURSES.map((c) => ({ ...c })),
      categories: INITIAL_CATEGORIES.map((c) => ({ ...c })),
      students: INITIAL_STUDENTS.map((s) => ({ ...s })),
      enrolments: INITIAL_ENROLMENTS.map((e) => ({ ...e })),
      payments: INITIAL_PAYMENTS.map((p) => ({ ...p })),
      assessments: INITIAL_ASSESSMENTS.map((a) => ({ ...a })),
      platformSettings: { ...INITIAL_SETTINGS },
      auditLogs: INITIAL_AUDIT_LOGS.map((l) => ({ ...l })),
    };
  }
  return globalForAdminStore.__jpAdminStore;
}

export function resolveUserRole(email?: string | null): UserRole {
  if (!email) return 'super_admin';
  const normalized = email.trim().toLowerCase();
  if (
    normalized === 'elubudukaemmanuel@gmail.com' ||
    normalized === 'admin@jpsmartsolutions.com' ||
    normalized.includes('admin')
  ) {
    return 'super_admin';
  }
  if (normalized.includes('instructor') || normalized.includes('tutor')) {
    return 'instructor';
  }
  return 'student';
}

export function getStoreCourses(): Course[] {
  return getState().courses;
}

export function getStoreCourseById(idOrSlug: string): Course | undefined {
  return getState().courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export function getStoreCategories(): Category[] {
  return getState().categories;
}

export function getStoreStudents(): AdminStudentRecord[] {
  return getState().students;
}

export function getStoreEnrolments(): Enrolment[] {
  return getState().enrolments;
}

export function getStorePayments(): Payment[] {
  return getState().payments;
}

export function getStoreAssessments(): Assessment[] {
  return getState().assessments;
}

export function getStorePlatformSettings(): PlatformSettings {
  return getState().platformSettings;
}

export function getStoreAuditLogs(): AuditLog[] {
  return getState().auditLogs;
}

export function getAdminDashboardMetrics() {
  const state = getState();
  const totalStudents = state.students.length;
  const activeStudents = state.students.filter((s) => s.is_active).length;
  const totalCourses = state.courses.length;
  const publishedCourses = state.courses.filter((c) => c.status === 'published').length;
  const totalEnrolments = state.enrolments.filter((e) => e.is_active).length;
  const totalRevenue = state.payments
    .filter((p) => p.status === 'successful')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return {
    totalStudents,
    activeStudents,
    totalCourses,
    publishedCourses,
    totalEnrolments,
    totalRevenue,
    recentPayments: state.payments.slice(0, 5),
    recentStudents: state.students.slice(0, 5),
  };
}

export function appendStoreAuditLog(
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  const state = getState();
  const entry: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: 'admin-1',
    action,
    resource_type: resourceType ?? null,
    resource_id: resourceId ?? null,
    details: details ?? null,
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString(),
    user: {
      id: 'admin-1',
      email: 'admin@jpsmartsolutions.com',
      full_name: 'Engr. Emmanuel Elubuduka',
      avatar_url: null,
      role: 'super_admin',
      bio: null,
      phone: null,
      is_active: true,
      email_verified: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
  };
  state.auditLogs.unshift(entry);
  return entry;
}

export function addStoreCourse(input: {
  title: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  price?: number | null;
  mode?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
}): Course {
  const state = getState();
  const category =
    state.categories.find((c) => c.id === input.categoryId || c.slug === input.categoryId) ||
    state.categories[0];
  const id = `course-${Date.now()}`;
  const slug = `${generateSlug(input.title)}-${Math.random().toString(36).substring(2, 6)}`;
  const newCourse: Course = {
    id,
    title: input.title,
    slug,
    short_description: input.shortDescription || input.description || 'Practical engineering training course.',
    description: input.description || input.shortDescription || 'Practical engineering training course.',
    image_url:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    category_id: category.id,
    category,
    instructor_id: null,
    status: 'draft',
    price: input.price ?? 75000,
    currency: 'NGN',
    duration_text: '6 Weeks • Self-Paced',
    difficulty_level: input.difficultyLevel || 'intermediate',
    mode: input.mode || 'Online',
    learning_objectives: [
      'Apply industry-standard engineering calculations and simulations',
      'Produce verified study reports and single-line diagrams',
    ],
    requirements: ['Foundational electrical engineering knowledge'],
    target_audience: 'Practicing Engineers & Technical Graduates',
    is_featured: false,
    total_lessons: 12,
    total_duration_minutes: 480,
    sort_order: state.courses.length + 1,
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: SEEDED_COURSES[0].modules,
  };

  state.courses.unshift(newCourse);
  appendStoreAuditLog('create_course', 'course', newCourse.id, {
    title: newCourse.title,
    slug: newCourse.slug,
  });
  return newCourse;
}

export function updateStoreCourse(
  courseId: string,
  patch: {
    title?: string;
    shortDescription?: string;
    description?: string;
    categoryId?: string;
    price?: number | null;
    mode?: string;
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
    status?: 'draft' | 'published' | 'archived';
  }
): Course | null {
  const state = getState();
  const idx = state.courses.findIndex((c) => c.id === courseId);
  if (idx === -1) return null;

  const existing = state.courses[idx];
  const category = patch.categoryId
    ? state.categories.find((c) => c.id === patch.categoryId || c.slug === patch.categoryId) ||
      existing.category
    : existing.category;

  const updated: Course = {
    ...existing,
    title: patch.title ?? existing.title,
    short_description: patch.shortDescription ?? existing.short_description,
    description: patch.description ?? existing.description,
    category_id: category?.id ?? existing.category_id,
    category,
    price: patch.price !== undefined ? patch.price : existing.price,
    mode: patch.mode ?? existing.mode,
    difficulty_level: patch.difficultyLevel ?? existing.difficulty_level,
    status: patch.status ?? existing.status,
    updated_at: new Date().toISOString(),
  };

  state.courses[idx] = updated;
  appendStoreAuditLog('update_course', 'course', courseId, {
    title: updated.title,
    status: updated.status,
  });
  return updated;
}

export function toggleStoreCoursePublish(courseId: string, publish: boolean): Course | null {
  const state = getState();
  const idx = state.courses.findIndex((c) => c.id === courseId);
  if (idx === -1) return null;

  state.courses[idx] = {
    ...state.courses[idx],
    status: publish ? 'published' : 'draft',
    updated_at: new Date().toISOString(),
  };
  appendStoreAuditLog(publish ? 'publish_course' : 'unpublish_course', 'course', courseId, {
    status: state.courses[idx].status,
  });
  return state.courses[idx];
}

export function deleteStoreCourse(courseId: string): boolean {
  const state = getState();
  const before = state.courses.length;
  state.courses = state.courses.filter((c) => c.id !== courseId);
  if (state.courses.length < before) {
    appendStoreAuditLog('delete_course', 'course', courseId);
    return true;
  }
  return false;
}

export function addStoreCategory(input: { name: string; description?: string }): Category {
  const state = getState();
  const slug = generateSlug(input.name);
  const existing = state.categories.find((c) => c.slug === slug);
  if (existing) return existing;

  const created: Category = {
    id: `cat-${Date.now()}`,
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || `Engineering courses in ${input.name.trim()}.`,
    sort_order: state.categories.length + 1,
    created_at: new Date().toISOString(),
  };
  state.categories.push(created);
  appendStoreAuditLog('create_category', 'category', created.id, { name: created.name, slug });
  return created;
}

export function toggleStoreStudentActive(studentId: string, isActive: boolean): AdminStudentRecord | null {
  const state = getState();
  const idx = state.students.findIndex((s) => s.id === studentId);
  if (idx === -1) return null;

  state.students[idx] = {
    ...state.students[idx],
    is_active: isActive,
    updated_at: new Date().toISOString(),
  };
  appendStoreAuditLog(
    isActive ? 'activate_student' : 'deactivate_student',
    'profile',
    studentId,
    { is_active: isActive }
  );
  return state.students[idx];
}

export function addStoreManualEnrolment(
  studentId: string,
  courseId: string,
  notes?: string
): Enrolment | null {
  const state = getState();
  const student = state.students.find((s) => s.id === studentId);
  const course = state.courses.find((c) => c.id === courseId);
  if (!student || !course) return null;

  const existingIdx = state.enrolments.findIndex(
    (e) => e.student_id === studentId && e.course_id === courseId
  );

  const record: Enrolment = {
    id: existingIdx >= 0 ? state.enrolments[existingIdx].id : `enr-${Date.now()}`,
    student_id: studentId,
    course_id: courseId,
    payment_id: null,
    enrolled_at: new Date().toISOString(),
    expires_at: null,
    is_active: true,
    enrolled_by: 'admin-1',
    notes: notes?.trim() || 'Manual administrative enrolment',
    student,
    course,
  };

  if (existingIdx >= 0) {
    state.enrolments[existingIdx] = record;
  } else {
    state.enrolments.unshift(record);
    student.enrolment_count = (student.enrolment_count || 0) + 1;
  }

  appendStoreAuditLog('manual_enrolment', 'enrolment', record.id, {
    studentId,
    courseId,
    notes: record.notes,
  });
  return record;
}

export function updateStorePlatformSettings(patch: Partial<PlatformSettings>): PlatformSettings {
  const state = getState();
  state.platformSettings = {
    ...state.platformSettings,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  appendStoreAuditLog('update_platform_settings', 'platform_settings', '1', patch as Record<string, unknown>);
  return state.platformSettings;
}
