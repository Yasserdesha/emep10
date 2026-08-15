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

const FALLBACK_IMG = '/logo/logo.png';

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
  const [isSavingProject, setIsSavingProject] = useState(false);

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
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Analytics state
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsRefreshed, setAnalyticsRefreshed] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<'unknown' | 'ok' | 'error'>('unknown');

  // Auto-dismiss status message after 6 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

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

      // API returns { authenticated: true } on success (not data.success)
      if (res.ok && (data.authenticated || data.success)) {
        setIsAuthenticated(true);
        setLoading(false);
        // Fetch dashboard data immediately — no page reload needed
        await Promise.all([fetchProjects(), fetchArticles()]);
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
    if (!confirm(isAr ? 'هل تريد تسجيل الخروج من لوحة التحكم؟' : 'Are you sure you want to logout?')) return;
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

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArtTitleAr('');
    setArtTitleEn('');
    setArtSummaryAr('');
    setArtSummaryEn('');
    setArtContentAr('');
    setArtContentEn('');
    setArtImage('');
    setArtReadTime(5);
    setArtImageMode('upload');
    setStatusMessage(null);
  };

  const handleArticleEditInit = (art: Article) => {
    setEditingArticle(art);
    setArtTitleAr(art.titleAr);
    setArtTitleEn(art.titleEn);
    setArtSummaryAr(art.summaryAr);
    setArtSummaryEn(art.summaryEn);
    setArtContentAr(art.contentAr);
    setArtContentEn(art.contentEn);
    setArtImage(art.image);
    setArtReadTime(art.readTimeMin);
    setArtImageMode('url');
    setActiveTab('articles');
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const checkDbHealth = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        setDbHealth('ok');
        setAnalyticsRefreshed(new Date().toLocaleTimeString('ar-EG'));
      } else {
        setDbHealth('error');
      }
    } catch {
      setDbHealth('error');
    } finally {
      setAnalyticsLoading(false);
    }
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
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Helper to compress image in client before sending to server
  const compressImageBeforeUpload = async (file: File): Promise<File> => {
    if (typeof window === 'undefined') return file;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1400;
          const MAX_HEIGHT = 1400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/webp',
            0.85
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
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

    setIsSavingProject(true);
    setStatusMessage(null);

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
        // Also include id in body for the PUT handler (belt-and-suspenders approach)
        body: JSON.stringify(editingProject ? { ...payload, id: editingProject.id } : payload),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: editingProject 
            ? (isAr ? 'تم تعديل بيانات المشروع بنجاح! ✅' : 'Project updated successfully! ✅') 
            : (isAr ? 'تم إضافة المشروع الجديد بنجاح! ✅' : 'New project added! ✅')
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
    } finally {
      setIsSavingProject(false);
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

  // Submit Article (Blog CMS) — handles both Create (POST) and Edit (PUT)
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitleAr.trim()) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى كتابة عنوان المقال بالعربي على الأقل' : 'Arabic article title is required' });
      return;
    }
    if (!artContentAr.trim()) {
      setStatusMessage({ type: 'error', text: isAr ? 'يرجى كتابة محتوى المقال' : 'Article content is required' });
      return;
    }
    setIsSavingArticle(true);
    setStatusMessage(null);
    const payload = {
      titleAr: artTitleAr,
      titleEn: artTitleEn || artTitleAr,
      summaryAr: artSummaryAr,
      summaryEn: artSummaryEn,
      contentAr: artContentAr,
      contentEn: artContentEn,
      image: artImage || '',
      readTimeMin: artReadTime,
      author: 'E-MEP Engineering Team',
    };
    try {
      const isEdit = Boolean(editingArticle);
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/articles?id=${editingArticle!.id}` : '/api/articles';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...payload, id: editingArticle!.id } : payload),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.article)) {
        setStatusMessage({
          type: 'success',
          text: isEdit
            ? (isAr ? 'تم تعديل المقال بنجاح! ✅' : 'Article updated successfully! ✅')
            : (isAr ? 'تم نشر المقال الهندسي بنجاح! ✅' : 'Article published successfully! ✅')
        });
        resetArticleForm();
        fetchArticles();
      } else {
        setStatusMessage({ type: 'error', text: data.message || (isAr ? 'حدث خطأ أثناء حفظ المقال' : 'Failed to save article') });
      }
    } catch (err) {
      console.error('Save article error:', err);
      setStatusMessage({ type: 'error', text: isAr ? 'حدث خطأ في السيرفر' : 'Server error' });
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
              <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl text-red-400 text-xs flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
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
  // DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Bar Navigation Header */}
      <header className="bg-[#131317]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 px-4 py-3 shadow-xl">
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
            {/* Quick link to live site */}
            <a
              href="https://emep.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition hidden sm:flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              <span>{isAr ? 'الموقع الحي' : 'Live Site'}</span>
            </a>
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
        
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: isAr ? 'إجمالي المشاريع' : 'Total Projects', value: stats.totalProjects, icon: 'fa-folder-open', color: 'text-blue-400' },
            { label: isAr ? 'إجمالي المقالات' : 'Total Articles', value: stats.totalArticles, icon: 'fa-newspaper', color: 'text-purple-400' },
            { label: isAr ? 'مطاعم وكافيهات' : 'F&B Dining', value: stats.dining, icon: 'fa-utensils', color: 'text-orange-400' },
            { label: isAr ? 'مبيعات وتجزئة' : 'Retail Stores', value: stats.retail, icon: 'fa-store', color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#131317] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className={`fa-solid ${stat.icon} ${stat.color}`}></i>
              </div>
              <div>
                <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: 'projects', labelAr: '📁 إدارة المشاريع', labelEn: 'Projects CMS', icon: 'fa-folder-open' },
            { id: 'articles', labelAr: '✍️ إدارة المقالات', labelEn: 'Blog CMS', icon: 'fa-newspaper' },
            { id: 'analytics', labelAr: '📊 الإحصائيات', labelEn: 'Analytics', icon: 'fa-chart-pie' },
            { id: 'settings', labelAr: '⚙️ الإعدادات', labelEn: 'Settings', icon: 'fa-sliders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white shadow-lg shadow-red-600/30'
                  : 'bg-[#131317] border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Floating Toast Notification Banner */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-2xl transition ${
            statusMessage.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border-red-500/40 text-red-300'
          }`}>
            <div className="flex items-center gap-2.5">
              <i className={`fa-solid ${statusMessage.type === 'success' ? 'fa-circle-check text-lg' : 'fa-circle-exclamation text-lg'}`}></i>
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[11px] transition">
              {isAr ? 'إغلاق' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 1: PROJECTS MANAGEMENT */}
        {/* ====================================================== */}
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
                  {/* Category Selection Cards */}
                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-2">
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
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer flex items-center justify-between ${
                            categoryKey === cat.key
                              ? 'bg-[#FF1E27]/25 border-[#FF1E27] text-white shadow-lg'
                              : 'bg-[#0A0A0C] border-white/10 text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <span>{isAr ? cat.ar : cat.en}</span>
                          {categoryKey === cat.key && <i className="fa-solid fa-circle-check text-[#FF1E27]"></i>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        {isAr ? 'اسم المشروع (عربي)' : 'Title (Arabic)'} <span className="text-[#FF1E27]">*</span>
                      </label>
                      <input
                        type="text"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        placeholder="مثال: ستاربكس سيتي سنتر"
                        required
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        {isAr ? 'اسم المشروع (إنجليزي)' : 'Title (English)'} <span className="text-[#FF1E27]">*</span>
                      </label>
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. Starbucks City Centre"
                        required
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Project Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-2">
                      {isAr ? 'صورة المشروع (رفع مباشر مضغوط بنسبة 100%)' : 'Project Image Upload'} <span className="text-[#FF1E27]">*</span>
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
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    )}

                    {/* Preview Thumbnail */}
                    {imageUrl && (
                      <div className="mt-3 p-3 bg-[#0A0A0C] border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-emerald-400">{isAr ? 'تم جاهزية الصورة' : 'Image Ready'}</p>
                            <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{imageUrl}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setImageUrl('')} className="text-xs text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition">
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
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
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
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:border-[#FF1E27] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProject}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
                  >
                    {isSavingProject ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>{editingProject ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة المشروع للمعرض' : 'Add Project')}</span>
                      </>
                    )}
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
                    className="bg-[#0A0A0C] border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FF1E27] focus:outline-none"
                  />
                </div>

                <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                  {filteredProjects.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <i className="fa-solid fa-folder-open text-gray-600 text-2xl"></i>
                      </div>
                      <p className="text-sm font-bold text-gray-500">
                        {searchQuery ? (isAr ? 'لا توجد نتائج للبحث' : 'No results found') : (isAr ? 'لا توجد مشاريع مضافة بعد' : 'No projects added yet')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {!searchQuery && (isAr ? 'أضف مشروعك الأول من النموذج على اليسار' : 'Add your first project from the form')}
                      </p>
                    </div>
                  ) : (
                    filteredProjects.map((p) => (
                      <div key={p.id} className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-white/20 transition shadow-lg">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={p.image}
                            alt={p.titleAr}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-[#FF1E27]/20 text-[#FF1E27] rounded-full inline-block mb-1">
                              {p.catAr}
                            </span>
                            <h3 className="text-xs font-extrabold text-white truncate">{p.titleAr}</h3>
                            <p className="text-[11px] text-gray-400 truncate">{p.titleEn}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditInit(p)}
                            title={isAr ? 'تعديل' : 'Edit'}
                            className="px-3 py-2 text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/25 transition"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id, p.titleAr)}
                            title={isAr ? 'حذف' : 'Delete'}
                            className="px-3 py-2 text-xs bg-red-500/15 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/25 transition"
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
        )}

        {/* ====================================================== */}
        {/* TAB 2: BLOG CMS & ARTICLES EDITOR */}
        {/* ====================================================== */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* New Article Form (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <i className={`fa-solid ${editingArticle ? 'fa-pen-to-square' : 'fa-pen-nib'} text-[#FF1E27]`}></i>
                      <span>{editingArticle ? (isAr ? 'تعديل المقال الهندسي' : 'Edit Article') : (isAr ? 'كتابة ونشر مقال هندسي جديد' : 'Publish New Engineering Article')}</span>
                    </h2>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {isAr ? 'الحقول المطلوبة مُعلَّمة بـ ❊ — باقي الحقول اختيارية والسيرفر يكمّلها تلقائياً' : 'Required fields marked with ❊ — others are auto-filled by server'}
                    </p>
                  </div>
                  {editingArticle && (
                    <button type="button" onClick={resetArticleForm} className="text-xs text-gray-400 hover:text-white underline flex-shrink-0">
                      {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
                    </button>
                  )}
                </div>


                <form onSubmit={handleSubmitArticle} className="space-y-4">
                  {/* Arabic Title (required) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'عنوان المقال (عربي)' : 'Article Title (Arabic)'} <span className="text-[#FF1E27]">❊</span>
                    </label>
                    <input
                      type="text"
                      value={artTitleAr}
                      onChange={(e) => setArtTitleAr(e.target.value)}
                      placeholder="مثال: اشتراطات الكود المصري للحريق في المحلات والمطاعم"
                      required
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  {/* English Title (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'عنوان المقال (إنجليزي) — اختياري' : 'Article Title (English) — Optional'}
                    </label>
                    <input
                      type="text"
                      value={artTitleEn}
                      onChange={(e) => setArtTitleEn(e.target.value)}
                      placeholder="e.g. Egyptian Firefighting Code Standards (optional)"
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  {/* Cover Image - Optional */}
                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-2">
                      {isAr ? 'صورة الغلاف — اختياري (يوجد صورة افتراضية)' : 'Article Cover Image — Optional (default image available)'}
                    </label>

                    <div className="flex border border-white/10 rounded-xl overflow-hidden mb-3 bg-[#0A0A0C]">
                      <button
                        type="button"
                        onClick={() => setArtImageMode('upload')}
                        className={`flex-1 py-2 text-xs font-semibold transition ${artImageMode === 'upload' ? 'bg-[#FF1E27] text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <i className="fa-solid fa-cloud-arrow-up ml-1"></i> {isAr ? 'رفع صورة غلاف' : 'Upload Image'}
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
                        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
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
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                              <i className="fa-solid fa-newspaper text-[#FF1E27] text-lg"></i>
                            </div>
                            <p className="text-xs font-semibold text-gray-200">
                              {artImage ? (isAr ? 'صورة جاهزة ✅ — اضغط لتغييرها' : 'Image ready ✅ — click to change') : (isAr ? 'اضغط أو اسحب الصورة هنا (اختياري)' : 'Click or drag image (optional)')}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {isAr ? 'يُضغط تلقائياً WebP • أو اترك فارغاً للصورة الافتراضية' : 'Auto-compressed to WebP • or leave blank for default'}
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
                        placeholder="https://... (اتركه فارغاً للصورة الافتراضية)"
                        className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                      />
                    )}

                    {artImage && (
                      <div className="mt-3 p-3 bg-[#0A0A0C] border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={artImage}
                            alt="Article Cover"
                            className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-emerald-400">{isAr ? 'تم جاهزية صورة الغلاف ✅' : 'Cover Image Ready ✅'}</p>
                            <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{artImage}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setArtImage('')} className="text-xs text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'ملخص المقال (عربي) — اختياري' : 'Article Summary (Arabic) — Optional'}
                    </label>
                    <textarea
                      rows={2}
                      value={artSummaryAr}
                      onChange={(e) => setArtSummaryAr(e.target.value)}
                      placeholder="ملخص مختصر يظهر في قائمة المقالات..."
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>

                  {/* Arabic content (required) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isAr ? 'المحتوى الهندسي الكامل (عربي)' : 'Full Content (Arabic)'} <span className="text-[#FF1E27]">❊</span>
                    </label>
                    <textarea
                      rows={6}
                      value={artContentAr}
                      onChange={(e) => setArtContentAr(e.target.value)}
                      placeholder="اكتب المحتوى الهندسي التفصيلي للمقال هنا... يمكنك استخدام سطور جديدة للفقرات."
                      required
                      className="w-full bg-[#0A0A0C] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#FF1E27] focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Read time */}
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-gray-300 whitespace-nowrap">
                      {isAr ? 'وقت القراءة (دقائق):' : 'Read Time (mins):'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={artReadTime}
                      onChange={(e) => setArtReadTime(Number(e.target.value))}
                      className="w-20 bg-[#0A0A0C] border border-white/15 rounded-xl p-2 text-xs text-white focus:border-[#FF1E27] focus:outline-none text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingArticle}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
                  >
                    {isSavingArticle ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isAr ? 'جاري النشر...' : 'Publishing...'}</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>{isAr ? 'نشر المقال الهندسي' : 'Publish Article'}</span>
                      </>
                    )}
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

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {articles.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <i className="fa-solid fa-newspaper text-gray-600 text-2xl"></i>
                      </div>
                      <p className="text-sm font-bold text-gray-500">{isAr ? 'لا توجد مقالات منشورة بعد' : 'No articles published yet'}</p>
                      <p className="text-xs text-gray-600">{isAr ? 'انشر مقالك الأول من النموذج على اليسار' : 'Publish your first article from the form'}</p>
                    </div>
                  ) : (
                    articles.map((art) => (
                      <div key={art.id} className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition shadow-lg">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <img
                              src={art.image}
                              alt={art.titleAr}
                              className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-extrabold text-gray-400 block mb-1 flex items-center gap-1">
                                <i className="fa-solid fa-clock text-[9px]"></i> {art.readTimeMin} {isAr ? 'دقائق' : 'min read'}
                              </span>
                              <h3 className="text-xs font-extrabold text-white truncate">{art.titleAr}</h3>
                              <p className="text-[11px] text-gray-500 truncate font-mono">{art.slug}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <a
                              href={`/blog/${art.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={isAr ? 'عرض المقال' : 'View Article'}
                              className="px-3 py-2 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/25 transition"
                            >
                              <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                            <button
                              onClick={() => handleArticleEditInit(art)}
                              title={isAr ? 'تعديل' : 'Edit'}
                              className="px-3 py-2 text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/25 transition"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id, art.titleAr)}
                              title={isAr ? 'حذف' : 'Delete'}
                              className="px-3 py-2 text-xs bg-red-500/15 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/25 transition flex-shrink-0"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 3: ANALYTICS */}
        {/* ====================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <i className="fa-solid fa-chart-pie text-[#FF1E27]"></i>
                  <span>مؤشرات الأداء والمعاينة العامة للمنصة</span>
                </h2>
                <button
                  onClick={checkDbHealth}
                  disabled={analyticsLoading}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
                >
                  {analyticsLoading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fa-solid fa-satellite-dish"></i>}
                  <span>{isAr ? 'فحص حالة الاتصال' : 'Check DB Health'}</span>
                </button>
              </div>

              {/* DB Health Status */}
              {dbHealth !== 'unknown' && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
                  dbHealth === 'ok' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border-red-500/30 text-red-300'
                }`}>
                  <i className={`fa-solid ${dbHealth === 'ok' ? 'fa-circle-check' : 'fa-circle-xmark'} text-base`}></i>
                  <span>
                    {dbHealth === 'ok'
                      ? `✅ الاتصال ب Supabase سليم تماماً — تم الفحص ${analyticsRefreshed || ''}`
                      : '❌ تعذر الاتصال ب Supabase — تحقق من متغيرات البيئة'
                    }
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-xs text-gray-400">إجمالي المشاريع</span>
                  <p className="text-3xl font-extrabold text-emerald-400">{stats.totalProjects}</p>
                  <p className="text-[11px] text-gray-500">مفعل ISR 60s Revalidation</p>
                </div>
                <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-xs text-gray-400">إجمالي المقالات المنشورة</span>
                  <p className="text-3xl font-extrabold text-purple-400">{stats.totalArticles}</p>
                  <p className="text-[11px] text-gray-500">مقالات هندسية متخصصة</p>
                </div>
                <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-2">
                  <span className="text-xs text-gray-400">حالة الربط مع Supabase</span>
                  <p className={`text-3xl font-extrabold ${dbHealth === 'ok' ? 'text-emerald-400' : dbHealth === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                    {dbHealth === 'ok' ? 'نشط ✅' : dbHealth === 'error' ? 'خطأ ❌' : 'جار الفحص...'}
                  </p>
                  <p className="text-[11px] text-gray-500">مشروع dpptnkehkzolqrifbagx</p>
                </div>
              </div>

              {/* Articles breakdown */}
              {articles.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-newspaper text-[#FF1E27]"></i>
                    <span>آخر المقالات المنشورة</span>
                  </h3>
                  <div className="space-y-2">
                    {articles.slice(0, 5).map((art) => (
                      <div key={art.id} className="flex items-center justify-between p-3 bg-[#0A0A0C] rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={art.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                          <p className="text-xs font-semibold text-white truncate">{art.titleAr}</p>
                        </div>
                        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">{art.readTimeMin} دقائق</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-bold text-white mb-4">توزيع المشاريع حسب التصنيف</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'retail', label: 'مبيعات وتجزئة', color: 'bg-blue-500' },
                    { key: 'dining', label: 'مطاعم وكافيهات', color: 'bg-orange-500' },
                    { key: 'showrooms', label: 'معارض سيارات', color: 'bg-purple-500' },
                    { key: 'supermarket', label: 'سوبرماركت', color: 'bg-emerald-500' },
                  ].map((cat) => {
                    const count = projects.filter(p => p.category === cat.key).length;
                    const pct = stats.totalProjects > 0 ? Math.round((count / stats.totalProjects) * 100) : 0;
                    return (
                      <div key={cat.key} className="bg-[#0A0A0C] border border-white/10 rounded-xl p-4 space-y-2">
                        <p className="text-xs text-gray-400">{cat.label}</p>
                        <p className="text-2xl font-extrabold text-white">{count}</p>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${cat.color}`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500">{pct}% من الإجمالي</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 4: SYSTEM SETTINGS */}
        {/* ====================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 max-w-2xl mx-auto">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <i className="fa-solid fa-sliders text-[#FF1E27]"></i>
                <span>إعدادات النظام والاتصال بقاعدة البيانات</span>
              </h2>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'البريد الإلكتروني للأدمن:', value: 'admin@emep-egy.com', color: 'text-white' },
                  { label: 'رابط مشروع Supabase Live:', value: 'https://dpptnkehkzolqrifbagx.supabase.co', color: 'text-emerald-400 font-mono' },
                  { label: 'Storage Bucket:', value: 'public / projects', color: 'text-blue-400 font-mono' },
                  { label: 'الموقع الحي:', value: 'https://emep.vercel.app', color: 'text-purple-400 font-mono' },
                  { label: 'Next.js Version:', value: '16.x (Turbopack)', color: 'text-yellow-400 font-mono' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 bg-[#0A0A0C] rounded-2xl border border-white/10 gap-4">
                    <span className="text-gray-400 flex-shrink-0">{item.label}</span>
                    <span className={`font-bold text-right break-all ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                  onClick={checkDbHealth}
                  disabled={analyticsLoading}
                  className="w-full py-3.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold rounded-2xl border border-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50"
                >
                  {analyticsLoading ? <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : <i className="fa-solid fa-satellite-dish"></i>}
                  <span>فحص حالة اتصال Supabase</span>
                  {dbHealth !== 'unknown' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${dbHealth === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {dbHealth === 'ok' ? '✅ متصل' : '❌ خطأ'}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { fetchProjects(); fetchArticles(); setStatusMessage({ type: 'success', text: 'تم تحديث وسحب البيانات من السيرفر بنجاح!' }); }}
                  className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-rotate"></i>
                  <span>إعادة تحديث ومزامنة البيانات مع Supabase</span>
                </button>
                <a
                  href="https://emep.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-2xl border border-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  <span>فتح الموقع الحي في تبويب جديد</span>
                </a>
                <a
                  href="https://supabase.com/dashboard/project/dpptnkehkzolqrifbagx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl border border-white/10 transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-database"></i>
                  <span>فتح لوحة تحكم Supabase</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
