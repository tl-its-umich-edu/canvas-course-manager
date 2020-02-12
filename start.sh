#!/bin/bash
shopt -s nocaseglob

if [ -z "${ENV_FILE}" ]; then
    echo "no env file set"
    ENV_FILE="/secrets/env.json"
fi

echo $DJANGO_SETTINGS_MODULE

if [ -z "${GUNICORN_WORKERS}" ]; then
    GUNICORN_WORKERS=4
fi

if [ -z "${GUNICORN_PORT}" ]; then
    GUNICORN_PORT=8000
fi

if [ -z "${GUNICORN_TIMEOUT}" ]; then
    GUNICORN_TIMEOUT=120
fi

if [ "${GUNICORN_RELOAD}" ]; then
    GUNICORN_RELOAD="--reload"
else
    GUNICORN_RELOAD=""
fi

DOMAIN_JQ='.ALLOWED_HOSTS | . - ["127.0.0.1", "localhost", ".ngrok.io"] | if . | length == 0 then "localhost" else .[0] end'
echo "DOMAIN_JQ: ${DOMAIN_JQ}"


if [ -z "${ENV_JSON}" ]; then
   echo "ENV_JSON found"
   MYSQL_HOST=$(jq -r -c ".MYSQL_HOST | values" ${ENV_FILE})
   MYSQL_PORT=$(jq -r -c ".MYSQL_PORT | values" ${ENV_FILE})
   DOMAIN=$(jq -r -c "${DOMAIN_JQ} | values" ${ENV_FILE})
else
   echo "ENV_JSON not found"
   MYSQL_HOST=$(echo "${ENV_JSON}" | jq -r -c ".MYSQL_HOST | values")
   MYSQL_PORT=$(echo "${ENV_JSON}" | jq -r -c ".MYSQL_PORT | values")
   DOMAIN=$(echo "${ENV_JSON}" | jq -r -c "${DOMAIN_JQ} | values")
fi

echo "ENV_JSON: ${ENV_JSON}"

echo "Waiting for DB"
while ! nc -z ${MYSQL_HOST} ${MYSQL_PORT}; do
  sleep 1 # wait 1 second before check again
done



echo Running python startups
python manage.py migrate

echo "Setting domain of default site record"
# The value for LOCALHOST_PORT is set in docker-compose.yml
if [ ${DOMAIN} == "localhost" ]; then
  python manage.py site --domain="${DOMAIN}:${LOCALHOST_PORT}" --name="${DOMAIN}"
else
  python manage.py site --domain="${DOMAIN}" --name="${DOMAIN}"
fi

echo Starting Gunicorn.

exec gunicorn course_manager.wsgi:application \
        --bind 0.0.0.0:${GUNICORN_PORT} \
        --workers="${GUNICORN_WORKERS}" \
        ${GUNICORN_RELOAD}