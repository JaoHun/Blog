# Domestic Temporary Server Deployment

This guide is for a temporary China-accessible deployment without buying a domain or filing ICP registration yet.

## Deployment Model

```text
frontend/out
-> domestic lightweight server
-> Nginx static site
-> http://SERVER_PUBLIC_IP
```

Vercel remains the overseas preview deployment. The domestic server is only for access testing and should not be submitted to search engines before a real domain is ready.

## Build With Domestic Site URL

Run from `frontend` on your local machine or on the server:

```powershell
$env:SITE_URL='http://SERVER_PUBLIC_IP'
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
Remove-Item Env:\SITE_URL
```

Replace `SERVER_PUBLIC_IP` with the actual server IP.

The generated files in `frontend/out` will then use that IP in:

- `robots.txt`
- `sitemap.xml`
- `rss.xml`
- canonical and Open Graph URLs

## Upload Static Files

Upload the contents of `frontend/out` to the server directory:

```text
/var/www/blog
```

Upload the contents inside `out`, not the `out` folder itself.

## Nginx Site Config

Create an Nginx server block similar to:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/blog;
    index index.html;

    location / {
        try_files $uri $uri/ /404.html;
    }

    location ~* \.(?:css|js|mjs|json|xml|txt|svg|png|jpg|jpeg|gif|webp|ico)$ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }

    error_page 404 /404.html;
}
```

Reload Nginx after updating the config:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Acceptance Checks

Open these from a domestic network:

```text
http://SERVER_PUBLIC_IP/
http://SERVER_PUBLIC_IP/posts/
http://SERVER_PUBLIC_IP/posts/static-blog-mvp/
http://SERVER_PUBLIC_IP/rss.xml
http://SERVER_PUBLIC_IP/sitemap.xml
http://SERVER_PUBLIC_IP/robots.txt
http://SERVER_PUBLIC_IP/search-index.json
```

Expected:

- Home page opens.
- Post detail opens.
- Code highlighting is visible.
- Draft route `/posts/draft-example/` returns 404.
- RSS, Sitemap, robots, and search index are reachable.
- Mobile network access is noticeably more reliable than Vercel.

## Later Migration

When a real domain and ICP filing are ready:

1. Point the domain to the server or CDN.
2. Rebuild with `SITE_URL='https://YOUR_DOMAIN'`.
3. Redeploy `frontend/out`.
4. Verify RSS, Sitemap, robots, canonical, and Open Graph URLs.
