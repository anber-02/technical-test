
## Folder Structure BACKEND
```
prisma/                                # Prisma schema and migrations
src/
├── app/                               # app modules (user, auth)
│   ├── auth/
│   ├── user/
│
├── config/                            # custom utilities
│   ├── bcryptjs.ts/        
│   ├── jwt.ts/         
│
├── database/                          # configure prisma ORM
│   ├── index.ts/                      # Utility functions
│
├── middleware/                   
│   ├── auth.middleware.ts             # validate routes
│   ├── multer.middleware.ts           # upload images
│
├── public/
│   ├── uploads/                       # images
|
├── utils/                
│   ├── custom-error.ts                # handle common errors
│
├── app.ts            
├── routes.ts             
├── server.ts            
             
├── .env.local                         # Environment variables
├── .gitignore
├── package.json
```
## Folder Structure FRONTEND
```
src/
├── assets/                # Static assets (images, fonts)
│   ├── fonts/
│   ├── images/
│
├── components/           
│   ├── templates/         # DashboardLayout
│
├── lib/                   
│   ├── helpers/           # Utility functions
│   ├── hooks/             # Custom reusable hooks
│   ├── store/             # State management (Zustand)
│
├── schemas/                   
│   ├── userSchema.ts      # validate user data
│
├── pages/                 # Page components (LoginPage, DashboardPage)
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard pages
|
├── routes/                
│   ├── index.tsx
│   ├── ProtectedRoutes.tsx
│   ├── PublicRoutes.tsx
│
├── services/
│   ├── user.ts            # user API services
│   ├── auth.ts            # auth API services
├── .env.local             # Environment variables
├── .gitignore
├── package.json
```


## Backend 
1. clone repository
 ```bash
   git clone https://github.com/anber-02/technical-test.git
   cd technical-test/backend
 ```
2. install dependencies
 ```bash
   npm install
 ```

3. generate migrations
 ```bash
   npx prisma migrate dev
 ```
4. generate prisma client
 ```bash
   npx prisma generate
 ```
5. run server
 ```bash
   npm run dev
 ```


## Frontend 
1. clone repository
 ```bash
   git clone https://github.com/anber-02/technical-test.git
   cd technical-test/frontend
 ```
2. install dependencies
 ```bash
   npm install
 ```
3. run server
 ```bash
   npm run dev
 ```

## Libraries

### Frontend
- **React.js**
- **Tailwind CSS**:
- **React Router**:
- **Zod**:
- **jwt-decode**:

### Backend
- **Node.js**:
- **Express.js**:
- **Prisma**:
- **Zod**:
- **Multer**:
- **bcryptjs**:
- **cors**:
- **JWT (JSON Web Tokens)**:

### Database
- **PostgresSQL**:

