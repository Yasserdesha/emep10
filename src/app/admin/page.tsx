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

// Client-side image compressor: converts any photo to lightweight WebP before uploading
async function compressImageBeforeUpload(file: File, maxWidth = 1200, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    // If SVG, skip canvas compression
    if (file.type === 'image/svg+xml') {
      return resolve(file);
    }
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
      if (!ctx) {
        return resolve(file);
      }
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob((blob) => {
        if (!blob) {
          return resolve(file);
        }
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

  // Form Fields State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [catAr, setCatAr] = useState('مبيعات وتجزئة');
  const [catEn, setCatEn] = useState('Retail Store');
  const [categoryKey, setCategoryKey] = useState('retail');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');

  // Image Upload State
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presetImages = [
    "https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/assets/projects/starbucks-citycenter.webp",
    "https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/assets/projects/costa-coffee.webp",
    "https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/assets/projects/bmw-showroom.webp",
    "https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/assets/projects/spinneys-hypermarket.webp",
    "https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/assets/projects/carrefour-express.webp"
  ];

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/verify');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchProjects();
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
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
    }
  };

  // Login submit handler
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
        fetchProjects();
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
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const resetForm = () => {
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
    setImageMode(p.image.startsWith('http') ? 'url' : 'upload');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Fail-proof File Upload Handler with Client-Side Compression
  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى اختيار صورة صالحة (PNG, JPG, WebP)' : 'Please select a valid image file' });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      // 1. Compress image to WebP client-side via canvas before sending over network
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
          text: isAr ? `تم رفع وضغط الصورة بنجاح (${(compressedFile.size / 1024).toFixed(0)} KB)` : `Image compressed and uploaded successfully!`
        });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setStatusMessage({
        type: 'error',
        text: isAr ? 'فشل رفع الصورة على السيرفر. يرجى تجربة صورة أخرى.' : 'Failed to upload image.'
      });
    } finally {
      setIsUploading(false);
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
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى ملء جميع الحقول المطلوبة واختيار صورة المشروع' : 'Please fill all required fields and upload an image' });
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

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: editingProject 
            ? (isAr ? 'تم تعديل بيانات المشروع بنجاح!' : 'Project updated successfully!') 
            : (isAr ? 'تم إضافة المشروع الجديد بنجاح!' : 'New project added successfully!')
        });
        resetForm();
        fetchProjects();
      } else {
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
      } else {
        const data = await res.json();
        setStatusMessage({ type: 'error', text: data.message || 'Delete error' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setStatusMessage({ type: 'error', text: 'Server error deleting project' });
    }
  };

  const filteredProjects = projects.filter(p => 
    p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.catAr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics Count
  const stats = {
    total: projects.length,
    retail: projects.filter(p => p.category === 'retail').length,
    dining: projects.filter(p => p.category === 'dining').length,
    showrooms: projects.filter(p => p.category === 'showrooms' || p.category === 'supermarket').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF1E27] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">جاري التحقق من الجلسة والأمان...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN (Supabase Auth Email + Password)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md bg-[#131317] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl p-3 border border-white/20 mb-4 flex items-center justify-center shadow-lg">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={48} height={48} className="w-12 h-12 object-contain" priority />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {isAr ? 'لوحة تحكم E-MEP للإدارة' : 'E-MEP Admin Control Portal'}
            </h1>
            <p className="text-xs text-gray-400">
              {isAr ? 'قم بتسجيل الدخول بإيميل الأدمن المعتمد وباسورد سوبابيز' : 'Log in using authorized admin email & password'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@emep-egy.com"
                  required
                  className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27] transition"
                />
              </div>
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
                className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27] transition"
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
  // ADVANCED DASHBOARD OVERHAUL SCREEN
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Admin Header Bar */}
      <header className="bg-[#131317]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl p-2 border border-white/20 flex items-center justify-center">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={32} height={32} className="w-8 h-8 object-contain" priority />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">E-MEP Dashboard</h1>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isAr ? 'متصل بقواعد بيانات Supabase' : 'Connected to Supabase DB'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAr(!isAr)}
              className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-gray-300 transition"
            >
              {isAr ? 'English' : 'العربية'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Quick Stats Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-semibold">{isAr ? 'إجمالي المشاريع' : 'Total Projects'}</span>
              <i className="fa-solid fa-folder-open text-[#FF1E27]"></i>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-semibold">{isAr ? 'مبيعات وتجزئة' : 'Retail Stores'}</span>
              <i className="fa-solid fa-bag-shopping text-blue-400"></i>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.retail}</p>
          </div>
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-semibold">{isAr ? 'مطاعم وكافيهات' : 'Dining F&B'}</span>
              <i className="fa-solid fa-utensils text-amber-400"></i>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.dining}</p>
          </div>
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-semibold">{isAr ? 'معارض وهايبر' : 'Showrooms'}</span>
              <i className="fa-solid fa-car text-purple-400"></i>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.showrooms}</p>
          </div>
        </div>

        {/* Global Feedback Status Banner */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
            statusMessage.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              <i className={`fa-solid ${statusMessage.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs underline hover:opacity-75">
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}

        {/* Main Content Grid: Form (Left/Top) & Project List (Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Project Form Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-plus-circle text-[#FF1E27]"></i>
                  <span>{editingProject ? (isAr ? 'تعديل بيانات المشروع' : 'Edit Project') : (isAr ? 'إضافة مشروع جديد' : 'Add New Project')}</span>
                </h2>
                {editingProject && (
                  <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white underline">
                    {isAr ? 'إلغاء التعديل' : 'Cancel'}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitProject} className="space-y-4">
                {/* Category Selection Radio Badges */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    {isAr ? 'تصنيف المشروع (Category)' : 'Project Category'}
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
                      {isAr ? 'اسم المشروع (بالعربية)' : 'Project Title (Arabic)'}
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
                      {isAr ? 'اسم المشروع (بالإنجليزية)' : 'Project Title (English)'}
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

                {/* FAIL-PROOF DRAG & DROP IMAGE UPLOADER */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    {isAr ? 'صورة المشروع (رفع مباشر مضغوط بنسبة 100%)' : 'Project Image Upload'}
                  </label>

                  {/* Mode switcher tabs */}
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
                            {isAr ? 'اضغط هنا لرفع صورة أو اسحب الملف وقربه هنا' : 'Click to select or drag image file here'}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {isAr ? 'يتم ضغط الصورة تلقائياً لصيغة WebP خفيفة قبل الرفع' : 'Images automatically compressed to WebP'}
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

                  {/* Thumbnail Realtime Preview */}
                  {imageUrl && (
                    <div className="mt-3 p-2 bg-[#0A0A0C] border border-white/10 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-emerald-400">{isAr ? 'تم تجهيز الصورة' : 'Image Ready'}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{imageUrl}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-xs text-red-400 hover:text-red-300 p-1.5"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* Description Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}
                    </label>
                    <textarea
                      rows={3}
                      value={descAr}
                      onChange={(e) => setDescAr(e.target.value)}
                      placeholder="وصف تفصيلي لأعمال التكييف والكهرباء والإنذار..."
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      placeholder="Full electromechanical MEP scope details..."
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>{editingProject ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة المشروع إلى المعرض' : 'Add Project to Website')}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Projects Data Table / List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-[#FF1E27]"></i>
                  <span>{isAr ? 'قائمة المشاريع المضافة' : 'Existing Projects List'} ({projects.length})</span>
                </h2>
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث في المشاريع...' : 'Search projects...'}
                    className="bg-[#0A0A0C] border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#FF1E27] focus:outline-none w-full sm:w-48"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-500 text-xs"></i>
                </div>
              </div>

              {/* Projects Grid List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    {isAr ? 'لا توجد مشاريع مضافة طابقة لبحثك' : 'No projects found'}
                  </div>
                ) : (
                  filteredProjects.map((p) => (
                    <div key={p.id} className="bg-[#0A0A0C] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-white/20 transition">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={p.image} alt={p.titleAr} className="w-14 h-14 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FF1E27]/20 text-[#FF1E27] rounded-full">
                            {p.catAr}
                          </span>
                          <h3 className="text-xs font-bold text-white truncate mt-1">{p.titleAr}</h3>
                          <p className="text-[11px] text-gray-400 truncate">{p.titleEn}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditInit(p)}
                          className="px-2.5 py-1.5 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id, p.titleAr)}
                          className="px-2.5 py-1.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
