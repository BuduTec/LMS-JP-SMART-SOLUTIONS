import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveUserRole,
  getAdminDashboardMetrics,
  getStoreCourses,
  addStoreCourse,
  toggleStoreCoursePublish,
  toggleStoreStudentActive,
  addStoreManualEnrolment,
  updateStorePlatformSettings,
  addStoreCategory,
  getStoreAuditLogs,
} from './admin-store';

test('resolveUserRole assigns super_admin to admin and owner emails', () => {
  assert.equal(resolveUserRole('elubudukaemmanuel@gmail.com'), 'super_admin');
  assert.equal(resolveUserRole('admin@jpsmartsolutions.com'), 'super_admin');
  assert.equal(resolveUserRole('instructor@jpsmartsolutions.com'), 'instructor');
  assert.equal(resolveUserRole('engineer@example.com'), 'student');
});

test('getAdminDashboardMetrics computes accurate KPI totals', () => {
  const metrics = getAdminDashboardMetrics();
  assert.equal(metrics.totalCourses >= 10, true);
  assert.equal(metrics.totalStudents >= 5, true);
  assert.equal(metrics.totalEnrolments >= 6, true);
  assert.equal(metrics.totalRevenue, 425000);
});

test('addStoreCourse and toggleStoreCoursePublish mutate course state and append audit log', () => {
  const initialCount = getStoreCourses().length;
  const created = addStoreCourse({
    title: 'Substation Earthing & IEEE 80 Grid Design',
    shortDescription: 'Step-by-step IEEE 80 substation grounding calculation course.',
    categoryId: 'cat-3',
    price: 95000,
    difficultyLevel: 'advanced',
  });

  assert.equal(getStoreCourses().length, initialCount + 1);
  assert.equal(created.status, 'draft');

  const published = toggleStoreCoursePublish(created.id, true);
  assert.equal(published?.status, 'published');
  assert.equal(getStoreAuditLogs()[0].action, 'publish_course');
});

test('toggleStoreStudentActive and addStoreManualEnrolment update student and enrolment records', () => {
  const toggled = toggleStoreStudentActive('stu-5', true);
  assert.equal(toggled?.is_active, true);

  const enrolment = addStoreManualEnrolment('stu-5', 'seed-course-2', 'Sponsored by Corporate Partner');
  assert.ok(enrolment);
  assert.equal(enrolment?.student_id, 'stu-5');
  assert.equal(enrolment?.course_id, 'seed-course-2');
});

test('updateStorePlatformSettings and addStoreCategory persist updates', () => {
  const updated = updateStorePlatformSettings({ discussions_enabled: true });
  assert.equal(updated.discussions_enabled, true);

  const cat = addStoreCategory({ name: 'HVDC & Grid Automation', description: 'High voltage direct current' });
  assert.equal(cat.slug, 'hvdc-grid-automation');
});
