import { OnInit, Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Events, AlertController, ToastController,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { AutocompletePage } from './autocomplete';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Userservice } from "../../providers/userservice";
import { UserData } from "../../providers/user-data";
import { LoginUser } from "../../models/logonUser";
import { LoginPage } from "../login/login";
/**
 * Generated class for the Userregistration page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-userregistration',
  templateUrl: 'userregistration.html',
})
export class Userregistration implements OnInit {
  @Output() formValidated = new EventEmitter<boolean>();
  user: LoginUser = new LoginUser();
  masks: any;
  step: any;
  stepCondition: any;
  stepDefaultCondition: any;
  currentStep: any;
  myForm: FormGroup;
  address;
  autocompleteItems: any;
  autocomplete: any;
  acService: any;
  placesService: any;
  userInfo: { name: string, email: string, phone: string, address: string, profilePic: string, noUrl: string, lat: string, lon: string, password: string, confirmPassword: string, subLocal: string, local: string, city: string, province: string ,category:string}
  = { name: '', email: '', phone: '', address: '', profilePic: '', noUrl: 'assets/img/nouser.jpg', lat: '', lon: '', password: '', confirmPassword: '', subLocal: '', local: '', city: '', province: '',category:'' };
  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.minLength(6), this.nameValidator.bind(this)]],
      'phone': ['', this.phoneValidator.bind(this)],
      // 'address': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'category': ['', Validators.compose([Validators.required])],
      'email': ['', [Validators.required, this.emailValidator.bind(this)]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])],
      confirmPassword: ['', Validators.required],
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public formBuilder: FormBuilder, public modalCtrl: ModalController, public alertCtrl: AlertController
    , public viewCtrl: ViewController, public evts: Events, private cdr: ChangeDetectorRef
    , private camera: Camera, private userservice: Userservice,private toastCtrl: ToastController,private userData:UserData, private loadingCtrl: LoadingController) {
    this.address = {
      place: ''
    };
    this.masks = {
      phoneNumber: [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };
    this.step = 1;//The value of the first step, always 1
    this.stepCondition = true;//Set to true if you don't need condition in every step
    this.stepDefaultCondition = this.stepCondition;//Save the default condition for every step
    //You can subscribe to the Event 'step:changed' to handle the current step
    this.evts.subscribe('step:changed', step => {
      //Handle the current step if you need
      this.currentStep = step[0];
      //Set the step condition to the default value
      this.stepCondition = this.stepDefaultCondition;
    });
    this.evts.subscribe('step:next', () => {
      //Do something if next
      console.log('Next pressed: ', this.currentStep);
    });
    this.evts.subscribe('step:back', () => {
      //Do something if back
      console.log('Back pressed: ', this.currentStep);
    });
  }

  isProfilePic() {
    if (this.userInfo.profilePic.length > 0) {
      return 'profilePic';
    }
    else {
      return 'noprofile';
    }
  }

  phoneValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value !== '') {
      if (!control.value.match('\\(?\\d{3}\\)?-? *\\d{3}-? *-?\\d{4}')) {
        return { invalidPhone: true };
      }
    }
  }
  emailValidator(control: FormControl): { [s: string]: boolean } {
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(control.value.toLowerCase().match(emailReg))) {
      return { invalidEmail: true };
    }
    //  if (!(control.value.toLowerCase().match('^[a-zA-Z]\\w*@gmail\\.com$') || control.value.toLowerCase().match('^[a-zA-Z]\\w*@yahoo\\.com$'))) {
    //   return { invalidEmail: true };
    // }
  }
  nameValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value.match("^[a-zA-Z ,.'-]+$")) {
      return { invalidName: true };
    }
  }
  emptyValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value.match("")) {
      return { invalidAddress: true };
    }
  }
  isValid(field: string) {
    let formField = this.myForm.get(field);
    return formField.valid || formField.pristine;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Userregistration');
  }
  onSubmit() {
    console.log('submitting form');
  }

  showAddressModal() {
    // console.log("showing autocomplete")
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      if (data != null) {
        this.address=data.name;
        this.userInfo.address = data.name;
        this.userInfo.lat = data.lat;
        this.userInfo.lon = data.lng;
        this.userInfo.subLocal = data.sublocal;
        this.userInfo.local = data.local;
        this.userInfo.city = data.city;
        this.userInfo.province = data.province;
        this.cdr.detectChanges();
        console.log('location from on dismiss' + JSON.stringify(this.userInfo));
      }
    });
    modal.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.userInfo.profilePic = 'data:image/jpeg;base64,' + imageData;
      this.userInfo.noUrl = '';
    }, (err) => {
      // Handle error
    });
  }

  browsePhoto() {
    let options = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((data) => {
      this.userInfo.profilePic = "data:image/jpeg;base64," + data;
      this.userInfo.noUrl = '';
    },
      (error) => { }
    );
  }
  /**
  * Demo functions
  */
  onFinish() {
    this.userInfo.phone.replace(/\D+/g, '');
    this.userservice.registerUser(this.userInfo, this.address.place)
      .then((createdUser) => {
        this.user.email=createdUser.email;
        this.user.userID=createdUser.uid;
        this.user.name=this.userInfo.name;
        this.user.pictureUrl =this.userInfo.noUrl;
        if (this.userInfo.profilePic.length>0)
        {
          this.user.pictureUrl = this.userInfo.profilePic;
        }
        this.alertCtrl.create({
          message: 'User created successfully. Please verify you email before you log on',
          title: 'Success',
          buttons: [{text: 'Ok',handler:()=>{
            // this.userData.login(this.user)
            this.navCtrl.push(LoginPage);
          }
          }]
        }).present();
      }, (error) => {
        this.toastCtrl.create({
          message: error.message,
          duration: 5000,
          position:'middle',
          showCloseButton: true,
          closeButtonText: 'OK',
        }).present();
      });
  }
  toggle() {
    this.stepCondition = !this.stepCondition;
  }
  getIconStep2() {
    return this.stepCondition ? 'unlock' : 'lock';
  }

  getIconStep3() {
    return this.stepCondition ? 'happy' : 'sad';
  }
  getLikeIcon() {
    return this.stepCondition ? 'thumbs-down' : 'thumbs-up';
  }

  textChange(e) {
    if (e.target.value && e.target.value.trim() !== '') {
      this.stepCondition = true;
    } else {
      this.stepCondition = false;
    }
  }
}

