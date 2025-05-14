FROM python:3.12-slim

WORKDIR /app

# Install system dependencies including PostgreSQL development files
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install hatch
RUN pip install hatch

# Copy project files
COPY . .

# Create and activate virtual environment, install dependencies
RUN hatch env create && \
    . .venv/bin/activate && \
    pip install -e .

# Expose port
EXPOSE 8000

# Run the application
CMD ["hatch", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]  