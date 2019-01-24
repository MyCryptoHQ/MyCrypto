FROM electronuserland/builder:wine-03.18

RUN mkdir /hostHome
RUN apt-get update && apt-get install -y libusb-1.0 nasm graphicsmagick autoconf automake libtool python-pip
RUN pip install awscli --upgrade --user
ENV PATH "$PATH:/root/.local/bin"
