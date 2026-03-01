Location & classification mock service

Run locally for testing AI/location integration:

Windows PowerShell commands:

```powershell
cd python_services\location_service
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
python app.py
```

This starts a Flask server on port 5001 with endpoints:
- POST /classify  -> accepts { description, location }
- POST /location  -> accepts { location }
