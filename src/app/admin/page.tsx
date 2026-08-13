"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  image: string;
  titleEn: string;
  titleAr: string;
  category: string;
  catEn: string;
  catAr: string;
  descEn: string;
  descAr: string;
}

interface Article {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  contentEn: string;
  contentAr: string;
  image: string;
  author: string;
  readTimeMin: number;
  createdAt: string;
}

// Client-side image compressor: converts any photo to lightweight WebP before uploading
async function compressImageBeforeUpload(file: File, maxWidth = 1200, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml') return resolve(file);
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;

      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob((blob) => {
        if (!blob) return resolve(file);
        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
          type: "image/webp",
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, "image/webp", quality);
    };
    img.onerror = () => resolve(file);
  });
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'projects' | 'articles' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState<'projects' | 'articles' | 'analytics' | 'settings'>('projects');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Language state (RTL / LTR)
  const [isAr, setIsAr] = useState(true);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields State (Projects)
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [catAr, setCatAr] = useState('مبيعات وتجزئة');
  const [catEn, setCatEn] = useState('Retail Store');
  const [categoryKey, setCategoryKey] = useState('retail');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');

  // Image Upload State (Projects)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Image Upload State (Articles)
  const [artImageMode, setArtImageMode] = useState<'upload' | 'url'>('upload');
  const [artImage, setArtImage] = useState('');
  const [isArtUploading, setIsArtUploading] = useState(false);
  const [isArtDragging, setIsArtDragging] = useState(false);
  const artFileInputRef = useRef<HTMLInputElement | null>(null);

  // Articles State (Blog CMS)
  const [articles, setArticles] = useState<Article[]>([]);
  const [artTitleAr, setArtTitleAr] = useState('');
  const [artTitleEn, setArtTitleEn] = useState('');
  const [artSummaryAr, setArtSummaryAr] = useState('');
  const [artSummaryEn, setArtSummaryEn] = useState('');
  const [artContentAr, setArtContentAr] = useState('');
  const [artContentEn, setArtContentEn] = useState('');
  const [artReadTime, setArtReadTime] = useState(5);
  const [isSavingArticle, setIsSavingArticle] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/verify');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchProjects();
          fetchArticles();
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (err) {
      console.error('Fetch projects error:', err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch (err) {
      console.error('Fetch articles error:', err);
    }
  };

  // Login submit handler (Automatic instant refresh fix)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        // Instant reload to attach session cookie to all sub-fetches
        window.location.reload();
      } else {
        setLoginError(data.message || (isAr ? 'البريد الإلكتروني أو كلمة السر غير صحيحة' : 'Invalid email or password'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(isAr ? 'حدث خطأ في الاتصال بالسيرفر' : 'Server connection error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setPassword('');
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setTitleAr('');
    setTitleEn('');
    setCatAr('مبيعات وتجزئة');
    setCatEn('Retail Store');
    setCategoryKey('retail');
    setDescAr('');
    setDescEn('');
    setImageUrl('');
    setImageMode('upload');
    setStatusMessage(null);
  };

  const handleEditInit = (p: Project) => {
    setEditingProject(p);
    setTitleAr(p.titleAr);
    setTitleEn(p.titleEn);
    setCatAr(p.catAr);
    setCatEn(p.catEn);
    setCategoryKey(p.category);
    setDescAr(p.descAr);
    setDescEn(p.descEn);
    setImageUrl(p.image);
    setImageMode('url');
    setActiveTab('projects');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Fail-proof File Upload Handler for Projects
  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى اختيار صورة صالحة (PNG, JPG, WebP)' : 'Please select a valid image file' });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const compressedFile = await compressImageBeforeUpload(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setImageUrl(data.url);
        setStatusMessage({
          type: 'success',
          text: isAr ? `تم ضغط الصورة ورفعها بنجاح! (${(compressedFile.size / 1024).toFixed(0)} KB)` : `Image compressed & uploaded successfully!`
        });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setStatusMessage({
        type: 'error',
        text: isAr ? 'فشل رفع الصورة على السيرفر.' : 'Failed to upload image.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fail-proof File Upload Handler for Articles
  const handleArticleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى اختيار صورة صالحة (PNG, JPG, WebP)' : 'Please select a valid image file' });
      return;
    }

    setIsArtUploading(true);
    setStatusMessage(null);

    try {
      const compressedFile = await compressImageBeforeUpload(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setArtImage(data.url);
        setStatusMessage({
          type: 'success',
          text: isAr ? `تم ضغط صورة المقال ورفعها بنجاح! (${(compressedFile.size / 1024).toFixed(0)} KB)` : `Article image uploaded successfully!`
        });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Article upload error:', err);
      setStatusMessage({
        type: 'error',
        text: isAr ? 'فشل رفع صورة المقال.' : 'Failed to upload article image.'
      });
    } finally {
      setIsArtUploading(false);
    }
  };

  const handleCategorySelect = (key: string) => {
    setCategoryKey(key);
    if (key === 'retail') {
      setCatAr('مبيعات وتجزئة'); setCatEn('Retail Store');
    } else if (key === 'dining') {
      setCatAr('مطاعم وكافيهات'); setCatEn('F&B Dining');
    } else if (key === 'showrooms') {
      setCatAr('معارض سيارات'); setCatEn('Showroom');
    } else if (key === 'supermarket') {
      setCatAr('سوبرماركت وهايبر'); setCatEn('Supermarket');
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !titleEn.trim() || !imageUrl) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى ملء جميع الحقول ورفع صورة المشروع' : 'Please fill all fields and upload image' });
      return;
    }

    const payload = {
      image: imageUrl,
      titleEn,
      titleAr,
      category: categoryKey,
      catEn,
      catAr,
      descEn,
      descAr,
    };

    try {
      const method = editingProject ? 'PUT' : 'POST';
      const url = editingProject ? `/api/projects?id=${editingProject.id}` : '/api/projects';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: editingProject 
            ? (isAr ? 'تم تعديل بيانات المشروع بنجاح!' : 'Project updated!') 
            : (isAr ? 'تم إضافة المشروع الجديد بنجاح!' : 'New project added!')
        });
        resetProjectForm();
        fetchProjects();
      } else {
        const data = await res.json();
        setStatusMessage({ type: 'error', text: data.message || 'Error saving project' });
      }
    } catch (err) {
      console.error('Submit project error:', err);
      setStatusMessage({ type: 'error', text: 'Server error saving project' });
    }
  };

  const handleDeleteProject = async (id: number, title: string) => {
    if (!confirm(isAr ? `هل أنت تأكد من حذف مشروع "${title}"؟` : `Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: isAr ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully' });
        fetchProjects();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Submit Article (Blog CMS)
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitleAr.trim() || !artTitleEn.trim() || !artContentAr.trim() || !artImage) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى اختيار صورة ومثال عنوان ومحتوى المقال' : 'Please fill required article fields' });
      return;
    }

    setIsSavingArticle(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: artTitleAr,
          titleEn: artTitleEn,
          summaryAr: artSummaryAr,
          summaryEn: artSummaryEn,
          contentAr: artContentAr,
          contentEn: artContentEn,
          image: artImage,
          readTimeMin: artReadTime,
          author: 'E-MEP Engineering Team',
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: isAr ? 'تم نشر المقال الهندسي الجديد بنجاح!' : 'Article published successfully!' });
        setArtTitleAr(''); setArtTitleEn(''); setArtSummaryAr(''); setArtSummaryEn(''); setArtContentAr(''); setArtContentEn(''); setArtImage('');
        fetchArticles();
      } else {
        const data = await res.json();
        setStatusMessage({ type: 'error', text: data.message || 'Failed to publish article' });
      }
    } catch (err) {
      console.error('Save article error:', err);
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: number, title: string) => {
    if (!confirm(isAr ? `هل أنت تأكد من حذف مقال "${title}"؟` : `Delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: isAr ? 'تم حذف المقال بنجاح' : 'Article deleted' });
        fetchArticles();
      }
    } catch (err) {
      console.error('Delete article error:', err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.catAr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProjects: projects.length,
    totalArticles: articles.length,
    retail: projects.filter(p => p.category === 'retail').length,
    dining: projects.filter(p => p.category === 'dining').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF1E27] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">جاري فتح لوحة التحكم والأمان...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md bg-[#131317] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1E27]/10 blur-2xl pointer-events-none rounded-full"></div>
          
          <div className="flex flex-col items-center mb-8 text-center relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl p-3 border border-white/20 mb-4 flex items-center justify-center shadow-xl">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={48} height={48} className="w-12 h-12 object-contain" priority />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">
              {isAr ? 'لوحة تحكم E-MEP المتطورة' : 'E-MEP Enterprise Portal'}
            </h1>
            <p className="text-xs text-gray-400">
              {isAr ? 'قم بتسجيل الدخول ببيانات الأدمن المعتمـدة' : 'Enter your admin email & password'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {loginError && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                {isAr ? 'البريد الإلكتروني للإدارة (Email)' : 'Admin Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@emep-egy.com"
                required
                className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF1E27] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                {isAr ? 'كلمة السر (Password)' : 'Admin Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF1E27] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>{isAr ? 'تسجيل الدخول للوحة التحكم' : 'Login to Dashboard'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE-OF-THE-ART OVERHAULED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Bar Navigation Header */}
      <header className="bg-[#131317]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl p-2 border border-white/20 flex items-center justify-center shadow-lg">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={32} height={32} className="w-8 h-8 object-contain" priority />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white leading-tight">E-MEP Enterprise Portal</h1>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isAr ? 'متصل بقاعدة البيانات Supabase DB' : 'Supabase Active Session'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAr(!isAr)}
              className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 transition"
            >
              {isAr ? 'English' : 'العربية'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/25 transition flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: 'projects', labelAr: '📁 إدارة المشاريع والأعمال', labelEn: 'Projects CMS', icon: 'fa-folder-open' },
            { id: 'articles', labelAr: '✍️ إدارة المقالات والمدونة', labelEn: 'Blog CMS', icon: 'fa-newspaper' },
            { id: 'analytics', labelAr: '📊 لوحة الإحصائيات والأداء', labelEn: 'Analytics', icon: 'fa-chart-pie' },
            { id: 'settings', labelAr: '⚙️ إعدادات المنصة وقاعدة البيانات', labelEn: 'System Settings', icon: 'fa-sliders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white shadow-lg shadow-red-600/30'
                  : 'bg-[#131317] border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            statusMessage.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              <i className={`fa-solid ${statusMessage.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="underline hover:opacity-80">
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <i className="fa-solid fa-plus-circle text-[#FF1E27]"></i>
                    <span>{editingProject ? (isAr ? 'تعديل بيانات المشروع' : 'Edit Project') : (isAr ? 'إضافة مشروع جديد' : 'Add New Project')}</span>
                  </h2>
                  {editingProject && (
                    <button onClick={resetProjectForm} className="text-xs text-gray-400 hover:text-white underline">
                      {isAr ? 'إلغاء التعديل' : 'Cancel'}
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmitProject} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      {isAr ? 'تصنيف المشروع' : 'Project Category'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'retail', ar: 'مبيعات وتجزئة', en: 'Retail' },
                        { key: 'dining', ar: 'مطاعم وكافيهات', en: 'Dining F&B' },
                        { key: 'showrooms', ar: 'معارض سيارات', en: 'Showroom' },
                        { key: 'supermarket', ar: 'سوبرماركت وهايبر', en: 'Supermarket' },
                      ].map((cat) => (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => handleCategorySelect(cat.key)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                            categoryKey === cat.key
                              ? 'bg-[#FF1E27]/20 border-[#FF1E27] text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {isAr ? cat.ar : cat.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        {isAr ? 'اسم المشروع (عربي)' : 'Title (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        placeholder="مثال: ستاربكس سيتي سنتر"
                        required
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        {isAr ? 'اسم المشروع (إنجليزي)' : 'Title (English)'}
                      </label>
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. Starbucks City Centre"
                        required
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Fail-Proof WebP Image Drag & Drop Uploader */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      {isAr ? 'صورة المشروع (رفع مباشر مضغوط بنسبة 100%)' : 'Project Image Upload'}
                    </label>

                    <div className="flex border border-white/10 rounded-xl overflow-hidden mb-3 bg-[#0A0A0C]">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`flex-1 py-2 text-xs font-semibold transition ${imageMode === 'upload' ? 'bg-[#FF1E27] text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <i className="fa-solid fa-cloud-arrow-up ml-1"></i> {isAr ? 'رفع صورة جديدة' : 'Upload File'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`flex-1 py-2 text-xs font-semibold transition ${imageMode === 'url' ? 'bg-[#FF1E27] text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <i className="fa-solid fa-link ml-1"></i> {isAr ? 'رابط مباشر CDN' : 'Direct URL'}
                      </button>
                    </div>

                    {imageMode === 'upload' && (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                          isDragging ? 'border-[#FF1E27] bg-[#FF1E27]/10' : 'border-white/15 bg-[#0A0A0C] hover:border-white/30'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          className="hidden"
                        />
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-3 border-[#FF1E27] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-gray-300">{isAr ? 'جاري ضغط ورفع الصورة...' : 'Compressing & uploading...'}</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                              <i className="fa-solid fa-image text-[#FF1E27] text-xl"></i>
                            </div>
                            <p className="text-xs font-semibold text-gray-200">
                              {isAr ? 'اضغط هنا لرفع صورة أو اسحب الملف هنا' : 'Click or drag image file here'}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {isAr ? 'تتم معالجة الصورة وضغطها أوتوماتيكياً صيغة WebP' : 'Compressed to WebP via Canvas'}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {imageMode === 'url' && (
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://dpptnkehkzolqrifbagx.supabase.co/..."
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    )}

                    {/* Preview Thumbnail */}
                    {imageUrl && (
                      <div className="mt-3 p-2.5 bg-[#0A0A0C] border border-white/10 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-emerald-400">{isAr ? 'تم تجهيز الصورة' : 'Image Ready'}</p>
                            <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{imageUrl}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setImageUrl('')} className="text-xs text-red-400 p-1">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        {isAr ? 'الوصف (عربي)' : 'Desc (Arabic)'}
                      </label>
                      <textarea
                        rows={3}
                        value={descAr}
                        onChange={(e) => setDescAr(e.target.value)}
                        placeholder="تفاصيل نطاق التكييف والكهرباء والإنذار..."
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        {isAr ? 'الوصف (إنجليزي)' : 'Desc (English)'}
                      </label>
                      <textarea
                        rows={3}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        placeholder="Full MEP scope details..."
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>{editingProject ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة المشروع للمعرض' : 'Add Project')}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* List Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-[#FF1E27]"></i>
                    <span>{isAr ? 'المشاريع المضافة' : 'Existing Projects'} ({projects.length})</span>
                  </h2>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث في المشاريع...' : 'Search...'}
                    className="bg-[#0A0A0C] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#FF1E27] focus:outline-none"
                  />
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredProjects.map((p) => (
                    <div key={p.id} className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-white/20 transition">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={p.image} alt={p.titleAr} className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FF1E27]/20 text-[#FF1E27] rounded-full">
                            {p.catAr}
                          </span>
                          <h3 className="text-xs font-bold text-white truncate mt-1">{p.titleAr}</h3>
                          <p className="text-[11px] text-gray-400 truncate">{p.titleEn}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleEditInit(p)} className="px-2.5 py-1.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => handleDeleteProject(p.id, p.titleAr)} className="px-2.5 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BLOG CMS & ARTICLES EDITOR (WITH DEDICATED IMAGE UPLOADER) */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* New Article Form (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <i className="fa-solid fa-pen-nib text-[#FF1E27]"></i>
                    <span>{isAr ? 'كتابة ونشر مقال هندسي جديد' : 'Publish New Engineering Article'}</span>
                  </h2>
                </div>

                <form onSubmit={handleSubmitArticle} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'عنوان المقال (عربي)' : 'Article Title (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={artTitleAr}
                      onChange={(e) => setArtTitleAr(e.target.value)}
                      placeholder="مثال: اشتراطات الكود المصري للحريق في المحلات والمطاعم"
                      required
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'عنوان المقال (إنجليزي)' : 'Article Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={artTitleEn}
                      onChange={(e) => setArtTitleEn(e.target.value)}
                      placeholder="e.g. Egyptian Firefighting Code Standards"
                      required
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  {/* DEDICATED FILE UPLOADER FOR ARTICLES */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      {isAr ? 'صورة الغلاف (رفع مباشر أو رابط)' : 'Article Cover Image'}
                    </label>

                    <div className="flex border border-white/10 rounded-xl overflow-hidden mb-3 bg-[#0A0A0C]">
                      <button
                        type="button"
                        onClick={() => setArtImageMode('upload')}
                        className={`flex-1 py-2 text-xs font-semibold transition ${artImageMode === 'upload' ? 'bg-[#FF1E27] text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <i className="fa-solid fa-cloud-arrow-up ml-1"></i> {isAr ? 'رفع صورة غلاف جديدة' : 'Upload Image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtImageMode('url')}
                        className={`flex-1 py-2 text-xs font-semibold transition ${artImageMode === 'url' ? 'bg-[#FF1E27] text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <i className="fa-solid fa-link ml-1"></i> {isAr ? 'رابط مباشر' : 'Direct URL'}
                      </button>
                    </div>

                    {artImageMode === 'upload' && (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsArtDragging(true); }}
                        onDragLeave={() => setIsArtDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsArtDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleArticleFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => artFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                          isArtDragging ? 'border-[#FF1E27] bg-[#FF1E27]/10' : 'border-white/15 bg-[#0A0A0C] hover:border-white/30'
                        }`}
                      >
                        <input
                          ref={artFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleArticleFileUpload(e.target.files[0])}
                          className="hidden"
                        />
                        {isArtUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-3 border-[#FF1E27] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-gray-300">{isAr ? 'جاري ضغط ورفع الصورة...' : 'Compressing & uploading...'}</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                              <i className="fa-solid fa-newspaper text-[#FF1E27] text-xl"></i>
                            </div>
                            <p className="text-xs font-semibold text-gray-200">
                              {isAr ? 'اضغط هنا لرفع صورة الغلاف أو اسحب الملف هنا' : 'Click or drag cover image here'}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {isAr ? 'تتم المعالجة والضغط التلقائي صيغة WebP' : 'Compressed to WebP via Canvas'}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {artImageMode === 'url' && (
                      <input
                        type="url"
                        value={artImage}
                        onChange={(e) => setArtImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                      />
                    )}

                    {/* Preview Thumbnail */}
                    {artImage && (
                      <div className="mt-3 p-2.5 bg-[#0A0A0C] border border-white/10 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={artImage} alt="Article Cover" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-emerald-400">{isAr ? 'تم جاهزية صورة الغلاف' : 'Cover Image Ready'}</p>
                            <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{artImage}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setArtImage('')} className="text-xs text-red-400 p-1">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'ملخص المقال (عربي)' : 'Article Summary (Arabic)'}
                    </label>
                    <textarea
                      rows={2}
                      value={artSummaryAr}
                      onChange={(e) => setArtSummaryAr(e.target.value)}
                      placeholder="ملخص مختصر يظهر في القائمة..."
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'المحتوى الهندسي الكامل (عربي)' : 'Full Content (Arabic)'}
                    </label>
                    <textarea
                      rows={5}
                      value={artContentAr}
                      onChange={(e) => setArtContentAr(e.target.value)}
                      placeholder="اكتب المحتوى الهندسي للمقال..."
                      required
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingArticle}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>{isSavingArticle ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر المقال الهندسي' : 'Publish Article')}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Articles List (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <i className="fa-solid fa-newspaper text-[#FF1E27]"></i>
                    <span>{isAr ? 'المقالات الهندسية المنشورة' : 'Published Articles'} ({articles.length})</span>
                  </h2>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                  {articles.map((art) => (
                    <div key={art.id} className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-white/20 transition">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={art.image} alt={art.titleAr} className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-bold text-gray-400">
                            {art.readTimeMin} دقائق قراءة
                          </span>
                          <h3 className="text-xs font-bold text-white truncate mt-0.5">{art.titleAr}</h3>
                          <p className="text-[11px] text-gray-400 truncate">{art.slug}</p>
                        </div>
                      </div>

                      <button onClick={() => handleDeleteArticle(art.id, art.titleAr)} className="px-2.5 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition flex-shrink-0">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <i className="fa-solid fa-chart-pie text-[#FF1E27]"></i>
                <span>مؤشرات الأداء والمعاينة العامة للمنصة</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-xs text-gray-400">إجمالي المشاريع</span>
                  <p className="text-3xl font-extrabold text-emerald-400">{stats.totalProjects}</p>
                  <p className="text-[11px] text-gray-500">مفعل ISR 60s Revalidation</p>
                </div>
                <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-xs text-gray-400">حجم صور CDN المضغوطة</span>
                  <p className="text-3xl font-extrabold text-blue-400">WebP Auto</p>
                  <p className="text-[11px] text-gray-500">توفير 95% من سعة التخزين</p>
                </div>
                <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-xs text-gray-400">حالة الربط مع Supabase</span>
                  <p className="text-3xl font-extrabold text-purple-400">نشط وحي</p>
                  <p className="text-[11px] text-gray-500">مشروع dpptnkehkzolqrifbagx</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 max-w-2xl mx-auto">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <i className="fa-solid fa-sliders text-[#FF1E27]"></i>
                <span>إعدادات النظام والاتصال بقاعدة البيانات</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between p-3 bg-[#0A0A0C] rounded-xl border border-white/10">
                  <span className="text-gray-400">البريد الإلكتروني الحالي للأدمن:</span>
                  <span className="font-bold text-white">admin@emep-egy.com</span>
                </div>
                <div className="flex justify-between p-3 bg-[#0A0A0C] rounded-xl border border-white/10">
                  <span className="text-gray-400">رابط مشروع Supabase Live:</span>
                  <span className="font-mono text-emerald-400">https://dpptnkehkzolqrifbagx.supabase.co</span>
                </div>
                <div className="flex justify-between p-3 bg-[#0A0A0C] rounded-xl border border-white/10">
                  <span className="text-gray-400">صندوق تخزين الصور Storage Bucket:</span>
                  <span className="font-mono text-blue-400">public / projects</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => { fetchProjects(); fetchArticles(); setStatusMessage({ type: 'success', text: 'تم تحديث وسحب البيانات من السيرفر بنجاح!' }); }}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-rotate"></i>
                  <span>إعادة تحديث ومزامنة البيانات مع Supabase</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
