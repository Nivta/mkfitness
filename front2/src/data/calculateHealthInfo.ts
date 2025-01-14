// src/utils/calculateHealthInfo.ts

export const calculateBMR = (age: number, height: number, weight: number, gender: string) => {
    if (!age || !height || !weight || !gender) return null;
  
    let bmr = 0;
  
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age; // נוסחת גברים
    } else if (gender === 'female') {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age; // נוסחת נשים
    }
  
    return bmr;
  };
  
  export const calculateCalories = (bmr: number | null, activityLevel: string) => {
    if (!bmr) return null;
  
    let activityMultiplier = 1; // ברירת מחדל: חוסר פעילות
  
    switch (activityLevel) {
      case 'inactive':
        activityMultiplier = 1.2;
        break;
      case 'low':
        activityMultiplier = 1.375;
        break;
      case 'medium':
        activityMultiplier = 1.55;
        break;
      case 'high':
        activityMultiplier = 1.725;
        break;
      default:
        break;
    }
  
    return bmr * activityMultiplier;
  };
  