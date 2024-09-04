.PHONY: help
help:	## Show this help.
	@grep -hE '^[A-Za-z0-9_ \-]*?:.*##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run:	## Run the app
	@clear
	@docker run --env FORCE_COLOR=1 -v ./:/home/node/app -w /home/node/app --name "rss-checker" node:20.17-alpine npm run dev

exec:	## SSH into a container with the app
	@docker run -it -v ./:/home/node/app -w /home/node/app --name "rss-checker" node:20.17-alpine sh
	@make clean

clean:  ## Remove existing containers and volumes make
	@docker container rm --volumes $$(docker ps -a --filter "status=exited" --filter "name=rss-checker" --quiet) &> /dev/null
