#!/usr/bin/make -f

package = $(shell grep ^Name: *.spec | awk '{print $$2}')
version = $(shell grep ^Version: *.spec | awk '{print $$2}')

xpi = kiosek@techlib.cz.xpi
libdir = /usr/lib$(shell uname -m | grep -o 64)

all:
	zip -r ${xpi} chrome.manifest content install.rdf defaults components modules

install:
	install -D -m644 ${xpi} ${DESTDIR}${libdir}/firefox/browser/extensions/${xpi}

clean:
	rm -f $(wildcard *.xpi) $(wildcard *.tar.gz)


dist:
	git clone --depth=1 .git ${package}-${version}
	rm -rf ${package}-${version}/.git
	tar -cvpzf ${package}-${version}.tar.gz ${package}-${version}
	rm -rf ${package}-${version}

# EOF
