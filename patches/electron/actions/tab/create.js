import {
    WebContentsView
  } from 'electron'
  import getElectronStoreKey from '../electronStore/getKey.js'
  import getActiveTabId from './getActiveId.js'
  import setActiveTab from './setActive.js'
  import setTabBounds from './setBounds.js'
  import setViewScale from '../view/setScale.js'
  import {
    baseUrl
  } from '../../helpers/urls.js'
  import {
    isDevelopment
  } from '../../helpers/utils.js'
  import {
    handleNewWindow
  } from '../../handlers/app.js'
  import changeViewBackgroundColor
    from '../view/changeBackgroundColor.js'
  import {
    preloadScriptFilePath
  } from '../../helpers/paths.js'
  import packageconf from '../../../package.json' with { type: 'json' }
  
  export default function (
    data
  ) {
    const {
      uuid,
      path
    } = data
  
    const options = {
      webPreferences: {
        devTools: isDevelopment,
        preload: preloadScriptFilePath,
        nodeIntegration: true
      }
    }
  
    const tab =
      new WebContentsView(
        options
      )
  
    tab.webContents.setUserAgent("mufbeta/" + packageconf.version)
  
    tab.uuid = uuid
  
    tab.isTab = true
  
    changeViewBackgroundColor(
      tab
    )
  
    mainWindow
      .contentView
      .addChildView(
        tab
      )
  
    const isSwitchToNewTab =
      getElectronStoreKey(
        'layout.isSwitchToNewTab'
      )
  
    if (!isSwitchToNewTab) {
      setActiveTab(
        getActiveTabId()
      )
    }
  
    setTabBounds(
      tab
    )
  
    const url =
      `${baseUrl}#/${path}`
  
    tab
      .webContents
      .loadURL(
        url
      )
  
    if (isDevelopment) {
      const devToolsData = {
        mode: 'right'
      }
  
      tab
        .webContents
        .openDevTools(
          devToolsData
        )
    }
  
    mainView
      .webContents
      .send(
        'add-tab',
        data
      )
  
    function handleDidStartNavigation () {
      const data = {
        'layout.tabId': uuid
      }
  
      tab
        .webContents
        .send(
          'update-store',
          data
        )
    }
  
    function handleDomReady () {
      setViewScale(
        tab
      )
    }
  
    function addNewWindowHandler (
      details
    ) {
      return handleNewWindow(
        {
          url: details.url,
          tabId: tab.uuid
        }
      )
    }
  
    tab
      .webContents
      .setWindowOpenHandler(
        addNewWindowHandler
      )
  
    tab
      .webContents
      .on(
        'did-start-navigation',
        handleDidStartNavigation
      )
  
    tab
      .webContents
      .on(
        'dom-ready',
        handleDomReady
      )
  }
 