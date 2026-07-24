import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import ProjectsManager from './admin/ProjectsManager'
import ProjectCategoriesManager from './admin/ProjectCategoriesManager'
import ServicesManager from './admin/ServicesManager'
import GalleryManager from './admin/GalleryManager'
import GalleryCategoriesManager from './admin/GalleryCategoriesManager'
import HeroSliderManager from './admin/HeroSliderManager'
import AboutManager from './admin/AboutManager'
import Enquiries from './admin/Enquiries'
import Testimonials from './admin/Testimonials'
import ContactInfoManager from './admin/ContactInfoManager'
import WebsiteSettings from './admin/WebsiteSettings'
import SEOSettings from './admin/SEOSettings'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/projects" element={<ProtectedRoute><ProjectsManager /></ProtectedRoute>} />
      <Route path="/admin/project-categories" element={<ProtectedRoute><ProjectCategoriesManager /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><ServicesManager /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><GalleryManager /></ProtectedRoute>} />
      <Route path="/admin/gallery-categories" element={<ProtectedRoute><GalleryCategoriesManager /></ProtectedRoute>} />
      <Route path="/admin/hero-slider" element={<ProtectedRoute><HeroSliderManager /></ProtectedRoute>} />
      <Route path="/admin/about" element={<ProtectedRoute><AboutManager /></ProtectedRoute>} />
      <Route path="/admin/enquiries" element={<ProtectedRoute><Enquiries /></ProtectedRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
      <Route path="/admin/contact-info" element={<ProtectedRoute><ContactInfoManager /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><WebsiteSettings /></ProtectedRoute>} />
      <Route path="/admin/seo" element={<ProtectedRoute><SEOSettings /></ProtectedRoute>} />
    </Routes>
  )
}
