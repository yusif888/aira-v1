# Mapping Modul & File Project PUSDA Jatim SISDA

Dokumen ini memetakan file-file source code berdasarkan modul fungsionalnya untuk memudahkan navigasi developer baru.

## 1. Berita (News)

- **Backend Controller**:
    - `app/Http/Controllers/Admin/NewsController.php`
    - `app/Http/Controllers/Public/NewsController.php` (via `StaticController` saat ini, perlu refactor)
- **Models**:
    - `app/Models/News/NewsArticle.php`
    - `app/Models/News/NewsCategory.php`
    - `app/Models/News/NewsTag.php`
    - `app/Models/News/NewsComment.php`
    - `app/Models/News/NewsImage.php`
    - `app/Models/News/NewsAttachment.php`
- **Routes**:
    - Admin: `routes/admin/news.php`
    - Public: `routes/public/news.php`
- **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/News/` (Index, Create, Edit, Categories, Tags, Trash)
    - Public: `resources/js/Public/Pages/News/` (Index, Show)
- **Database**:
    - Migration: `2025_08_07_022922_create_news_table.php`

## 2. Dokumen (Documents)

- **Backend Controller**:
    - `app/Http/Controllers/Admin/DocumentController.php`
    - `app/Http/Controllers/Public/DocumentController.php`
- **Models**:
    - `app/Models/Documents/DocumentsEntry.php`
    - `app/Models/Documents/DocumentsCategory.php`
    - `app/Models/Documents/DocumentsType.php`
    - `app/Models/Documents/DocumentsTag.php`
- **Routes**:
    - Admin: `routes/admin/documents.php`
    - Public: `routes/public/document.php`
- **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/Documents/` (Index, Create, Edit, Categories, Tags, Trash, Show)
    - Public: `resources/js/Public/Pages/Documents/` (Index, Show)
- **Database**:
    - Migration: `2025_08_11_140424_create_documents_tables.php`

## 3. Pelayanan (FHD, SIH3, JOSS)

- **Backend Controller**:
    - `app/Http/Controllers/Admin/PelayananController.php`
    - `app/Http/Controllers/Public/PelayananController.php`
- **Models**:
    - `app/Models/Pelayanan.php`
- **Routes**:
    - Admin: `routes/admin/pelayanan.php`
    - Public: `routes/public/pelayanan.php`
- **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/Pelayanan/` (Index, Show)
    - Public: `resources/js/Public/Pages/Pelayanan/` (Index, Show)
- **Database**:
    - Migration: `2025_10_13_160943_create_pelayanans_table.php`

## 4. Infrastruktur SDA

- **Backend Controller**:
    - `app/Http/Controllers/Admin/InfrastrukturSDAController.php`
    - `app/Http/Controllers/Public/InfrastrukturSDAController.php`
- **Models**:
    - `app/Models/InfrastrukturSDA/DataInfrastrukturSDA.php`
    - `app/Models/InfrastrukturSDA/InfrastrukturCategory.php`
- **Routes**:
    - Admin: `routes/admin/infrastruktur-sda.php`
    - Public: `routes/public/infrastruktur-sda.php`
- **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/InfrastrukturSDA/` (Index, Create, Edit, Categories)
    - Public: `resources/js/Public/Pages/InfrastrukturSDA/` (Index, MapView)
- **Database**:
    - Migration: `2025_10_27_045237_create_table_data_infrastruktur-sda.php`

## 5. Portal Data

- **Backend Controller**:
    - `app/Http/Controllers/Admin/PortalDataController.php`
    - `app/Http/Controllers/Public/PortalDataController.php`
- **Models**:
    - `app/Models/PortalData/PortalDataDataset.php` (perlu cek implementasi)
- **Routes**:
    - Admin: `routes/admin/portal-data.php`
    - Public: `routes/public/portal-data.php`
- **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/PortalData/` (Datasets, Categories)
    - Public: `resources/js/Public/Pages/PortalData/` (Index)
- **Database**:
    - Migration: `2025_08_08_042741_create_portaldata_table.php`

## 6. SDA Dalam Angka

- **Backend Controller**:
    - `app/Http/Controllers/Public/SDADalamAngkaController.php`
- **Routes**:
    - Public: `routes/public/sda-dalam-angka.php`
- **Frontend Pages**:
    - Public: `resources/js/Public/Pages/SDADalamAngka/` (Index, Show/2025/...)
- **Data Source**:
    - JSON Files: `resources/js/data/SDADalamAngka/`

## 7. Profil (Halaman Statis)

- **Backend Controller**:
    - `app/Http/Controllers/Public/StaticController.php`
- **Routes**:
    - Public: `routes/public/profile.php`
- **Frontend Pages**:
    - Public: `resources/js/Public/Pages/Static/Profil/` (VisiMisi, Tupoksi, Sejarah, Pimpinan, Struktur, dll)

## 8. User Management (RBAC)

- **Backend Controller**:
    - `app/Http/Controllers/Admin/UserController.php`
    - `app/Http/Controllers/Admin/RoleController.php`
    - `app/Http/Controllers/Admin/PermissionController.php`
- **Models**:
    - `app/Models/User.php`
    - `app/Models/Role.php` (extends Spatie Role)
- **Routes**:
    - Admin: `routes/admin/user.php`
    - Admin: `routes/admin/role.php`
    - Admin: `routes/admin/permission.php`
- **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/Users/`
    - Admin: `resources/js/Admin/Pages/Roles/`
    - Admin: `resources/js/Admin/Pages/Permissions/`
- **Database**:
    - Migration: `2025_06_17_020441_create_permission_tables.php`

## 9. Autentikasi (Auth)

- **Backend Controller**:
    - `app/Http/Controllers/Auth/*` (AuthenticatedSession, RegisteredUser, PasswordReset, dll)
- **Routes**:
    - Auth: `routes/auth.php`
- **Frontend Pages**:
    - Public: `resources/js/Public/Pages/Auth/*` (Login, Register, ForgotPassword, dll)
