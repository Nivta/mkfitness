import { useState } from "react";
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

export default function AddMeasurement({ idNumber, navigateUrl }: { idNumber: string | undefined; navigateUrl: string }) {
  const nav = useNavigate();
  const [newMeasurement, setNewMeasurement] = useState<Omit<Measurement, "idNumber">>({
    date: new Date().toISOString().split("T")[0], 
    weight: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    arm: 0,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeasurement({ ...newMeasurement, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const measurementData = { ...newMeasurement, idNumber };
      await axios.post(apiURL + "/api/measurements/addMeasurment", measurementData);
      nav(navigateUrl);
    } catch (err) {
      console.error("Error saving measurement:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-card animate-fade-in">
        <div className="card-header">
          <h1 className="page-title">הוספת מדידה חדשה</h1>
        </div>
        
        <div className="card-body">
          <div className="form-group">
            <label className="text-label">תאריך</label>
            <input 
              type="date" 
              name="date" 
              value={newMeasurement.date} 
              onChange={handleChange} 
              required 
              className="input-field" 
            />
          </div>

          <div className="input-group">
            <div className="form-group">
              <label className="text-label">משקל (ק"ג)</label>
              <input 
                type="number" 
                name="weight" 
                placeholder="0" 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
            
            <div className="form-group">
              <label className="text-label">היקף חזה (ס"מ)</label>
              <input 
                type="number" 
                name="chest" 
                placeholder="0" 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
            
            <div className="form-group">
              <label className="text-label">היקף טבור (ס"מ)</label>
              <input 
                type="number" 
                name="waist" 
                placeholder="0" 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
            
            <div className="form-group">
              <label className="text-label">היקף אגן (ס"מ)</label>
              <input 
                type="number" 
                name="hips" 
                placeholder="0" 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
            
            <div className="form-group">
              <label className="text-label">היקף יד (ס"מ)</label>
              <input 
                type="number" 
                name="arm" 
                placeholder="0" 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
          </div>

          <div className="btn-group">
            <button 
              onClick={() => nav(navigateUrl)} 
              className="btn btn-secondary"
            >
              חזרה
            </button>
            
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'שומר...' : 'שמור מדידה'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

