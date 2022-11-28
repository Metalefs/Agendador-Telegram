import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-groceryshopping-form',
  templateUrl: './groceryshopping-form.component.html',
  styleUrls: ['./groceryshopping-form.component.css'],
})
export class GroceryshoppingFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() activity?: any;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('items', this.fb.control([this.activity.items]))
  }

  addChip(value:string|number, input:IonInput){
    if(!this.itemsControl!.value)
      this.itemsControl!.setValue([])

    this.itemsControl!.value.push(value)
    input.value = '';
  }

  removeItem(i: number){
    (this.itemsControl!.value as Array<any>).splice(i, 1)
  }

  get itemsControl(){
    return this.form.get('items')
  }
}
