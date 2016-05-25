import {Component, Output, Input, EventEmitter} from '@angular/core'

@Component({
  selector: 'form-save',
  template: require('./FormSave.jade')(),
  styles: [require('./FormSave.scss')]
})
export class FormSave {
  @Input() public saveText: string = 'Save'
  @Output() public onSave: EventEmitter<any> = new EventEmitter()
  @Output() public onCancel: EventEmitter<any> = new EventEmitter()

  public save() {
    this.onSave.emit('event')
  }

  public cancel() {
    this.onCancel.emit('event')
  }
}