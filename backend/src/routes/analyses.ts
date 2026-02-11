import { Response } from "express";
import multer from "multer";
import { Readable } from "stream";
import { ObjectId, GridFSBucket } from "mongodb";
import { connectDb } from "../config/db.js";
import type { AnalysisDocument, AnalysisResult } from "../types/index.js";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import { runAnalysis, delay } from "../lib/analysis-model.js";
import { Router } from "express";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

function getBaseUrl(req: AuthenticatedRequest): string {
  const host = req.get("host") || "diabevision-backend.onrender.com";
  const protocol = req.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

function docToResult(doc: AnalysisDocument & { _id: ObjectId }, baseUrl: string): AnalysisResult {
  return {
    id: doc._id.toString(),
    patientId: doc.patientId,
    date: doc.date.toISOString(),
    imageUrl: `${baseUrl}/api/analyses/${doc._id.toString()}/image`,
    prediction: doc.prediction,
    confidence: doc.confidence,
    severityScore: doc.severityScore,
    details: doc.details,
  };
}

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.authPayload?.userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "Image file is required" });
        return;
      }

      const db = await connectDb();
      const bucket = new GridFSBucket(db, { bucketName: "images" });
      const readable = Readable.from(req.file.buffer);
      const uploadStream = bucket.openUploadStream(req.file.originalname || "image", {
        contentType: req.file.mimetype,
      });
      await new Promise<void>((resolve, reject) => {
        readable.pipe(uploadStream);
        uploadStream.on("finish", () => resolve());
        uploadStream.on("error", reject);
      });
      const imageFileId = uploadStream.id as ObjectId;

      await delay(2500);
      const { severityScore, prediction, confidence, details } = runAnalysis();
      const patientId = `PT-${Math.floor(Math.random() * 10000)}`;

      const analyses = db.collection<AnalysisDocument>("analyses");
      const doc: Omit<AnalysisDocument, "_id"> = {
        userId: req.authPayload.userId,
        patientId,
        date: new Date(),
        imageFileId: imageFileId.toString(),
        prediction,
        confidence,
        severityScore,
        details,
        createdAt: new Date(),
      };
      const insert = await analyses.insertOne(doc as AnalysisDocument);
      const inserted = await analyses.findOne({ _id: insert.insertedId }) as (AnalysisDocument & { _id: ObjectId }) | null;
      if (!inserted) {
        res.status(500).json({ error: "Failed to save analysis" });
        return;
      }

      const baseUrl = getBaseUrl(req);
      res.status(201).json(docToResult(inserted, baseUrl));
    } catch (err) {
      console.error("Analyze error:", err);
      res.status(500).json({ error: "Analysis failed" });
    }
  }
);

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.authPayload?.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const db = await connectDb();
    const analyses = db.collection<AnalysisDocument>("analyses");
    const cursor = analyses.find({ userId: req.authPayload.userId }).sort({ createdAt: -1 });
    const docs = (await cursor.toArray()) as (AnalysisDocument & { _id: ObjectId })[];
    const baseUrl = getBaseUrl(req);
    res.json(docs.map((d) => docToResult(d, baseUrl)));
  } catch (err) {
    console.error("List analyses error:", err);
    res.status(500).json({ error: "Failed to list analyses" });
  }
});

router.get("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.authPayload?.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid analysis id" });
      return;
    }
    const db = await connectDb();
    const analyses = db.collection<AnalysisDocument>("analyses");
    const doc = await analyses.findOne({
      _id: new ObjectId(id),
      userId: req.authPayload.userId,
    }) as (AnalysisDocument & { _id: ObjectId }) | null;
    if (!doc) {
      res.status(404).json({ error: "Analysis not found" });
      return;
    }
    const baseUrl = getBaseUrl(req);
    res.json(docToResult(doc, baseUrl));
  } catch (err) {
    console.error("Get analysis error:", err);
    res.status(500).json({ error: "Failed to get analysis" });
  }
});

router.get("/:id/image", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.authPayload?.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid analysis id" });
      return;
    }
    const db = await connectDb();
    const analyses = db.collection<AnalysisDocument>("analyses");
    const doc = await analyses.findOne({
      _id: new ObjectId(id),
      userId: req.authPayload.userId,
    });
    if (!doc) {
      res.status(404).json({ error: "Analysis not found" });
      return;
    }
    const bucket = new GridFSBucket(db, { bucketName: "images" });
    const fileId = new ObjectId(doc.imageFileId);
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on("data", (chunk) => res.write(chunk));
    downloadStream.on("error", () => res.status(404).end());
    downloadStream.on("end", () => res.end());
    res.setHeader("Content-Type", "image/jpeg");
  } catch (err) {
    console.error("Get image error:", err);
    res.status(500).json({ error: "Failed to get image" });
  }
});

export default router;
