import { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.joao.tray-todo',
  productName: 'Tray Todo',
  directories: { output: 'dist-release' },
  files: ['out/**/*'],
  mac: {
    icon: 'resources/icon.png',
    target: ['dmg'],
    category: 'public.app-category.productivity'
  },
  win: {
    icon: 'resources/icon.ico',
    target: ['nsis'],
    signAndEditExecutable: false,
    sign: null
  },
  nsis: {
    oneClick: true,
    perMachine: false
  }
}

export default config
