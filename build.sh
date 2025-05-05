#!/bin/bash

cd frontend
bun i
bun run build
cp -av static ../static