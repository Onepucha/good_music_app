deploy-stage:
	@cp .env.production .env
	npx quasar build
	cp -a dist/spa/. dist/
	rm -rf dist/spa
	@pm2 start ecosystem.config.cjs --only frontend

deploy:
	npx quasar build
	git checkout main
	git pull origin main
	git merge dev
	git push origin
	git checkout dev

dev:
	@cp .env.dev .env
	quasar dev

dev-ios:
	@cp .env.app .env
	quasar dev -m capacitor -T ios --ide

start-ios:
	@cp .env.app .env
	quasar build -m capacitor -T ios --ide

build-ios:
	@cp .env.app .env
	quasar build -m capacitor -T ios


build:
	@cp .env.production .env
	quasar build
