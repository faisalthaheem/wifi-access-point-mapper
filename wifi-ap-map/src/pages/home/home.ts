import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { RecordedEntry } from '../pojo/mytypes';
import { AlertController } from 'ionic-angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { ContactPage } from '../contact/contact';
import { File } from '@ionic-native/file';
import { StatusBar } from '@ionic-native/status-bar';
import { WifiSelectorPage } from '../wifiselector/wifiselector';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isRecording: boolean = false;
  projectName: string = '';
  recordedEntries: Array<RecordedEntry> = new Array();
  lastRecordedEntry: RecordedEntry = new RecordedEntry();
  currEntry: RecordedEntry = new RecordedEntry();

  //event handlers
  networkSelectedEventHandler: any;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private hotspot: Hotspot,
    private file: File,
    public events: Events
  ) {

    //for dev only
    // this.projectName = 'dev';
    // this.lastRecordedEntry.gridCol = 10;
    // this.lastRecordedEntry.gridRow = 23;
    // this.lastRecordedEntry.rssi = -88;
    // this.lastRecordedEntry.addr = '00:33:DD:FF:33';
    // this.lastRecordedEntry.friendlyname = 'keep out!';

    this.networkSelectedEventHandler = this.wifiNetworkSelected.bind(this);
    this.events.subscribe('WifiSelectorPage:networkSelected',this.networkSelectedEventHandler);

  }

  pushCurrent(){

    var entryToPush = this.currEntry;
    this.currEntry = new RecordedEntry();
    this.currEntry.gridCol = entryToPush.gridCol;
    this.currEntry.gridRow = entryToPush.gridRow;

    this.lastRecordedEntry = entryToPush;
    this.recordedEntries.push(entryToPush);

  }

  popCurrent(){

    this.presentConfirm('Remove last added', 'Are you sure?').then(data => {
      this.recordedEntries.pop();
    }).catch(err => {
      console.log(err);
    });

  }

  resetProject(){

    this.presentConfirm('Close Project', 'Are you sure?').then(data => {

      this.isRecording = false;

      console.log('Trying to save to: ' + this.file.externalRootDirectory + 'WifiMapper/' + this.projectName + '.json');

      //save the data here
      this.file.createDir(
        this.file.externalRootDirectory,
        'WifiMapper',
        true
      ).then((res)=>{

        var dataToWrite = JSON.stringify(this.recordedEntries);

        this.file.writeFile(

          this.file.externalRootDirectory,
          'WifiMapper/' + this.projectName + '.json',
          dataToWrite,
          {replace:true}

        ).then((res)=>{

          //reset stuff
          this.lastRecordedEntry = new RecordedEntry();
          this.currEntry = new RecordedEntry();
          this.recordedEntries = new Array();

        }).catch((res)=>{
          console.error(JSON.stringify(res));
        });

      }).catch((res)=>{
        console.error(JSON.stringify(res));
      });

    }).catch((err) => {
      console.error(JSON.stringify(err));
    });
  }

  setCurrToHotspotNetwork(network: HotspotNetwork){
    this.currEntry.addr = network.BSSID;
    this.currEntry.friendlyname = network.SSID;
    this.currEntry.rssi = network.level;
  }

  presentWifiSelection(){

    this.navCtrl.push(WifiSelectorPage);
  }

  wifiNetworkSelected(selectedNetwork: HotspotNetwork){

    this.setCurrToHotspotNetwork(selectedNetwork);

  }

  newProject(){


    this.promptProjectName().then((data) =>{

      this.projectName = data['projectName'];
      this.isRecording = true;

    }).catch((res) =>{
      console.log('cancelled new project creation: ' + res);
    });
  }

  promptProjectName() {

    return new Promise((resolve,reject) => {
      let alert = this.alertCtrl.create({
        title: 'New Project',
        inputs: [
          {
            name: 'projectName',
            placeholder: 'Project Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              reject();
            }
          },
          {
            text: 'Create',
            handler: data => {
              resolve(data);
            }
          }
        ]
      });
      alert.present();
     });
  }

  presentConfirm(tytle, msg) {

    return new Promise((resolve,reject) => {
      let alert = this.alertCtrl.create({
        title: tytle,
        message: msg,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              reject('cancelled');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              resolve();
            }
          }
        ]
      });
      alert.present();
    });
  }

}
