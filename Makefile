all: kiosek@techlib.cz.xpi

kiosek@techlib.cz.xpi:
	zip -r $@ chrome.manifest content install.rdf defaults components modules

clean:
	rm -f $(wildcard *.xpi)

clean:
