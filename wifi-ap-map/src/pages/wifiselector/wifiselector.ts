import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-wifiselector',
  templateUrl: 'wifiselector.html'
})
export class WifiSelectorPage {

  wifiNetworks: Array<HotspotNetwork> = new Array<HotspotNetwork>();

  constructor(
    public navCtrl: NavController,
    private hotspot: Hotspot,
    public toastCtrl: ToastController,
    public events: Events
  ) {

  }

  ionViewDidEnter(){
    this.scanWifiNetworks();
  }

  scanWifiNetworks(){

    this.hotspot.scanWifi().then((networks: Array<HotspotNetwork>) => {

      //console.log(".........hotspot..........",JSON.stringify(networks));

      //sorting...
      //conver to dictionary
      var unsorted = {};
      networks.forEach(network => {
        unsorted[network.level] = network;
      });

      var unsortedKeys = Object.keys(unsorted);
      unsortedKeys.sort();

      this.wifiNetworks = [];
      unsortedKeys.forEach(key => {
        this.wifiNetworks.push(unsorted[key]);
      });

      const toast = this.toastCtrl.create({
        message: 'Network List Refreshed',
        duration: 1500
      });
      toast.present();

    });
  }

  networkSelected(network: HotspotNetwork){
    console.log(JSON.stringify(network));

    this.events.publish('WifiSelectorPage:networkSelected', network);

    this.navCtrl.pop();
  }

}
