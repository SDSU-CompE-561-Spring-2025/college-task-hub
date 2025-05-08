# TaskU

A platform designed to help college students find quick, flexible jobs during their free time. Students can:

- Sign up and create a profile
- Browse or get notified of nearby gigs that match their skills
- Accept or decline tasks such as tutoring, dog walking, helping with moves, etc.

Clients can post tasks with the required skills, and the platform automatically pings matching students in the area.

The main goal is to offer students a way to earn extra cash without committing to a regular job.

## Deployment

To run the site, clone the repo, install hatch & npm, and run the application:

```bash
git clone https://github.com/SDSU-CompE-561-Spring-2025/college-task-hub.git
cd college-task-hub
pip install hatch
npm install
```

### Backend

Prerequisites: Ensure you are in the home directory

```bash
cd Backend
hatch shell
hatch run dev
```

### Frontend

Prerequisites: Ensure you are in the home directory

```bash
cd Frontend
npm run dev
```

## Unit Tests

To run unit tests:

```bash
cd Backend
hatch shell
hatch run tests
```

## Software and Frameworks Used

### Backend

- 🐍 Python 3.11+
- ⚡ FastAPI - Backend framework
- 🐘 PostgreSQL (via SQLAlchemy) – database
- ✉️ Pydantic for data validation
- 🧪 Hatch for environment management

### Frontend

- 🧠 TypeScript
- ⚛️ React
- 🧱 ShadCN UI – component library
- 🪝 Next.js – server framework
- 🎨 Tailwind CSS – styling

## Authors

- [@GracePeebles](https://github.com/GracePeebles)
- [@konradekk14](https://www.github.com/konradekk14)
- [@robertrodarte](https://github.com/robertrodarte)
- [@victorianguyenn](https://github.com/victorianguyenn)
- [@badromar00](https://github.com/badromar00)

## License

`TaskU` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
