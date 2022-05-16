#!/bin/bash

sessid=`cat sessionid.txt`

curl -s \
     -H "SessionID: $sessid" \
     -X GET http://localhost:3636/api/bufab/v1/admin/user/list | jq
