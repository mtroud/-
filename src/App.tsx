/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { 
  Utensils, 
  Flame, 
  Sparkles, 
  Beef, 
  Pizza, 
  Salad, 
  GlassWater, 
  ChefHat,
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Check, 
  Info, 
  Grid, 
  List, 
  Calculator, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Heart,
  Settings,
  Lock,
  Unlock,
  Edit,
  Save,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MENU_DATA, RESTAURANT_INFO, MenuItem, MenuCategory } from "./data";
// @ts-ignore
import heroImage from "./assets/images/hero_grills_1783234556633.jpg";

const formatPrice = (num: number): string => {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function App() {
  // Persistent Menu Data state
  const [menuData, setMenuData] = useState<MenuCategory[]>(() => {
    const local = localStorage.getItem("khayrat_menu_data");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Error loading local menu", e);
      }
    }
    return MENU_DATA;
  });

  // Save menuData to localStorage when changed
  useEffect(() => {
    localStorage.setItem("khayrat_menu_data", JSON.stringify(menuData));
  }, [menuData]);

  // Admin Dashboard States
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("khayrat_admin_logged_in") === "true";
  });
  const [adminTab, setAdminTab] = useState<"add" | "edit" | "settings">("add");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);

  // Admin Form fields state
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formPrice, setFormPrice] = useState<string>("");
  const [formPricesStr, setFormPricesStr] = useState<string>(""); // format: "سفري: 3000, صالة: 4000"
  const [formTagsStr, setFormTagsStr] = useState<string>(""); // format: "شعبية, تقليدي"
  const [formImage, setFormImage] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("rice-soup");

  // State for active category
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("all");
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  // Selected tag
  const [selectedTag, setSelectedTag] = useState<string>("all");
  // View mode: grid vs list
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Planner state (estimated bill calculator)
  const [plannerItems, setPlannerItems] = useState<Array<{
    id: string; // unique item-option combination
    item: MenuItem;
    selectedOption: string; // e.g. "داخل الصالة", "نفر كامل", "وسط", etc.
    price: number;
    quantity: number;
  }>>([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);
  // Detail modal item
  const [activeDetailItem, setActiveDetailItem] = useState<MenuItem | null>(null);
  // Favorites state (stored locally in memory for now)
  const [favorites, setFavorites] = useState<string[]>([]);
  // "اطمئن" (Rest assured) detail popup
  const [showAssurance, setShowAssurance] = useState<boolean>(false);
  // Success toast for additions
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Table number state
  const [tableNumber, setTableNumber] = useState<string>(() => localStorage.getItem("table_number") || "");

  // Persist table number
  useEffect(() => {
    localStorage.setItem("table_number", tableNumber);
  }, [tableNumber]);

  // Admin Event Handlers
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "1234") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("khayrat_admin_logged_in", "true");
      setAdminPassword("");
      setLoginError(null);
    } else {
      setLoginError("رمز المرور خاطئ! يرجى استخدام 1234 لتجربة لوحة التحكم.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem("khayrat_admin_logged_in", "false");
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormPricesStr("");
    setFormTagsStr("");
    setFormImage("");
    setFormCategory("rice-soup");
    setEditingItemId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      return;
    }

    // Parse prices
    let parsedPrices: { [key: string]: number } | undefined = undefined;
    if (formPricesStr.trim()) {
      parsedPrices = {};
      const pairs = formPricesStr.split(",");
      pairs.forEach(pair => {
        const parts = pair.split(":");
        if (parts.length === 2) {
          const opt = parts[0].trim();
          const pr = parseInt(parts[1].trim());
          if (opt && !isNaN(pr)) {
            parsedPrices![opt] = pr;
          }
        }
      });
      if (Object.keys(parsedPrices).length === 0) {
        parsedPrices = undefined;
      }
    }

    // Parse tags
    const parsedTags = formTagsStr.split(",").map(t => t.trim()).filter(t => t !== "");

    // Prepare MenuItem
    const targetId = editingItemId || `custom-item-${Date.now()}`;
    const newItem: MenuItem = {
      id: targetId,
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      price: formPrice.trim() ? parseInt(formPrice) : undefined,
      prices: parsedPrices,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      image: formImage.trim() || undefined,
    };

    setMenuData(prev => {
      // If editing, we remove from the previous category if it changed
      let cleaned = prev.map(cat => {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== targetId)
        };
      });

      // Add to the selected category
      return cleaned.map(cat => {
        if (cat.id === formCategory) {
          return {
            ...cat,
            items: [...cat.items, newItem]
          };
        }
        return cat;
      });
    });

    // Clear form
    const wasEditing = !!editingItemId;
    resetForm();
    setToastMessage(wasEditing ? "تم تعديل الوجبة بنجاح!" : "تم إضافة الوجبة الجديدة للمنيو!");
    setAdminTab("edit");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleEditClick = (item: MenuItem, catId: string) => {
    setEditingItemId(item.id);
    setFormName(item.name);
    setFormDescription(item.description || "");
    setFormPrice(item.price ? String(item.price) : "");
    setFormCategory(catId);
    
    // Convert prices object back to string representation
    if (item.prices) {
      const pStr = Object.entries(item.prices)
        .map(([opt, pr]) => `${opt}: ${pr}`)
        .join(", ");
      setFormPricesStr(pStr);
    } else {
      setFormPricesStr("");
    }

    // Convert tags back to string representation
    if (item.tags) {
      setFormTagsStr(item.tags.join(", "));
    } else {
      setFormTagsStr("");
    }

    setFormImage(item.image || "");
    setAdminTab("add"); // Switch to form tab for editing
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuData(prev => {
      return prev.map(cat => {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      });
    });
    setDeleteConfirmId(null);
    setToastMessage("تم حذف الوجبة بنجاح من المنيو.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleResetMenu = () => {
    setMenuData(MENU_DATA);
    localStorage.removeItem("khayrat_menu_data");
    resetForm();
    setResetConfirm(false);
    setToastMessage("تم استعادة المنيو الافتراضي الأصلي.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Get active icon component
  const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Utensils": return <Utensils className={className} />;
      case "Flame": return <Flame className={className} />;
      case "Sparkles": return <Sparkles className={className} />;
      case "Beef": return <Beef className={className} />;
      case "Pizza": return <Pizza className={className} />;
      case "Salad": return <Salad className={className} />;
      case "GlassWater": return <GlassWater className={className} />;
      case "ChefHat": return <ChefHat className={className} />;
      default: return <Utensils className={className} />;
    }
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    menuData.forEach(cat => {
      cat.items.forEach(item => {
        if (item.tags) {
          item.tags.forEach(tag => tagsSet.add(tag));
        }
      });
    });
    return Array.from(tagsSet);
  }, [menuData]);

  // Filter items based on Category, Search query and Tags
  const filteredCategories = useMemo(() => {
    return menuData.map(category => {
      // If we selected a category, skip others
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return { ...category, items: [] };
      }

      const matchingItems = category.items.filter(item => {
        // Tag filter
        if (selectedTag !== "all" && (!item.tags || !item.tags.includes(selectedTag))) {
          return false;
        }

        // Search query filter
        if (searchInputValue.trim() !== "") {
          const query = searchInputValue.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(query);
          const descMatch = item.description?.toLowerCase().includes(query) || false;
          const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
          const categoryMatch = category.name.toLowerCase().includes(query);
          return nameMatch || descMatch || tagMatch || categoryMatch;
        }

        return true;
      });

      return {
        ...category,
        items: matchingItems
      };
    }).filter(category => category.items.length > 0);
  }, [selectedCategory, searchInputValue, selectedTag, menuData]);

  // Handle addition to planner
  const addToPlanner = (item: MenuItem, optionKey?: string) => {
    let price = item.price || 0;
    let optionLabel = "وجبة";

    if (item.prices) {
      const keys = Object.keys(item.prices);
      const selectedKey = optionKey || keys[0];
      price = item.prices[selectedKey];
      optionLabel = selectedKey;
    }

    const plannerId = `${item.id}-${optionLabel}`;

    setPlannerItems(prev => {
      const existing = prev.find(p => p.id === plannerId);
      if (existing) {
        return prev.map(p => p.id === plannerId ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { id: plannerId, item, selectedOption: optionLabel, price, quantity: 1 }];
    });

    // Trigger feedback toast
    setToastMessage(`تم إضافة ${item.name} (${optionLabel}) إلى حاسبة الوجبة`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Remove item from planner
  const removeFromPlanner = (plannerId: string) => {
    setPlannerItems(prev => prev.filter(p => p.id !== plannerId));
  };

  // Adjust quantity in planner
  const updateQuantity = (plannerId: string, delta: number) => {
    setPlannerItems(prev => {
      return prev.map(p => {
        if (p.id === plannerId) {
          const newQty = p.quantity + delta;
          return newQty > 0 ? { ...p, quantity: newQty } : p;
        }
        return p;
      });
    });
  };

  // Toggle favorite
  const toggleFavorite = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // Total estimation calculator
  const totalEstimation = useMemo(() => {
    return plannerItems.reduce((sum, current) => sum + (current.price * current.quantity), 0);
  }, [plannerItems]);

  // Total quantity of items planned
  const totalPlannedCount = useMemo(() => {
    return plannerItems.reduce((sum, current) => sum + current.quantity, 0);
  }, [plannerItems]);

  // Share menu link
  const shareMenu = () => {
    if (navigator.share) {
      navigator.share({
        title: 'منيو مطعم خيرات الوارث',
        text: 'تصفح قائمة الطعام الإلكترونية الرسمية لمطعم خيرات الوارث',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("تم نسخ رابط المنيو لمشاركته!");
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen font-serif antialiased selection:bg-brand-gold/30 selection:text-brand-text overflow-x-hidden" dir="rtl">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-gold/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[400px] -right-40 w-96 h-96 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[1000px] -left-40 w-96 h-96 rounded-full bg-brand-gold/3 blur-[120px] pointer-events-none" />

      {/* --- HERO BANNER & HEADER --- */}
      <header className="relative w-full z-10">
        {/* Banner image wrapper */}
        <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
          <img 
            src={heroImage} 
            alt="مطعم خيرات الوارث" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-50 contrast-110"
            referrerPolicy="no-referrer"
          />
          {/* Gradients to blend banner to brand bg */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-brand-bg/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/40 via-transparent to-transparent" />
        </div>

        {/* Brand floating container */}
        <div className="max-w-6xl mx-auto px-4 -mt-36 md:-mt-48 relative text-center pb-8 border-b border-brand-border">
          
          {/* Logo emblem */}
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-bg border-2 border-brand-gold shadow-2xl shadow-brand-gold/10 p-1 mb-4 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 via-transparent to-brand-gold/10 animated-pulse" />
            {RESTAURANT_INFO.logoUrl ? (
              <img 
                src={RESTAURANT_INFO.logoUrl} 
                alt={RESTAURANT_INFO.name}
                className="w-full h-full rounded-full object-cover p-1 bg-brand-bg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-full border border-brand-gold/30 flex flex-col items-center justify-center bg-brand-bg">
                <span className="text-brand-gold font-extrabold text-2xl md:text-3xl tracking-tighter">الوارث</span>
                <span className="text-[10px] md:text-xs text-brand-muted tracking-widest font-light -mt-1">{RESTAURANT_INFO.subtitle}</span>
              </div>
            )}
            {/* Symmetrical glowing corner rings */}
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-gold/80 animate-ping" />
          </div>

          {/* Restaurant name & welcome */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-l from-brand-text via-[#f3f0e8] to-brand-gold tracking-tight mb-2 font-serif"
          >
            {RESTAURANT_INFO.name}
          </motion.h1>

          <p className="text-brand-text/90 text-sm md:text-base font-light max-w-2xl mx-auto mb-4 tracking-wide px-4 italic font-serif">
            {RESTAURANT_INFO.welcomeMessage}
          </p>

          {/* Slogan */}
          <div className="bg-brand-border/10 border border-brand-border rounded-lg px-5 py-2 inline-flex items-center gap-2 max-w-xl mx-auto mb-6 text-xs md:text-sm shadow-inner text-brand-gold/90 backdrop-blur-sm font-serif">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shrink-0" />
            <span>{RESTAURANT_INFO.slogan}</span>
          </div>

          {/* Metadata chips (Hours, Location, Phone, Assurance) */}
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs md:text-sm text-brand-muted font-sans">
            <div className="flex items-center gap-1.5 bg-brand-bg/80 border border-brand-border rounded-lg px-3.5 py-1.5 shadow-sm">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>{RESTAURANT_INFO.workingHours}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-bg/80 border border-brand-border rounded-lg px-3.5 py-1.5 shadow-sm">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span>{RESTAURANT_INFO.location}</span>
            </div>
            
            {/* "اطمئن" clickable safety badge */}
            <button 
              onClick={() => setShowAssurance(true)}
              className="flex items-center gap-1.5 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-lg px-3.5 py-1.5 shadow-sm transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-bold">{RESTAURANT_INFO.badgeText}</span>
              <Info className="w-3.5 h-3.5 opacity-75" />
            </button>

            {/* Share menu button */}
            <button 
              onClick={shareMenu}
              className="flex items-center gap-1.5 bg-brand-bg/80 hover:bg-brand-border/30 border border-brand-border text-brand-text rounded-lg px-3.5 py-1.5 shadow-sm transition-all cursor-pointer"
              title="مشاركة المنيو"
            >
              <Share2 className="w-4 h-4 text-brand-gold" />
              <span>مشاركة</span>
            </button>
          </div>

        </div>
      </header>

      {/* --- CORE MENU EXPERIENCE --- */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10 min-h-[600px]">
        
        {/* CASHIER REMINDER BANNER */}
        <div className="mb-6 bg-brand-gold/5 border border-brand-gold/25 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-xl backdrop-blur-sm border-dashed">
          <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/30 animate-pulse">
            <Info className="w-6 h-6" />
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-base font-bold text-brand-gold font-serif mb-1">💡 تنبيه وتذكير للطلب:</h4>
            <p className="text-xs md:text-sm text-brand-text/90 leading-relaxed font-serif italic">
              هذا الموقع مخصص لتصفح المنيو وحساب التكلفة التقديرية فقط. 
              <span className="font-bold text-brand-gold"> عند الانتهاء من اختيار وجباتك وتحديدها، يرجى التوجه مباشرة إلى الكاشير لتقديم طلبك وإتمام عملية الشراء.</span>
            </p>
          </div>
        </div>

        {/* TABLE NUMBER SELECTION */}
        <div className="mb-6 bg-brand-bg border border-brand-border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/20 font-bold shrink-0">
              #
            </div>
            <div className="text-right">
              <h4 className="text-sm font-bold text-brand-text font-serif">رقم طاولة الجلوس</h4>
              <p className="text-xs text-brand-muted">أدخل رقم طاولتك لتضمينه عند مشاركة وحساب الفاتورة</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <input 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="مثال: 12"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full sm:w-32 bg-brand-bg text-brand-text font-sans font-bold px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 text-center text-base transition-all placeholder:text-brand-muted/50"
            />
            {tableNumber && (
              <button 
                onClick={() => setTableNumber("")}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 cursor-pointer text-xs shrink-0"
                title="مسح رقم الطاولة"
              >
                مسح
              </button>
            )}
          </div>
        </div>
        
        {/* INTERACTIVE NAVIGATION CONTROL PANEL */}
        <section className="mb-8 sticky top-2 z-30">
          <div className="bg-brand-bg/95 border border-brand-border rounded-2xl p-4 shadow-2xl backdrop-blur-md">
            
            {/* Search and view toggle row */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
              
              {/* Search input bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input 
                  type="text" 
                  placeholder="ابحث عن وجبة، صنف، أو مكوّن..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="w-full bg-brand-bg text-brand-text pr-10 pl-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 text-sm transition-all placeholder:text-brand-muted/70 font-sans"
                />
                {searchInputValue && (
                  <button 
                    onClick={() => setSearchInputValue("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtering Controls and View Mode */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* View switcher */}
                <div className="flex bg-brand-bg p-1 rounded-xl border border-brand-border text-brand-muted text-xs font-semibold font-sans">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-brand-gold text-brand-bg font-bold shadow" : "hover:text-brand-text"}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>بطاقات</span>
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-brand-gold text-brand-bg font-bold shadow" : "hover:text-brand-text"}`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>تقليدي دقيق</span>
                  </button>
                </div>

                {/* Estimate Calculator Quick Toggle */}
                <button 
                  onClick={() => setIsPlannerOpen(!isPlannerOpen)}
                  className="relative flex items-center gap-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition-all cursor-pointer font-sans"
                >
                  <Calculator className="w-4 h-4" />
                  <span>حاسبة الفاتورة</span>
                  {totalPlannedCount > 0 && (
                    <span className="absolute -top-2.5 -left-2 bg-brand-gold text-brand-bg text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse border border-brand-bg">
                      {totalPlannedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Scrolling categories list */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-thin scrollbar-thumb-brand-gold/20 font-sans">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${selectedCategory === "all" ? "bg-brand-gold text-brand-bg border-brand-gold shadow-lg shadow-brand-gold/10" : "bg-brand-bg text-brand-muted border-brand-border hover:border-brand-muted hover:text-brand-text"}`}
              >
                <Utensils className="w-4 h-4" />
                <span>الكل ({menuData.reduce((sum, c) => sum + c.items.length, 0)})</span>
              </button>

              {menuData.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${selectedCategory === category.id ? "bg-brand-gold text-brand-bg border-brand-gold shadow-lg shadow-brand-gold/10" : "bg-brand-bg text-brand-muted border-brand-border hover:border-brand-muted hover:text-brand-text"}`}
                >
                  {getCategoryIcon(category.iconName, "w-4 h-4")}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Tag Pills Row (Only if search input is empty) */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-border/50 overflow-x-auto font-sans">
                <span className="text-xs text-brand-muted font-semibold shrink-0">تصنيفات سريعة:</span>
                <button 
                  onClick={() => setSelectedTag("all")}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${selectedTag === "all" ? "bg-brand-text text-brand-bg" : "bg-brand-bg text-brand-muted border border-brand-border hover:text-brand-text"}`}
                >
                  الجميع
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${selectedTag === tag ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30" : "bg-brand-bg text-brand-muted border border-brand-border/80 hover:text-brand-text"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* --- DYNAMIC DISHES LISTINGS --- */}
        <div className="space-y-12">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 bg-brand-bg/20 rounded-3xl border border-brand-border">
              <Search className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-brand-text mb-1">لم نجد أي وجبة تطابق بحثك</h3>
              <p className="text-sm text-brand-muted">جرب البحث بكلمات أخرى مثل "كباب"، "بيتزا" أو "كنتاكي"</p>
              <button 
                onClick={() => { setSearchInputValue(""); setSelectedCategory("all"); setSelectedTag("all"); }}
                className="mt-4 px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
              >
                إعادة ضبط القائمة
              </button>
            </div>
          ) : (
            filteredCategories.map(category => (
              <motion.section 
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="scroll-mt-32"
                id={`sec-${category.id}`}
              >
                
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-brand-border relative">
                  <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
                    {getCategoryIcon(category.iconName, "w-6 h-6")}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-light text-brand-text font-serif">{category.name}</h2>
                    <p className="text-xs text-brand-muted italic font-serif">مجموعة متميزة ولذيذة طازجة يومياً</p>
                  </div>
                  <span className="mr-auto text-xs font-bold text-brand-muted bg-brand-bg border border-brand-border px-2.5 py-1 rounded-full font-sans">
                    {category.items.length} وجبة
                  </span>
                </div>

                {/* Categories Grid or List view */}
                {viewMode === "grid" ? (
                  
                  // BENTO GRID CARD LAYOUT
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map(item => {
                      const isFav = favorites.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          className="bg-brand-bg/40 hover:bg-brand-bg/70 border border-brand-border hover:border-brand-gold/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group shadow-lg hover:shadow-brand-gold/5 relative overflow-hidden"
                        >
                          {/* Corner ambient glow on hover */}
                          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-brand-gold/0 via-transparent to-transparent group-hover:from-brand-gold/[0.02] transition-all duration-300 pointer-events-none" />
                          
                          <div>
                            {/* Card Image */}
                            {item.image && (
                              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-4 bg-brand-bg border border-brand-border/60">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
                              </div>
                            )}

                            {/* Card Header & Favorite */}
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <h3 className="font-bold text-base md:text-lg text-brand-text group-hover:text-brand-gold transition-colors font-serif">
                                {item.name}
                              </h3>
                              <div className="flex gap-1.5 shrink-0 font-sans">
                                <button 
                                  onClick={(e) => toggleFavorite(item.id, e)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isFav ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-brand-bg text-brand-muted border-brand-border hover:text-rose-400 hover:border-rose-500/20"}`}
                                  title={isFav ? "إزالة من المفضلات" : "حفظ الوجبة"}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-400" : ""}`} />
                                </button>
                              </div>
                            </div>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3 font-sans">
                                {item.tags.map(t => (
                                  <span key={t} className="text-[9px] font-extrabold bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded-md">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Description */}
                            {item.description && (
                              <p className="text-xs text-brand-muted leading-relaxed mb-4 line-clamp-2 min-h-[32px] italic font-serif">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Pricing and Planner Adding area */}
                          <div className="pt-4 border-t border-brand-border/40 mt-auto">
                            {item.prices ? (
                              // Multiple pricing columns
                              <div className="space-y-2 mb-3">
                                <div className="text-[10px] text-brand-muted font-bold mb-1 font-sans">الخيارات والأسعار:</div>
                                {Object.entries(item.prices).map(([opt, pr]) => (
                                  <div key={opt} className="flex justify-between items-center text-xs bg-brand-bg/80 hover:bg-brand-bg p-2 rounded-xl border border-brand-border/50">
                                    <span className="text-brand-text font-semibold font-serif">{opt}</span>
                                    <div className="flex items-center gap-2 font-sans">
                                      <span className="text-brand-gold font-extrabold">{formatPrice(pr as number)} د.ع</span>
                                      <button 
                                        onClick={() => addToPlanner(item, opt)}
                                        className="p-1 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-bg text-brand-gold rounded-md transition-all cursor-pointer border border-brand-gold/20"
                                        title={`إضافة ${opt} إلى الحاسبة`}
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Single price item
                              <div className="flex justify-between items-center gap-3">
                                <div className="font-sans">
                                  <span className="text-[10px] text-brand-muted block font-bold">السعر:</span>
                                  <span className="text-brand-gold font-black text-lg font-serif">{formatPrice(item.price || 0)} <span className="text-xs font-semibold font-sans">د.ع</span></span>
                                </div>
                                
                                <button 
                                  onClick={() => addToPlanner(item)}
                                  className="flex items-center gap-1.5 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-bg text-brand-gold border border-brand-gold/20 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-sans"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>إضافة للحاسبة</span>
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  
                  // TRADITIONAL HIGH-DENSITY LIST LAYOUT
                  <div className="bg-brand-bg/20 border border-brand-border rounded-3xl p-6 space-y-5 shadow-lg">
                    {category.items.map(item => {
                      const isFav = favorites.includes(item.id);
                      return (
                        <div key={item.id} className="group pb-4 border-b border-brand-border/40 last:border-0 last:pb-0 flex gap-4 items-start">
                          
                          {/* List Item Thumbnail */}
                          {item.image && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-brand-border/80 bg-brand-bg">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {/* Row 1: Name, Dotted Leader, Price */}
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 justify-between">
                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  onClick={(e) => toggleFavorite(item.id, e)}
                                  className={`text-brand-muted hover:text-rose-400 transition-colors cursor-pointer`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-400 text-rose-400" : ""}`} />
                                </button>
                                <span className="font-bold text-brand-text group-hover:text-brand-gold transition-colors text-sm md:text-base font-serif">
                                  {item.name}
                                </span>
                              </div>
                              
                              {/* Dotted spacer leader */}
                              <div className="hidden sm:block flex-grow border-b border-dotted border-brand-border mx-2" />
                              
                              {/* Pricing area */}
                              <div className="shrink-0 text-right sm:text-left font-sans mt-1 sm:mt-0">
                                {item.prices ? (
                                  <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                    {Object.entries(item.prices).map(([opt, pr]) => (
                                      <div key={opt} className="inline-flex items-center gap-1.5 bg-brand-bg px-2 py-1 rounded-lg border border-brand-border text-xs">
                                        <span className="text-[10px] text-brand-muted font-serif">{opt}:</span>
                                        <span className="text-brand-gold font-extrabold">{formatPrice(pr as number)} د.ع</span>
                                        <button 
                                          onClick={() => addToPlanner(item, opt)}
                                          className="p-0.5 bg-brand-gold/10 text-brand-gold rounded hover:bg-brand-gold hover:text-brand-bg transition-all cursor-pointer"
                                          title={`إضافة ${opt} للحاسبة`}
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2.5 justify-start sm:justify-end">
                                    <span className="text-brand-gold font-black text-sm md:text-base font-serif">{formatPrice(item.price || 0)} د.ع</span>
                                    <button 
                                      onClick={() => addToPlanner(item)}
                                      className="p-1 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-bg text-brand-gold rounded-lg transition-all border border-brand-gold/20 cursor-pointer"
                                      title="إضافة للحاسبة"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Row 2: Tags & description */}
                            <div className="flex flex-wrap justify-between items-center gap-2 mt-1.5 pr-1.5">
                              {item.description && (
                                <p className="text-xs text-brand-muted max-w-xl font-serif italic">
                                  {item.description}
                                </p>
                              )}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 font-sans">
                                  {item.tags.map(t => (
                                    <span key={t} className="text-[9px] font-bold bg-brand-bg text-brand-muted px-1.5 py-0.5 rounded border border-brand-border/80">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                )}

              </motion.section>
            ))
          )}
        </div>

      </main>

      {/* --- FLOATING SUCCESS TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 right-6 md:left-12 md:right-auto bg-brand-bg border-2 border-brand-gold/40 text-brand-text px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 md:max-w-md"
            dir="rtl"
          >
            <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/30">
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs md:text-sm font-semibold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ESTIMATED BILL PLANNER DRAWER/ASIDE (حاسبة الفاتورة) --- */}
      <AnimatePresence>
        {isPlannerOpen && (
          <>
            {/* Backdrop for mobile overlay */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsPlannerOpen(false)}
            />

            {/* Planner drawer element */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 md:left-auto md:right-0 bottom-0 w-full md:w-[420px] bg-brand-bg border-t md:border-t-0 md:border-l border-brand-border z-50 shadow-2xl flex flex-col justify-between"
              dir="rtl"
            >
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-brand-border flex justify-between items-center bg-brand-bg/40">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 text-brand-gold" />
                  <div>
                    <h3 className="font-light text-lg text-brand-text font-serif">حاسبة الفاتورة التقديرية</h3>
                    <p className="text-[10px] text-brand-muted font-serif italic">خطط لوجبتك واحسب التكلفة قبل الطلب</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPlannerOpen(false)}
                  className="p-1.5 hover:bg-brand-border/40 rounded-lg text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Number indicator inside Drawer */}
              <div className="px-5 py-3 bg-brand-gold/5 border-b border-brand-border flex items-center justify-between text-xs font-serif">
                <span className="text-brand-muted">رقم طاولة الجلوس:</span>
                {tableNumber ? (
                  <span className="font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-lg border border-brand-gold/20 text-sm">
                    طاولة {tableNumber}
                  </span>
                ) : (
                  <span className="text-brand-muted/60 italic">(لم يتم إدخال رقم الطاولة)</span>
                )}
              </div>

              {/* Drawer Body - Items Planned */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {plannerItems.length === 0 ? (
                  <div className="text-center py-24 text-brand-muted">
                    <Calculator className="w-12 h-12 text-brand-muted/30 mx-auto mb-4" />
                    <h4 className="font-bold text-brand-muted mb-1 font-serif">الحاسبة فارغة</h4>
                    <p className="text-xs px-6 font-serif italic">تصفح المنيو واضغط على زر (+) أو (إضافة للحاسبة) لتخطيط وحساب وجبتك المفضلة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-brand-muted font-sans">الوجبات المحددة ({plannerItems.length})</span>
                      <button 
                        onClick={() => setPlannerItems([])}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>مسح الكل</span>
                      </button>
                    </div>

                    {plannerItems.map(item => (
                      <div 
                        key={item.id}
                        className="bg-brand-bg/60 border border-brand-border p-3 rounded-xl flex justify-between items-center gap-3 hover:border-brand-gold/30 transition-all"
                      >
                        {/* Title & selected option */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs md:text-sm text-brand-text truncate font-serif">{item.item.name}</h4>
                          <span className="inline-block mt-1 text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-1.5 py-0.5 rounded font-sans uppercase">
                            {item.selectedOption}
                          </span>
                          <span className="block mt-1 text-xs text-brand-muted font-sans font-bold">
                            {formatPrice(item.price * item.quantity)} د.ع
                          </span>
                        </div>

                        {/* Quantity adjusts */}
                        <div className="flex items-center gap-2 bg-brand-bg p-1 rounded-lg border border-brand-border shrink-0 font-sans">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-brand-border/40 text-brand-muted hover:text-brand-text rounded transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-brand-text w-5 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-brand-border/40 text-brand-muted hover:text-brand-text rounded transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Trash delete */}
                        <button 
                          onClick={() => removeFromPlanner(item.id)}
                          className="p-1.5 hover:bg-rose-950/40 text-brand-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 rounded-lg transition-all cursor-pointer shrink-0"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer & Total Calculations */}
              <div className="p-5 border-t border-brand-border bg-brand-bg/60 space-y-4">
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-brand-muted">
                    <span>العدد الإجمالي للمواد:</span>
                    <span className="font-bold text-brand-text">{totalPlannedCount} وجبة</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
                    <span className="text-sm font-bold text-brand-text">المجموع التقديري:</span>
                    <span className="text-xl font-black text-brand-gold">{formatPrice(totalEstimation)} د.ع</span>
                  </div>
                </div>

                {/* Important reminder about read-only menu */}
                <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-3.5 text-xs text-brand-gold/90 leading-relaxed font-serif">
                  <span className="font-extrabold text-brand-gold block mb-1 text-sm">⚠️ تذكير هام عند الانتهاء:</span>
                  هذا الموقع مخصص لقراءة المنيو وتخطيط التكلفة التقديرية فقط. <span className="font-bold text-brand-text">عند الانتهاء من اختيار وجباتك وتخطيطها، يرجى التوجه مباشرة إلى الكاشير لتقديم طلبك والمباشرة في إعداده.</span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-sans">
                  <button 
                    onClick={() => setIsPlannerOpen(false)}
                    className="w-full bg-brand-border/60 hover:bg-brand-border/95 text-brand-text font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center"
                  >
                    إغلاق الحاسبة
                  </button>
                  <button 
                    onClick={() => {
                      if (plannerItems.length === 0) return;
                      // Generate text to copy or share with friends
                      const tableText = tableNumber ? ` (طاولة رقم ${tableNumber})` : "";
                      const txt = `💡 تخطيط وجبتي من مطعم خيرات الوارث${tableText}:\n` + 
                        plannerItems.map(item => `- ${item.item.name} (${item.selectedOption}) x${item.quantity}`).join('\n') + 
                        `\n💵 المجموع المقدر: ${formatPrice(totalEstimation)} د.ع`;
                      
                      navigator.clipboard.writeText(txt);
                      setToastMessage("تم نسخ تخطيط الوجبة مع رقم الطاولة لمشاركته!");
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    disabled={plannerItems.length === 0}
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg font-black py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center shadow-lg shadow-brand-gold/10"
                  >
                    مشاركة التخطيط
                  </button>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- "اطمئن" DETAILS ASSURANCE POPUP DIALOG --- */}
      <AnimatePresence>
        {showAssurance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowAssurance(false)}
            />
            {/* Box Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-bg border-2 border-brand-gold/30 rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 shadow-2xl shadow-brand-gold/5 text-center"
              dir="rtl"
            >
              <button 
                onClick={() => setShowAssurance(false)}
                className="absolute top-4 left-4 p-1 hover:bg-brand-border/40 rounded-lg text-brand-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-500/30 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h3 className="text-xl md:text-2xl font-light text-brand-gold font-serif mb-2">{RESTAURANT_INFO.badgeText}</h3>
              <p className="text-xs md:text-sm text-brand-muted font-serif mb-6 italic">
                {RESTAURANT_INFO.badgeDescription}
              </p>

              <div className="bg-brand-bg/80 border border-brand-border rounded-2xl p-4 text-xs md:text-sm text-brand-text space-y-3 text-right">
                <div className="flex gap-2 items-start font-serif">
                  <span className="text-emerald-400 font-extrabold">✓</span>
                  <p>جميع اللحوم المستخدمة بلدية طازجة ١٠٠٪ (غنم وعجل بلدي).</p>
                </div>
                <div className="flex gap-2 items-start font-serif">
                  <span className="text-emerald-400 font-extrabold">✓</span>
                  <p>الدواجن المستخدمة تخضع لأدق الفحوصات الطبية والرقابة الشرعية الكاملة.</p>
                </div>
                <div className="flex gap-2 items-start font-serif">
                  <span className="text-emerald-400 font-extrabold">✓</span>
                  <p>تحت إشراف مباشر من العتبة الحسينية المقدسة لضمان أقصى درجات النقاء والجودة والحلية.</p>
                </div>
                <div className="flex gap-2 items-start font-serif">
                  <span className="text-emerald-400 font-extrabold">✓</span>
                  <p>نلتزم بأعلى معايير النظافة والتعقيم والصحة الغذائية العالمية في مطابخنا وصالتنا.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowAssurance(false)}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-brand-text font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10 cursor-pointer font-sans"
              >
                أشعر بالاطمئنان، حسناً
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER & BRAND INFO --- */}
      <footer className="bg-brand-bg border-t border-brand-border pt-12 pb-24 relative z-10 text-center text-brand-muted text-xs md:text-sm font-serif">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-brand-gold font-light text-xl tracking-tight font-serif">{RESTAURANT_INFO.name}</span>
            <span className="text-[10px] text-brand-muted tracking-wider font-sans">كربلاء المقدسة - خدمةً لزوار الإمام الحسين</span>
          </div>

          <p className="max-w-md mx-auto text-brand-muted font-light px-4 leading-relaxed italic">
            "{RESTAURANT_INFO.slogan}"
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-4 border-t border-brand-border max-w-xl mx-auto font-sans text-xs">
            <div className="flex items-center gap-1.5 text-brand-muted">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>{RESTAURANT_INFO.workingHours}</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-muted">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span>{RESTAURANT_INFO.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-muted">
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>هاتف الاستفسار والاتصال داخل الصالة</span>
            </div>
          </div>

          <p className="text-[10px] text-brand-muted/60 pt-6 font-sans">
            جميع الحقوق محفوظة لمطعم خيرات الوارث © {new Date().getFullYear()}
          </p>

          <div className="pt-6 flex justify-center">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border hover:border-brand-gold/40 text-[11px] text-brand-muted hover:text-brand-gold transition-all cursor-pointer font-sans"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>لوحة تحكم الإدارة</span>
            </button>
          </div>

        </div>
      </footer>

      {/* MOBILE FLOATING CART/CALCULATOR BUTTON */}
      <AnimatePresence>
        {plannerItems.length > 0 && !isPlannerOpen && (
          <motion.button
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 30 }}
            onClick={() => setIsPlannerOpen(true)}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:right-6 z-40 md:hidden bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-sans font-bold py-3.5 px-6 rounded-full shadow-2xl flex items-center justify-between sm:justify-center gap-3 border border-brand-gold/40 cursor-pointer active:scale-95 transition-all text-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Calculator className="w-5 h-5 text-brand-bg" />
                <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-brand-gold">
                  {totalPlannedCount}
                </span>
              </div>
              <span className="font-extrabold text-brand-bg">عرض الفاتورة التقديرية</span>
            </div>
            <span className="font-black bg-brand-bg/10 px-2.5 py-1 rounded-lg text-brand-bg text-xs">
              {formatPrice(totalEstimation)} د.ع
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ADMIN CONTROL PANEL MODAL */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#141611] border-2 border-brand-gold/40 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-border mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/25">
                    <Settings className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-base text-brand-text font-serif">لوحة تحكم الإدارة</h3>
                    <p className="text-[10px] text-brand-muted">تعديل المنيو وإضافة وجبات جديدة</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAdminOpen(false);
                    setLoginError(null);
                    resetForm();
                  }}
                  className="p-1.5 bg-brand-bg hover:bg-brand-border/40 text-brand-muted hover:text-brand-text rounded-xl transition-all cursor-pointer border border-brand-border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!isAdminLoggedIn ? (
                /* LOGIN SCREEN */
                <form onSubmit={handleAdminLogin} className="flex-1 flex flex-col justify-center items-center py-8 space-y-6 max-w-sm mx-auto w-full">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center border-2 border-brand-gold/20 mb-2">
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-bold text-base text-brand-text">تسجيل الدخول كمسؤول</h4>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      يرجى إدخال رمز المرور لتتمكن من إضافة وجبات جديدة أو تعديل الأسعار والصور.
                    </p>
                  </div>

                  <div className="w-full space-y-2">
                    <input 
                      type="password" 
                      placeholder="رمز المرور (الافتراضي: 1234)"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setLoginError(null);
                      }}
                      className="w-full bg-brand-bg text-brand-text text-center px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 text-base transition-all placeholder:text-brand-muted/40 font-mono tracking-widest"
                      required
                    />
                    {loginError && (
                      <p className="text-xs text-rose-400 text-center font-serif mt-1 animate-pulse">
                        ⚠️ {loginError}
                      </p>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/10 cursor-pointer"
                  >
                    تسجيل الدخول
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[10px] text-brand-muted bg-brand-bg px-3 py-1.5 rounded-full border border-brand-border">
                      💡 رمز التجريب السريع للمالك هو: <strong className="font-mono text-brand-gold">1234</strong>
                    </span>
                  </div>
                </form>
              ) : (
                /* LOGGED IN VIEW */
                <div className="flex-1 overflow-y-auto flex flex-col">
                  
                  {/* Logged in Header Info / Tabs */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-brand-bg p-3 rounded-2xl border border-brand-border mb-5 shrink-0">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-brand-text">أهلاً بك، المدير المسؤول</span>
                    </div>
                    
                    <div className="flex gap-1.5 font-sans text-xs">
                      <button 
                        onClick={() => setAdminTab("add")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${adminTab === "add" ? "bg-brand-gold text-brand-bg" : "hover:bg-brand-border text-brand-muted"}`}
                      >
                        {editingItemId ? "تعديل الوجبة" : "إضافة وجبة"}
                      </button>
                      <button 
                        onClick={() => setAdminTab("edit")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${adminTab === "edit" ? "bg-brand-gold text-brand-bg" : "hover:bg-brand-border text-brand-muted"}`}
                      >
                        إدارة وجبات المنيو
                      </button>
                      <button 
                        onClick={() => setAdminTab("settings")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${adminTab === "settings" ? "bg-brand-gold text-brand-bg" : "hover:bg-brand-border text-brand-muted"}`}
                      >
                        إعدادات عامة
                      </button>
                    </div>

                    <button 
                      onClick={handleAdminLogout}
                      className="text-xs text-rose-400 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-transparent hover:border-rose-500/10 transition-all cursor-pointer shrink-0"
                    >
                      خروج
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                    {adminTab === "add" && (
                      /* ADD / EDIT DISH FORM */
                      <form onSubmit={handleSaveItem} className="space-y-4 pb-4">
                        <h4 className="text-sm font-bold text-brand-gold pb-2 border-b border-brand-border/40 font-serif text-right">
                          {editingItemId ? "✍️ تعديل بيانات الوجبة الحالية" : "➕ إضافة وجبة طعام جديدة للمنيو"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                          {/* Name */}
                          <div className="space-y-1">
                            <label className="text-xs text-brand-muted font-bold block">اسم الوجبة (عربي) *</label>
                            <input 
                              type="text" 
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="مثال: كباب عراقي فاخر"
                              className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all text-right"
                              required
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-1">
                            <label className="text-xs text-brand-muted font-bold block">التصنيف الرئيسي *</label>
                            <select 
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value)}
                              className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all cursor-pointer text-right"
                            >
                              {menuData.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1 text-right">
                          <label className="text-xs text-brand-muted font-bold block">الوصف أو المكونات</label>
                          <textarea 
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="مثال: يقدم مع الخبز الحار، البصل الطازج، الطماطم المشوية والريحان"
                            className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all h-20 text-right"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                          {/* Simple Price */}
                          <div className="space-y-1">
                            <label className="text-xs text-brand-muted font-bold block">السعر البسيط (د.ع)</label>
                            <input 
                              type="number" 
                              value={formPrice}
                              onChange={(e) => setFormPrice(e.target.value)}
                              placeholder="مثال: 8000"
                              className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all text-right"
                            />
                            <p className="text-[10px] text-brand-muted italic">يُترك فارغاً إذا كان للوجبة أسعار متعددة أدناه.</p>
                          </div>

                          {/* Complex Prices (Multiple Options) */}
                          <div className="space-y-1">
                            <label className="text-xs text-brand-muted font-bold block">أسعار متعددة (اختياري)</label>
                            <input 
                              type="text" 
                              value={formPricesStr}
                              onChange={(e) => setFormPricesStr(e.target.value)}
                              placeholder="مثال: سفري: 5000, صالة: 6000"
                              className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all text-right"
                            />
                            <p className="text-[10px] text-brand-muted italic">الصيغة: الخيار: السعر، مفصولة بفاصلة.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                          {/* Image URL */}
                          <div className="space-y-1">
                            <label className="text-xs text-brand-muted font-bold block">رابط صورة الوجبة (URL)</label>
                            <input 
                              type="text" 
                              value={formImage}
                              onChange={(e) => setFormImage(e.target.value)}
                              placeholder="رابط الصورة من unsplash أو imgix..."
                              className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all text-left"
                            />
                            <p className="text-[10px] text-brand-muted">أدخل رابط صورة عالي الجودة لعرضها للزبائن.</p>
                          </div>

                          {/* Tags */}
                          <div className="space-y-1">
                            <label className="text-xs text-brand-muted font-bold block">الوسوم/العلامات (مفصولة بفاصلة)</label>
                            <input 
                              type="text" 
                              value={formTagsStr}
                              onChange={(e) => setFormTagsStr(e.target.value)}
                              placeholder="مثال: عراقي أصيل, مميز, حار"
                              className="w-full bg-brand-bg text-brand-text px-3 py-2 rounded-xl border border-brand-border focus:border-brand-gold/50 focus:outline-none text-sm transition-all text-right"
                            />
                          </div>
                        </div>

                        {/* Image Preview */}
                        {formImage.trim() && (
                          <div className="bg-brand-bg p-3 rounded-2xl border border-brand-border flex items-center justify-between gap-3 text-right">
                            <div className="flex items-center gap-3">
                              <img 
                                src={formImage.trim()} 
                                alt="معاينة" 
                                className="w-16 h-16 rounded-xl object-cover border border-brand-border shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop";
                                }}
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="text-xs font-bold text-emerald-400 block">✓ تمت قراءة الصورة بنجاح</span>
                                <span className="text-[10px] text-brand-muted">ستظهر هذه الصورة للزبائن كغلاف شهي للوجبة.</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Submit Row */}
                        <div className="flex gap-2.5 pt-4 border-t border-brand-border/40">
                          <button 
                            type="submit"
                            className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 font-sans"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingItemId ? "تحديث الوجبة الحالية" : "إضافة وجبة طعام جديدة"}</span>
                          </button>
                          
                          {editingItemId && (
                            <button 
                              type="button"
                              onClick={resetForm}
                              className="px-5 bg-brand-bg hover:bg-brand-border/50 text-brand-text font-bold py-2.5 rounded-xl text-sm border border-brand-border transition-all cursor-pointer font-sans"
                            >
                              إلغاء التعديل
                            </button>
                          )}
                        </div>

                      </form>
                    )}

                    {adminTab === "edit" && (
                      /* MANAGE EXISTING ITEMS LIST */
                      <div className="space-y-6 pb-4 text-right">
                        <h4 className="text-sm font-bold text-brand-gold pb-2 border-b border-brand-border/40 font-serif">
                          📋 الوجبات المتوفرة حالياً في المنيو ({menuData.reduce((sum, c) => sum + c.items.length, 0)} وجبة)
                        </h4>

                        {menuData.map(cat => (
                          <div key={cat.id} className="bg-brand-bg p-3.5 rounded-2xl border border-brand-border space-y-3">
                            <div className="flex justify-between items-center border-b border-brand-border/50 pb-2">
                              <span className="text-xs font-bold text-brand-gold font-serif flex items-center gap-1.5">
                                {getCategoryIcon(cat.iconName, "w-3.5 h-3.5")}
                                {cat.name}
                              </span>
                              <span className="text-[10px] bg-brand-card text-brand-muted px-2 py-0.5 rounded-md border border-brand-border font-sans">
                                {cat.items.length} أطباق
                              </span>
                            </div>

                            <div className="space-y-2">
                              {cat.items.length === 0 ? (
                                <p className="text-xs text-brand-muted italic text-center py-2">لا توجد أطباق في هذا التصنيف حالياً.</p>
                              ) : (
                                cat.items.map(item => (
                                  <div key={item.id} className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-brand-card/40 transition-colors border border-transparent hover:border-brand-border/30">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {item.image && (
                                        <img 
                                          src={item.image} 
                                          alt={item.name} 
                                          className="w-10 h-10 rounded-lg object-cover border border-brand-border shrink-0"
                                          referrerPolicy="no-referrer"
                                        />
                                      )}
                                      <div className="min-w-0 text-right">
                                        <span className="text-xs font-bold text-brand-text block truncate font-serif">{item.name}</span>
                                        <span className="text-[10px] text-brand-gold font-sans">
                                          {item.prices ? (
                                            Object.entries(item.prices).map(([o, p]) => `${o}: ${formatPrice(p as number)}`).join(" | ")
                                          ) : (
                                            `${formatPrice(item.price || 0)} د.ع`
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button 
                                        type="button"
                                        onClick={() => handleEditClick(item, cat.id)}
                                        className="p-1.5 bg-brand-bg hover:bg-brand-gold/10 text-brand-muted hover:text-brand-gold rounded-lg border border-brand-border hover:border-brand-gold/20 transition-all cursor-pointer"
                                        title="تعديل الوجبة"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      {deleteConfirmId === item.id ? (
                                        <div className="flex items-center gap-1 font-sans">
                                          <button 
                                            type="button"
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                                          >
                                            تأكيد
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => setDeleteConfirmId(null)}
                                            className="px-2 py-1 bg-brand-bg hover:bg-brand-border text-brand-text text-[10px] rounded-lg border border-brand-border transition-all cursor-pointer"
                                          >
                                            إلغاء
                                          </button>
                                        </div>
                                      ) : (
                                        <button 
                                          type="button"
                                          onClick={() => setDeleteConfirmId(item.id)}
                                          className="p-1.5 bg-brand-bg hover:bg-rose-500/10 text-brand-muted hover:text-rose-400 rounded-lg border border-brand-border hover:border-rose-500/20 transition-all cursor-pointer"
                                          title="حذف الوجبة"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {adminTab === "settings" && (
                      /* MENU SETTINGS / MAINTENANCE */
                      <div className="space-y-6 pb-4 font-serif text-right">
                        <h4 className="text-sm font-bold text-brand-gold pb-2 border-b border-brand-border/40">
                          ⚙️ صيانة المنيو والإعدادات العامة
                        </h4>

                        <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border space-y-4">
                          <h5 className="text-xs font-bold text-brand-text">⚠️ منطقة الخطر</h5>
                          <p className="text-xs text-brand-muted leading-relaxed">
                            إذا قمت بعمل تغييرات غير صحيحة، أو قمت بحذف عناصر بالخطأ، يمكنك مسح الذاكرة المحلية واستعادة المنيو الافتراضي الأصلي لمطعم خيرات الوارث فوراً.
                          </p>

                          {resetConfirm ? (
                            <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-3">
                              <span className="text-xs font-bold text-rose-300 block">⚠️ هل أنت متأكد تماماً من رغبتك بالمسح والاستعادة؟</span>
                              <p className="text-[10px] text-rose-400 leading-normal">سيؤدي هذا إلى حذف جميع الوجبات التي أضفتها والتغييرات التي أجريتها نهائياً!</p>
                              
                              <div className="flex gap-2 font-sans">
                                <button 
                                  onClick={handleResetMenu}
                                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  نعم، استعد المنيو الأصلي
                                </button>
                                <button 
                                  onClick={() => setResetConfirm(false)}
                                  className="px-4 py-2 bg-brand-bg hover:bg-brand-card text-brand-text font-bold text-xs rounded-xl border border-brand-border transition-all cursor-pointer"
                                >
                                  إلغاء وتراجع
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setResetConfirm(true)}
                              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-sans font-bold py-2.5 rounded-xl text-xs transition-all border border-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>استعادة وإرجاع المنيو الافتراضي الأصلي</span>
                            </button>
                          )}
                        </div>

                        <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border space-y-3 font-sans">
                          <h5 className="text-xs font-bold text-brand-text text-right">📊 معلومات وقراءة المنيو</h5>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-brand-card rounded-xl border border-brand-border text-right">
                              <span className="text-[10px] text-brand-muted block">عدد التصنيفات</span>
                              <span className="text-lg font-bold text-brand-gold">{menuData.length} تصنيفات</span>
                            </div>
                            <div className="p-3 bg-brand-card rounded-xl border border-brand-border text-right">
                              <span className="text-[10px] text-brand-muted block">إجمالي أطباق الطعام</span>
                              <span className="text-lg font-bold text-brand-gold">{menuData.reduce((sum, c) => sum + c.items.length, 0)} وجبة</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
