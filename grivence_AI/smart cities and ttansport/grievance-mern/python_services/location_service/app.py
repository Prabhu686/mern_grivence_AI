from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simple mock classify endpoint
@app.route('/classify', methods=['POST'])
def classify():
    data = request.json or {}
    description = data.get('description', '')
    location = data.get('location', '')

    # Naive rules for demo purposes
    department = 'Administration'
    urgency = 'Medium'
    emotion = 'neutral'

    if 'water' in description.lower():
        department = 'Water & Sanitation'
    if 'road' in description.lower() or 'pothole' in description.lower():
        department = 'Roads & Transport'
    if 'urgent' in description.lower() or 'danger' in description.lower():
        urgency = 'High'
    if 'angry' in description.lower() or 'frustrat' in description.lower():
        emotion = 'angry'

    return jsonify({
        'department': department,
        'urgency': urgency,
        'emotion': emotion
    })

# Simple mock location endpoint
@app.route('/location', methods=['POST'])
def location():
    data = request.json or {}
    loc = data.get('location', '')

    # If client submits coordinates as "lat, lng" parse them
    lat = None
    lng = None
    confidence = 0.5
    if isinstance(loc, str) and ',' in loc:
        try:
            parts = [p.strip() for p in loc.split(',')]
            lat = float(parts[0])
            lng = float(parts[1])
            confidence = 0.98
        except:
            lat = None
            lng = None
            confidence = 0.3

    # Fallback mock location
    if lat is None:
        lat = 12.9716
        lng = 77.5946
        confidence = 0.6

    return jsonify({
        'lat': lat,
        'lng': lng,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
