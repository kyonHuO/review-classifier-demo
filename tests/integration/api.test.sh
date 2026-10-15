#!/usr/bin/env bash
# Integration test for the account + jobs API against the real Workers runtime
# (`wrangler pages dev`, workerd) with a local D1 database.
#
# Setup:
#   npx wrangler d1 execute nagiport-accounts --local --file=migrations/0001_auth.sql
#   npx wrangler d1 execute nagiport-accounts --local --file=migrations/0002_jobs.sql
#   npx wrangler pages dev . --d1 DB=REPLACE_WITH_D1_DATABASE_ID --local-protocol https --port 8790
#   bash tests/integration/api.test.sh
#
# Override the target with BASE=https://host:port. The server uses a Secure
# cookie, so it must be tested over https (pages dev --local-protocol https).
set -u
BASE="${BASE:-https://127.0.0.1:8790}"
CURL="curl -sk"
J="$(mktemp -d)"
trap 'rm -rf "$J"' EXIT
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS  $1"; pass=$((pass+1)); else echo "FAIL  $1  expected=$2 actual=$3"; fail=$((fail+1)); fi; }
code() { $CURL -o /dev/null -w "%{http_code}" "$@"; }

EMAIL_A="alice+$RANDOM@example.com"
EMAIL_B="bob+$RANDOM@example.com"

check "register A (201)" 201 "$(code -X POST "$BASE/api/auth/register" -H 'content-type: application/json' -H "origin: $BASE" -c "$J/a" -d "{\"email\":\"$EMAIL_A\",\"password\":\"pass1234\",\"name\":\"Alice\"}")"
check "me A after register (200)" 200 "$(code "$BASE/api/auth/me" -H "origin: $BASE" -b "$J/a")"
check "duplicate register (409)" 409 "$(code -X POST "$BASE/api/auth/register" -H 'content-type: application/json' -H "origin: $BASE" -d "{\"email\":\"$EMAIL_A\",\"password\":\"pass1234\"}")"
check "wrong password (401)" 401 "$(code -X POST "$BASE/api/auth/login" -H 'content-type: application/json' -H "origin: $BASE" -d "{\"email\":\"$EMAIL_A\",\"password\":\"wrongpass1\"}")"
check "malformed json (400)" 400 "$(code -X POST "$BASE/api/auth/login" -H 'content-type: application/json' -H "origin: $BASE" -d '{bad json')"
check "cross-origin (403)" 403 "$(code -X POST "$BASE/api/auth/login" -H 'content-type: application/json' -H "origin: https://evil.example" -d "{\"email\":\"$EMAIL_A\",\"password\":\"pass1234\"}")"
check "register B (201)" 201 "$(code -X POST "$BASE/api/auth/register" -H 'content-type: application/json' -H "origin: $BASE" -c "$J/b" -d "{\"email\":\"$EMAIL_B\",\"password\":\"pass1234\"}")"
check "malformed cookie (401 not 500)" 401 "$(code "$BASE/api/auth/me" -H "origin: $BASE" -H 'cookie: np_session=%zz%')"

JOB_ID=$($CURL -X POST "$BASE/api/jobs" -H 'content-type: application/json' -H "origin: $BASE" -b "$J/a" \
  -d '{"results":[{"id":1,"text":"good","category":"positive","candidate":"positive","score":0.6,"margin":0.1},{"id":2,"text":"bad","category":"negative","candidate":"negative","score":0.5,"margin":0.05}]}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin).get("job",{}).get("id",""))')
check "create job A (id present)" "yes" "$([ -n "$JOB_ID" ] && echo yes || echo no)"
check "list jobs A (1)" 1 "$($CURL "$BASE/api/jobs" -H "origin: $BASE" -b "$J/a" | python3 -c 'import sys,json;print(len(json.load(sys.stdin).get("jobs",[])))')"
check "job detail A (200)" 200 "$(code "$BASE/api/jobs/$JOB_ID" -H "origin: $BASE" -b "$J/a")"
check "job csv A (200)" 200 "$(code "$BASE/api/jobs/$JOB_ID/csv" -H "origin: $BASE" -b "$J/a")"
check "job csv A content-type" "text/csv; charset=utf-8" "$($CURL -o /dev/null -D - "$BASE/api/jobs/$JOB_ID/csv" -H "origin: $BASE" -b "$J/a" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print $2}')"

check "list jobs B (0, isolated)" 0 "$($CURL "$BASE/api/jobs" -H "origin: $BASE" -b "$J/b" | python3 -c 'import sys,json;print(len(json.load(sys.stdin).get("jobs",[])))')"
check "B access A job (404)" 404 "$(code "$BASE/api/jobs/$JOB_ID" -H "origin: $BASE" -b "$J/b")"
check "B access A csv (404)" 404 "$(code "$BASE/api/jobs/$JOB_ID/csv" -H "origin: $BASE" -b "$J/b")"
check "no-cookie list jobs (401)" 401 "$(code "$BASE/api/jobs" -H "origin: $BASE")"

check "logout A (200)" 200 "$(code -X POST "$BASE/api/auth/logout" -H "origin: $BASE" -b "$J/a" -c "$J/a")"
check "me after logout (401)" 401 "$(code "$BASE/api/auth/me" -H "origin: $BASE" -b "$J/a")"

echo "-----"
echo "TOTAL pass=$pass fail=$fail"
[ "$fail" = 0 ]
