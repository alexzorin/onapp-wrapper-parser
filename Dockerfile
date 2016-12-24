FROM fedora:latest

RUN dnf -y install fedora-repos-rawhide && \
	dnf --enablerepo rawhide --best --allowerasing -y install make php php-curl php-openssl composer nodejs libuv git && \
	dnf clean all

WORKDIR /work

CMD make
