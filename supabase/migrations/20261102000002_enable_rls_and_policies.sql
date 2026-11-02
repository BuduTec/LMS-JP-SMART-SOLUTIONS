-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_access_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is admin or super_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is instructor or admin
CREATE OR REPLACE FUNCTION is_instructor_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor','admin','super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: student is enrolled in a course
CREATE OR REPLACE FUNCTION is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrolments
    WHERE student_id = auth.uid() AND course_id = p_course_id AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES policies
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "profiles_public_instructors" ON profiles;
CREATE POLICY "profiles_public_instructors" ON profiles FOR SELECT USING (role = 'instructor');

-- CATEGORIES policies (public read, admin write)
DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "categories_admin_write" ON categories;
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (is_admin());

-- COURSES policies
DROP POLICY IF EXISTS "courses_public_published" ON courses;
CREATE POLICY "courses_public_published" ON courses FOR SELECT USING (
  status = 'published' OR is_admin() OR (instructor_id = auth.uid() AND is_instructor_or_admin())
);

DROP POLICY IF EXISTS "courses_admin_all" ON courses;
CREATE POLICY "courses_admin_all" ON courses FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "courses_instructor_own" ON courses;
CREATE POLICY "courses_instructor_own" ON courses FOR UPDATE USING (instructor_id = auth.uid() AND is_instructor_or_admin());

-- MODULES policies
DROP POLICY IF EXISTS "modules_enrolled_or_admin" ON modules;
CREATE POLICY "modules_enrolled_or_admin" ON modules FOR SELECT USING (
  is_admin() OR
  is_enrolled(course_id) OR
  EXISTS (SELECT 1 FROM courses WHERE id = course_id AND status = 'published' AND is_published = TRUE)
);

DROP POLICY IF EXISTS "modules_admin_write" ON modules;
CREATE POLICY "modules_admin_write" ON modules FOR ALL USING (is_instructor_or_admin());

-- LESSONS policies  
DROP POLICY IF EXISTS "lessons_preview_public" ON lessons;
CREATE POLICY "lessons_preview_public" ON lessons FOR SELECT USING (
  is_preview = TRUE OR is_admin() OR is_enrolled(course_id)
);

DROP POLICY IF EXISTS "lessons_admin_write" ON lessons;
CREATE POLICY "lessons_admin_write" ON lessons FOR ALL USING (is_instructor_or_admin());

-- LESSON RESOURCES policies
DROP POLICY IF EXISTS "lesson_resources_enrolled" ON lesson_resources;
CREATE POLICY "lesson_resources_enrolled" ON lesson_resources FOR SELECT USING (
  is_admin() OR EXISTS (
    SELECT 1 FROM lessons l WHERE l.id = lesson_id AND is_enrolled(l.course_id)
  )
);

DROP POLICY IF EXISTS "lesson_resources_admin_write" ON lesson_resources;
CREATE POLICY "lesson_resources_admin_write" ON lesson_resources FOR ALL USING (is_instructor_or_admin());

-- ENROLMENTS policies
DROP POLICY IF EXISTS "enrolments_own" ON enrolments;
CREATE POLICY "enrolments_own" ON enrolments FOR SELECT USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "enrolments_admin_write" ON enrolments;
CREATE POLICY "enrolments_admin_write" ON enrolments FOR ALL USING (is_admin());

-- PAYMENTS policies
DROP POLICY IF EXISTS "payments_own" ON payments;
CREATE POLICY "payments_own" ON payments FOR SELECT USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "payments_admin_write" ON payments;
CREATE POLICY "payments_admin_write" ON payments FOR ALL USING (is_admin());

-- LESSON PROGRESS policies
DROP POLICY IF EXISTS "progress_own" ON lesson_progress;
CREATE POLICY "progress_own" ON lesson_progress FOR SELECT USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "progress_own_write" ON lesson_progress;
CREATE POLICY "progress_own_write" ON lesson_progress FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "progress_own_update" ON lesson_progress;
CREATE POLICY "progress_own_update" ON lesson_progress FOR UPDATE USING (student_id = auth.uid());

DROP POLICY IF EXISTS "progress_admin" ON lesson_progress;
CREATE POLICY "progress_admin" ON lesson_progress FOR ALL USING (is_admin());

-- COURSE COMPLETIONS policies
DROP POLICY IF EXISTS "completions_own" ON course_completions;
CREATE POLICY "completions_own" ON course_completions FOR SELECT USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "completions_admin_write" ON course_completions;
CREATE POLICY "completions_admin_write" ON course_completions FOR ALL USING (is_admin());

-- ASSESSMENTS policies
DROP POLICY IF EXISTS "assessments_enrolled" ON assessments;
CREATE POLICY "assessments_enrolled" ON assessments FOR SELECT USING (
  is_admin() OR is_enrolled(course_id)
);

DROP POLICY IF EXISTS "assessments_admin_write" ON assessments;
CREATE POLICY "assessments_admin_write" ON assessments FOR ALL USING (is_instructor_or_admin());

-- QUESTIONS policies
DROP POLICY IF EXISTS "questions_admin" ON questions;
CREATE POLICY "questions_admin" ON questions FOR ALL USING (is_instructor_or_admin());

DROP POLICY IF EXISTS "questions_enrolled_read" ON questions;
CREATE POLICY "questions_enrolled_read" ON questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND is_enrolled(a.course_id))
);

-- QUESTION OPTIONS policies
DROP POLICY IF EXISTS "options_admin" ON question_options;
CREATE POLICY "options_admin" ON question_options FOR ALL USING (is_instructor_or_admin());

DROP POLICY IF EXISTS "options_enrolled_read" ON question_options;
CREATE POLICY "options_enrolled_read" ON question_options FOR SELECT USING (
  EXISTS (SELECT 1 FROM questions q JOIN assessments a ON a.id = q.assessment_id WHERE q.id = question_id AND is_enrolled(a.course_id))
);

-- ASSESSMENT ATTEMPTS policies
DROP POLICY IF EXISTS "attempts_own" ON assessment_attempts;
CREATE POLICY "attempts_own" ON assessment_attempts FOR SELECT USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "attempts_own_insert" ON assessment_attempts;
CREATE POLICY "attempts_own_insert" ON assessment_attempts FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "attempts_own_update" ON assessment_attempts;
CREATE POLICY "attempts_own_update" ON assessment_attempts FOR UPDATE USING (student_id = auth.uid());

DROP POLICY IF EXISTS "attempts_admin" ON assessment_attempts;
CREATE POLICY "attempts_admin" ON assessment_attempts FOR ALL USING (is_admin());

-- ATTEMPT ANSWERS policies
DROP POLICY IF EXISTS "answers_own" ON attempt_answers;
CREATE POLICY "answers_own" ON attempt_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM assessment_attempts aa WHERE aa.id = attempt_id AND aa.student_id = auth.uid()) OR is_admin()
);

DROP POLICY IF EXISTS "answers_own_insert" ON attempt_answers;
CREATE POLICY "answers_own_insert" ON attempt_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM assessment_attempts aa WHERE aa.id = attempt_id AND aa.student_id = auth.uid())
);

-- ASSIGNMENTS policies
DROP POLICY IF EXISTS "assignments_enrolled" ON assignments;
CREATE POLICY "assignments_enrolled" ON assignments FOR SELECT USING (is_enrolled(course_id) OR is_admin());

DROP POLICY IF EXISTS "assignments_admin_write" ON assignments;
CREATE POLICY "assignments_admin_write" ON assignments FOR ALL USING (is_instructor_or_admin());

-- ASSIGNMENT SUBMISSIONS policies
DROP POLICY IF EXISTS "submissions_own" ON assignment_submissions;
CREATE POLICY "submissions_own" ON assignment_submissions FOR SELECT USING (student_id = auth.uid() OR is_instructor_or_admin());

DROP POLICY IF EXISTS "submissions_own_insert" ON assignment_submissions;
CREATE POLICY "submissions_own_insert" ON assignment_submissions FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "submissions_admin_write" ON assignment_submissions;
CREATE POLICY "submissions_admin_write" ON assignment_submissions FOR ALL USING (is_instructor_or_admin());

-- ANNOUNCEMENTS policies
DROP POLICY IF EXISTS "announcements_read" ON announcements;
CREATE POLICY "announcements_read" ON announcements FOR SELECT USING (
  is_global = TRUE OR is_admin() OR (course_id IS NOT NULL AND is_enrolled(course_id))
);

DROP POLICY IF EXISTS "announcements_admin_write" ON announcements;
CREATE POLICY "announcements_admin_write" ON announcements FOR ALL USING (is_instructor_or_admin());

-- NOTIFICATIONS policies
DROP POLICY IF EXISTS "notifications_own" ON notifications;
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_own_update" ON notifications;
CREATE POLICY "notifications_own_update" ON notifications FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_admin_insert" ON notifications;
CREATE POLICY "notifications_admin_insert" ON notifications FOR INSERT WITH CHECK (is_admin());

-- PLATFORM SETTINGS policies
DROP POLICY IF EXISTS "settings_public_read" ON platform_settings;
CREATE POLICY "settings_public_read" ON platform_settings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "settings_super_admin_write" ON platform_settings;
CREATE POLICY "settings_super_admin_write" ON platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- CERTIFICATES policies
DROP POLICY IF EXISTS "certificates_own" ON certificates;
CREATE POLICY "certificates_own" ON certificates FOR SELECT USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "certificates_admin_write" ON certificates;
CREATE POLICY "certificates_admin_write" ON certificates FOR ALL USING (is_admin());

-- AUDIT LOGS policies
DROP POLICY IF EXISTS "audit_admin_only" ON audit_logs;
CREATE POLICY "audit_admin_only" ON audit_logs FOR ALL USING (is_admin());

-- VIDEO ACCESS LOGS policies
DROP POLICY IF EXISTS "video_logs_admin" ON video_access_logs;
CREATE POLICY "video_logs_admin" ON video_access_logs FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "video_logs_insert_own" ON video_access_logs;
CREATE POLICY "video_logs_insert_own" ON video_access_logs FOR INSERT WITH CHECK (student_id = auth.uid());
