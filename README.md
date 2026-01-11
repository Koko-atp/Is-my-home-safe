# Is-my-home-safe
## backend setup for dev

```
cd imhs_backend
npm install

npx wrangler d1 create IMHS_DB

```
### then binding d1 in wrangler.json

### create local db for dev
```
npx wrangler d1 execute my_db --file=./src/schema.sql --local
```
### run dev and save the url for frontend
```
npm run dev

```

## frontend setup
### fallback from backend dir
```
cd ../imhs_frontend
```

```
npm install

```
### create .env file and set backend url
##### .env 
```
VITE_DB_API= 'your backend url'
```

```
npm run dev
```


