# syntax=docker/dockerfile:1
FROM python:3.10-alpine
WORKDIR /code
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
COPY . .
# Drop Tables
# RUN ./manage.py sqlflush | ./manage.py dbshell
# Migrate
# RUN ["python", "manage.py", "migrate"]
# CMD ["python", "manage.py", "migrate", "&&", "python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000