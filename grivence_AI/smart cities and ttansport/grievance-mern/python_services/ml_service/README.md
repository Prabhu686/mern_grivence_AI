# ML Service for Grievance Classification

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
python app.py
```

Service runs on `http://localhost:5002`

## Features

- **Machine Learning Model**: Uses scikit-learn's Naive Bayes classifier with TF-IDF vectorization
- **Department Classification**: Automatically categorizes grievances into departments
- **Priority Detection**: Predicts priority level (Low, Medium, High, Critical)

## API Endpoint

**POST /classify**
```json
{
  "title": "Water leak in street",
  "description": "There is a major water pipe leak"
}
```

Response:
```json
{
  "department": "Water & Sanitation",
  "priority": "High"
}
```
