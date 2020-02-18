#!/bin/bash
shopt -s nocaseglob

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

printenv

echo "Waiting for DB"
while ! nc -z ${MYSQL_HOST} ${MYSQL_PORT}; do
  sleep 1 # wait 1 second before check again
done

echo Running python startups
python manage.py migrate

echo Starting Gunicorn.

exec gunicorn course_manager.wsgi:application \
        --bind 0.0.0.0:${GUNICORN_PORT} \
        --workers="${GUNICORN_WORKERS}" \
        ${GUNICORN_RELOAD}