

import { useState, useEffect } from "react";
import axios from "axios";
import apiURL from "../data/apiConfig";
import { useNavigate } from "react-router-dom";
import "../styles/measurements.css"; // Import the CSS file

interface Measurement {
  idNumber: string | undefined;
  date: string;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  arm: number;
}

export default function MeasurementList({ idNumber, navigateUrl }: { idNumber: string | undefined; navigateUrl: string }) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [expandedMeasurement, setExpandedMeasurement] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!idNumber) return;
    
    setIsLoading(true);
    axios.post(apiURL + "/api/measurements/getMeasurements", { idNumber })
      .then((res) => {
        setMeasurements(res.data.sort((a: Measurement, b: Measurement) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()));
      })
      .catch(err => console.error("Error fetching measurements:", err))
      .finally(() => setIsLoading(false));
  }, [idNumber]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const toggleDetails = (index: number) => {
    setExpandedMeasurement(expandedMeasurement === index ? null : index);
  };

  return (
    <div className="page-container">
      <div className="content-card animate-fade-in">
        <div className="card-header">
          <div className="tabs">
            <button 
              onClick={() => setViewMode('list')}
              className={`tab ${viewMode === 'list' ? 'active' : ''}`}
            >
              רשימה
            </button>
            <button 
              onClick={() => setViewMode('chart')}
              className={`tab ${viewMode === 'chart' ? 'active' : ''}`}
            >
              גרף
            </button>
          </div>
          <h1 className="page-title">היסטוריית מדידות</h1>
        </div>
        
        <div className="card-body">
          {isLoading ? (
            <div className="empty-state">
              <p className="empty-state-text">טוען נתונים...</p>
            </div>
          ) : measurements.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">אין מדידות להצגה</p>
              <p className="detail-label">לחץ על כפתור ההוספה להתחיל לעקוב אחר ההתקדמות שלך</p>
            </div>
          ) : viewMode === 'list' ? (
            <div>
              {measurements.map((m, i) => (
                <div key={i} className="measurement-item">
                  <div 
                    onClick={() => toggleDetails(i)}
                    className="measurement-header"
                  >
                    <span className="measurement-weight">{m.weight} ק"ג</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="measurement-date">{formatDate(m.date)}</span>
                      <svg 
                        className={`icon-dropdown ${expandedMeasurement === i ? 'open' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {expandedMeasurement === i && (
                    <div className="measurement-details">
                      <div className="measurement-detail">
                        <p className="detail-label">היקף חזה</p>
                        <p className="detail-value">{m.chest} ס"מ</p>
                      </div>
                      <div className="measurement-detail">
                        <p className="detail-label">היקף טבור</p>
                        <p className="detail-value">{m.waist} ס"מ</p>
                      </div>
                      <div className="measurement-detail">
                        <p className="detail-label">היקף אגן</p>
                        <p className="detail-value">{m.hips} ס"מ</p>
                      </div>
                      <div className="measurement-detail">
                        <p className="detail-label">היקף יד</p>
                        <p className="detail-value">{m.arm} ס"מ</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-container">
              <div className="chart-placeholder">
                <p className="chart-title">תצוגת גרף</p>
                <p className="chart-subtitle">גרף מגמות יופיע כאן</p>
              </div>
            </div>
          )}
          
          <div className="btn-group">
            <button 
              onClick={() => nav(navigateUrl)} 
              className="btn btn-secondary"
            >
              חזרה
            </button>
            
            <button 
              onClick={() => nav("/measurements")} 
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <svg className="btn-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              הוספת מדידה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

