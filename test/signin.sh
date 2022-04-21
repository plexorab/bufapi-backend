#!/bin/bash

curl -s -d "username=jimmy&password=abc123xyz" -X POST http://192.168.18.99:3636/api/bufab/v1/auth/signin | jq -r '.data.sessionid'
