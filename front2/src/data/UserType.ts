export interface HealthQuestion {
  question: string;
  answer: string;
}

// סוג עבור משתמש רגיל
export interface User {
    fullName: string;
    email: string;
    idNumber: string;
    password: string;
    phone: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
    activityLevel: string;
    dangerousFoods: string;
    diet: 'meat' | 'vegetarian' | 'vegan' | null;
    eatsEggs: boolean;
    eatsDairy: boolean;
    eatsFish: boolean;
    favoriteFoods: string;
    dislikeFoods: string;
    goal: string;
    trainingLocation: string;
    acceptTerms: boolean;
    healthQuestions: HealthQuestion[];
    status: string 
  }
  
  // סוג עבור Admin
  export interface Admin {
    fullName: string;
    email: string;
    password: string;
    
  }
  