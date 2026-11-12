import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Shell from './components/Shell'
import Welcome from './pages/Welcome'
import StudentHome from './pages/StudentHome'
import Practice from './pages/Practice'
import AskBuddy from './pages/AskBuddy'
import Library from './pages/Library'
import TeacherOverview from './pages/TeacherOverview'
import Groups from './pages/Groups'
import Approvals from './pages/Approvals'
import Missions from './pages/Missions'
import Assistant from './pages/Assistant'
import Village from './pages/Village'
import Parent from './pages/Parent'
import Hub from './pages/Hub'
import Impact from './pages/Impact'
import Privacy from './pages/Privacy'

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Shell>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/practice" element={<Practice />} />
          <Route path="/student/ask" element={<AskBuddy />} />
          <Route path="/student/library" element={<Library />} />
          <Route path="/teacher" element={<TeacherOverview />} />
          <Route path="/teacher/groups" element={<Groups />} />
          <Route path="/teacher/approvals" element={<Approvals />} />
          <Route path="/teacher/missions" element={<Missions />} />
          <Route path="/teacher/assistant" element={<Assistant />} />
          <Route path="/village" element={<Village />} />
          <Route path="/parent" element={<Parent />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy/:tab" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </HashRouter>
  )
}
