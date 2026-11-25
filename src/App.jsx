import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterParent from "./pages/register/Parent";
import RegisterStudent from "./pages/register/Student";
import StudentCompleteProfile from "./pages/register/StudentCompleteProfile";
import RegisterTeacher from "./pages/register/Teacher";
import TeacherCompleteProfile from "./pages/register/TeacherCompleteProfile";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyAccount from "./pages/VerifyAccount";
import ParentDashboard from "./pages/parent/Dashboard";

// استيراد المكون الرئيسي المنظم للخطوات الأربع
import AddChildWizard from "./pages/parent/AddChildWizard";
import AddChildSuccess from "./pages/parent/AddChildSuccess";
import AddChildPendingReview from "./pages/parent/AddChildPendingReview";
import ChildrenList from "./pages/parent/ChildrenList";
import Schedule from "./pages/parent/Schedule";
import Messages from "./pages/parent/Messages";
import EducationalPlans from "./pages/parent/EducationalPlans";
import Notifications from "./pages/parent/Notifications";
import AccountSettings from "./pages/parent/Accountsettings";

// لوحة تحكم المعلم
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherGroups from "./pages/teacher/Groups";
import GroupDetails from "./pages/teacher/GroupDetails";
import CreateSession from "./pages/teacher/CreateSession";
import SessionDetails from "./pages/teacher/SessionDetails";
import Attendance from "./pages/teacher/Attendance";
import TeacherGroupStudents from "./pages/teacher/GroupStudents";
import StudentDetails from "./pages/teacher/StudentDetails";
import TeacherSchedule from "./pages/teacher/Schedule";
import TeacherScheduleComponent from "./pages/teacher/TeacherSchedule";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import AssignmentInfo from "./pages/teacher/AssignmentInfo";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import TeacherExams from "./pages/teacher/TeacherExams";
import ExamInfo from "./pages/teacher/ExamInfo";
import CreateExam from "./pages/teacher/CreateExam";
import CreateExamQuestions from "./pages/teacher/CreateExamQuestions";
import CreateExamReview from "./pages/teacher/CreateExamReview";
import TeacherMessages from "./pages/teacher/Messages";
import TeacherNotifications from "./pages/teacher/Notifications";
import TeacherProfits from "./pages/teacher/Profits";
import TeacherAccountSettings from "./pages/teacher/AccountSettings";

// لوحة تحكم الطالب
// كل صفحات الطالب هتتحط جوه فولدر ./pages/student زي ما هو متبع مع فولدر teacher
import StudentDashboard from "./pages/student/Dashboard";
import StudentGroupSessions from "./pages/student/GroupSessions";
import StudentSessionDetails from "./pages/student/SessionDetails";

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/parent" element={<RegisterParent />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route
          path="/register/student/complete-profile"
          element={<StudentCompleteProfile />}
        />
        <Route path="/register/teacher" element={<RegisterTeacher />} />
        <Route
          path="/register/teacher/complete-profile"
          element={<TeacherCompleteProfile />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-account" element={<VerifyAccount />} />

        {/* لوحة تحكم ولي الأمر - محمية بدور parent */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* مسارات إضافة وإدارة الأبناء */}
        <Route
          path="/parent/children/add"
          element={
            <ProtectedRoute allowedRole="parent">
              <AddChildWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/children/add/success"
          element={
            <ProtectedRoute allowedRole="parent">
              <AddChildSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/children/add/pending"
          element={
            <ProtectedRoute allowedRole="parent">
              <AddChildPendingReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/children"
          element={
            <ProtectedRoute allowedRole="parent">
              <ChildrenList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/schedule"
          element={
            <ProtectedRoute allowedRole="parent">
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/messages"
          element={
            <ProtectedRoute allowedRole="parent">
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/plans"
          element={
            <ProtectedRoute allowedRole="parent">
              <EducationalPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/notifications"
          element={
            <ProtectedRoute allowedRole="parent">
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/settings"
          element={
            <ProtectedRoute allowedRole="parent">
              <AccountSettings />
            </ProtectedRoute>
          }
        />

        {/* لوحة تحكم المعلم - محمية بدور teacher */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/groups"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherGroups />
            </ProtectedRoute>
          }
        />

        {/*
          كل صفحة دلوقتي Route مستقل قائم بذاته (مفيش Routes متداخلة جوه GroupDetails).
          عشان كده مفيش حاجة لـ /* في نهاية المسار، وكل مسار فرعي (زي create-session)
          له Route منفصل صريح.
        */}
        <Route
          path="/teacher/courses/:courseId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <GroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId/create-session"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateSession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/groups/:groupId/lessons"
          element={
            <ProtectedRoute allowedRole="teacher">
              <GroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/groups/:groupId/lessons/create-session"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateSession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/groups/sessions/:id"
          element={<SessionDetails />}
        />

        <Route
          path="/teacher/groups/:groupId/schedule/create"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/groups/sessions/attendance"
          element={
            <ProtectedRoute allowedRole="teacher">
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/groups/:groupId/students"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherGroupStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/students/:studentId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/schedule/create"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherScheduleComponent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/schedule"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherScheduleComponent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />

        {/* صفحة معلومات الواجب — بتفتح من أيقونة العين في جدول الواجبات */}
        <Route
          path="/teacher/assignments/:assignmentId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <AssignmentInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/create"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams/:examId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <ExamInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams/create"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams/:examId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <ExamInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams/create/questions"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateExamQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams/create/review"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateExamReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/messages"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/notifications"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profits"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherProfits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/earnings"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherProfits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/settings"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherAccountSettings />
            </ProtectedRoute>
          }
        />

        {/* لوحة تحكم الطالب - محمية بدور student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* صفحة حصص المجموعة للطالب — بتفتح من كروت "مجموعاتي" و"حصص اليوم" في الداشبورد */}
        <Route
          path="/student/groups/:groupId/sessions"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentGroupSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/groups/:groupId/sessions/:sessionId"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentSessionDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;