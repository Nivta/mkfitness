export interface HealthQuestion {
  question: string;
  answer: string;
}

export interface FormValues {
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
  eatsEggs: boolean;
  eatsDairy: boolean;
  eatsFish: boolean;
  goal: string;
  dangerousFoods: string;
  favoriteFoods: string;
  dislikeFoods: string;
  trainingLocation: string;
  acceptTerms: boolean;
  diet: string | null;
  dailyCalories: number | null;
  healthQuestions: HealthQuestion[];
}

  