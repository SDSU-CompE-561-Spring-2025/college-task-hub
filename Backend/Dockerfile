# Use an official Python image from the Docker Hub
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Install dependencies
COPY Backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Hatch (if you don't have it in requirements.txt)
RUN pip install hatch

# Copy the backend code to the container
COPY . .

# Set environment variable for FastAPI app
ENV PYTHONPATH=/app

# Expose FastAPI port (default 8000)
EXPOSE 8000

# Run FastAPI with `hatch run dev`
CMD ["hatch", "run", "dev"]
