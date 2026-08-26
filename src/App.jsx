import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { ToastProvider } from "./admin/components/cms/ToastContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./admin/layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Work from "./pages/Work";
import About from "./pages/About";
import Automation from "./pages/Automation";
import Contact from "./pages/Contact";
import Dashboard from "./admin/pages/Dashboard";
import Login from "./admin/pages/Login";

// CMS Pages
import HomepageCMS from "./admin/pages/HomepageCMS";
import AboutCMS from "./admin/pages/AboutCMS";
import ServicesCMS from "./admin/pages/ServicesCMS";
import ProjectsCMS from "./admin/pages/ProjectsCMS";
import AutomationsCMS from "./admin/pages/AutomationsCMS";
import TechnologiesCMS from "./admin/pages/TechnologiesCMS";
import ProcessCMS from "./admin/pages/ProcessCMS";
import ContactCMS from "./admin/pages/ContactCMS";
import MediaCMS from "./admin/pages/MediaCMS";
import SeoCMS from "./admin/pages/SeoCMS";
import SettingsCMS from "./admin/pages/SettingsCMS";



function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/work" element={<Work />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Login (Unprotected) */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="homepage" element={<HomepageCMS />} />
                <Route path="about" element={<AboutCMS />} />
                <Route path="services" element={<ServicesCMS />} />
                <Route path="projects" element={<ProjectsCMS />} />
                <Route path="automations" element={<AutomationsCMS />} />
                <Route path="technologies" element={<TechnologiesCMS />} />
                <Route path="process" element={<ProcessCMS />} />
                <Route path="contact" element={<ContactCMS />} />
                <Route path="media" element={<MediaCMS />} />
                <Route path="seo" element={<SeoCMS />} />
                <Route path="settings" element={<SettingsCMS />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
