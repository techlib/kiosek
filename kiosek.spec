# Package contains no binaries.
%global debug_package %{nil}

Name:		kiosek
Version:	1
Release:	1%{?dist}
Summary:	NTK Kiosk Firefox Addon

Group:		Applications/Internet
License:	MIT
URL:		http://github.com/techlib/kiosek
Source0:	%{name}-%{version}.tar.gz

BuildRequires:	zip make
Requires:	firefox

BuildArch:	noarch

%description
A system-wide Firefox extension that enables kiosk mode.

%prep
%setup -q


%build
make %{?_smp_mflags}


%install
make install DESTDIR=%{buildroot} libdir=%{_libdir}


%files
%doc LICENSE README.md
%{_libdir}/firefox/browser/extensions/*


%changelog

