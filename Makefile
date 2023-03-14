deploy-stage:
	npm run build
	@pm2 start ecosystem.config.cjs --only frontend-stage
