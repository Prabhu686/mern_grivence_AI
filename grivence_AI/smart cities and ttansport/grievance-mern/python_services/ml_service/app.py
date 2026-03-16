from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

app = Flask(__name__)
CORS(app)

TRAIN_DATA = [
    ("water leak pipe broken", "Water & Sanitation", "High"),
    ("road pothole damaged", "Roads & Transport", "Medium"),
    ("electricity power outage", "Electricity", "Critical"),
    ("hospital emergency medical", "Healthcare", "Critical"),
    ("school education teacher", "Education", "Low"),
    ("police crime theft safety", "Public Safety", "High"),
    ("garbage waste pollution", "Environment", "Medium"),
    ("drainage sewage overflow", "Water & Sanitation", "High"),
    ("traffic signal not working", "Roads & Transport", "Medium"),
    ("streetlight broken dark", "Electricity", "Medium"),
]

X_train = [text for text, _, _ in TRAIN_DATA]
y_dept = [dept for _, dept, _ in TRAIN_DATA]
y_priority = [priority for _, _, priority in TRAIN_DATA]

dept_model = Pipeline([('tfidf', TfidfVectorizer(max_features=100)), ('clf', MultinomialNB())])
dept_model.fit(X_train, y_dept)

priority_model = Pipeline([('tfidf', TfidfVectorizer(max_features=100)), ('clf', MultinomialNB())])
priority_model.fit(X_train, y_priority)

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json or {}
    text = f"{data.get('title', '')} {data.get('description', '')}".lower()
    
    if not text.strip():
        return jsonify({'department': 'Administration', 'priority': 'Medium'})
    
    department = dept_model.predict([text])[0]
    priority = priority_model.predict([text])[0]
    
    return jsonify({'department': department, 'priority': priority})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
