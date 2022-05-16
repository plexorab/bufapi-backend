#!/bin/bash

curl -s -d "username=jimmy&password=abc123xyz" -X POST http://localhost:3636/api/bufab/v1/auth/signin | jq -r '.data.sessionid' > sessionid.txt
