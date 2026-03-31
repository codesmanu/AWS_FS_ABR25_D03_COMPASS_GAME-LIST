dev:
	(cd server && npm run dev) & (cd client && npm run dev)

build:
	(cd server && npm run build) && (cd client && npm run build)

start:
	(cd server && npm start) & (cd client && npm start)