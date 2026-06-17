# ERD — SISDA (Selected Tables)

Tabel yang disertakan: `users`, modul news, modul documents, `pelayanans`, infrastruktur SDA.
Tabel yang dilewati: `news_images`, `news_attachments`, `news_comments`, `documents_tags`, pivot tables, cache, jobs, sessions, permission tables.

```mermaid
erDiagram

    users {
        bigint id PK
        string name
        string email
        timestamp email_verified_at
        string password
        timestamps created_at
    }

    news_categories {
        bigint id PK
        string name
        string slug
        text description
    }

    news_tags {
        bigint id PK
        string name
        string slug
    }

    news_articles {
        bigint id PK
        bigint news_category_id FK
        bigint user_id FK
        string title
        string slug
        text excerpt
        longtext content
        string featured_image_path
        enum status
        boolean is_featured
        bigint view_count
        string meta_title
        text meta_description
        timestamp published_at
        timestamp deleted_at
    }

    news_article_tag {
        bigint news_article_id FK
        bigint news_tag_id FK
    }

    documents_categories {
        bigint id PK
        string name
        text description
        boolean is_active
    }

    documents_types {
        bigint id PK
        bigint category_id FK
        string name
        string icon
        enum status
    }

    documents_entries {
        bigint id PK
        bigint type_id FK
        bigint uploader_id FK
        string title
        string document_number
        year year
        text description
        string file_path
        timestamp deleted_at
    }

    pelayanans {
        bigint id PK
        string kode_antrian
        string nama_lengkap
        string email
        string instansi_asal
        enum jenis_layanan
        string nomor_whatsapp
        date tanggal_kedatangan
        enum status
        timestamp deleted_at
    }

    infrastruktur_categories {
        bigint id PK
        string code
        string name
        boolean is_active
    }

    data_infrastruktur_sda {
        bigint id PK
        bigint category_id FK
        string name
        string code
        enum type
        string legend_color
        decimal latitude
        decimal longitude
        json geojson
        string file_path
        boolean is_active
        timestamp deleted_at
    }

    %% News relationships
    users ||--o{ news_articles : "menulis"
    news_categories ||--o{ news_articles : "mengkategorikan"
    news_articles }o--o{ news_tags : "news_article_tag"

    %% Documents relationships
    documents_categories ||--o{ documents_types : "mengelompokkan"
    documents_types ||--o{ documents_entries : "mengklasifikasi"
    users ||--o{ documents_entries : "mengupload"

    %% Infrastruktur relationships
    infrastruktur_categories ||--o{ data_infrastruktur_sda : "mengkategorikan"
```
