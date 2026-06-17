setup:
	@echo "Setting up project..."
	cp -n .env.example .env || true
	composer install
	npm install
	php artisan key:generate
	php artisan migrate --seed
	@echo "Setup done!"

clean:
	rm -rf vendor node_modules

dev:
	npm run dev

serve:
	php artisan serve

test:
	php artisan test

build:
	npm run build
