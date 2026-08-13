"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

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

export default function AdminPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [email, setEmail] = useState('admin@emep-egy.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Projects list state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Form states for Add / Edit project
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [category, setCategory] = useState('retail');
  const [catEn, setCatEn] = useState('Retail & Fashion');
  const [catAr, setCatAr] = useState('متاجر وموضة');

  // Multi-mode Image Upload state
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Deletion confirmation modal state
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success/error messages
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset images list for quick selection
  const presetImages = [
    '/assets/projects/portfolio-2_page-0004.jpg',
    '/assets/projects/portfolio-2_page-0005.jpg',
    '/assets/projects/portfolio-2_page-0006.jpg',
    '/assets/projects/portfolio-2_page-0007.jpg',
    '/assets/projects/portfolio-2_page-0008.jpg',
    '/assets/projects/portfolio-2_page-0009.jpg',
    '/assets/projects/portfolio-2_page-0010.jpg',
    '/assets/projects/portfolio-2_page-0011.jpg',
    '/assets/projects/portfolio-2_page-0012.jpg',
    '/assets/projects/portfolio-2_page-0013.jpg',
  ];

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (!editingId) {
      if (newCat === 'retail') {
        setCatEn('Retail & Fashion');
        setCatAr('متاجر وموضة');
      } else if (newCat === 'dining') {
        setCatEn('Dining & Cafes');
        setCatAr('مطاعم وكافيهات');
      } else if (newCat === 'showrooms') {
        setCatEn('Showrooms & Tech');
        setCatAr('معارض وتكنولوجيا');
      }
    }
  };

  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // Check HttpOnly session cookie on mount via server endpoint /api/admin/verify
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/verify')
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated) {
          setIsLoggedIn(true);
          fetchProjects();
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoggedIn(false);
      })
      .finally(() => {
        if (isMounted) setIsVerifyingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchProjects]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email || !password) {
      setLoginError(isAr ? 'الرجاء إدخال البريد الإلكتروني وكلمة السر' : 'Please enter email and password');
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid login credentials'));
      }

      setIsLoggedIn(true);
      setPassword(''); // Clear sensitive password memory
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg || (isAr ? 'خطأ أثناء تسجيل الدخول' : 'Login failed'));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore
    } finally {
      setIsLoggedIn(false);
      setPassword('');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleAr('');
    setDescEn('');
    setDescAr('');
    setCategory('retail');
    setCatEn('Retail & Fashion');
    setCatAr('متاجر وموضة');
    setImageUrl('');
    setImageMode('upload');
    setFormErrors({});
  };

  const startEditProject = (p: Project) => {
    setEditingId(p.id);
    setTitleEn(p.titleEn);
    setTitleAr(p.titleAr);
    setDescEn(p.descEn);
    setDescAr(p.descAr);
    setCategory(p.category);
    setCatEn(p.catEn);
    setCatAr(p.catAr);
    setImageUrl(p.image);
    setFormErrors({});
    setActionSuccess('');
    setActionError('');

    const formEl = document.getElementById('projectFormSection');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Image File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Upload failed');
      }

      const data = await res.json();
      setImageUrl(data.url);
      setActionSuccess(
        isAr 
          ? `تم رفع الصورة "${file.name}" بنجاح!` 
          : `Image "${file.name}" uploaded successfully!`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setActionError(
        isAr 
          ? `فشل رفع الصورة: ${msg}` 
          : `Upload failed: ${msg}`
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const validateForm = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!titleEn.trim()) errs.titleEn = isAr ? 'العنوان الإنجليزي مطلوب' : 'English Title is required';
    if (!titleAr.trim()) errs.titleAr = isAr ? 'العنوان العربي مطلوب' : 'Arabic Title is required';
    if (!descEn.trim()) errs.descEn = isAr ? 'الوصف الإنجليزي مطلوب' : 'English Description is required';
    if (!descAr.trim()) errs.descAr = isAr ? 'الوصف العربي مطلوب' : 'Arabic Description is required';
    if (!catEn.trim()) errs.catEn = isAr ? 'تسمية القسم مطلوبة' : 'Category label is required';
    if (!catAr.trim()) errs.catAr = isAr ? 'تسمية القسم بالعربي مطلوبة' : 'Arabic Category label is required';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setActionSuccess('');
    setActionError('');

    try {
      const isEditing = editingId !== null;
      const method = isEditing ? 'PUT' : 'POST';

      const payload: Record<string, unknown> = {
        titleEn,
        titleAr,
        category,
        catEn,
        catAr,
        descEn,
        descAr,
        image: imageUrl.trim() || undefined,
      };

      if (isEditing) {
        payload.id = editingId;
      }

      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Submission failed');
      }

      setActionSuccess(
        isEditing
          ? (isAr ? 'تم تعديل المشروع بنجاح!' : 'Project has been updated successfully!')
          : (isAr ? 'تمت إضافة المشروع الجديد بنجاح!' : 'New project has been added successfully!')
      );
      
      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setActionError(
        isAr 
          ? `فشل الحفظ: ${msg}` 
          : `Failed: ${msg}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await fetch(`/api/projects?id=${deletingProject.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Deletion failed');
      }

      setActionSuccess(
        isAr 
          ? `تم حذف مشروع "${deletingProject.titleAr}" بنجاح!` 
          : `Project "${deletingProject.titleEn}" was deleted successfully!`
      );
      
      setDeletingProject(null);
      if (editingId === deletingProject.id) {
        resetForm();
      }
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setActionError(
        isAr 
          ? `فشل الحذف: ${msg}` 
          : `Delete failed: ${msg}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Export JSON Backup file
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ projects }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `emep_projects_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore JSON Backup file
  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || !Array.isArray(parsed.projects)) {
          throw new Error(isAr ? 'تنسيق الملف غير صحيح. يرجى اختيار ملف نسخة احتياطية صالح.' : 'Invalid format. Select a valid JSON backup.');
        }

        const res = await fetch('/api/projects/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Restore failed');
        }

        setActionSuccess(
          isAr 
            ? 'تم استعادة قاعدة بيانات المشاريع بنجاح!' 
            : 'Projects database restored successfully!'
        );
        fetchProjects();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setActionError(
          isAr 
            ? `فشل استعادة النسخة الاحتياطية: ${msg}` 
            : `Restore failed: ${msg}`
        );
      }
    };

    reader.readAsText(file);
  };

  // Filtered & Sorted projects for list table
  const processedProjects = projects
    .filter((p) => {
      const matchesCategory = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
      const matchesSearch = 
        p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'title') return (isAr ? a.titleAr : a.titleEn).localeCompare(isAr ? b.titleAr : b.titleEn);
      return 0;
    });

  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#94A3B8]">
          <i className="fa-solid fa-shield-halved text-xl text-[#FF1E27] animate-pulse"></i>
          <span>{isAr ? 'جاري التحقق من أمان الجلسة الخادِمية...' : 'Verifying secure session token...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] font-sans antialiased py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation back to site & Topbar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link 
            href="/" 
            className="text-sm font-semibold text-[#94A3B8] hover:text-[#FF1E27] flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>{isAr ? 'العودة للموقع الرئيسي' : 'Back to Website'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              <i className="fa-solid fa-lock text-[#25D366]"></i>
              <span>E-MEP CMS Pro v4.0 (Server Secured & Encrypted)</span>
            </span>
          </div>
        </div>

        {/* 1. Login Screen */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto mt-16">
            <div className="glass-panel p-8 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] to-[#FF1E27]"></div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Image src="/logo/logo.png" alt="E-MEP Logo" width={48} height={48} className="w-12 h-12" priority />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  {isAr ? 'بوابة الإدارة المشفرة' : 'Secure CMS Portal'}
                </h1>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {isAr ? 'نظام تحكم آمن مع حماية جدارية ضد المحاولات العشوائية' : 'Encrypted server authentication & anti-bruteforce protection'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                <div>
                  <label htmlFor="admin_email" className="block text-xs font-bold uppercase mb-1.5 text-[#94A3B8]">
                    {isAr ? 'البريد الإلكتروني للإدارة' : 'Admin Email'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="admin_email"
                      name="admin_email_input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#131317] border border-white/10 rounded-md p-3 text-white focus:border-[#D31019] outline-none transition-colors pr-10 rtl:pl-10 rtl:pr-3 text-sm"
                      placeholder="admin@emep-egy.com"
                      autoComplete="username"
                      required
                    />
                    <i className="fa-solid fa-envelope absolute right-3 top-3.5 text-xs text-[#64748B] rtl:right-auto rtl:left-3"></i>
                  </div>
                </div>

                <div>
                  <label htmlFor="admin_pass" className="block text-xs font-bold uppercase mb-1.5 text-[#94A3B8]">
                    {isAr ? 'كلمة السر' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="admin_pass"
                      name="admin_pass_input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#131317] border border-white/10 rounded-md p-3 text-white focus:border-[#D31019] outline-none transition-colors pr-10 rtl:pl-10 rtl:pr-3 text-sm"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <i className="fa-solid fa-key absolute right-3 top-3.5 text-xs text-[#64748B] rtl:right-auto rtl:left-3"></i>
                  </div>
                </div>

                {loginError && (
                  <div className="text-xs font-semibold text-[#FF1E27] bg-[#FF1E27]/10 p-3 rounded-lg border border-[#FF1E27]/20 flex items-start gap-2 leading-relaxed">
                    <i className="fa-solid fa-shield-cat text-sm mt-0.5 flex-shrink-0"></i>
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 rounded font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>{isAr ? 'تسجيل الدخول (Supabase Auth)' : 'Login via Supabase Auth'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          
          /* 2. Authenticated Dashboard State */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Bar Header */}
            <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Image src="/logo/logo.png" alt="E-MEP Logo" width={48} height={48} className="w-12 h-12" priority />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {isAr ? 'مركز إدارة وتطوير المحتوى الكهروميكانيكي' : 'Electromechanical CMS Dashboard'}
                  </h1>
                  <p className="text-xs text-[#94A3B8]">
                    {isAr ? 'رفع الصور المباشر، الروابط الخارجية، التعديل والحذف وتصدير النسخ الاحتياطية' : 'Direct file uploads, external web URLs, project CRUD & JSON backups'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Backup & Logout */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="btn bg-white/5 border border-white/10 hover:border-white/30 text-white text-xs py-2 px-3 rounded font-semibold flex items-center gap-1.5"
                  title={isAr ? 'تحميل نسخة احتياطية من قاعدة البيانات' : 'Download JSON database backup'}
                >
                  <i className="fa-solid fa-download text-[#25D366]"></i>
                  <span>{isAr ? 'تصدير نسخة احتياطية' : 'Export Backup'}</span>
                </button>

                <label className="btn bg-white/5 border border-white/10 hover:border-white/30 text-white text-xs py-2 px-3 rounded font-semibold cursor-pointer flex items-center gap-1.5">
                  <i className="fa-solid fa-upload text-[#3B82F6]"></i>
                  <span>{isAr ? 'استعادة نسخة' : 'Restore Backup'}</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm hover:bg-[#FF1E27]/10 hover:border-[#FF1E27] hover:text-[#FF1E27] py-2 px-3 rounded text-xs font-bold"
                >
                  <i className="fa-solid fa-right-from-bracket mr-1.5 rtl:ml-1.5"></i>
                  <span>{isAr ? 'خروج' : 'Logout'}</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-xs text-[#94A3B8] block mb-1">{isAr ? 'إجمالي المشاريع' : 'Total Projects'}</span>
                <span className="text-2xl font-black text-white">{projects.length}</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-xs text-[#94A3B8] block mb-1">{isAr ? 'متاجر وموضة' : 'Retail'}</span>
                <span className="text-2xl font-black text-[#FF1E27]">
                  {projects.filter(p => p.category === 'retail').length}
                </span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-xs text-[#94A3B8] block mb-1">{isAr ? 'مطاعم وكافيهات' : 'Dining'}</span>
                <span className="text-2xl font-black text-[#25D366]">
                  {projects.filter(p => p.category === 'dining').length}
                </span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-xs text-[#94A3B8] block mb-1">{isAr ? 'معارض وتكنولوجيا' : 'Showrooms'}</span>
                <span className="text-2xl font-black text-[#3B82F6]">
                  {projects.filter(p => p.category === 'showrooms').length}
                </span>
              </div>
            </div>

            {/* Notifications Alert Banner */}
            {actionSuccess && (
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-lg"></i>
                  <span>{actionSuccess}</span>
                </div>
                <button type="button" onClick={() => setActionSuccess('')} className="text-white/50 hover:text-white">&times;</button>
              </div>
            )}

            {actionError && (
              <div className="bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                  <span>{actionError}</span>
                </div>
                <button type="button" onClick={() => setActionError('')} className="text-white/50 hover:text-white">&times;</button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Section (5 Cols) */}
              <div className="lg:col-span-5" id="projectFormSection">
                <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden shadow-2xl lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto custom-scrollbar">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${editingId ? 'bg-[#3B82F6]' : 'bg-[#D31019]'}`}></div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <i className={`fa-solid ${editingId ? 'fa-pen-to-square text-[#3B82F6]' : 'fa-plus-circle text-[#FF1E27]'}`}></i>
                      <span>
                        {editingId 
                          ? (isAr ? `تعديل مشروع #${editingId}` : `Edit Project #${editingId}`)
                          : (isAr ? 'إضافة مشروع جديد' : 'Add New Project')}
                      </span>
                    </h2>

                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-[#94A3B8] hover:text-white underline bg-white/5 px-2.5 py-1 rounded"
                      >
                        {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitProject} className="space-y-4">
                    
                    {/* Category Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] mb-1.5 uppercase">
                        {isAr ? 'قسم المشروع' : 'Project Category'}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-[#131317] border border-white/10 rounded p-2.5 text-sm text-white focus:border-[#D31019] outline-none cursor-pointer"
                      >
                        <option value="retail">Retail (متاجر وتجهيزات دقيقة)</option>
                        <option value="dining">Dining (مطاعم وكافيهات)</option>
                        <option value="showrooms">Showrooms (معارض وتكنولوجيا)</option>
                      </select>
                    </div>

                    {/* Titles */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#94A3B8] mb-1 uppercase">
                          عنوان المشروع (العربية) <span className="text-[#FF1E27]">*</span>
                        </label>
                        <input
                          type="text"
                          value={titleAr}
                          onChange={(e) => setTitleAr(e.target.value)}
                          className={`w-full bg-[#131317] border ${formErrors.titleAr ? 'border-[#FF1E27]' : 'border-white/10'} rounded p-2.5 text-sm text-white focus:border-[#D31019] outline-none`}
                          placeholder="مثال: معرض زيكر للسيارات"
                        />
                        {formErrors.titleAr && <span className="text-[10px] text-[#FF1E27] mt-1 block">{formErrors.titleAr}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#94A3B8] mb-1 uppercase">
                          Project Title (English) <span className="text-[#FF1E27]">*</span>
                        </label>
                        <input
                          type="text"
                          value={titleEn}
                          onChange={(e) => setTitleEn(e.target.value)}
                          className={`w-full bg-[#131317] border ${formErrors.titleEn ? 'border-[#FF1E27]' : 'border-white/10'} rounded p-2.5 text-sm text-white focus:border-[#D31019] outline-none`}
                          placeholder="e.g. ZEEKR Showroom"
                        />
                        {formErrors.titleEn && <span className="text-[10px] text-[#FF1E27] mt-1 block">{formErrors.titleEn}</span>}
                      </div>
                    </div>

                    {/* MULTI-MODE IMAGE SELECTION */}
                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-[#94A3B8] uppercase">
                          {isAr ? 'صورة المشروع (اختر طريقة الرفع)' : 'Project Image (Choose Method)'}
                        </label>
                      </div>

                      {/* Mode Selector Tabs */}
                      <div className="grid grid-cols-3 gap-1 bg-[#131317] p-1 rounded-lg border border-white/10 text-[11px] font-semibold text-center">
                        <button
                          type="button"
                          onClick={() => setImageMode('upload')}
                          className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 ${imageMode === 'upload' ? 'bg-[#D31019] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                        >
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          <span>{isAr ? 'رفع ملف' : 'Upload'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode('url')}
                          className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 ${imageMode === 'url' ? 'bg-[#D31019] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                        >
                          <i className="fa-solid fa-link"></i>
                          <span>{isAr ? 'رابط خارجي' : 'Web URL'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode('preset')}
                          className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 ${imageMode === 'preset' ? 'bg-[#D31019] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                        >
                          <i className="fa-solid fa-images"></i>
                          <span>{isAr ? 'المعرض' : 'Preset'}</span>
                        </button>
                      </div>

                      {/* Mode 1: File Upload */}
                      {imageMode === 'upload' && (
                        <div className="space-y-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="projectFileInput"
                          />
                          <label
                            htmlFor="projectFileInput"
                            className="w-full bg-[#131317] hover:bg-[#1A1A22] border-2 border-dashed border-white/20 hover:border-[#FF1E27] rounded-lg p-4 text-center cursor-pointer block transition-colors"
                          >
                            {isUploading ? (
                              <div className="flex items-center justify-center gap-2 text-xs text-[#FF1E27]">
                                <i className="fa-solid fa-spinner animate-spin"></i>
                                <span>{isAr ? 'جاري رفع الملف إلى الخادم...' : 'Uploading image to server...'}</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <i className="fa-solid fa-folder-open text-xl text-[#FF1E27]"></i>
                                <span className="block text-xs font-semibold text-white">
                                  {isAr ? 'اضغط لاختيار صورة من جهازك / موبايلك' : 'Click to browse image from your device'}
                                </span>
                                <span className="block text-[10px] text-[#64748B]">
                                  PNG, JPG, WEBP, AVIF (Max 10MB)
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                      )}

                      {/* Mode 2: External Web URL */}
                      {imageMode === 'url' && (
                        <div>
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-[#131317] border border-white/10 rounded p-2.5 text-xs text-white focus:border-[#D31019] outline-none"
                            placeholder="https://images.unsplash.com/... or external image URL"
                          />
                          <span className="text-[10px] text-[#64748B] mt-1 block">
                            {isAr ? 'الصق أي رابط صورة مباشر من خارج الموقع' : 'Paste any direct image URL from web'}
                          </span>
                        </div>
                      )}

                      {/* Mode 3: Gallery Presets */}
                      {imageMode === 'preset' && (
                        <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1 bg-[#131317] rounded border border-white/10">
                          {presetImages.map((img, i) => (
                            <button
                              type="button"
                              key={i}
                              onClick={() => setImageUrl(img)}
                              className={`h-12 rounded overflow-hidden border transition-all ${imageUrl === img ? 'border-[#FF1E27] ring-2 ring-[#FF1E27]' : 'border-white/10 hover:border-white/40'}`}
                            >
                              <Image src={img} alt="Preset" width={80} height={48} className="w-full h-full object-cover" unoptimized />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Selected Image Real-Time Thumbnail Preview */}
                      {imageUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black h-24 flex items-center justify-center group">
                          <Image src={imageUrl} alt="Project Preview" width={300} height={96} className="w-full h-full object-cover" unoptimized />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3 text-xs text-white">
                            <span className="truncate max-w-[200px] text-[10px] font-mono">{imageUrl}</span>
                            <button
                              type="button"
                              onClick={() => setImageUrl('')}
                              className="text-[#FF1E27] hover:underline font-bold"
                            >
                              {isAr ? 'إزالة' : 'Remove'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#94A3B8] mb-1 uppercase">
                          وصف المشروع (العربية) <span className="text-[#FF1E27]">*</span>
                        </label>
                        <textarea
                          rows={2}
                          value={descAr}
                          onChange={(e) => setDescAr(e.target.value)}
                          className={`w-full bg-[#131317] border ${formErrors.descAr ? 'border-[#FF1E27]' : 'border-white/10'} rounded p-2.5 text-xs text-white focus:border-[#D31019] outline-none resize-none`}
                          placeholder="اكتب تفاصيل الأعمال الكهروميكانيكية المنفذة..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#94A3B8] mb-1 uppercase">
                          Description (English) <span className="text-[#FF1E27]">*</span>
                        </label>
                        <textarea
                          rows={2}
                          value={descEn}
                          onChange={(e) => setDescEn(e.target.value)}
                          className={`w-full bg-[#131317] border ${formErrors.descEn ? 'border-[#FF1E27]' : 'border-white/10'} rounded p-2.5 text-xs text-white focus:border-[#D31019] outline-none resize-none`}
                          placeholder="Provide electromechanical scope details..."
                        />
                      </div>
                    </div>

                    {/* Category Labels */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-[#94A3B8] mb-1 uppercase">
                          تسمية القسم (عربي)
                        </label>
                        <input
                          type="text"
                          value={catAr}
                          onChange={(e) => setCatAr(e.target.value)}
                          className="w-full bg-[#131317] border border-white/10 rounded p-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#94A3B8] mb-1 uppercase">
                          Cat Label (EN)
                        </label>
                        <input
                          type="text"
                          value={catEn}
                          onChange={(e) => setCatEn(e.target.value)}
                          className="w-full bg-[#131317] border border-white/10 rounded p-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className={`btn ${editingId ? 'bg-[#3B82F6] hover:bg-[#2563EB]' : 'btn-primary'} w-full py-3 rounded font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg`}
                      >
                        {isSubmitting ? (
                          <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                          <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-save'}`}></i>
                        )}
                        <span>
                          {editingId 
                            ? (isAr ? 'حفظ التعديلات' : 'Save Changes')
                            : (isAr ? 'إضافة ونشر المشروع' : 'Save & Publish')}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Projects List & Management Table (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Search & Category Filter Controls */}
                <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <i className="fa-solid fa-search absolute left-3 top-3 text-xs text-[#94A3B8] rtl:left-auto rtl:right-3"></i>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isAr ? 'بحث باسم المشروع...' : 'Search by title...'}
                        className="w-full bg-[#131317] border border-white/10 rounded-lg pl-9 pr-3 py-2 rtl:pr-9 rtl:pl-3 text-xs text-white outline-none focus:border-[#FF1E27]"
                      />
                    </div>

                    {/* Sorting dropdown */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-[#94A3B8] flex-shrink-0">{isAr ? 'ترتيب:' : 'Sort:'}</span>
                      <select
                        value={sortBy}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                        className="bg-[#131317] border border-white/10 rounded-lg text-xs text-white p-2 outline-none cursor-pointer w-full sm:w-auto"
                      >
                        <option value="newest">{isAr ? 'الأحدث أولاً' : 'Newest First'}</option>
                        <option value="oldest">{isAr ? 'الأقدم أولاً' : 'Oldest First'}</option>
                        <option value="title">{isAr ? 'أبجدياً' : 'Alphabetical'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1 bg-[#131317] p-1 rounded-lg border border-white/5 text-xs justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded font-semibold transition-colors ${activeCategoryFilter === 'all' ? 'bg-[#FF1E27] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {isAr ? 'جميع المشروعات' : 'All Projects'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('retail')}
                      className={`px-3 py-1.5 rounded font-semibold transition-colors ${activeCategoryFilter === 'retail' ? 'bg-[#FF1E27] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {isAr ? 'متاجر' : 'Retail'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('dining')}
                      className={`px-3 py-1.5 rounded font-semibold transition-colors ${activeCategoryFilter === 'dining' ? 'bg-[#FF1E27] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {isAr ? 'مطاعم' : 'Dining'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('showrooms')}
                      className={`px-3 py-1.5 rounded font-semibold transition-colors ${activeCategoryFilter === 'showrooms' ? 'bg-[#FF1E27] text-white' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {isAr ? 'معارض' : 'Showrooms'}
                    </button>
                  </div>
                </div>

                {/* Projects List Card Container */}
                <div className="glass-panel p-4 rounded-xl border border-white/10 min-h-[500px] lg:max-h-[calc(100vh-230px)] lg:overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <i className="fa-solid fa-list-check text-[#FF1E27]"></i>
                      <span>{isAr ? 'دليل مشاريع الشركة' : 'Project Directory'}</span>
                    </h3>
                    <span className="text-xs text-[#94A3B8]">
                      {isAr ? `عرض ${processedProjects.length} من ${projects.length}` : `Showing ${processedProjects.length} of ${projects.length}`}
                    </span>
                  </div>

                  {isLoadingProjects ? (
                    <div className="flex justify-center items-center py-20 text-white/50">
                      <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                    </div>
                  ) : processedProjects.length === 0 ? (
                    <div className="text-center py-16 text-[#94A3B8]">
                      <i className="fa-solid fa-folder-open text-4xl mb-3 block text-white/20"></i>
                      <p className="text-sm">{isAr ? 'لم يتم العثور على أي مشاريع مطابقة' : 'No matching projects found'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {processedProjects.map((p) => (
                        <div 
                          key={p.id} 
                          className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${editingId === p.id ? 'bg-[#3B82F6]/10 border-[#3B82F6]' : 'bg-white/5 border-white/5 hover:border-white/15'}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Image 
                              src={p.image} 
                              alt={p.titleEn} 
                              width={56}
                              height={56}
                              unoptimized
                              className="w-14 h-14 object-cover rounded-md flex-shrink-0 border border-white/10" 
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-white truncate">
                                  {isAr ? p.titleAr : p.titleEn}
                                </h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.category === 'retail' ? 'bg-[#FF1E27]/20 text-[#FF1E27]' : p.category === 'dining' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-[#3B82F6]/20 text-[#3B82F6]'}`}>
                                  {p.category}
                                </span>
                              </div>
                              <p className="text-xs text-[#94A3B8] line-clamp-1">
                                {isAr ? p.descAr : p.descEn}
                              </p>
                              <span className="text-[10px] text-[#64748B] block mt-0.5">
                                #{p.id} • {isAr ? p.titleEn : p.titleAr}
                              </span>
                            </div>
                          </div>

                          {/* Actions: Edit & Delete Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => startEditProject(p)}
                              className="px-3 py-1.5 rounded text-xs font-semibold bg-[#3B82F6]/15 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors flex items-center gap-1"
                              title={isAr ? 'تعديل البيانات' : 'Edit details'}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                              <span>{isAr ? 'تعديل' : 'Edit'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingProject(p)}
                              className="px-3 py-1.5 rounded text-xs font-semibold bg-[#FF1E27]/15 text-[#FF1E27] hover:bg-[#FF1E27] hover:text-white transition-colors flex items-center gap-1"
                              title={isAr ? 'حذف المشروع' : 'Delete project'}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                              <span>{isAr ? 'حذف' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-md w-full text-center space-y-4 animate-scaleUp shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] flex items-center justify-center mx-auto text-xl">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isAr ? 'تأكيد حذف المشروع' : 'Confirm Project Deletion'}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                  {isAr 
                    ? `هل أنت تأكد من إزالة مشروع "${deletingProject.titleAr}" نهائياً من قاعدة البيانات والمعرض الرئيسي؟` 
                    : `Are you sure you want to permanently remove "${deletingProject.titleEn}" from the portfolio database?`}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProject(null)}
                  className="btn btn-outline w-full py-2.5 rounded text-xs font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className="btn bg-[#FF1E27] hover:bg-[#D31019] text-white w-full py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2"
                >
                  {isDeleting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-trash-can"></i>}
                  <span>{isAr ? 'نعم، احذف المشروع' : 'Yes, Delete Project'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
