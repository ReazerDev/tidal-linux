import electronPackager from 'electron-packager';

electronPackager({
  dir: './dist/',
  download: {
    mirrorOptions: {
      mirror: 'https://github.com/castlabs/electron-releases/releases/download/',
    },
  },
  name: 'Tidal',
  executableName: 'tidal',
})