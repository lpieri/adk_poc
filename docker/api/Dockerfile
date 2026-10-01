FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8080 \
    ALE_DATA_DIR=/data

WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt

RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin ale \
 && mkdir -p /data \
 && chown ale /data
COPY agents/ ./agents/
COPY app/ ./app/
COPY equine/ ./equine/
USER ale

VOLUME /data
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.environ.get('PORT', '8080') + '/health', timeout=4)"
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port \"$PORT\" --proxy-headers --forwarded-allow-ips='*'"]
