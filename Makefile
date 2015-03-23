all:
	zip -r kiosek@techlib.cz.xpi chrome.manifest content install.rdf defaults components modules

clean:
	rm -f $(wildcard *.xpi)

clean:
