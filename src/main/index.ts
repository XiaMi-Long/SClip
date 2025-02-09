
import { app } from 'electron'
import { ApplicationRegister } from './app/application'

app.whenReady().then(() => {

  ApplicationRegister.appRegister.init()
  ApplicationRegister.getMainWindowMethod().init()
})




