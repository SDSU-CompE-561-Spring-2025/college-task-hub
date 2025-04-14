# This is the backend structure of our project.

```text
Backend/
├── app/              
│   ├── core/           # Core configs, auth and security
│   ├── crud/           # CRUD function definitions
│   ├── middleware/     # FastAPI logging middleware
│   ├── models/         # Database models
│   ├── routers/        # FastAPI routes
│   ├── schema/         # Schema for models
│   ├── scripts/        # SQLite db scripts
│   ├── tests/          # Backend unit tests
│   └── main.py         # Entry point of the application
├── pyproject.toml      # Hatch project config file
```