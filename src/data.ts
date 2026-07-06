export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number; // for simple pricing
  prices?: { [key: string]: number }; // for complex pricing like (صالة, سفري) or (نفر, نص نفر) or (وسط, كبير)
  tags?: string[];
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  iconName: string;
  items: MenuItem[];
}

export const RESTAURANT_INFO = {
  name: "مطعم خيرات الوارث",
  subtitle: "كربلاء المقدسة",
  welcomeMessage: "أهلاً وسهلاً بكم في مطعم خيرات الوارث",
  slogan: "كل وجبة من خيرات الوارث تثمر في مشاريع العتبة الحسينية المقدسة",
  badgeText: "اطمئن",
  badgeDescription: "جميع اللحوم والمكونات خاضعة للرقابة الشرعية والصحية ومذبوحة على الطريقة الإسلامية",
  workingHours: "من الساعة 11:00 صباحاً إلى 10:00 ليلاً",
  location: "العراق، كربلاء المقدسة",
  phone: "07800000000", // placeholder or general
};

export const MENU_DATA: MenuCategory[] = [
  {
    id: "rice-soup",
    name: "تمن ومرق وجلو",
    iconName: "Utensils",
    items: [
      {
        id: "rice-soup-1",
        name: "تمن ومرق",
        description: "أرز عراقي فاخر يقدم مع المرق اليومي الطازج",
        price: 4000,
        tags: ["شعبية", "تقليدي"],
        image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "rice-soup-2",
        name: "تمن ومرق مع كص دجاج",
        description: "أرز عراقي مع كص الدجاج المتبل اللذيذ والمرق المختار",
        price: 7000,
        tags: ["مميز", "أكثر طلباً"],
        image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "rice-soup-3",
        name: "تشريب لحم",
        description: "لحم الغنم الطازج المطبوخ ببطء مع خبز الرقاق العراقي والتشريب",
        price: 15000,
        tags: ["عراقي أصيل", "دسم"],
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "rice-soup-4",
        name: "جلو كباب لحم",
        description: "كباب لحم عراقي مشوي على الفحم يقدم مع الأرز البسمتي بالزعفران",
        price: 9000,
        tags: ["مشويات", "كلاسيك"],
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "rice-soup-5",
        name: "جلو كباب دجاج",
        description: "كباب دجاج مفروم بالخلطة الخاصة مشوي على الفحم مع الأرز بالزعفران",
        price: 9000,
        tags: ["مشويات"],
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "quzi-main",
    name: "القوزي والأطباق الرئيسية",
    iconName: "Flame",
    items: [
      {
        id: "quzi-1",
        name: "قوزي على التمن",
        description: "فخذ لحم الغنم الطري المطبوخ ببطء لدرجة الذوبان، يقدم فوق جبل من الأرز المزين بالمكسرات والشعرية والزبيب مع المرق",
        price: 20000,
        tags: ["فاخر", "ولائم"],
        image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "quzi-2",
        name: "جلو تكة دجاج",
        description: "شيش تكة دجاج متبلة بالليمون والبهارات مشوية على الفحم وتقدم مع الأرز",
        price: 9000,
        tags: ["مشويات"],
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "quzi-3",
        name: "دجاج على التمن مع المرق",
        description: "نصف دجاجة محمرة طرية تقدم مع الأرز البسمتي والمرق الساخن",
        price: 8000,
        tags: ["شعبية"],
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "mixed-grills",
    name: "مشكل مشاوي",
    iconName: "Sparkles",
    items: [
      {
        id: "mixed-1",
        name: "كباب لحم - كباب دجاج",
        description: "مزيج متناغم من كباب اللحم البلدي وكباب الدجاج المتبل المشويين على الفحم",
        price: 13000,
        tags: ["توفير", "مشكل"],
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "mixed-2",
        name: "كباب دجاج - تكة دجاج",
        description: "وجبة مشويات دجاج تجمع بين كباب الدجاج الطري وتكة الدجاج اللذيذة",
        price: 12000,
        tags: ["عشاق الدجاج"],
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "mixed-3",
        name: "كباب لحم - تكة دجاج",
        description: "مشكل فاخر يجمع بين كباب اللحم البلدي الطازج وتكة الدجاج المتبلة المشوية بعناية",
        price: 13000,
        tags: ["رائج"],
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "grills",
    name: "المشويات بالوزن (نفر / نصف نفر)",
    iconName: "Beef",
    items: [
      {
        id: "grill-1",
        name: "كباب لحم",
        description: "كباب لحم غنم عراقي بلدي طازج ومتبل بالملح والبصل فقط للمحافظة على نكهته الأصيلة",
        prices: { "نصف نفر": 7000, "نفر كامل": 14000 },
        tags: ["بلدي طازج"],
        image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "grill-2",
        name: "كباب دجاج",
        description: "صدور دجاج مفرومة مع خلطة بهاراتنا الخاصة والليمون مشوية بمهارة",
        prices: { "نصف نفر": 6000, "نفر كامل": 11000 },
        image: "https://images.unsplash.com/photo-1598511726623-d732c0331763?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "grill-3",
        name: "دجاج شوي",
        description: "دجاج متبل على الطريقة العراقية ومشوي على الفحم ببطء حتى القرمشة",
        prices: { "نصف نفر": 7000, "نفر كامل": 14000 },
        tags: ["على الفحم"],
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "grill-4",
        name: "كص دجاج",
        description: "شرائح دجاج طازج متبلة بالزبادي والخل والبهارات الخاصة ومشوية على السيخ العمودي",
        prices: { "نصف نفر": 6000, "نفر كامل": 12000 },
        tags: ["شاورما"],
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "grill-5",
        name: "تكة دجاج",
        description: "قطع شيش طاووق من صدور الدجاج الطازجة متبلة بالثوم والليمون ومشوية",
        prices: { "نصف نفر": 6000, "نفر كامل": 11000 },
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "grill-6",
        name: "ربع دجاجة ناشف",
        description: "ربع دجاجة مشوية ومحمرة بدون مرق أو أرز، تقدم كوجبة خفيفة",
        price: 4000,
        tags: ["وجبة خفيفة"],
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "sandwiches",
    name: "السندويشات (صالة / سفري)",
    iconName: "Clapperboard", // Using Sandwich or similar in UI
    items: [
      {
        id: "burger-1",
        name: "بركر لحم",
        description: "قرص لحم بقري مشوي مع الخس والطماطم والمخلل والصلصة السرية في خبز البرغر الطازج",
        prices: { "سفري": 3000, "داخل الصالة": 3500 },
        tags: ["بركر"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "burger-2",
        name: "تشيز بركر",
        description: "برغر اللحم المشوي مع طبقة غنية من جبنة الشيدر الذائبة والخضروات الطازجة",
        prices: { "سفري": 3500, "داخل الصالة": 4000 },
        tags: ["بركر", "جبنة"],
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "burger-3",
        name: "سندويش زنجر",
        description: "صدر دجاج مقرمش حار ومتبل جيدا مع الخس والمايونيز والجبنة",
        prices: { "سفري": 3500, "داخل الصالة": 4000 },
        tags: ["حار", "مقرمش"],
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "shawarma-1",
        name: "شاورما دجاج (لفّة)",
        description: "شاورما كص الدجاج الملفوفة في الخبز العراقي مع الثومية والمخلل",
        prices: { "سفري": 2500, "داخل الصالة": 3000 },
        tags: ["شاورما", "كلاسيك"],
        image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "shawarma-2",
        name: "صاج دجاج",
        description: "شاورما دجاج بخبز الصاج الرقيق المشوي على الكريل تقدم محمرة ومقطعة مع البطاطا",
        prices: { "سفري": 3000, "داخل الصالة": 3500 },
        tags: ["شاورما", "صاج"],
        image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "shawarma-3",
        name: "صاج دجاج بالجبن",
        description: "صاج شاورما الدجاج الغني بجبنة الموزاريلا الذائبة والمحمر على الكريل",
        prices: { "سفري": 4000, "داخل الصالة": 4500 },
        tags: ["شاورما", "جبنة"],
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "kentucky",
    name: "الكنتاكي والريزو",
    iconName: "ChefHat",
    items: [
      {
        id: "kfc-3pcs",
        name: "بروستد كنتاكي 3 قطع",
        description: "3 قطع من الدجاج المقرمش الذهبي بالخلطة السرية مع البطاطا والثومية والخبز",
        price: 6000,
        tags: ["مقرمش"],
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "kfc-5pcs",
        name: "بروستد كنتاكي 5 قطع",
        description: "5 قطع دجاج بروستد ذهبي فائق القرمشة يقدم مع البطاطس المقلية وصلصة الثوم",
        price: 9000,
        tags: ["مقرمش", "عائلي خفيف"],
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "kfc-7pcs",
        name: "بروستد كنتاكي 7 قطع",
        description: "7 قطع من الدجاج المقرمش العائلي اللذيذ مع مقبلات وسرفيس كامل",
        price: 13000,
        tags: ["مقرمش", "عائلي"],
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "kfc-9pcs",
        name: "بروستد كنتاكي 9 قطع",
        description: "وجبة عائلية كبرى تحتوي على 9 قطع من الكنتاكي المقرمش مع السرفيس والصلصات والبطاطا",
        price: 19000,
        tags: ["مقرمش", "عائلي كبير"],
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "rizo",
        name: "ريزو دجاج",
        description: "قطع الدجاج المقرمشة المقلية فوق الأرز المبهر الخاص بصلصة الريزو الحلوة والحارة اللذيذة",
        price: 6000,
        tags: ["حار وحلو", "أكثر طلباً"],
        image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "pizza",
    name: "البيتزا الإيطالية (وسط / كبير)",
    iconName: "Pizza",
    items: [
      {
        id: "pizza-1",
        name: "بيتزا دجاج",
        description: "عجينة إيطالية هشة، صلصة بيتزا غنية، قطع صدور دجاج متبلة، فلفل ألوان، زيتون وموزاريلا",
        prices: { "وسط": 11000, "كبير": 13000 },
        tags: ["بيتزا"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "pizza-2",
        name: "بيتزا خضار",
        description: "عجينة إيطالية غنية بالخضروات الطازجة (فطر، فلفل أخضر، بصل، طماطم، زيتون) مع الموزاريلا",
        prices: { "وسط": 10000, "كبير": 12000 },
        tags: ["بيتزا", "نباتي"],
        image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "pizza-3",
        name: "بيتزا مرغريتا",
        description: "بساطة الطعم الإيطالي الأصيل: صلصة طماطم غنية بالريحان والمزيد من جبن الموزاريلا الفاخر بدون خضار",
        prices: { "وسط": 9000, "كبير": 10000 },
        tags: ["بيتزا", "بسيطة"],
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "pizza-4",
        name: "بيتزا مشكل",
        description: "بيتزا الملوك: تشكيلة فاخرة من الكص واللحوم والخضار والجبن الذائب",
        prices: { "وسط": 12000, "كبير": 14000 },
        tags: ["بيتزا", "مميزة"],
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "appetizers",
    name: "المقبلات والفنكر",
    iconName: "Salad",
    items: [
      {
        id: "app-1",
        name: "مقبلات وسط",
        description: "صحن مشكل من المقبلات والمازات العراقية والشرقية الباردة (حمص بطحينة، بابا غنوج، جاجيك، تبولة)",
        price: 3000,
        tags: ["مقبلات"],
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "app-2",
        name: "مقبلات كبير",
        description: "تشكيلة كبرى غنية من شتى أنواع السلطات والمقبلات الباردة والساخنة الطازجة يومياً",
        price: 5000,
        tags: ["مقبلات", "مشاركة"],
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "french-fries",
        name: "صحن فنكر",
        description: "أصابع البطاطس الذهبية المقرمشة والمقلية بطلبك، متبلة بملح خفيف وبودرة الثوم",
        price: 3000,
        tags: ["فنكر", "مقرمش"],
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "drinks",
    name: "المشروبات المنعشة",
    iconName: "GlassWater",
    items: [
      {
        id: "drink-1",
        name: "عصائر طبيعية طازجة",
        description: "عصير فواكه طازج ومبرد محضر يومياً في المطعم",
        price: 2000,
        tags: ["طبيعي", "بارد"],
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "drink-2",
        name: "أسكنجبيل",
        description: "الشراب التراثي المنعش المكون من النعناع والخل والسكر والمبرد بالثلج",
        price: 1500,
        tags: ["تراثي", "منعش"],
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "drink-3",
        name: "لبن عرب",
        description: "لبن عراقي طبيعي خاثر ومملح قليلاً، مبرد ومثالي مع المشويات والتمن",
        price: 1000,
        tags: ["طبيعي", "منعش"],
        image: "https://images.unsplash.com/photo-1546173159-319807584405?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "drink-4",
        name: "بيبسي",
        description: "مشروب بيبسي غازي بارد ومنعش",
        price: 250,
        tags: ["مشروب غازي"],
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "drink-5",
        name: "شاي مهيل عراقي",
        description: "كوب شاي عراقي مخدر على الفحم مع الهيل العطر ليختم الوجبة",
        price: 250,
        tags: ["ساخن", "تراثي"],
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop"
      }
    ]
  }
];
