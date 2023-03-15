deploy-stage:
	npm run build
	@pm2 start ecosystem.config.cjs --only frontend-stage

dev:
	quasar dev

dev-ios:
	quasar dev -m capacitor -T ios --ide

start-ios:
	quasar build -m capacitor -T ios --ide

build-ios:
	quasar build -m capacitor -T ios

