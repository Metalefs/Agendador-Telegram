import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavParams, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {

  credentials!: UntypedFormGroup;

	constructor(
		private fb: UntypedFormBuilder,
		private authService: AuthenticationService,
		private alertController: AlertController,
		private loadingController: LoadingController,
		private router: Router,
    private modalCtrl: ModalController,
	) {}

	ngOnInit() {
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	async login() {
		const loading = await this.loadingController.create();
		await loading.present();

		this.authService.login(this.credentials.value!).subscribe(
			async (res) => {
				await loading.dismiss();
				this.router.navigate(['/home']);
			},
			async (res) => {
				await loading.dismiss();
				const alert = await this.alertController.create({
					header: 'Login failed',
					message: res.error.error,
					buttons: ['OK']
				});

				await alert.present();
			}
		);
	}

	// Easy access for form fields
	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}
}
