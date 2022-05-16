#!/bin/bash

sessid=`cat sessionid.txt`

curl -s \
     -X POST http://localhost:3636/api/bufab/v1/admin/user/pwchange \
     -H "SessionID: $sessid" \
     -H "Content-Type: application/json" \
     -d '{ "userid":2, "password":"Fvx45pVn" }' | jq
