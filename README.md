# SV Infra Projects — Website + Admin CMS

A full, dynamic business website and admin dashboard for **SV Infra Projects**
(ACP cladding, structural glazing, aluminium, interiors, commercial & residential
construction finishing), built with React + Vite + Tailwind CSS on the frontend
and Firebase (Auth, Firestore, Storage) on the backend.

Nothing on the public site is hard-coded — hero slides, services, project
categories, projects, gallery, testimonials, contact details, and homepage
section order/copy are all editable from `/admin` and stored in Firestore.

---

## 1. Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Lucide icons, React Helmet Async (SEO)
- **Backend:** Firebase Authentication (admin login), Firestore (database), Firebase Storage (images)
- Cloudinary is supported as a drop-in alternative to Firebase Storage (see step 4)

## 2. Project structure

```
src/
  firebase/config.js        Firebase app initialization
  context/                  AuthContext, SettingsContext (global site settings)
  utils/                    firestore.js (generic CRUD), storageUpload.js (image upload)
  components/                Navbar, Footer, WhatsAppButton, HeroSlider, ServiceCard,
                              ProjectCard, Lightbox, ImageUploader, AdminSidebar, AdminLayout,
                              ProtectedRoute, PublicLayout
  pages/                     Public site: Home, About, Services, ServiceDetail,
                              Projects, ProjectDetail, Gallery, Contact, NotFound
  admin/                     Admin panel: Login, Dashboard, ProjectsManager,
                              ProjectCategoriesManager, ServicesManager, GalleryManager,
                              GalleryCategoriesManager, HeroSliderManager, AboutManager,
                              Enquiries, Testimonials, ContactInfoManager, WebsiteSettings, SEOSettings
firestore.rules              Firestore security rules
storage.rules                Firebase Storage security rules
```

## 3. Firebase project setup

1. Go to the [Firebase console](https://console.firebase.google.com) and create a new project.
2. **Authentication** → Sign-in method → enable **Email/Password**. Then go to
   the **Users** tab and add yourself as the first admin user (email + password).
   This account is what you'll use to log in at `/admin/login`.
3. **Firestore Database** → Create database (start in production mode, pick your region).
4. **Storage** → Get started (this is where uploaded images live by default).
5. In Project Settings → General, scroll to "Your apps" → add a **Web app**.
   Copy the config values into a `.env` file at the project root (copy `.env.example`
   and fill it in):

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

6. Deploy the security rules (or paste them into the console's Rules tab):

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore storage   # point at this project, keep default rule file names
   firebase deploy --only firestore:rules,storage:rules
   ```

   The rules in `firestore.rules` / `storage.rules` already match this repo's
   collections — public users get read-only access to active content and can
   create enquiries; every write requires a signed-in admin.

## 4. (Optional) Use Cloudinary instead of Firebase Storage

If you'd rather host images on Cloudinary, create a free account, an
**unsigned upload preset**, then set:

```
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset-name
```

`src/utils/storageUpload.js` automatically switches to Cloudinary when these
two variables are present — no other code changes needed.

## 5. Install & run

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## 6. First-time content setup (as admin)

Once deployed, log in at `/admin/login` with the user you created in step 3,
then, in this order:

1. **Project Categories** → add categories (ACP Cladding, Structural Glazing, etc).
2. **Services** → add each service (cover image, description, gallery images).
3. **Projects** → add projects, assigning each to a category, with a cover
   image and multiple gallery images.
4. **Gallery Categories** → add categories, then **Gallery** → upload images into them.
5. **Hero Slider** → upload homepage hero slides.
6. **About Us** → edit intro/vision/mission/why-choose-us content.
7. **Testimonials** → add and approve testimonials to show them on the homepage.
8. **Contact Information** → phone numbers, WhatsApp number, addresses, map, socials.
9. **Website Settings** → company name/logo/tagline, footer text, and toggle/reorder
   homepage sections.
10. **SEO Settings** → site title, meta description, keywords, OG image.

Everything you publish appears immediately on the public site — no redeploy needed.

## 7. Deployment

Any static host works (Vercel, Netlify, Firebase Hosting). For Firebase Hosting:

```bash
npm run build
firebase init hosting   # public directory: dist, configure as single-page app: yes
firebase deploy --only hosting
```

## 8. Notes

- Only one admin route tree exists (`/admin/*`); anyone not signed in is
  redirected to `/admin/login`.
- Deleting a project/service/category/testimonial also removes its uploaded
  image(s) from Storage (Cloudinary images are removed from Firestore only,
  since deleting from Cloudinary requires a signed, server-side API call).
- All list pages (Projects, Gallery) build their category filters dynamically
  from Firestore — creating a new category makes it appear on the site with
  no code changes.
