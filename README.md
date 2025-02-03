# SOM ANES REPORTING V3

_build with www.actionherojs.com for more information_

## To install:

## Build

1. Build and Tag Docker with new version
```
docker build --platform=linux/amd64 --tag anescontainerregistry1.azurecr.io/anes-atlas-v3-api:[version] .
```
2. Login to Azure if not already
```
az login
```
3. Log into container registry if not already
```
az acr login --name anescontainerregistry1
```
4. Push to registry
```
docker push anescontainerregistry1.azurecr.io/anes-atlas-v3-api:[version]
```
