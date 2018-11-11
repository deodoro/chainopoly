FROM python:latest
LABEL maintainer="deodoro.filho@gmail.com"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y python3-pip

RUN mkdir /app
WORKDIR /app
COPY server/requirements.txt /app
RUN pip3 install -r requirements.txt

ADD ./server /app
COPY ./client/dist/client /app/contents/client

RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

VOLUME /config
EXPOSE 8080

CMD ["python3", "server.py"]
