export interface AnalysisResult {
  id: string;
  patientId: string;
  date: string;
  imageUrl: string;
  prediction: 'No DR' | 'Mild NPDR' | 'Moderate NPDR' | 'Severe NPDR' | 'Proliferative DR';
  confidence: number;
  severityScore: number; // 0-4
  details: {
    microaneurysms: boolean;
    hemorrhages: boolean;
    exudates: boolean;
    cottonWoolSpots: boolean;
    neovascularization: boolean;
  };
}

const PREDICTIONS = [
  'No DR',
  'Mild NPDR',
  'Moderate NPDR',
  'Severe NPDR',
  'Proliferative DR'
] as const;

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const severityScore = Math.floor(Math.random() * 5);
      const prediction = PREDICTIONS[severityScore];
      const confidence = 85 + Math.floor(Math.random() * 14); // 85-99%
      
      // Create a fake image URL (in a real app this would be the uploaded URL)
      const imageUrl = URL.createObjectURL(file);

      const result: AnalysisResult = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: `PT-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        imageUrl,
        prediction,
        confidence,
        severityScore,
        details: {
          microaneurysms: severityScore > 0,
          hemorrhages: severityScore > 1,
          exudates: severityScore > 1,
          cottonWoolSpots: severityScore > 2,
          neovascularization: severityScore > 3,
        }
      };

      resolve(result);
    }, 2500); // Simulate 2.5s processing time
  });
};

export const saveAnalysis = (analysis: AnalysisResult) => {
  const saved = localStorage.getItem('retinacheck_analyses');
  const analyses = saved ? JSON.parse(saved) : [];
  analyses.unshift(analysis);
  localStorage.setItem('retinacheck_analyses', JSON.stringify(analyses));
};

export const getAnalysis = (id: string): AnalysisResult | null => {
  const saved = localStorage.getItem('retinacheck_analyses');
  if (!saved) return null;
  const analyses = JSON.parse(saved);
  return analyses.find((a: AnalysisResult) => a.id === id) || null;
};

export const getAnalyses = (): AnalysisResult[] => {
  const saved = localStorage.getItem('retinacheck_analyses');
  return saved ? JSON.parse(saved) : [];
};

