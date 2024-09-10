.PHONY: help
help:	## Show this help.
	@grep -hE '^[A-Za-z0-9_ \-]*?:.*##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run:	## Run the app
	@clear
	@docker run --rm --env FORCE_COLOR=1 -v ./:/home/node/app -w /home/node/app --name "rss-watcher" node:20.17-slim npm run dev

exec:	## SSH into a container with the app
	@docker run --rm -it -v ./:/home/node/app -w /home/node/app --name "rss-watcher" node:20.17-slim sh

deploy: ## Deploy the worker to cloudflare
	@npm run deploy

clean:  ## Remove existing containers and volumes make
	@docker container rm --volumes $$(docker ps -a --filter "status=exited" --filter "name=rss-watcher" --quiet) &> /dev/null
