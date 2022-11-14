import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  selectedLanguage!: string;
  supportLanguages = ['en-us', 'pt-br'];

  constructor(public translateService: TranslateService) {
  }

  async loadLanguage() {
    this.translateService.currentLang = '';

    this.translateService.addLangs(this.supportLanguages);
    const currentLanguage = await (await Storage.get({key:'language'})).value;

    if (!currentLanguage || !this.supportLanguages.includes(currentLanguage)) {
      this.translateService.setDefaultLang('pt-br');
      this.selectedLanguage = 'pt-br';
      Storage.set({ key: 'language', value: 'pt-br' })


      let browserlang = this.translateService.getBrowserCultureLang();
      browserlang = browserlang!.toLocaleLowerCase();
      if (this.supportLanguages.includes(browserlang)) {
        this.translateService.use(browserlang);
        this.selectedLanguage = browserlang;
        Storage.set({ key: 'language', value: browserlang })

      }
    } else {
      this.translateService.use(currentLanguage);
      this.selectedLanguage = this.translateService.currentLang;
    }
  }

  useLang(lang: string) {
    this.translateService.use(lang);
    this.selectedLanguage = lang;
    Storage.set({ key: 'language', value: lang })
  }
}
