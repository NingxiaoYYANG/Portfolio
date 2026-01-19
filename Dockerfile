# Railway will use this Dockerfile if Root Directory is not set to 'backend'
FROM python:3.11-slim

WORKDIR /app

# Copy backend files
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Expose port
EXPOSE 5000

# Start command
CMD ["gunicorn", "run:app", "--bind", "0.0.0.0:5000"]
