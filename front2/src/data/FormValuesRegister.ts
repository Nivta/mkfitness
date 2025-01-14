// FormValues.ts

export interface FormValues {
    // פרטים אישיים
    fullName: string;
    email: string;
    idNumber: string;
    password: string;
    phone: string;
  
    // פרטי בריאות
    age: number;
    height: number;
    weight: number;
    gender: string;
    dailyCalories: number | null;
    activityLevel: string;
    dangerousFoods:string
  
    // העדפות תזונה
    diet: 'meat' | 'vegetarian' | 'vegan' | null; 
    eatsEggs: boolean;
    eatsDairy: boolean;
    eatsFish: boolean;
    favoriteFoods:string
    dislikeFoods:string
    // סוג תהליך ומיקום אימון
    goal: string;
    trainingLocation: string;
  
    // תנאים והגבלות
    acceptTerms: boolean;
  }
  