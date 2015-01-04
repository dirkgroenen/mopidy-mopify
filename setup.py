from __future__ import unicode_literals

import re
from setuptools import setup, find_packages


def get_version(filename):
    content = open(filename).read()
    metadata = dict(re.findall("__([a-z]+)__ = '([^']+)'", content))
    return metadata['version']


setup(
    name='Mopidy-Mopify',
    version=get_version('mopidy_mopify/__init__.py'),
    url='https://github.com/dirkgroenen/Mopify',
    license='GNU General Public License v3 (GPLv3)',
    author='Dirk Groenen',
    author_email='dirk@bitlabs.nl',
    description='A Mopidy Web client based on the (old) Spotify interface. Improved to work with spotify as main library.',
    long_description=open('README.md').read(),
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
        'setuptools',
        'Mopidy >= 0.19',
        'Mopidy-Spotify >= 1.2.0'
    ],
    entry_points={
        'mopidy.ext': [
            'mopify = mopidy_mopify:MopifyExtension',
        ],
    },
    classifiers=[
        'Environment :: No Input/Output (Daemon)',
        'Intended Audience :: End Users/Desktop',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 2',
        'Topic :: Multimedia :: Sound/Audio :: Players',
    ],
)