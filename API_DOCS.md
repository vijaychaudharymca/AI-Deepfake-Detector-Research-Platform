# REST API Documentation

## Deepfake Detection & Research API

### 1. User Authentication

#### `POST /api/auth/login`
Authenticates a user and returns a signed JWT token.

**Demo Credentials**:
- **System Administrator Account**:
  - Email: `admin@deepfake-research.edu`
  - Password: `admin123`
- **AI Research Scholar Account**:
  - Email: `researcher@ai-lab.edu`
  - Password: `user123`

- **Request Body**:
  ```json
  {
    "email": "researcher@ai-lab.edu",
    "password": "user123"
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "token": "mock-jwt-user-token-2026",
    "user": {
      "id": "2",
      "name": "AI Research Scholar",
      "email": "researcher@ai-lab.edu",
      "role": "researcher"
    }
  }
  ```

---

### 2. Deepfake Inference Endpoint

#### `POST /api/detect`
Executes deep learning classification and Grad-CAM heatmap extraction.

- **Request Body**:
  ```json
  {
    "fileName": "actor_interview_manipulated.mp4",
    "mediaType": "video",
    "fileSize": "14.2 MB",
    "modelUsed": "vit",
    "datasetContext": "FaceForensics++"
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "id": "det-174829102",
    "fileName": "actor_interview_manipulated.mp4",
    "prediction": "DEEPFAKE",
    "confidence": 97.4,
    "modelUsed": "vit",
    "datasetContext": "FaceForensics++",
    "heatmap": {
      "hotspots": [
        { "x": 48, "y": 38, "intensity": 0.92, "label": "Periorbital Edge Boundary Distortion" }
      ]
    },
    "xaiExplanation": {
      "summary": "High-confidence facial manipulation detected using Vision Transformer self-attention mapping.",
      "keyFeatures": ["Frequency domain noise inconsistencies along jawline"]
    },
    "processingTimeMs": 1420
  }
  ```

---

### 3. Research Metrics

#### `GET /api/research/metrics?dataset=FaceForensics++`
Returns comparative benchmark metrics for CNN, ResNet50, and ViT.

---

### 4. Admin Telemetry & Audit Logs

#### `GET /api/admin/stats`
Returns total detections, real vs fake ratio, and model usage counters.

#### `GET /api/admin/logs`
Returns the system telemetry audit stream.
