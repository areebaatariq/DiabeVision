export type UserRole = "medical_professional" | "admin";

export interface User {
  _id?: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PredictionLabel =
  | "No DR"
  | "Mild NPDR"
  | "Moderate NPDR"
  | "Severe NPDR"
  | "Proliferative DR";

export interface AnalysisDetails {
  microaneurysms: boolean;
  hemorrhages: boolean;
  exudates: boolean;
  cottonWoolSpots: boolean;
  neovascularization: boolean;
}

export interface AnalysisResult {
  id: string;
  patientId: string;
  date: string;
  imageUrl: string;
  prediction: PredictionLabel;
  confidence: number;
  severityScore: number;
  details: AnalysisDetails;
}

export interface AnalysisDocument {
  _id?: string;
  userId: string;
  patientId: string;
  date: Date;
  imageFileId: string; // GridFS file id
  prediction: PredictionLabel;
  confidence: number;
  severityScore: number;
  details: AnalysisDetails;
  createdAt: Date;
}
