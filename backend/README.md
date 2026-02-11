# DiabeVision Backend

Express + TypeScript API for auth and retinal analysis. Uses **MongoDB** with a **dedicated database name** so this project does not affect other apps on the same cluster.

## Database isolation

- **Database name:** `diabevision` (set in code; the connection string URL is not used for the DB name).
- All collections (`users`, `analyses`, GridFS bucket `images`) live only in the `diabevision` database.
- Do not change the database name or reuse shared collection names from other projects.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` – MongoDB connection string (can point at any cluster; DB name is overridden to `diabevision`).
   - `JWT_SECRET` – Secret for JWT signing.
   - `PORT` – Server port (default 4000).
   - `CORS_ORIGIN` – Frontend origin (e.g. `http://localhost:3000`).

2. Install and run:

```bash
npm install
npm run dev
```

## API

- `POST /api/auth/register` – Register (name, email, password).
- `POST /api/auth/login` – Login (email, password); returns `{ user, token }`.
- `GET /api/auth/me` – Current user (Bearer token).
- `POST /api/analyses` – Upload image (multipart `image`), run ResNet model analysis, store in DB; returns analysis result. Requires auth.
- `GET /api/analyses` – List analyses for the current user. Requires auth.
- `GET /api/analyses/:id` – Get one analysis. Requires auth.
- `GET /api/analyses/:id/image` – Get image for an analysis. Requires auth.
- `GET /health` – Health check.

## Model training (Python)

Jupyter notebooks in this folder are used for dataset prep and training the ResNet DR model:

- **diabeVision.ipynb** – ResNet / model training (PyTorch).
- **fyp-gans.ipynb** – Data loading (Kaggle DR), augmentation, SMOTE, DataLoader, GANs (PyTorch).

Requires: `torch`, `torchvision`, `opencv-python`, `Pillow`, `scikit-learn`, `imbalanced-learn`.
