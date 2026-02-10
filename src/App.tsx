import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminLogs from "./pages/AdminLogs";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminToolsUpload from "./pages/AdminToolsUpload";
import AdminServicesUpload from "./pages/AdminServicesUpload";
import AdminCategories from "./pages/AdminCategories";
import AdminAIUpload from "./pages/AdminAIUpload";
import AdminNotesUpload from "./pages/AdminNotesUpload";
import AdminPromptsUpload from "./pages/AdminPromptsUpload";
import AdminMindmapsUpload from "./pages/AdminMindmapsUpload";
import AdminUIUXUpload from "./pages/AdminUIUXUpload";
import AdminAnimationsUpload from "./pages/AdminAnimationsUpload";
import AdminFontsUpload from "./pages/AdminFontsUpload";
import AdminTemplatesUpload from "./pages/AdminTemplatesUpload";
import AdminPlans from "./pages/AdminPlans";
import AdminSponsored from "./pages/AdminSponsored";
import MyProfile from "./pages/MyProfile";
import ServicesPage from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ToolsPage from "./pages/ToolsPage";
import ToolDetail from "./pages/ToolDetail";
import AIPage from "./pages/AIPage";
import AIDetail from "./pages/AIDetail";
import NotesPage from "./pages/NotesPage";
import NoteDetail from "./pages/NoteDetail";
import PromptsPage from "./pages/PromptsPage";
import PromptDetail from "./pages/PromptDetail";
import MindmapsPage from "./pages/MindmapsPage";
import MindmapDetail from "./pages/MindmapDetail";
import MyPurchases from "./pages/MyPurchases";
import ActivityHistory from "./pages/ActivityHistory";
import SettingsPage from "./pages/SettingsPage";
import Notifications from "./pages/Notifications";
import UpgradePlan from "./pages/UpgradePlan";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MyFavorites from "./pages/MyFavorites";
import FreelancersPage from "./pages/FreelancersPage";
import FreelancerDetail from "./pages/FreelancerDetail";
import AdminFreelancersUpload from "./pages/AdminFreelancersUpload";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/ai-upload" element={<AdminAIUpload />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/tools-upload" element={<AdminToolsUpload />} />
              <Route path="/admin/services-upload" element={<AdminServicesUpload />} />
              <Route path="/admin/notes-upload" element={<AdminNotesUpload />} />
              <Route path="/admin/prompts-upload" element={<AdminPromptsUpload />} />
              <Route path="/admin/mindmaps-upload" element={<AdminMindmapsUpload />} />
              <Route path="/admin/uiux-upload" element={<AdminUIUXUpload />} />
              <Route path="/admin/animations-upload" element={<AdminAnimationsUpload />} />
              <Route path="/admin/fonts-upload" element={<AdminFontsUpload />} />
              <Route path="/admin/templates-upload" element={<AdminTemplatesUpload />} />
              <Route path="/admin/plans" element={<AdminPlans />} />
              <Route path="/admin/sponsored" element={<AdminSponsored />} />
              <Route path="/admin/freelancers-upload" element={<AdminFreelancersUpload />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/:id" element={<ToolDetail />} />
              <Route path="/ai" element={<AIPage />} />
              <Route path="/ai/:id" element={<AIDetail />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
              <Route path="/prompts" element={<PromptsPage />} />
              <Route path="/prompts/:id" element={<PromptDetail />} />
              <Route path="/mindmaps" element={<MindmapsPage />} />
              <Route path="/mindmaps/:id" element={<MindmapDetail />} />
              <Route path="/purchases" element={<MyPurchases />} />
              <Route path="/activity" element={<ActivityHistory />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/upgrade" element={<UpgradePlan />} />
              <Route path="/favorites" element={<MyFavorites />} />
              <Route path="/freelancers" element={<FreelancersPage />} />
              <Route path="/freelancers/:id" element={<FreelancerDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
