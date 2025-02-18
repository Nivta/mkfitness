import { jsPDF } from 'jspdf';
import { User } from './UserType';

// פונקציה להמיר ArrayBuffer ל-Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const length = bytes.length;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const healthQuestionsPDF = async (user: User) => {
  const doc = new jsPDF();

  // טוען את הגופן עברי מ-CDN של Google Fonts
  const fontBytes = await fetch('https://fonts.gstatic.com/s/heebo/v13/7c2e6bmPGv6XYt3vwbVjrJbts1dkpA.ttf')
    .then(res => res.arrayBuffer());

  // המרת ArrayBuffer ל-base64
  const fontBase64 = arrayBufferToBase64(fontBytes);

  // הוספת הגופן
  doc.addFileToVFS("heeboFont.ttf", fontBase64);
  doc.addFont("heeboFont.ttf", "heeboFont", "normal");

  // הגדרת הגופן עברי
  doc.setFont("heeboFont");

  // כותרת הדף
  doc.setFontSize(18);
  doc.text(`🩺 הצהרת בריאות - ${user.fullName}`, 10, 10);

  doc.setFontSize(12);
  doc.text(`📧 אימייל: ${user.email}`, 10, 20);
  doc.text(`🎂 גיל: ${user.age}`, 10, 30);
  doc.text(`🎯 מטרה: ${user.goal}`, 10, 40);

  doc.text(`📝 תשובות להצהרת הבריאות:`, 10, 50);

  let y = 60;
  Object.entries(user.healthQuestions).forEach(([question, answer]) => {
    doc.text(`${question}: ${answer}`, 10, y);
    y += 10; // כל תשובה תהיה במרחק של 10 פיקסלים
  });

  // שמירת ה-PDF
  doc.save(`Health_Declaration_${user.fullName}.pdf`);
};





